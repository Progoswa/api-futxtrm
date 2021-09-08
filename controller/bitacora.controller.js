const Bitacora = require('../models/bitacora');
const mongoXlsx = require('mongo-xlsx');
const fs = require('fs');
const bitacora = require('../models/bitacora');

const bitacoraCtrl = {};

bitacoraCtrl.getAll = async (req,res)=>{

    Bitacora.find()
        .populate('usuario')
        .sort({fecha:-1})
        .exec((err,historial)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                res.status(200).json({
                    ok:true,
                    historial
                })
            }
        })
}

bitacoraCtrl.getBitacoraFilter = async (req,res)=>{

    
    
    let condicions = {
        fecha: {
            $gte: req.body.since,
            $lt: req.body.until
        }
    }

    let or = [{}]

    if(req.body.query != ''){
        let query = req.body.query
        or[0] = {usuario: new RegExp (query, "i")}
        or[1] = {accion: new RegExp (query, "i")}
    }

    Bitacora.find(condicions)
        .or(or)
        .populate('usuario')
        .sort({fecha:-1})
        .exec((err,historial)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                
                res.status(200).json({
                    ok:true,
                    historial
                })
            }
        })
}

bitacoraCtrl.toExcelAll = async (req, res) => {

    let data = [];

    Bitacora.find()
        .populate('usuario')
        .sort({fecha:-1})
        .exec((err, historial) => {
            if(err){
                return
            } else {

                historial.map(x =>{

                    let f = new Date(x.fecha)
                    let d = f.toString() 
                    let data1 = {
                        Nombre : x.usuario.nombre,
                        Apellido: x.usuario.apellido,
                        Username: x.usuario.username,
                        Email: x.usuario.email,
                        Accion: x.accion,
                        Fecha: d,
                    }
                    data.push(data1)
                })
                
                let model = mongoXlsx.buildDynamicModel(data)
        
                mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {

                    
                });
                
            }
        })

}

bitacoraCtrl.toExcel = async (req, res) => {

    let data = [];

    Bitacora.find()
        .populate('usuario')
        .sort({fecha:-1})
        .exec((err, historial) => {
            if(err){
                res.status(200).json({
                    ok: false,
                    err
                })
            } else {
                historial.map(x =>{

                    let f = new Date(x.fecha)
                    let d = f.toString() 
                    let data1 = {
                        Nombre : x.usuario.nombre,
                        Apellido: x.usuario.apellido,
                        Username: x.usuario.username,
                        Email: x.usuario.email,
                        Accion: x.accion,
                        Fecha: d,
                    }
                    data.push(data1)
                })
                
                
                let model = mongoXlsx.buildDynamicModel(data)
        
                mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
                    
                    let dirname = __dirname.replace('controller', data.fullPath)                    
                    
                    res.status(200).sendFile(dirname, (err)=>{
                        if (err) {
                            
                        } 
                    })


                });
                
            }
        })

}

module.exports = bitacoraCtrl
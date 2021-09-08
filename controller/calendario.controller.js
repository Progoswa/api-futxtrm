const Calendario = require('../models/calendario')
const moment = require('moment')
const calendarioCtrl = {}

calendarioCtrl.create = async (req,res) => {
    
 let calendario = new Calendario(req.body)
 calendario.save((err,calendario)=>{
     if (err) {
         res.status(200).json({
            ok:false,
            err
         })
     } else {
         
         res.status(200).json({
            ok:true,
            calendario
         })
     }
 })
}


calendarioCtrl.predeterminada = async(req,res)=>{
    let dias = req.body.dias
    let plantillas = []
    let j = 0
    let k = 0
    let exist = false
    dias.forEach((dia,l,arry)=>{
        Calendario.findOne({borrado:false,usuario:req.body.usuario,plantilla:{$ne:null},categoria:req.body.categoria,dia:{$gt:moment(dia.fecha).startOf('day').format('YYYY-MM-DD'),$lt:moment(dia.fecha).endOf('day')}})
            .exec((err,dato)=>{
                k += 1
                if(dato !=null){
                    
                    exist = true
                }
               
                    if(k == arry.length){
                        
                        if(exist){
                            res.status(200).json({
                                ok:false,
                                err:{code:100}
                            })
                        }else{
                            dias.forEach((dia,i,arr) => {
                                Calendario.create({
                                 categoria:req.body.categoria,
                                 usuario:req.body.usuario,
                                 dia:dia.fecha,
                                 horario:req.body.horario,
                                 tipo:'predeterminada',
                                 condicional:dia.tipo
                                }).then((calendario)=>{
                                 j += 1
                                 plantillas.push(calendario)
                                 
                                 if(j == arr.length){
                                     plantillas = plantillas.sort((a,b)=>{
                                         return a.fecha - b.fecha
                                     })
                                     res.status(200).json({
                                         ok:true,
                                         plantillas
                                     })
                                 }
                                })
                                
                                 
                             });
    
                        }
                        
                    }
                
            })
    })
    
   
    
}

calendarioCtrl.getCalendarios = async(req,res)=>{
    Calendario.find({borrado:false})
        .exec((err,calendarios)=>{
            if (err) {
                res.status(200).json({
                   ok:false,
                   err
                })
            } else {
                res.status(200).json({
                   ok:true,
                   calendarios
                })
            }
        })
}

calendarioCtrl.getOne = async(req,res)=>{
    Calendario.findById(req.params.id)
    .populate('categoria')
    .exec((err,calendario)=>{
        if (err) {
            res.status(200).json({
               ok:false,
               err
            })
        } else {
            res.status(200).json({
               ok:true,
               calendario
            })
        }
    })
}

calendarioCtrl.setPlantilla = async (req,res) => {
    Calendario.findByIdAndUpdate(req.params.id,req.body)
        .exec((err,calendario)=>{
            if (err) {
                res.status(200).json({
                   ok:false,
                   err
                })
            } else {
                res.status(200).json({
                   ok:true,
                   calendario
                })
            }
        })
}


calendarioCtrl.getByUser = async (req,res) =>{
    Calendario.find({borrado:false,usuario:req.params.id})
        .populate('categoria plantilla')
        .exec((err,calendarios)=>{
            if (err) {
                res.status(200).json({
                   ok:false,
                   err
                })
            } else {
                res.status(200).json({
                   ok:true,
                   calendarios
                })
            }
        })
}

module.exports = calendarioCtrl;
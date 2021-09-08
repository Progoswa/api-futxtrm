const Usuarios = require('../models/usuario')
const Categorias = require('../models/categoria')
const Pagos = require('../models/pagos')
const Plantillas = require('../models/plantilla')
const pagoMembresia = require('../models/pagoMembresia')
moment = require('moment')
const estadisticasCtrl = {}

estadisticasCtrl.usuarios = async (req,res) => {
    Usuarios.count({role:'usuario'},(err,usuarios)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            res.status(200).json({
                ok:true,
                usuarios
            })
        }
    })
        
}
estadisticasCtrl.categorias = async (req,res) => {
    Categorias.count({borrado:false},(err,categorias)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            res.status(200).json({
                ok:true,
                categorias
            })
        }
    })
        
}
estadisticasCtrl.pagos = async (req,res) => {
    
    Pagos.count({fecha:{$gt:moment().startOf('month'),$lt:moment().endOf('month')}},(err,pagos)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            res.status(200).json({
                ok:true,
                pagos
            })
        }
    })
        
}
estadisticasCtrl.monto = async (req,res) => {
    
    Pagos.find({status:1})
        .exec((err,pagos)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                if(pagos.length > 0){
                    let monto = 0
                    let j = 0 
                    pagos.forEach((pago,i,arr)=>{
                        monto += pago.monto | 0
                        j += 1
                        if(j == arr.length){
                            pagoMembresia.find()
                                .exec((err,pagosM)=>{
                                    let k = 0
                                    pagosM.forEach((pago,i,arr)=>{
                                        monto += pago.monto | 0
                                        k += 1
                                        if(k == arr.length){
                                            res.status(200).json({
                                                ok:true,
                                                monto
                                            })
                                        }
                                    })
                                })
                        
                        }
                    })
                }else{
                    pagoMembresia.find()
                                .exec((err,pagosM)=>{
                                    let monto = 0
                                    let k = 0
                                    pagosM.forEach((pago,i,arr)=>{
                                        monto += pago.monto | 0
                                        k += 1
                                        if(k == arr.length){
                                            res.status(200).json({
                                                ok:true,
                                                monto
                                            })
                                        }
                                    })
                                })
                }
               
            }
        })
}
estadisticasCtrl.plantillas = async (req,res) => {
    
    Plantillas.count({},(err,plantillas)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            res.status(200).json({
                ok:true,
                plantillas
            })
        }
    })
        
}
module.exports = estadisticasCtrl;
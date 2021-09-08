const Seccion = require('../models/seccion')
const Bitacora = require('../models/bitacora')

const seccionCtrl = {}



seccionCtrl.seccionesByCategoriaId = async(req,res) => {
    Seccion.find({borrado:false,categoria:req.params.id})
        .exec((err,secciones)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                res.status(200).json({
                    ok:true,
                    secciones
                })
            }
        })
}
seccionCtrl.seccion = async(req,res) => {
    Seccion.findOne({borrado:false,_id:req.params.id})
        .exec((err,seccion)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                res.status(200).json({
                    ok:true,
                    seccion
                })
            }
        })
}

seccionCtrl.crearSeccion = async (req,res) =>{
    let seccion = new Seccion(req.body)
    seccion.save((err,seccion)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.body.usuario,
                accion:`Creo la seccion: ${seccion.nombre}`
            })
            res.status(200).json({
                ok:true,
                seccion
            })
        }
    })
}


seccionCtrl.editarSeccion = async (req,res) => {

    Seccion.findByIdAndUpdate(req.params.id,req.body)
    .exec((err,seccion)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.body.usuario,
                accion:`Edito la seccion: ${seccion.nombre}`
            })
            res.status(200).json({
                ok:true,
                seccion
            })
        }
    })
}


seccionCtrl.eliminarSeccion = async (req,res) => {

    Seccion.findByIdAndUpdate(req.params.id,{borrado:true})
    .exec((err,seccion)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.params.usuario,
                accion:`Elimino la seccion: ${seccion.nombre}`
            })
            res.status(200).json({
                ok:true,
                seccion
            })
        }
    })
}



module.exports = seccionCtrl;
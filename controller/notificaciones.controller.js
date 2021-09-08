const Bitacora = require('../models/bitacora');
const Notificaciones = require('../models/notificaciones')

const notificacionesCtrl = {};

notificacionesCtrl.notificacionesByUserId = async (req,res)=>{
    Notificaciones.find({usuario:req.params.id})
        .sort({fecha:-1})
        .exec((err,notificaciones)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                Notificaciones.count({usuario:req.params.id,visto:false}).exec((err,nuevos)=>{
                    res.status(200).json({
                        ok:true,
                        notificaciones,
                        nuevos
                    })
                })
               
            }
        })
}

notificacionesCtrl.notificacionVista = async(req,res) => {
    Notificaciones.findByIdAndUpdate(req.params.id,{visto:true})
        .exec((err,notificacion)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                res.status(200).json({
                    ok:true,
                    notificacion
                })
            }
        })
}



module.exports = notificacionesCtrl
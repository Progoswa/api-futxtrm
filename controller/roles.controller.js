const Bitacora = require('../models/bitacora');
const Roles = require('../models/roles')
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const bitacora = require('../models/bitacora');
const rolesCtrl = {};


rolesCtrl.getRoles = async(req,res)=>{

    Roles.find({borrado:false})
        .sort({fecha:-1})
        .exec((err,roles)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                res.status(200).json({
                    ok:true,
                    roles
                })
            }
        })

}

rolesCtrl.getRole = async(req,res)=>{

    Roles.findById(req.params.id)
        .exec((err,rol)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                res.status(200).json({
                    ok:true,
                    rol
                })
            }
        })

}

rolesCtrl.nuevoRol = async(req,res)=>{
    let rol = new Roles(req.body)
    rol.save((err,rol)=>{
        if(err){
            res.status(200).json({
                ok:false,
                err
            })
        }else{
            Bitacora.create({
                usuario:req.body.admin,
                accion:`creo el rol ${req.body.nombre}`
            })
            res.status(200).json({
                ok:true,
                rol
            })
        }
    })
 
}

rolesCtrl.editar = async(req,res) => {
    Roles.findByIdAndUpdate(req.params.id,req.body)
     .exec((err,rol)=>{
         if (err) {
             res.status(200).json({
                 ok:false,
                 err
             })
         } else {
             Bitacora.create({
                 usuario:req.params.admin,
                 accion:`Modifico el rol ${rol.nombre}`
             })
             res.status(200).json({
                 ok:true,
                 rol
             })
         }
     })
}

rolesCtrl.eliminar = async(req,res) => {
    Roles.findByIdAndUpdate(req.params.id,{borrado:true})
     .exec((err,rol)=>{
         if (err) {
             res.status(200).json({
                 ok:false,
                 err
             })
         } else {
             Bitacora.create({
                 usuario:req.params.admin,
                 action:`Elimino el rol ${rol.nombre}`
             })
             res.status(200).json({
                 ok:true,
                 rol
             })
         }
     })
}


rolesCtrl.asignar = async (req,res) => {
    Usuario.findByIdAndUpdate(req.body.usuario,{adminRole:req.body.role})
        .exec((err,usuario)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                Bitacora.create({
                    usuario:req.body.admin,
                    accion:`Asigno el rol ${req.body.nombre} al administrador ${usuario.username}`
                })
                res.status(200).json({
                    ok:true,
                    usuario
                })
            }
        })
}




module.exports = rolesCtrl
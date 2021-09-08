const membresia = require('../models/membresia')
const Membresia = require('../models/membresia')
const Usuario_membresia = require('../models/usuario_membresia')
const membresiaCtrl = {}


membresiaCtrl.create = async(req,res) => {
    let membresia = new Membresia(req.body)
    membresia.save((err,membresia)=>{
        if (err) {
            res.status(200).json({
                code:400,
                err
            })
        } else {
            res.status(200).json({
                code:200,
                membresia
            })
        }
    })
}

membresiaCtrl.getMembresias = async(req,res)=>{
    Membresia.find({lang:req.params.lang,borrado:false})
        .exec((err,membresias)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                res.status(200).json({
                    code:200,
                    membresias,
                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/`

                })
            }
        })
}

membresiaCtrl.haveMembership = async (req,res)=>{
    Usuario_membresia.findOne({membresia:req.body.membresia,usuario:req.body.usuario,fecha_exp:{$gt:Date.now()}})
        .exec((err,membresia)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                res.status(200).json({
                    code:200,
                    membresia
                })
               
            }
        })
}

membresiaCtrl.getMembresiasInfo = async(req,res)=>{
    Membresia.find({lang:req.params.lang,borrado:false,status:true})
        .populate("categorias")
        .exec((err,membresias)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                res.status(200).json({
                    code:200,
                    membresias,
                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/`

                })
            }
        })
}

membresiaCtrl.getMembresiaInfo = async(req,res)=>{
    Membresia.findOne({_id:req.params.id,borrado:false})
        .populate("categorias")
        .exec((err,membresia)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                res.status(200).json({
                    code:200,
                    membresia,
                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/`

                })
            }
        })
}

membresiaCtrl.updateMembresia = async(req,res)=>{
    Membresia.findByIdAndUpdate(req.params.id,req.body)
        .exec((err,membresia)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                res.status(200).json({
                    code:200,
                    membresia
                })
            }
        })
}

membresiaCtrl.updateMembresiaStatus = async(req,res)=>{
    Membresia.findById(req.params.id)
        .exec((err,membresia)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                Membresia.findByIdAndUpdate(membresia._id,{status:!membresia.status})
                    .exec((err,membresia)=>{
                        res.status(200).json({
                            code:200,
                            membresia
                        })
                    })
             
            }
        })
}

membresiaCtrl.deleteMembresia = async(req,res)=>{
    Membresia.findByIdAndUpdate(req.params.id,{borrado:true})
        .exec((err,membresia)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                res.status(200).json({
                    code:200,
                    membresia
                })
            }
        })
}


module.exports = membresiaCtrl;
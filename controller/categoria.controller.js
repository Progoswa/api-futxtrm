const Categoria = require('../models/categoria')
const Bitacora = require('../models/bitacora')
const Usuario_Categoria = require('../models/usuario_categoria')
const Seccion = require('../models/seccion')
const Entrenamiento_Seccion = require('../models/entrenamiento_seccion')
const Usuario_categoria_free = require('../models/usuario_categoria_free')
const moment = require('moment')
const categoriaCtrl = {}

categoriaCtrl.categorias = async(req,res) => {
    
    Categoria.find({borrado:false,lang:req.params.lang})
        .sort({fecha:-1})
        .exec((err,categorias)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                categoriasAndTime = []
                let j = 0
                if(categorias.length > 0){
                    categorias.forEach((categoria,i,arr)=>{
                        Seccion.find({borrado:false,categoria:categoria._id})
                            .exec((err,secciones)=>{
                                let tiempo = 0
                         
                                secciones.forEach((seccion)=>{
                                    
                                    seccion.bloques.forEach((bloque)=>{
                                        tiempo += (bloque.ejercicios*bloque.minutos)
                                    })
                                   
                                })
                                categoria.tiempo = tiempo
                                categoriasAndTime.push({categoria,tiempo})
                                j += 1
                                if(j == arr.length){
                                    categoriasAndTime = categoriasAndTime.sort((a,b)=>{
                                        return b.categoria.nombre - a.categoria.nombre
                                      })
                                    res.status(200).json({
                                        ok:true,
                                        categorias,
                                        categoriasAndTime,
                                        url:`${req.protocol}://${req.headers.host}/usuario/uploads/`
    
                                    })
                                }
                                
                            })
                    })
                }else{
                    res.status(200).json({
                        ok:true,
                        categorias:[],
                        categoriasAndTime:[],
                        url:`${req.protocol}://${req.headers.host}/usuario/uploads/`

                    })
                }
                
                
               
            }
        })
}

categoriaCtrl.crearCategoria = async (req,res) =>{
    
    let categoria = new Categoria(req.body)
    categoria.save((err,categoria)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
            
        } else {
            Bitacora.create({
                usuario:req.body.usuario,
                accion:`Creo la categoria: ${categoria.nombre}`
            })
            res.status(200).json({
                ok:true,
                categoria
            })
        }
    })
}

categoriaCtrl.editarCategoria = async (req,res) => {

    Categoria.findByIdAndUpdate(req.params.id,req.body)
    .exec((err,categoria)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.body.usuario,
                accion:`Edito la categoria: ${categoria.nombre}`
            })
            res.status(200).json({
                ok:true,
                categoria
            })
        }
    })
}


categoriaCtrl.eliminarCategoria = async (req,res) => {
    
    Categoria.findByIdAndUpdate(req.params.id,{borrado:true})
    .exec((err,categoria)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.params.usuario,
                accion:`Elimino la categoria: ${categoria.nombre}`
            })
            res.status(200).json({
                ok:true,
                categoria
            })
        }
    })
}

categoriaCtrl.categoria = async (req,res) => {
    Categoria.findOne({borrado:false,_id:req.params.id})
        .exec((err,categoria)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
              
                res.status(200).json({
                    ok:true,
                    categoria
                })
            }
        })
}

categoriaCtrl.comprar = async (req,res)=>{
    let compra = new Usuario_Categoria(req.body)

    ;(await compra.save()).populate('categoria usuario',(err,compra)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.body.usuario,
                accion:`Compro la categoria ${compra.categoria.nombre}`
            })
            res.status(200).json({
                ok:true,
                compra
            })
        }
    })
}

categoriaCtrl.misCategorias = async(req,res)=>{

    
    Usuario_Categoria.find({borrado:false,usuario:req.params.id,fecha_exp:{$gt:Date.now()}})
        .exec((err,categorias)=>{
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

categoriaCtrl.misCategoriasInfo = async(req,res)=>{
    
    Usuario_Categoria.find({borrado:false,usuario:req.params.id,fecha_exp:{$gt:Date.now()}})
        .populate('categoria')
        .exec((err,categorias)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                categoriasAndTime = []
                let j = 0
                categorias.forEach((categoria,i,arr)=>{
                    Seccion.find({borrado:false,categoria:categoria.categoria._id})
                        .exec((err,secciones)=>{
                            let tiempo = 0
                     
                            secciones.forEach((seccion)=>{
                                
                                seccion.bloques.forEach((bloque)=>{
                                    tiempo += (bloque.ejercicios*bloque.minutos)
                                })
                               
                            })
                            categoria.tiempo = tiempo
                            categoriasAndTime.push({categoria,tiempo})
                            j += 1
                            if(j == arr.length){
                                categoriasAndTime = categoriasAndTime.sort((a,b)=>{
                                    return b.categoria.nombre - a.categoria.nombre
                                  })
                                res.status(200).json({
                                    ok:true,
                                    categorias,
                                    categoriasAndTime,
                                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/`

                                })
                            }
                            
                        })
                })
                
            }
        })
}

categoriaCtrl.categoriaOwner = async(req,res)=>{
    Usuario_Categoria.findOne({borrado:false,categoria:req.body.categoria,usuario:req.body.usuario})
        .populate('categoria')
        .exec((err,categoria)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                if(categoria != null){
                    res.status(200).json({
                        ok:true,
                        categoria
                    })
                }else{
                    res.status(200).json({
                        ok:false,
                        err:{code:10},
                        msg:'Aun no has desbloqueado esta categoria'
                    })
                }
            }
        })
}

categoriaCtrl.getSeccionesAndEntrenamientos = async (req,res)=>{
    Seccion.find({categoria:req.params.id,borrado:false})
        .sort({fecha:1})
        .exec((err,secciones)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                
                let secciones_entrenamientos = []
                let j = 0
                secciones.forEach((seccion,i,arr)=>{
                    Entrenamiento_Seccion.find({borrado:false,seccion:seccion._id})
                        .sort({fecha:1})
                        .populate('entrenamiento')
                        .exec((err,entrenamientos)=>{
                            let condicional = null
                            if(seccion.condicional){
                                condicional = "Fuerza"
                            }
                            secciones_entrenamientos.push({
                               seccion,
                                entrenamientos,
                                bloque:seccion.bloques[0],
                                condicional
                            })
                            j += 1
                            if(j == arr.length){
                                secciones_entrenamientos.sort(function(a,b){
                                   
                                    return new Date(a.seccion.fecha) - new Date(b.seccion.fecha);
                                  });
                                res.status(200).json({
                                    ok:true,
                                    secciones_entrenamientos,
                                    url:`${req.protocol}://${req.headers.host}/entrenamiento/uploads`

                                })
                            }
                           
                        })
                })
               
            }
        })
}

categoriaCtrl.categoriesPerUser = async (req,res) =>{
    Usuario_Categoria.count({usuario:req.params.id,fecha_exp:{$gt:Date.now()}})
        .exec((err,categories)=>{
            
            if (err) {
                res.status(200).json({
                    code:400,
                    err
                })
            } else {
                Usuario_categoria_free.count(({usuario:req.params.id}))
                    .exec((err,free)=>{
                        if (err) {
                            res.status(400).json({
                                code:400,
                                err
                            })
                        } else {
                            res.status(200).json({
                                code:200,
                                categorias:categories,
                                categorias_free:free
                            })
                        }
                    })
            }
        })
}

module.exports = categoriaCtrl;


const fs = require('fs');
const moment = require('moment');
const categorieFree = require('../models/categorieFree')
const categoriaFreeCtrl = {}
const Usuario_Categoria = require('../models/usuario_categoria');
const usuario_categoria_free = require('../models/usuario_categoria_free');

categoriaFreeCtrl.getMsg = async (req,res) => {
    
    switch (req.params.lang) {
        case 'es':
            try {
                var data = fs.readFileSync('categorieFreeMsgEs.json', 'utf8');
                res.status(200).json({
                    code:200,
                    data:JSON.parse(data)
                })    
            } catch(e) {
            
                res.status(200).json({
                    code:400,
                    err:e.stack
                })   
            }
            break;
        case 'en':
            try {
                var data = fs.readFileSync('categorieFreeMsgEn.json', 'utf8');
                res.status(200).json({
                    code:200,
                    data:JSON.parse(data)
                })    
            } catch(e) {
            
                res.status(200).json({
                    code:400,
                    err:e.stack
                })   
            }
            break;
    
        default:
            break;
    }
  
 }

 categoriaFreeCtrl.updateMsg = async (req,res) => {
    categorieFree.updateMany({borrado:false,lang:req.params.lang},{dias:req.body.days}).exec((err,resp)=>{
        if(err){

        }else{
            if(req.params.lang == 'es'){
                try {
                    fs.writeFile('categorieFreeMsgEs.json', JSON.stringify(req.body) , 'utf-8', function(err, data) {
                        if (err) throw err;
                        res.status(200).json({
                            code:200,
                            msg:'Done!'
                        })
                    })
                } catch(e) {
                    res.status(200).json({
                        code:400,
                        err:e.stack
                    })   
                }
             }else if (req.params.lang == 'en') {
                try {
        
                    fs.writeFile('categorieFreeMsgEn.json', JSON.stringify(req.body), 'utf-8', function(err, data) {
                        if (err) throw err;
                        res.status(200).json({
                            code:200,
                            msg:'Done!'
                        })
                    })
                } catch(e) {
                    res.status(200).json({
                        code:400,
                        err:e.stack
                    })   
                }
             }
        }
    })
    
   
 }

 categoriaFreeCtrl.getCategoriesFree = async(req,res) =>{
    categorieFree.find({borrado:false,lang:req.params.lang})
        .populate('categoria')
        .exec((err,categorias)=>{
            if (err) {
                res.status(200).json({
                    code:400,
                    err,
                    categorias:null,
                    url:null

                }) 
            } else {
                res.status(200).json({
                    code:200,
                    err,
                    categorias,
                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/`

                }) 
            }
        })
 }

 categoriaFreeCtrl.newCategorieFree = async(req,res) =>{

    let categoria = new categorieFree(req.body)
    categoria.save((err,categoria)=>{
        if (err) {
            res.status(200).json({
                code:400,
                err,
                categoria:null
            }) 
        } else {
            res.status(200).json({
                code:200,
                err,
                categoria
            }) 
        }
    })
  
 }
 
 categoriaFreeCtrl.deleteCategorie = async (req,res) => {
     categorieFree.findByIdAndUpdate(req.params.id,{borrado:true})
        .exec((err,categoria)=>{
            
            if (err) {
                res.status(200).json({
                    code:400,
                    err,
                    categoria:null
                }) 
            } else {
                res.status(200).json({
                    code:200,
                    err:null,
                    categoria
                }) 
            }
        })
 }

 categoriaFreeCtrl.setCategorieUser = async (req,res) =>{
     

  
     let categoria = new Usuario_Categoria({
         usuario:req.body.usuario,
         categoria:req.body.categoria._id,
         fecha_exp:moment().add( req.body.dias,'days')
     })
     categoria.save((err,categoriaFree)=>{
        if (err) {
            res.status(200).json({
                code:400,
                err
            })
        } else {
            let categorieFree = new usuario_categoria_free({
                usuario:req.body.usuario,
                usuario_categoria_id:categoriaFree._id
            })
            categorieFree.save((err,categoria)=>{
                if (err) {
                    res.status(200).json({
                        code:400,
                        err
                    })
                } else {
                    res.status(200).json({
                        code:200,
                        categoria
                    })
                }
            })
        }
    
      
     })
 }
module.exports = categoriaFreeCtrl;
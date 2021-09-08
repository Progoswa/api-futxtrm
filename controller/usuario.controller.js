process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var Bitacora = require('../models/bitacora')
var multer  =   require('multer');
var fs = require('fs');
var path = require('path');
const msgCtrl = require('./msg.controller')
const usersSocket = require('../userSocket')
const io = require('../socket');
const bitacora = require('../models/bitacora');

const Sessions = require('../sessions')


if(process.argv.indexOf('--prod') !== -1){  
    var URL_WEB = `https://www.futxtrm.com/app/#`
}else{
    var URL_WEB = `http://localhost:4200/#`
}

io.on('connection',(socket) =>{

    


    
    socket.on('registerID',(data)=>{
        usersSocket.pushUser({id:socket.id,userId:data.id})
        socket.emit('login')
    })
    

    socket.on('logAdmin',(data)=>{
        
        
        socket.join('administradores')
    })

    socket.on('lang_change',()=>{
        socket.emit('lang_change_r')
    })

    socket.on('sala_chat',(data)=>{
        socket.join(data.name_room)
        
    })

    socket.on('nuevo_mensaje',(data)=>{
        
        
        io.to(`${data.name_room}`).emit('nuevo_mensaje_r')
    })

    socket.on('cambios_en_datos',(data)=>{
        usersSocket.getUserByIdUser(data.to).then((usuario)=>{   
            io.to(usuario.id).emit('cambios_en_datos_r',{})
            
        })
    })

   
    socket.on('disconnect', function() {
        usersSocket.popUserById(socket.id)
       
    });
    
})

const usuarioCtrl = {};





usuarioCtrl.newUser = (req,res)=>{


    let body = req.body
    let password = req.body.password
    body.password =  bcrypt.hashSync(body.password,10)

    body.token_verificacion = tokenNumber()
    body.simpleAccount =  true
    let admin = new Usuario(body)
    
    
    admin.save(async (err,userSaved)=>{
        if(err){
            
            
           
            if(err.code == 11000){            
        
                
                let index = await returnIndex(err.keyPattern)
                res.status(200).json({
                    ok: false,
                    msg: 'Ocurrio un error inesperado.',
                    err: err,
                    index
                })
            }else{
                res.status(200).json({
                    ok: false,
                    msg: 'Ocurrio un error inesperado.',
                    err: err
                })
            }
            
        }else{

            if(req.body.role == 'administrador'){

                msgCtrl.credencialesEmail(userSaved,password)
                Bitacora.create({
                    usuario:req.body.idAdmin,
                    accion:`Registro al administrador ${userSaved.username}`
                }) 


            }else{
                msgCtrl.verificationEmail(userSaved.token_verificacion,userSaved)
                Bitacora.create({
                    usuario:userSaved._id,
                    accion:'Se registro en el sistema'
                })
            }

          

   
         res.status(200).json({
            ok: true,
            msg: 'El admin se ha guardado.',
            user: userSaved
        })
        
        }

       
    })
}

function returnIndex(keyP){
for (const key in keyP) {
    return key
    
}

    
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


usuarioCtrl.newSocialAccount = (req,res)=>{
    let body = req.body
    body.verificado = true
    body.username = `${body.nombre}_${body.apellido}_${randomString(5, '0123456789')}`
    let admin = new Usuario(body)
    

    admin.save((err,userSaved)=>{
        if(err){
            res.status(200).json({
                ok: false,
                msg: 'Ocurrio un error inesperado.',
                err: err
            })
        }else{
            Bitacora.create({
                usuario:userSaved._id,
                accion:'Se registro en el sistema usando las redes sociales'
            })
         res.status(200).json({
            ok: true,
            msg: 'El admin se ha guardado.',
            user: userSaved
        })
        
        }

       
    })
}


usuarioCtrl.updatePosition = async (req,res) => {
    
    
    Usuario.findByIdAndUpdate(req.params.id,{ubicacion:JSON.stringify(req.body.ubicacion)})
        .exec((err,usuario)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                res.status(200).json({
                    ok:true,
                    usuario
                })
            }
        })
}

usuarioCtrl.resendEmailVerify = (req,res) =>{
    let token = tokenNumber()
    Usuario.findByIdAndUpdate(req.body.id,{token_verificacion:token})
        .exec((err,user)=>{
            if(err){
                res.status(200).json({
                    ok: false,
                    msg: 'Ocurrio un error inesperado.',
                    err: err
                })
            }else{
                if(user){
                    Bitacora.create({
                        usuario:req.body.id,
                        accion:'Reenvio el correo de verificación'
                    })
                    msgCtrl.verificationEmail(token,user)
                    res.status(200).json({
                        ok: true,
                        msg: 'mensaje reenviado',
                        user
                    })
                }else{
                
                    res.status(200).json({
                        ok: false,
                        msg: 'Ocurrio un error inesperado.',
                        err: err
                    })
                }
            }
        })
}


function tokenNumber() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);      
      return v.toString(16);
    });
}






usuarioCtrl.getUsers = (req,res)=>{
    Usuario.find({borrado:false})
    .populate("adminRole")
    .exec((err,usuarios)=>{

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


usuarioCtrl.getUserById = (req,res)=>{
   
    Usuario.findById(req.params.id)
    .populate('categoria adminRole')
    .exec((err,data)=>{
        if(err){
            res.status(200).json({
                ok:false,
                err
            })
        }else{
            if(data != null){
              
                
               
                 res.status(200).json({
                    ok:true,
                    data,
                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/`
                })
            }else{
                res.status(200).json({
                    ok:false,
                    err:{code:404}
                })
            }
        }
       
    })
}

usuarioCtrl.getUserByRole = (req,res)=>{
   
    Usuario.find({role : req.params.role, borrado:false})
    .exec((err,data)=>{
        if(err){
            res.status(200).json({
                ok:false,
                err
            })
        }else{
            if(data != null){                
               
                 res.status(200).json({
                    ok:true,
                    data,
                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/`
                })
            }else{
                res.status(200).json({
                    ok:false,
                    err:{code:404}
                })
            }
        }
       
    })
}
usuarioCtrl.getUserByCategory = (req,res)=>{
    // 
    const code = req.params.category;
    
    
    Categoria.findOne({ code : code })
        .exec((err, category) =>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }
            
            Usuario.find({ categoria : category._id , borrado : false })
            .exec((err,data)=>{
                if(err){
                    res.status(200).json({
                        ok:false,
                        err
                    })
                }else{
                    if(data != null){                
                       
                         res.status(200).json({
                            ok:true,
                            proveedores: data,
                            category: category,
                            url:`${req.protocol}://${req.headers.host}/usuario/uploads/`
                        })
                    }else{
                        res.status(200).json({
                            ok:false,
                            err:{code:404}
                        })
                    }
                }
               
            })    
        });
   
}

usuarioCtrl.updateRolAdminById = (req,res)=>{

    req.body.fecha_modificacion = Date.now();

    Usuario.findByIdAndUpdate(req.params.id ,req.body)
     .exec((err,usuario)=>{
         if(err){
             res.status(200).json({
                 ok:false,
                 err
             })
         }else{
             Bitacora.create({
                 usuario:req.body.idAdmin,
                 accion:'Modifico sus datos de perfil'
             })
             res.status(200).json({
                 ok:true,
                 usuario
             })
         }
     })
 
 }

usuarioCtrl.newPassword = (req,res)=>{
    let id = req.params.id
    let body = req.body



    Usuario.findById(id)
        .exec((err,user)=>{
            if(err){
                res.status(200).json({
                    ok: false,
                    msg: 'ocurrio un error inesperado',
                    err: err
                })
            }else{
               
                if(bcrypt.compareSync(body.current_password,user.password)){
                    Usuario.findByIdAndUpdate(id,{password: bcrypt.hashSync(body.new_password,10)})
                        .exec((err,userModifyPassword)=>{
                            if(err){
                                res.status(200).json({
                                    ok: false,
                                    msg: 'ocurrio un error inesperado',
                                    err: err
                                })
                            }else{
                                userModifyPassword.password = ':)'
                                res.status(200).json({
                                    ok:true,
                                    msg: 'admin modificado',
                                    userModifyPassword
                                })
                            }
                        })
                }else{
                    res.status(200).json({
                        ok: false,
                        msg: 'la contraseña no coincide',
                        err: 2
                    })
                }

            }
        })

   
}

usuarioCtrl.updatePerfilById = (req,res)=>{
 
   Usuario.findByIdAndUpdate(req.params.id,req.body)
    .exec((err,usuario)=>{
        if(err){
            res.status(400).json({
                ok:false,
                err
            })
        }else{
            Bitacora.create({
                usuario:req.params.id,
                accion:'Modifico sus datos de perfil'
            })
            if(usuario.role == 'provider'){
                UsuarioSubcategoria.updateMany({usuario:usuario._id}, { $set: { borrado: true } })
                .exec((err,succes)=>{
                    if(err){
                        
                        
                    }else{
                        for (var subcategoria of req.body.subcategorias) {
                
                            let userSub = new UsuarioSubcategoria({usuario:usuario._id,subcategoria:subcategoria})
                            userSub.save((err,subcategoria)=>{
                             
                            })
                            
                                                 
                        }
                    }
                })
               
            }
            res.status(200).json({
                ok:true,
                usuario
            })
        }
    })

}

usuarioCtrl.updateSeguridadById = (req,res) => {
    
    

    Usuario.findById(req.params.id)
        .exec((err,usuario)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
               if(bcrypt.compareSync(req.body.password,usuario.password)){
                if(req.body.cambiar){
                    req.body.password = bcrypt.hashSync(req.body.npassword,10)
                }else{
                    req.body.password = bcrypt.hashSync(req.body.password,10)
                }
                  
                    Usuario.findByIdAndUpdate(req.params.id,req.body)
                      .exec((err,usuario)=>{
                          if(err){
                              res.status(400).json({
                                  ok:false,
                                  err
                              })
                          }else{
                              Bitacora.create({
                                  usuario:req.params.id,
                                  accion:'Modifico sus datos de seguridad'
                              })
                              res.status(200).json({
                                  ok:true,
                                  usuario
                              })
                          }
                      })
               


               }else{
                res.status(200).json({
                    ok:false,
                    err:{code:404}
                })
                   
               }
            }
        })

}


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}${ path.extname(file.originalname)}` )
        
    }
  });


  usuarioCtrl.getImageByName = async (req,res) => {
    fs.readFile('./uploads/' + req.params.image, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
    });
 
  }

  usuarioCtrl.getDocumentByName = async (req,res) => {
      
      
    res.download(`./uploads/${req.params.document}`,req.params.document.split('@')[1])
 
  }

usuarioCtrl.uploadImageById = async (req,res) => {
 
    
    var upload = multer({ storage : storage}).single('image');

    upload(req,res,function(err) {
        
        if(err) {
           
            
            return res.end("Error uploading file.");
        }else{
          
            if(req.file != undefined){
                res.status(200).json({
                    ok:true,
                    url:`${req.protocol}://${req.headers.host}/usuario/uploads/${req.file.filename}`,
                    name:req.file.filename
                })
            }else{
                return res.end("Error uploading file.");
            }
           
        }
       
    });
    
    
}



usuarioCtrl.Auth = (req,res)=>{
    let body = req.body
    Usuario.findOne({ "username": body.usuario,borrado:false})
        .exec((err,user)=>{
            if (err){
                res.status(200).json({
                    ok: false,
                    msg: 'Ocurrio un error',
                    err: err
                })
            }
            else if(user){
                if(bcrypt.compareSync(body.password,user.password)){
                    Bitacora.create({
                        usuario:user.id,
                        accion:'Ingreso al sistema'
                    })
                    let token = tokenNumber()
                    Sessions.newSession({id:user.id,token})
                    res.status(200).json({
                        ok: true,
                        msg: 'Las credenciales son validas.',
                        role: user.role,
                        id: user.id,
                        verify: user.verificado,
                        email:user.email,
                        status:user.status,
                        token
                    })
                }else{
                    res.status(200).json({
                        ok: false,
                        msg: 'Credenciales invalidas.',
                        err: null
                    })
                }
            }
            else{
                res.status(200).json({
                    ok: false,
                    msg: 'Credenciales invalidas.',
                    err: null
                })
            }
        });
}


usuarioCtrl.verifySession =  (req,res)=>{
    Sessions.getSession(req.params.token)
        .then((session)=>{
            res.status(200).json("active")
        })
        .catch((err)=>{
            res.status(404).send("notFound")

        })
}

usuarioCtrl.deleteById = (req,res)=>{
    Usuario.findByIdAndUpdate(req.params.id,{borrado:true,fecha_modificacion:Date.now()})
    .exec((err,usuario)=>{
        if(err){
            res.status(200).json({
                ok:false,
                msg:`Hubo un error al intentar eliminar al usuario el id = ${req.params.id}`,
                err:err
            })
        }else{
            Bitacora.create({
                usuario:req.params.idAdmin,
                accion:`Borro al usuario ${usuario.username}`
            })
            res.status(200).json({
                ok:true,
                msg:'usuario eliminado',
                usuario
            })
        }
    })
}


usuarioCtrl.recoveryPassword = (req,res)=>{
    
    Usuario.findOne({email:req.body.email})
        .exec((err,user)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                if(user){
                    let token = tokenNumber()
                    Usuario.findByIdAndUpdate(user._id,{recovery_password: true,recovery_password_token:token})
                        .exec((err,user)=>{
                            Bitacora.create({
                                usuario:user._id,
                                accion:'Solicito un correo de olvido de contraseña'
                            })
                            msgCtrl.recoveryPasswordEmail(token,user)
                            res.status(200).json({
                                ok:true,
                                user
                            }
                               
                            )
                        })
                   
                }else{
                    res.status(200).json({
                        ok:false,
                        user
                    })
                }
            }
        })
}

 


usuarioCtrl.authRecoveryPassword = (req,res)=>{
    Usuario.findOne({recovery_password:true,recovery_password_token:req.body.token})
        .exec((err,user)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                
                if(user){
                    res.status(200).json({ok:true})
                }else{
                    res.status(200).json({ok:false})
                }
            }
        })
}

usuarioCtrl.setNewPassword = (req,res)=>{    
    Usuario.findOneAndUpdate({recovery_password_token:req.body.recovery_password_token},{password:bcrypt.hashSync(req.body.password,10),recovery_password:false})
        .exec((err,user)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                Bitacora.create({
                    usuario:user._id,
                    accion:'Recupero (Cambio) su contraseña mediante enlace'
                })
                
                res.status(200).json({
                    ok:true,
                    user
                })
            }
        })
}


usuarioCtrl.authEmail = (req,res) => {
    Usuario.findOne({token_verificacion:req.body.token})
        .exec((err,user)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                if(user){
                    Usuario.findByIdAndUpdate(user._id,{verificado:true,token_verificacion:null})
                        .exec((err,userModify)=>{
                            if(err){
                                res.status(200).json({
                                    ok:false,
                                    err
                                })
                            }else{
                                Bitacora.create({
                                    usuario:userModify,
                                    accion:'Verifico el correo electronico'
                                })
                                
                                res.status(200).json({
                                    ok:true,
                                    userModify
                                })
                            }
                        })
                   
                }else{
                    res.status(200).json({
                        ok:false,
                        err:{code:404}
                    })
                }
             
            }
        })
}

usuarioCtrl.updateStatusById = async (req,res) => {
    Usuario.findById(req.body.id)
    .exec((err,usuario)=>{
        if(err){
            res.status(200).json({
                ok:false,
                msg:`Hubo un error al intentar cambiar el estado a la usuario`,
                err:err
            })
        }else{
            
            Usuario.findByIdAndUpdate(usuario._id,{status:!usuario.status,fecha_modificacion: Date.now()})
            .exec((err,usuario)=>{
                if(err){
                    res.status(200).json({
                        ok:false,
                        msg:`Hubo un error al intentar cambiar el estado a la subategoria`,
                        err:err
                    })
                }else{
                    Bitacora.create({
                        usuario:req.body.idAdmin,
                        accion:`Cambio el estado del usuario ${usuario.username} a '${!usuario.status?'Activo':'Desactivo'}'`
                    })
                    res.status(200).json({
                        ok:true,
                        msg:'usuarios modificado',
                        usuario
                    })
                }
            })
        }
    })
}

usuarioCtrl.updateUserByAdmin = async (req,res) => {
    
    Usuario.findByIdAndUpdate(req.body.id,req.body)
        .exec((err,usuario)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                Bitacora.create({
                    usuario:req.body.idAdmin,
                    accion:` Modifico los datos de el usuario ${usuario.username}'`
                })
                res.status(200).json({
                    ok:true,
                    msg:'usuario modificado',
                    usuario
                })
            }
        })
}



usuarioCtrl.AuthAdmin = async(req,res) =>{
 

    Usuario.findOne({username:req.body.usuario,role:'administrador'})
        .exec((err,administrador)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
             
                if(administrador != null){
                    if(bcrypt.compareSync(req.body.password,administrador.password)){
                        res.status(200).json({
                            ok:true,
                            id:administrador._id
                            
                        })

                        bitacora.create({
                            usuario:administrador._id,
                            accion:'Ingreso al sistema administrativo'
                        })
                       
                    }else{
                        res.status(200).json({
                            ok:false,
                            err:{code:404}
                            
                        })
                    }
                   
                }else{
                    res.status(200).json({
                        ok:false,
                        err:{code:404}
                        
                    })
                }
               
            }
        })
}


module.exports = usuarioCtrl;
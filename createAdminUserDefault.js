const { createSecureServer } = require("http2");
const Usuario = require('./models/usuario')
const Roles = require('./models/roles')
var bcrypt = require('bcryptjs');



module.exports = (createAdmin = async()=>{

    Roles.findOne({nombre:'superadmin'})
        .exec((err,rol)=>{
            if(rol == null){
                let rol = new Roles({
                    nombre:'superadmin',
                    pagos_eliminar:true,
                    pagos_aceptar_rechazar:true,
                    categorias_crear:true,
                    categorias_editar:true,
                    categorias_eliminar:true,
                    secciones_crear:true,
                    secciones_editar:true,
                    secciones_eliminar:true,
                    secciones_entrenamiento_agregar:true,
                    secciones_entrenamiento_remover:true,
                    entrenamientos_cargar:true,
                    entrenamientos_editar:true,
                    entrenamientos_eliminar:true,
                    usuarios_crear:true,
                    usuarios_cambiar_estado:true,
                    usuarios_eliminar:true,
                    usuarios_consultar:true,
                    roles_crear:true,
                    roles_editar:true,
                    roles_eliminar:true,
                    roles_asignar:true
                })

                rol.save((err,rol)=>{
                   
                    Usuario.findOne({username:'administrador1'})
                    .exec((err,administrador)=>{
                        if(err){
                            
                        }else{
                           if(administrador == null){
                            let admin = new Usuario({
                                nombre:'Administrador',
                                apellido:'FutXtrm',
                                email:'administrador@futxtrm.com',
                                username:'administrador1',
                                password: bcrypt.hashSync('Administrador*1',10),
                                telefono:'0123456789',
                                direccion:'Administrador',
                                role:'administrador',
                                verificado:true,
                                simpleAccount:true,
                                adminRole:rol._id
                        })
                    
                        admin.save((err,administrador)=>{
                            if(err){
                                
                            }else{
                                
                            }
                        })
                           }else{
                               
                           }
                        }
                    })
                })   
             
            }else{
                
                
                Usuario.findOne({username:'administrador1'})
                .exec((err,administrador)=>{
                    if(err){
                        
                    }else{
                       if(administrador == null){
                        let admin = new Usuario({
                            nombre:'Administrador',
                            apellido:'FutXtrm',
                            email:'administrador@futxtrm.com',
                            username:'administrador1',
                            password: bcrypt.hashSync('Administrador*1',10),
                            telefono:'0123456789',
                            direccion:'Administrador',
                            role:'administrador',
                            verificado:true,
                            simpleAccount:true,
                            adminRole:rol._id
                    })
                
                    admin.save((err,administrador)=>{
                        if(err){
                            
                        }else{
                            
                        }
                    })
                       }else{
                           
                       }
                    }
                })
            }
        })
    

   
    
})()
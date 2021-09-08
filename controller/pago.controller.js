const Pagos = require('../models/pagos')
const Usuario_Categoria = require('../models/usuario_categoria')
const Usuario_membresia = require('../models/usuario_membresia')
const Bitacora = require('../models/bitacora')
const Categoria = require('../models/categoria')
const Usuario = require('../models/usuario')
const Stripe = require('stripe');
const stripe = Stripe('pk_live_51H88sQFRrriAnrIwBP7rXHSLFFa0qakAPmxyy72Lh6EpHAfbd0BRW4DA0zR7yFtPGeCVnHOWwECXgI5RH6Q5qocs00d2JcLAT9');
// const stripe = Stripe('sk_test_DtSlSm1ZyDptKYT0PWkY6Ft600JaLFFhvu');
const io = require('../socket');

const Notificaciones = require('../models/notificaciones')
const usersSocket = require('../userSocket')
const pagoMembresia = require('../models/pagoMembresia')
const pagosCtrl = {}

pagosCtrl.getAll = async (req,res) => {
    Pagos.find({borrado:false})
        .sort({fecha:-1})
        .populate("categoria usuario")
        .exec((err,pagos)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                pagoMembresia.find({borrado:false})
                .sort({fecha:-1})
                .populate("membresia usuario")
                .exec((err,pagosM)=>{
                    if (err) {
                        res.status(200).json({
                            ok:false,
                            err
                        })
                    } else{
                        res.status(200).json({
                            ok:true,
                           pagos ,
                           pagosM
                        }) 
                    }
                })
            
            }
        })
}

pagosCtrl.paymentWithPaypal = async(req,res) => {
    let price = req.body.price
    let pago = new Pagos(req.body.pago)
    pago.save(async (err,pago)=>{
        if (err) {
            
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            
            let compra = new Usuario_Categoria({usuario:pago.usuario,categoria:pago.categoria,fecha_exp:moment().add(price.meses,'months')})
            
    ;(await compra.save()).populate('categoria usuario',(err,compra)=>{
        if (err) {
            
            res.status(200).json({
                ok:false,
                err
            })
        } else {
           io.to('administradores').emit('pago')
            Bitacora.create({
                usuario:pago.usuario,
                accion:`Compro la categoria ${compra.categoria.nombre} mediante paypal`
            })
            res.status(200).json({
                ok:true,
                compra
            })
        }
    })
        }
    })
}


pagosCtrl.paymentWithStripe = async (req,res) => {
    // 

   
    Categoria.findById(req.body.categoria)
        .exec((err,categoria)=>{
            if(err){
                res.status.json({
                    ok:false,
                    err
                })
            }else{
                Usuario.findById(req.body.usuario)
                    .exec((err,usuario)=>{
                        if (err) {
                            res.status.json({
                                ok:false,
                                err
                            })
                        } else {
                            stripe.tokens.create(
                                {
                                  card:req.body.card,
                                },
                                function(err, token) {
                                    if(err){
                                  
                                      
                                        switch (err.raw.code) {
                                            case 'incorrect_number':
                                                err = {code:10,msg:'El numero de tarjeta es incorrecto'}
                                                break;
                                        
                                            case 'invalid_expiry_year':
                                                err = {code:11,msg:'Año de expiracion invalido'}
                                                break;
                                        
                                            case 'invalid_expiry_month':
                                                err = {code:12,msg:'Mes de expiracion invalido'}
                                                break;
                                        
                                            default:
                                                break;
                                        }
                                        
                                        res.status(200).json({
                                            ok:false,
                                            err
                                        })
                                    }else{
                                        let card_token = token.id
                                        stripe.charges.create(
                                            {
                                              amount: ((req.body.precio.precio - (req.body.precio.precio * (req.body.precio.descuento/100))) * 100),
                                              currency: 'usd',
                                              source: card_token,
                                              description: `${usuario.nombre} ${usuario.apellido} pago la categoria ${categoria.nombre}`,
                                            },
                                            function(err, charge) {
                                              if(err){
                                                  
                                                res.status(200).json({
                                                    ok:false,
                                                    err
                                                })
                                              }else{
                                                if(charge.paid && charge.status == 'succeeded'){
                                                    let pago = new Pagos({
                                                        usuario:usuario._id,
                                                        categoria:categoria._id,
                                                        referencia:charge.id,
                                                        metodo:'stripe',
                                                        monto:categoria.precio
                                                    })
                                                    pago.save(async (err,pago)=>{
                                                        if (err) {
                                                            
                                                            res.status(200).json({
                                                                ok:false,
                                                                err
                                                            })
                                                        } else {
                                                            
                                                            let compra = new Usuario_Categoria(
                                                                {
                                                                usuario:pago.usuario,
                                                                categoria:pago.categoria,
                                                                fecha_exp:moment().add(req.body.precio.meses,'months')
                                                            })
                                                            
                                                    ;(await compra.save()).populate('categoria usuario',(err,compra)=>{
                                                        if (err) {
                                                            
                                                            res.status(200).json({
                                                                ok:false,
                                                                err
                                                            })
                                                        } else {
                                                            io.to('administradores').emit('pago')
                                                            
                                                            Bitacora.create({
                                                                usuario:pago.usuario,
                                                                accion:`Compro la categoria ${compra.categoria.nombre} mediante stripe`
                                                            })
                                                            res.status(200).json({
                                                                ok:true,
                                                                compra
                                                            })
                                                        }
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
                                            }
                                          );
                                    }
                                }
                              );
                        }
                    })
            }
        })
}

pagosCtrl.paymentOffline = async (req,res)=>{
    let pago = new Pagos(req.body)
    ;(await pago.save()).populate('categoria',(err,pago)=>{
        if (err) {
            
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            io.to('administradores').emit('pago')
            Bitacora.create({
                usuario:pago.usuario,
                accion:`Solicito comprar la categoria ${pago.categoria.nombre} mediante pago offline`
            })
         
            Usuario.find({role:'administrador'})
                .populate('adminRole')
                .exec((err,admins)=>{
                    admins.forEach((admin)=>{
                        
                        if(admin.adminRole.pagos_aceptar_rechazar){
                            Notificaciones.create({
                                usuario:admin._id,
                                mensaje:`Nuevo pago offline en la categoria ${pago.categoria.nombre}`,
                                link:`/admin/pago`,
                                parametros:{id:pago._id}
                            })
                        }
                      
                    })
                    setTimeout(()=>{
                        io.to('administradores').emit('nueva_notificacion_r')

                    },1000)
                })
        
            res.status(200).json({
                ok:true,
                pago
            })
        }  
    })
        
}


pagosCtrl.aceptarOffline = async(req,res)=>{
    Pagos.findByIdAndUpdate(req.params.id,{status:1})
        .populate('categoria usuario')
        .exec(async (err,pago)=>{
            if(err){
                res.status(200).json({
                    ok:false,
                    err
                })
            }else{
                let compra = new Usuario_Categoria(
                    {
                    usuario:pago.usuario,
                    categoria:pago.categoria,
                    fecha_exp:moment().add(pago.precio.meses,'months')
                })
                
            ;(await compra.save()).populate('categoria usuario',(err,compra)=>{
            if (err) {
                
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                io.to('administradores').emit('pago')
                
                Bitacora.create({
                    usuario:req.params.admin,
                    accion:`Se aprobo la compra de  la categoria ${pago.categoria.nombre} mediante pago offline`
                })

                Notificaciones.create({
                    usuario:pago.usuario._id,
                    mensaje:`Categoria ${pago.categoria.nombre} desbloqueda, su pago ha sido aprobado`,
                    link:`/cliente/inicio`,
                    parametros:{}
                })

                setTimeout(()=>{
                    usersSocket.getUserByIdUser(pago.usuario._id).then((user)=>{
                        io.to(user.id).emit('nueva_notificacion_r')
                    })

                },1000)
              


                res.status(200).json({
                    ok:true,
                    compra
                })
            }
            })
            }
     
        })
    
}

pagosCtrl.rechazarOffline = async(req,res)=>{
    Pagos.findByIdAndUpdate(req.params.id,{status:2})
        .populate('categoria usuario')
        .exec(async(err,pago)=>{
         if (err) {
             res.status(200).json({
                 ok:false,
                 err
             })
         } else {
            io.to('administradores').emit('pago')
            Bitacora.create({
                usuario:req.params.admin,
                accion:`Se rechado la compra de  la categoria ${pago.categoria.nombre} mediante pago offline`
            })

            Notificaciones.create({
                usuario:pago.usuario._id,
                mensaje:`Pago rechazado, su pago por la categoria ${pago.categoria.nombre} no ha sido aprobado`,
                link:`/cliente/inicio`,
                parametros:{}
            })

            usersSocket.getUserByIdUser(pago.usuario._id).then((user)=>{
                io.to(user.id).emit('nueva_notificacion_r')
            })

            res.status(200).json({
                ok:true,
                pago
            })
         }
        })
    
}

pagosCtrl.getPago = async(req,res) => {
    Pagos.findById(req.params.id)
        .populate('categoria usuario')
        .exec((err,pago)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                if(pago != null){
                    
                    res.status(200).json({
                        ok:true,
                        pago,
                        url:`${req.protocol}://${req.headers.host}/usuario/uploads/${pago.captura}`
                    }) 
                }else{
                 
                    res.status(200).json({
                        ok:false,
                        err
                    })
                }
            }
        })
}

pagosCtrl.getPagoM = async(req,res) => {
    pagoMembresia.findById(req.params.id)
        .populate('membresia usuario')
        .exec((err,pago)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                if(pago != null){
                    
                    res.status(200).json({
                        ok:true,
                        pago,
                        url:`${req.protocol}://${req.headers.host}/usuario/uploads/${pago.captura}`
                    }) 
                }else{
                 
                    res.status(200).json({
                        ok:false,
                        err
                    })
                }
            }
        })
}

pagosCtrl.delete = async (req,res) => {
    Pagos.findByIdAndUpdate(req.params.id,{borrado:true})
        .exec((err,resp)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                Bitacora.create({
                    usuario:req.params.admin,
                    accion:'Borro un registro de pago'
                })
                res.status(200).json({
                    ok:true,
                    resp
                })
            }
        })
}

pagosCtrl.deleteM = async (req,res) => {
    pagoMembresia.findByIdAndUpdate(req.params.id,{borrado:true})
        .exec((err,resp)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                Bitacora.create({
                    usuario:req.params.admin,
                    accion:'Borro un registro de pago'
                })
                res.status(200).json({
                    ok:true,
                    resp
                })
            }
        })
}



pagosCtrl.payMembershipStripe = async (req,res) => {
    // llamamos a la funcion y recibimos el price, categories, user, card
    let price = req.body.price
    let categories = req.body.membership.categorias
    let user = req.body.user
    let card = req.body.card
    let membership = req.body.membership
    // le decimos a stripe que cree un token para la tarjeta
    stripe.tokens.create(
        {
          card // le pasamos la tarjeta
        },
        function(err, token) {
            if(err){
                // si hay un error le respondemos que paso
              
                switch (err.raw.code) {
                    case 'incorrect_number':
                        err = {code:10,msg:'El numero de tarjeta es incorrecto'}
                        break;
                
                    case 'invalid_expiry_year':
                        err = {code:11,msg:'Año de expiracion invalido'}
                        break;
                
                    case 'invalid_expiry_month':
                        err = {code:12,msg:'Mes de expiracion invalido'}
                        break;
                
                    default:
                        break;
                }
                
                res.status(200).json({
                    code:400,
                    err
                })
            }else{
               

                // si no hay error deberia darme el token
                let card_token = token.id
                stripe.charges.create(
                    {
                      amount: ((price.precio - (price.precio * (price.descuento/100))) * 100),
                      currency: 'usd',
                      source: card_token,
                      description: `${user.nombre} ${user.apellido} pago la membresia ${membership.name}`,
                    },
                    function(err, charge) {
                      if(err){
                          // aqui dira si pago o no xD
                        res.status(200).json({
                            code:400,
                            err
                        })
                      }else{
                          // se supone que se proceso el pago
                        if(charge.paid && charge.status == 'succeeded'){
                            // si el pago es succeded registramos esa membresia, o el pago
                            let pago = new pagoMembresia({
                                usuario:user._id,
                                membresia:membership._id,
                                referencia:charge.id,
                                metodo:'stripe',
                                monto:((price.precio - (price.precio * (price.descuento/100))))
                            })
                            pago.save(async (err,pago)=>{
                                if (err) {
                                    
                                    res.status(200).json({
                                        code:400,
                                        err
                                    })
                                } else {
                                    Bitacora.create({
                                        usuario:pago.usuario,
                                        accion:`Compro la membresia ${membership.name} mediante stripe`
                                    })

                                    let membresia = new Usuario_membresia({
                                        usuario:pago.usuario,
                                        membresia:pago.membresia,
                                        fecha_exp:moment().add(price.meses,'months')
                                    })

                                    categories.forEach(async (cateogorie)=>{
                                        let compra = new Usuario_Categoria(
                                            {
                                            usuario:pago.usuario,
                                            categoria:cateogorie._id,
                                            fecha_exp:moment().add(price.meses,'months')
                                        })
                                        
                                        compra.save()
                                    })
                                    membresia.save((err,resp)=>{
                                        if (err) {
                                            res.status(200).json({
                                                code:400,
                                                err
                                            })
                                        } else {
                                            io.to('administradores').emit('pago')
                                        
                                      
                                            res.status(200).json({
                                                code:200,
                                                resp
                                            })
                                        }
                                    })
                                   
                                    
                                    
                                }
                            })
                        }else{
                            res.status(200).json({
                                code:400,
                                err:{code:404}
                            })
                        }
                      }
                    }
                  );
            }
        }
      );
}

pagosCtrl.payMembershipPaypal = async (req,res) => {
   
    let price = req.body.price
    let categories = req.body.membership.categorias
    let user = req.body.user
    let membership = req.body.membership
    let details = req.body.details
    let pago = new pagoMembresia({
        usuario:user._id,
        membresia:membership._id,
        referencia:details.id,
        metodo:'PayPal',
        monto:Number(details.purchase_units[0].amount.value)
    })
    ;(await pago.save()).populate("membresia usuario",(err,pago)=>{
        if (err) {
            res.status(200).json({
                code:400,
                err
            })
        } else {
            let membresia = new Usuario_membresia({
                usuario:pago.usuario,
                membresia:pago.membresia,
                fecha_exp:moment().add(price.meses,'months')
            })
    
            membresia.save((err,resp)=>{
                if (err) {
                    res.status(200).json({
                        code:400,
                        err
                    })
                } else {
                    categories.forEach(async (cateogorie)=>{
                        let compra = new Usuario_Categoria(
                            {
                            usuario:pago.usuario,
                            categoria:cateogorie._id,
                            fecha_exp:moment().add(price.meses,'months')
                        })
                        
                        compra.save()
                    })

                    res.status(200).json({
                        code:200,
                        resp
                    })
                }
            })
        }
        
    })
}

module.exports = pagosCtrl;
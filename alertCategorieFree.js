const Usuario_categoria_free = require('./models/usuario_categoria_free')
const msgCtrl = require('./controller/msg.controller')
var moment = require('moment');

module.exports = (alertFree = async()=>{
    
    setInterval(()=>{
        
     
        Usuario_categoria_free.find({alert:false})
            .populate("usuario_categoria_id")
            .populate({path:'usuario_categoria_id',populate:{path:'categoria usuario'}})
            .exec((err,categorias)=>{
              
                categorias.forEach((categoria)=>{
                    if(moment(categoria.usuario_categoria_id.fecha_exp).diff(moment(),'days') < 2){
                        let categoriaInfo = categoria.usuario_categoria_id.categoria
                  
                        msgCtrl.alertFree(categoria.usuario_categoria_id.usuario,categoriaInfo,categoria._id,moment(categoria.usuario_categoria_id.fecha_exp).format('DD-MM-YYYY'))
                    }
                })
            })
    

    },1000*10)

  
    
})()
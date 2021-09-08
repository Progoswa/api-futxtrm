const msgCtrl = {}
if(process.argv.indexOf('--prod') !== -1){  
    var URL_WEB = `https://www.futxtrm.com/app/#`
}else{
    var URL_WEB = `http://localhost:4200/#`
}
var nodemailer = require('nodemailer');
var mailer = nodemailer.createTransport({
    host: 'mail.olahagency.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'futxtrm@olahagency.com', // generated ethereal user
        pass: '2020futxtrm' // generated ethereal password
      }
   });

var hbs = require('nodemailer-express-handlebars');
const usuario_categoria_free = require('../models/usuario_categoria_free');

msgCtrl.credencialesEmail = async (usuario,password) => {
    mailer.use('compile', hbs({
        viewEngine : {
            extname: '.hbs', // handlebars extension
            layoutsDir: 'views/email/', // location of handlebars templates
            defaultLayout: 'credenciales', // name of main template
            partialsDir: 'views/email/', // location of your subtemplates aka. header, footer etc
        },
        viewPath: 'views/email',
        extName: '.hbs'
        }
        ));
    mailer.sendMail({
        from: 'futxtrm@olahagency.com',
        to: usuario.email,
        subject: `Bienvenido a FUTXTRM`,
        template: 'credenciales',
        context: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            usuario:usuario.username,
            password:password,
            link:`${URL_WEB}/`,
            
            
        }
        }, (error, response)=>{
            if(error){
                setTimeout(() => {
                   msgCtrl.credencialesEmail(usuario,password)
                }, 1000);
           
            }else{
                
              
            }
           
            
        }) 

}

msgCtrl.alertFree = async (usuario,categoria,id,fecha_exp) => {
    mailer.use('compile', hbs({
        viewEngine : {
            extname: '.hbs', // handlebars extension
            layoutsDir: 'views/email/', // location of handlebars templates
            defaultLayout: 'categorieFree', // name of main template
            partialsDir: 'views/email/', // location of your subtemplates aka. header, footer etc
        },
        viewPath: 'views/email',
        extName: '.hbs'
        }
        ));
    mailer.sendMail({
        from: 'futxtrm@olahagency.com',
        to: usuario.email,
        subject: categoria.nombre,
        template: 'categorieFree',
        context: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            categoria:categoria.nombre,
            fecha_exp:fecha_exp,
            link:`${URL_WEB}/`,
            
            
        }
        }, (error, response)=>{
            if(error){
                setTimeout(() => {
                   msgCtrl.alertFree(usuario,categoria,id,fecha_exp)
                }, 1000);
           
            }else{
                usuario_categoria_free.findByIdAndUpdate(id,{alert:true})
                    .exec((err,res)=>{
                    })
              
            }
           
            
        }) 

}

function tokenNumber() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);      
      return v.toString(16);
    });
}



msgCtrl.verificationEmail = (token,user) => {
    let url = `${URL_WEB}/verificar?token=${token}`
  
    
   

    const mailOptions = {
        from: 'futxtrm@olahagency.com', // sender address
        to: `${user.email}`, // list of receivers
        subject: 'FutXtrm', // Subject line
        html: `  
       <h2 class="text-center">Verificar correo</h2>
    
       
         <p style="margin-top: 7px;">
             Estimado ${user.nombre}
             Para poder terminar con su registro por favor haga click en el siguiente enlace
         </p>
         
         <a href=${url}>${url}</a>
         
 
     <p>Equipo FutXtrm.</p>  
         <p>
           Esta es una cuenta de correo no monitoreada, por favor no responda o reenvie a este correo electrónico.
       
         </p>
      
   
   </div>
  </p>`// plain text body
      };

      mailer.sendMail(mailOptions, function (err, info) {
        if(err){
            
            setTimeout(() => {
                msgCtrl.verificationEmail(token,user)
            }, 3000);
        }
          
        else{
        
        
        
        }
          
     });
}


msgCtrl.recoveryPasswordEmail = async (token,user) => {
    let url = `${URL_WEB}/nueva-contrasena?token=${token}`
   

    let mailOptions = {
        from: 'futxtrm@olahagency.com', // sender address
        to: `${user.email}`, // list of receivers
        subject: 'Recuperar contraseña (FutXtrm)', // Subject line
        html: `  
       <h2 class="text-center">Enlace para recupera contraseña</h2>
    
       
         <p style="margin-top: 7px;">
             Estimado ${user.nombre}
             Para poder recuperar su contraseña por favor haga click en el siguiente enlace
         </p>

         
         <a href=${url}>${url}</a>
         
    
 
     <p>Equipo FutXtrm.</p>  
         <p>
           Esta es una cuenta de correo no monitoreada, por favor no responda o reenvie a este correo electrónico.
       
         </p>
      
   
   </div>
  </p>`// plain text body
      };

      mailer.sendMail(mailOptions, function (err, info) {
      
          
        if(err){
            
            setTimeout(() => {
                msgCtrl.recoveryPasswordEmail(token,user) 
            }, 1000 * 10);
            
        }
          
        else{
        
        
        
        }
          
     });
}
module.exports = msgCtrl;
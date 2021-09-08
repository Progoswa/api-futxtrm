const Entrenamiento = require('../models/entrenamiento')
const Bitacora = require('../models/bitacora')
const EntrenamientoSeccion = require('../models/entrenamiento_seccion')
const readXlsxFile = require('read-excel-file/node');
var multer  =   require('multer');
var fs = require('fs');
var path = require('path');
const bitacora = require('../models/bitacora');
const entrenamiento_seccion = require('../models/entrenamiento_seccion');


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './entrenamientos');
    },
    filename: function (req, file, callback) {
      
            callback(null, `${Date.now()}${ path.extname(file.originalname)}` )

       
    }
  });





const entrenamietoCtrl = {}


entrenamietoCtrl.uploadEntrenamiento = async(req,res) => {
       
    var upload = multer({ storage : storage}).single('entrenamiento');

    upload(req,res,function(err) {
        
        if(err) {
           
            
            return res.end("Error uploading file.");
        }else{
          
            
            res.status(200).json({
                ok:true,
                url:`${req.protocol}://${req.headers.host}/entrenamiento/uploads/${req.file.filename}`,
                name:req.file.filename
            })
        }
       
    });
}

entrenamietoCtrl.entrenamientosBySeccionId = async (req,res) => {
    EntrenamientoSeccion.find({borrado:false,seccion:req.params.id})
        .populate('entrenamiento seccion')
        .sort({fecha:-1})
        .exec((err,entrenamientos)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                res.status(200).json({
                    ok:true,
                    entrenamientos,
                    url:`${req.protocol}://${req.headers.host}/entrenamiento/uploads`,
                })
            }
        })
}

entrenamietoCtrl.deleteEntrenamientoSeccion = async(req,res)=>{
    
    EntrenamientoSeccion.findByIdAndUpdate(req.params.id,{borrado:true})
        .populate('entrenamiento seccion')
        .exec((err,entrenamiento)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                bitacora.create({
                    usuario:req.params.usuario,
                    accion:`Elimino el ejercicio ${entrenamiento.entrenamiento.ejercicio} de la seccion ${entrenamiento.seccion.nombre}`
                })
                res.status(200).json({
                    ok:true
                   
                })
            }
        })
}

entrenamietoCtrl.createEntrenamientosBySeccionId = async (req,res) => {
    
    let j = 0
    req.body.entrenamientos.forEach(async (entrenamiento,i,arr) => {
        let entrenamientoSec = new EntrenamientoSeccion({
            entrenamiento,
            seccion:req.body.seccion
        })

 
        ;(await entrenamientoSec.save()).populate('seccion entrenamiento',(err,nueva)=>{
            if(err){
                               
            res.status(200).json({
                ok:false,
                err
            })
            }else{
                bitacora.create({
                    usuario:req.body.usuario,
                    accion:`Cargo el  ejercicio ${nueva.entrenamiento.ejercicio} a la seccion ${nueva.seccion.nombre}`
                })
                j = j + 1
                if(j == arr.length){
                               
                                
                    res.status(200).json({
                        ok:true
                    })
            }
      
               
           }
        })
    });
}

entrenamietoCtrl.entrenamientosFilter = async (req,res) => {
   
    let or = [{}]
    if(req.body.query != ''){
         let query = req.body.query
         or[0] = {ejercicio: new RegExp(query,"i")}
         or[1] = {descripcion: new RegExp(query,"i")}
 
     }
    Entrenamiento.find({borrado:false})
        .or(or)
        .sort({fecha: -1})
        .exec((err,entrenamientos)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                res.status(200).json({
                    ok:true,
                    entrenamientos,
                    url:`${req.protocol}://${req.headers.host}/entrenamiento/uploads`,
                })
            }
        })
}

entrenamietoCtrl.getEntrenamientoByName = async (req,res) => {
    fs.readFile('./entrenamientos/' + req.params.entrenamiento, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'*'});
            res.end(content);
        }
    });
 
  }

entrenamietoCtrl.entrenamientos = async(req,res) => {

    Entrenamiento.find({borrado:false,lang:req.params.lang})
        .exec((err,entrenamientos)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
             
                res.status(200).json({
                    ok:true,
                    entrenamientos,
                    url:`${req.protocol}://${req.headers.host}/entrenamiento/uploads`,
                })
            }
        })
}

entrenamietoCtrl.crearEntrenamiento = async (req,res) =>{
    let entrenamiento = new Entrenamiento(req.body)
    entrenamiento.save(async (err,entrenamiento)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.body.usuario,
                accion:`Cargo el ejercicio: ${entrenamiento.ejercicio}`
            })
            let entrenamientoSec = new EntrenamientoSeccion({
                entrenamiento:entrenamiento._id,
                seccion:req.body.seccion
            })
    
     
            ;(await entrenamientoSec.save()).populate('seccion entrenamiento',(err,nueva)=>{
                if(err){
                                   
                res.status(200).json({
                    ok:false,
                    err
                })
                }else{
                    bitacora.create({
                        usuario:req.body.usuario,
                        accion:`Cargo el  ejercicio ${nueva.entrenamiento.ejercicio} a la seccion ${nueva.seccion.nombre}`
                    })
                   
                                   
                                    
                        res.status(200).json({
                            ok:true
                        })
                
          
                   
               }
            })

            // res.status(200).json({
            //     ok:true,
            //     entrenamiento
            // })
        }
    })
}


entrenamietoCtrl.editarEntrenamiento = async (req,res) => {

    Entrenamiento.findByIdAndUpdate(req.params.id,req.body)
    .exec((err,entrenamiento)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.body.usuario,
                accion:`Edito el ejercicio: ${entrenamiento.ejercicio}`
            })
            res.status(200).json({
                ok:true,
                entrenamiento
            })
        }
    })
}


entrenamietoCtrl.eliminarEntrenamiento = async (req,res) => {

    Entrenamiento.findByIdAndUpdate(req.params.id,{borrado:true})
    .exec((err,entrenamiento)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Bitacora.create({
                usuario:req.params.usuario,
                accion:`Elimino el ejercicio: ${entrenamiento.ejercicio}`
            })
            res.status(200).json({
                ok:true,
                entrenamiento
            })
        }
    })
}

entrenamietoCtrl.cargaMasiva = async(req,res) => {
    var XLSX = require('xlsx');
    try {
        var workbook = XLSX.readFile(`./uploads/${req.body.file}`)
        var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;
    
            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }
    
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        Entrenamiento.insertMany(data).then((resp)=>{
        
            resp.forEach((entrenamiento)=>{
                
                entrenamiento_seccion.create({
                    entrenamiento:entrenamiento._id,
                    seccion:req.body.seccion
                })
            })
            res.status(200).json({ok:true,msj:'se supone que se cargo todo bien, por favor revisar'})
        })
    });
    
    } catch (error) {
        
    res.status(200).json({
        ok:false,
        error
    })
    }
   
    
}


module.exports = entrenamietoCtrl
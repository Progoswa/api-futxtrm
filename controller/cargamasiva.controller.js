const Categorias = require('../models/categoria')
const Seccion = require('../models/seccion')
const readXlsxFile = require('read-excel-file/node');
var fs = require('fs');
var path = require('path');
const bitacora = require('../models/bitacora');
var multer  =   require('multer');
const Entrenamiento = require('../models/entrenamiento')

const entrenamiento_seccion = require('../models/entrenamiento_seccion');


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      
            callback(null, `${Date.now()}${ path.extname(file.originalname)}` )

       
    }
  });




const cargaCtrl = {}



cargaCtrl.categorias = async (req,res) => {

    var upload = multer({ storage : storage}).single('file');

    upload(req,res,function(err) {
        
        if(err) {
           
            
            return res.end("Error uploading file.");
        }else{
          
          
            
            

            var XLSX = require('xlsx');
            try {
                var workbook = XLSX.readFile(`./uploads/${req.file.filename}`)
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
               let categorias = []
               let j = 0 
                data.forEach((row,i,arr)=>{
                    categorias.push(
                        {
                            nombre: row.name,
                            frecuencia: row.frequency,
                            descripcion:row.description,
                            precios: [
                                {
                                    meses:1,
                                    precio:row.price_1,
                                    descuento:0
                                  },
                                  {
                                    meses:3,
                                    precio:row.price_3,
                                    descuento:0
                                  },
                                  {
                                    meses:6,
                                    precio:row.price_6,
                                    descuento:0
                                  },
                                  {
                                    meses:12,
                                    precio:row.price_12,
                                    descuento:0
                                  }
                            ],
                            dias:[
                                {
                                    dia:row.day1,
                                    tipo:row.type1
                                },
                                {
                                    dia:row.day2,
                                    tipo:row.type2
                                },
                                {
                                    dia:row.day3,
                                    tipo:row.type3
                                },
                                {
                                    dia:row.day4,
                                    tipo:row.type4
                                }
                            ]
                        }
                    )
                    j = j + 1
                     if(j == arr.length){
                       
                         let k = 0
                         let categoriasEnd = []
                         categorias.forEach((categoria,l,arr2)=>{
                             let categoriaNew = {
                                nombre: categoria.nombre,
                                frecuencia: categoria.frecuencia,
                                descripcion:categoria.descripcion,
                                precios: categoria.precios,
                                dias:[],
                                lang:req.body.lang
                             }
                            
                            categoria.dias.forEach((dia)=>{
                                if(dia.dia != undefined && dia.tipo != undefined){
                                   
                                    categoriaNew.dias.push(dia)
                                }
                            })
                            categoriasEnd.push(categoriaNew)
                            k = k + 1
                            if(k == arr2.length){
                                Categorias.insertMany(categoriasEnd).then((resp)=>{
                                    bitacora.create({
                                        usuario:req.body.admin,
                                        accion:"Realizo una carga masiva de categorias"
                                    })
                                    res.status(200).json({ok:true,msj:'se supone que se cargo todo bien, por favor revisar'})
                                    
                                }).catch((err)=>{
                                    res.status(200).json({
                                        ok:false,
                                        err
                                    })
                                })
            
                            }
                           
                         })
                     }
                })
            });
            
            } catch (error) {
                
            res.status(200).json({
                ok:false,
                error
            })
            }
           
        }
       
    });
}

cargaCtrl.secciones = async (req,res) => {

    var upload = multer({ storage : storage}).single('file');

    upload(req,res,function(err) {
        
        if(err) {
           
            
            return res.end("Error uploading file.");
        }else{
          
          
            
            

            var XLSX = require('xlsx');
            try {
                var workbook = XLSX.readFile(`./uploads/${req.file.filename}`)
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
               let secciones = []
               let j = 0 
                data.forEach((row,i,arr)=>{
                    secciones.push({
                        categoria:req.body.categoria,
                        nombre:row.name,
                        descripcion:row.description,
                        condicional:(row.conditional == 'x')?true:false,
                        bloques:[{ejercicios:row.exercises,minutos:row.minutes}]
                        
                    })
                    j = j + 1
                    if(j == arr.length){
                        Seccion.insertMany(secciones).then((resp)=>{
                            bitacora.create({
                                usuario:req.body.admin,
                                accion:`Realizo una carga masiva de Secciones`
                            })
                            res.status(200).json({ok:true,msj:'se supone que se cargo todo bien, por favor revisar'})

                        }).catch((err)=>{
                            res.status(200).json({
                                ok:false,
                                err
                            })
                        })
                    }
                })
            });
            
            } catch (error) {
                
            res.status(200).json({
                ok:false,
                error
            })
            }
           
        }
       
    });
}

cargaCtrl.entrenamientos = async (req,res) => {

    var upload = multer({ storage : storage}).single('file');

    upload(req,res,function(err) {
        
        if(err) {
           
            
            return res.end("Error uploading file.");
        }else{
          
          
            
            

          var XLSX = require('xlsx');
    try {
        var workbook = XLSX.readFile(`./uploads/${req.file.filename}`)
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
            bitacora.create({
                usuario:req.body.admin,
                accion:`Realizo una carga masiva de Entrenamientos`
            })
            res.status(200).json({ok:true,msj:'se supone que se cargo todo bien, por favor revisar'})
        }).catch((err)=>{
            res.status(200).json({
                ok:false,
                err
            })
        })
    });
    
    } catch (error) {
        
    res.status(200).json({
        ok:false,
        error
    })
    }
   
           
        }
       
    });
}


module.exports = cargaCtrl;
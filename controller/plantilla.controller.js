const Plantilla = require('../models/plantilla')
const Seccion = require('../models/seccion')
const Calendario = require('../models/calendario')

var moment = require('moment');


const plantillaCtrl = {};

plantillaCtrl.create = async (req,res) => {

    var start = moment().startOf('day').format('YYYY-MM-DD');
// end today
var end = moment().endOf('day').format('YYYY-MM-DD');;



let plantilla = new Plantilla(req.body)
        
plantilla.save((err,plantilla)=>{
    if (err) {
        res.status(200).json({
            ok:false,
            err
        })
    } else {
        res.status(200).json({
            ok:true,
            plantilla
        })
    }
})
 
   
}

plantillaCtrl.getAll = async (req,res) => {
    Plantilla.find({borrado:false})
        .exec((err,plantillas)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                res.status(200).json({
                    ok:true,
                    plantillas
                })
            }
        })
}

plantillaCtrl.getById = async (req,res)=>{
       
    Plantilla.findOne({_id:req.params.id,borrado:false})
    .populate({path:'plantilla.ejercicios',populate:{path:'entrenamiento'}})
    .populate('plantilla.seccion')
    .populate('categoria usuario')
    .exec((err,plantilla)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
            Calendario.findOne({borrado:false,plantilla:req.params.id})
                .populate('categoria')
                .exec((err,calendario)=>{
                    res.status(200).json({
                        ok:true,
                        plantilla,
                        calendario,
                        url:`${req.protocol}://${req.headers.host}/entrenamiento/uploads`
                    })
                })
          
        }
    })
}

plantillaCtrl.misPlantillas = async (req,res) => {
  
    Plantilla.find({usuario:req.params.id,borrado:false})
    .populate('categoria')
    .exec((err,plantillas)=>{
        if (err) {
            res.status(200).json({
                ok:false,
                err
            })
        } else {
         
            res.status(200).json({
                ok:true,
                plantillas
            })
        }
    })
}

plantillaCtrl.borrar = async(req,res) => {
    Plantilla.findByIdAndUpdate(req.params.id,{borrado:true})
        .exec((err,plantilla)=>{
            if (err) {
                res.status(200).json({
                    ok:false,
                    err
                })
            } else {
                Calendario.findOneAndUpdate({plantilla:req.params.id},{borrado:true}).exec()
             
                res.status(200).json({
                    ok:true,
                    plantilla
                })
            }
        })
}


module.exports = plantillaCtrl;
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var entrenamientoSchema = new Schema({
    ejercicio: { type:String, required: true},
    descripcion: { type:String},
    requerimientos: { type:String,default:''},
    repeticiones: { type:String,required:true},
    descanso: { type:Number},
    tiempo: { type:Number},
    tipo: { type:Number},
    formato: { type:String},
    id_vimeo: { type:String},
    video: { type:String},
    imagen: { type:String},
    lang:{type:String,default:'es'},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('entrenamiento', entrenamientoSchema);
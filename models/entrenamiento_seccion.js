var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var entrenamientoSeccionSchema = new Schema({
    seccion: { type: Schema.Types.ObjectId, required: true , ref: 'secciones'},
    entrenamiento: { type: Schema.Types.ObjectId, required: true , ref: 'entrenamiento'},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('entrenamiento_seccion', entrenamientoSeccionSchema);
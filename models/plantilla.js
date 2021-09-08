var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var plantillaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    categoria: { type: Schema.Types.ObjectId, required: true , ref: 'categoria'},
    nombre: { type: String, default:'Plantilla'},
    plantilla: [
        {
            seccion:{
                type:Schema.Types.ObjectId,
                ref:'secciones'
            },
            ejercicios:[
                {
                    type:Schema.Types.ObjectId,
                    ref:'entrenamiento_seccion'
                }
            ],
            cantidad:{type:Number},
            minutos:{type:Number}}],
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('plantilla', plantillaSchema);
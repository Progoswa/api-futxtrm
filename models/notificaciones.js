var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var notificacionesSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    link: { type:String, required: true},
    mensaje: { type:String, required: true},
    fecha: {type: Date, default: Date.now },
    visto:{type:Boolean,default:false},
    parametros:{type:Object,default:null}

});

module.exports = mongoose.model('notificaciones', notificacionesSchema);
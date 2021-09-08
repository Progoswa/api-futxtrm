var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    membresia: { type: Schema.Types.ObjectId, required: true , ref: 'membresia'},
    referencia:{type:String},
    metodo:{type:String},
    monto:{type:Number},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}


});

module.exports = mongoose.model('pagoMembresia', schema);
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var bitacoraSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    fecha: {type: Date, default: Date.now },
    accion:{type:String}

});

module.exports = mongoose.model('bitacora', bitacoraSchema);
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var usuarioCategoriaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    usuario_categoria_id: { type: Schema.Types.ObjectId, required: true , ref: 'usuario_categoria'},
    alert: { type: Boolean, default: false},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('usuario_categoria_free', usuarioCategoriaSchema);
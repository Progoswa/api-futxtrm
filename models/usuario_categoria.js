var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var usuarioCategoriaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    categoria: { type: Schema.Types.ObjectId, required: true , ref: 'categoria'},
    fecha_exp: {type: Date, required:true },
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('usuario_categoria', usuarioCategoriaSchema);
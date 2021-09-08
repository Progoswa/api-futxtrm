var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var seccionSchmema = new Schema({
    categoria:{type: Schema.Types.ObjectId, required: true , ref: 'categoria'},
    nombre: { type:String, required: true},
    descripcion: { type:String},
    condicional: { type:Boolean,default:false},
    bloques: [{type:Object,require:true}],
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('secciones', seccionSchmema);
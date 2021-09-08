var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var categoriaFreeSchema = new Schema({
    categoria: { type: Schema.Types.ObjectId, required: true , ref: 'categoria'},
    dias: {type:Number,default:7},
    lang:{type:String,default:'es'},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('categories_free', categoriaFreeSchema);
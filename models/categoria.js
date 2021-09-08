var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var categoriaSchema = new Schema({
    nombre: { type:String, required: true},
    frecuencia: { type:String, required: true},
    imagen: { type:String,default:'categoria.png'},
    dias: [{ type:Object}],
    descripcion: { type:String},
    precios: [
        {
            meses:{type:Number},
            precio:{type:Number},
            descuento:{type:Number}
        }
    ],
    lang:{type:String,default:'es'},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('categoria', categoriaSchema);
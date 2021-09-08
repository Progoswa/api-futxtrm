var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var schema = new Schema({
    categorias: [{ type: Schema.Types.ObjectId , ref: 'categoria'}],
    name: {type: String, required:true },
    description: {type: String, required:true },
    prices: [
        {
            meses:{type:Number},
            precio:{type:Number},
            descuento:{type:Number}
        }
    ],
    lang:{type:String,default:'es'},
    image: { type:String,default:'categoria.png'},
    fecha: {type: Date, default: Date.now },
    status:{type:Boolean,default:true},
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('membresia', schema);
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var usuarioCategoriaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    categoria: { type: Schema.Types.ObjectId, required: true , ref: 'categoria'},
    referencia:{type:String},
    captura:{type:String},
    metodo:{type:String},
    monto:{type:Number},
    precio:{type:Object, default:null},
    status:{type:Number,default:1},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

    // status code
    // 0 pedido
    // 1 aprobado
    // 2 rechazado
});

module.exports = mongoose.model('pago', usuarioCategoriaSchema);
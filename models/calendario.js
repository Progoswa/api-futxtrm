var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var calendarioSchema = new Schema({
    categoria: { type: Schema.Types.ObjectId, required: true , ref: 'categoria'},
    usuario: { type: Schema.Types.ObjectId, required: true , ref: 'usuario'},
    dia: { type: Date, required: true},
    horario: {  
        min:{type:String},
        max:{type:String}
    },
    tipo:{type:String},
    plantilla:{type:Schema.Types.ObjectId,default:null,ref:'plantilla'},
    condicional:{type:Number,default:0},

    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('calendario', calendarioSchema);
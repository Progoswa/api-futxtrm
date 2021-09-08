var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String,default:'' },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true,required:true },
    password: { type: String },
    telefono: { type: String },
    direccion: { type: String },
    pais: { type: String },
    estado: { type: String },
    ciudad: { type: String },
    role: { type: String , enum:['usuario','administrador'] },
    adminRole: { type: Schema.Types.ObjectId, default:null,ref:'roles'},
    status: {type:Boolean, default: true},
    fechaCreacion: {type:Date, default:Date.now},
    recovery_password: {type:Boolean, default:false},
    recovery_password_token: {type:String, default:null},
    verificado: {type:Boolean, default:false},
    token_verificacion: {type:String, default:null},
    simpleAccount:{type:Boolean, default:false},
    socialAccount:{type:Boolean, default:false},
    uid:{type:String,default:null},
    fecha_modificacion:{type:Date,default:null},
    foto:{type:String,default:'profile.jpg'},
    borrado: {type:Boolean,default:false}
});


module.exports = mongoose.model('usuario', usuarioSchema);
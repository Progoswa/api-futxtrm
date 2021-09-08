var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var roleSchema = new Schema({
    nombre:{type:String,required:true} ,
    pagos_eliminar:{type:Boolean,default:false},
    pagos_aceptar_rechazar:{type:Boolean,default:false},
    categorias_crear:{type:Boolean,default:false},
    categorias_editar:{type:Boolean,default:false},
    categorias_eliminar:{type:Boolean,default:false},
    secciones_crear:{type:Boolean,default:false},
    secciones_editar:{type:Boolean,default:false},
    secciones_eliminar:{type:Boolean,default:false},
    secciones_entrenamiento_agregar:{type:Boolean,default:false},
    secciones_entrenamiento_remover:{type:Boolean,default:false},
    entrenamientos_cargar:{type:Boolean,default:false},
    entrenamientos_editar:{type:Boolean,default:false},
    entrenamientos_eliminar:{type:Boolean,default:false},
    usuarios_crear:{type:Boolean,default:false},
    usuarios_cambiar_estado:{type:Boolean,default:false},
    usuarios_eliminar:{type:Boolean,default:false},
    usuarios_consultar:{type:Boolean,default:false},
    roles_crear:{type:Boolean,default:false},
    roles_editar:{type:Boolean,default:false},
    roles_eliminar:{type:Boolean,default:false},
    roles_asignar:{type:Boolean,default:false},
    fecha: {type: Date, default: Date.now },
    borrado:{type:Boolean,default:false}

});

module.exports = mongoose.model('roles', roleSchema);
var usuarios = []

usuariosCtrl = {}


usuariosCtrl.getUserByIdUser = async (id) => {
    return  usuarios.find((usuario)=>{
        return usuario.userId == id
    })
  
}
usuariosCtrl.getUserByEmail = async (email) => {
    return  usuarios.find((usuario)=>{
        return usuario.email == email
    })
  
}

usuariosCtrl.getUsers = async () => {
    return usuarios
}

usuariosCtrl.pushUser = async (user) => {

    let userExist = await usuarios.find((usuario)=>{
        return usuario.userId == user.userId
    })
    if(userExist == undefined){
             
        usuarios.push(user)
        
        
        
   
    }
    

}


usuariosCtrl.popUserById = async (id) => {
    usuarios = usuarios.filter((usuario)=>{
        return usuario.id != id
    })
}


module.exports = usuariosCtrl

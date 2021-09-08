var express = require('express');
var app = express();

const usuarioCtrl = require('../controller/usuario.controller')

app.post('/',usuarioCtrl.newUser)
app.post('/social',usuarioCtrl.newSocialAccount)
app.post('/administradorauth',usuarioCtrl.AuthAdmin)

app.get('/',usuarioCtrl.getUsers)

app.get('/usuario/:id',usuarioCtrl.getUserById)
app.get('/usuarioRole/:role',usuarioCtrl.getUserByRole)
app.get('/proveedores/:category',usuarioCtrl.getUserByCategory)
app.get('/uploads/:image', usuarioCtrl.getImageByName)
app.get('/documentuploads/:document', usuarioCtrl.getDocumentByName)

app.put('/updateRolAdminById/:id', usuarioCtrl.updateRolAdminById)

app.put('/perfil/:id', usuarioCtrl.updatePerfilById)
app.put('/updateUserByAdmin', usuarioCtrl.updateUserByAdmin)
app.put('/seguridad/:id', usuarioCtrl.updateSeguridadById)
app.post('/status', usuarioCtrl.updateStatusById)
app.post('/uploadImageById', usuarioCtrl.uploadImageById)

app.put('/password/:id', usuarioCtrl.newPassword)

app.delete('/:id/:idAdmin',usuarioCtrl.deleteById)

app.post('/login',usuarioCtrl.Auth)

app.get('/token/:token',usuarioCtrl.verifySession)

app.post('/recovery-password',usuarioCtrl.recoveryPassword)
app.post('/recovery-password-auth',usuarioCtrl.authRecoveryPassword)
app.post('/recovery-password-set',usuarioCtrl.setNewPassword)


app.post('/auth-email',usuarioCtrl.authEmail)
app.post('/resend-auth-email',usuarioCtrl.resendEmailVerify)

app.put('/updatePosition/:id',usuarioCtrl.updatePosition)


module.exports = app;
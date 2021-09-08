var express = require('express');
var app = express();

const rolesCtrl = require('../controller/roles.controller')


app.get('/roles',rolesCtrl.getRoles)
app.get('/rol/:id',rolesCtrl.getRole)

app.post('/roles',rolesCtrl.nuevoRol)

app.put('/asignar',rolesCtrl.asignar)

app.put('/rol/:id/:admin',rolesCtrl.editar)

app.delete('/rol/:id/:admin',rolesCtrl.eliminar)

module.exports = app;
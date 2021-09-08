var express = require('express');
var app = express();

const notificacionesCtrl = require('../controller/notificaciones.controller')

app.get('/misnotificaciones/:id',notificacionesCtrl.notificacionesByUserId)
app.get('/notificacionvista/:id',notificacionesCtrl.notificacionVista)



module.exports = app;
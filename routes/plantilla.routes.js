var express = require('express');
var app = express();

const plantillaCtrl = require('../controller/plantilla.controller')

app.get('/plantillas',plantillaCtrl.getAll)

app.get('/plantilla/:id',plantillaCtrl.getById)

app.delete('/plantilla/:id',plantillaCtrl.borrar)

app.get('/usuario/:id',plantillaCtrl.misPlantillas)

app.post('/plantilla', plantillaCtrl.create)


module.exports = app;
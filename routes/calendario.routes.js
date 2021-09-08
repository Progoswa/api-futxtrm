var express = require('express');
var app = express();
const calendarioCtrl = require('../controller/calendario.controller')

app.get('/calendarios',calendarioCtrl.getCalendarios)

app.get('/calendario/:id',calendarioCtrl.getOne)

app.get('/usuario/:id',calendarioCtrl.getByUser)

app.post('/calendario',calendarioCtrl.create)

app.post('/predeterminada',calendarioCtrl.predeterminada)

app.put('/calendario/:id',calendarioCtrl.setPlantilla)

module.exports = app;
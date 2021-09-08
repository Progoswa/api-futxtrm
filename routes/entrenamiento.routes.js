var express = require('express');
var app = express();
const entrenamientoCtrl = require('../controller/entrenamiento.controller');
const entrenamietoCtrl = require('../controller/entrenamiento.controller');

app.get('/entrenamientos/:lang',entrenamietoCtrl.entrenamientos)
app.get('/entrenamientosseccion/:id',entrenamietoCtrl.entrenamientosBySeccionId)
app.post('/entrenamientosseccion',entrenamietoCtrl.createEntrenamientosBySeccionId)

app.post('/entrenamiento',entrenamientoCtrl.crearEntrenamiento)
app.post('/entrenamientosfilter',entrenamientoCtrl.entrenamientosFilter)

app.put('/entrenamiento/:id',entrenamientoCtrl.editarEntrenamiento)

app.delete('/entrenamiento/:id/:usuario',entrenamientoCtrl.eliminarEntrenamiento)
app.delete('/entrenamientoseccion/:id/:usuario',entrenamientoCtrl.deleteEntrenamientoSeccion)

app.get('/uploads/:entrenamiento', entrenamietoCtrl.getEntrenamientoByName)

app.post('/uploadEntrenamiento', entrenamietoCtrl.uploadEntrenamiento)
app.post('/cargar', entrenamietoCtrl.cargaMasiva)


module.exports = app;
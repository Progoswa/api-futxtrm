var express = require('express');
var app = express();

const cargaCtrl = require('../controller/cargamasiva.controller')



app.post('/categorias', cargaCtrl.categorias)

app.post('/secciones', cargaCtrl.secciones)

app.post('/entrenamientos', cargaCtrl.entrenamientos)



module.exports = app;
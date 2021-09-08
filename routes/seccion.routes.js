var express = require('express');
var app = express();

const seccionCtrl = require('../controller/seccion.controller')



app.get('/secciones/:id',seccionCtrl.seccionesByCategoriaId)
app.get('/seccion/:id',seccionCtrl.seccion)

app.post('/seccion',seccionCtrl.crearSeccion)

app.put('/seccion/:id',seccionCtrl.editarSeccion)

app.delete('/seccion/:id/:usuario',seccionCtrl.eliminarSeccion)


module.exports = app;
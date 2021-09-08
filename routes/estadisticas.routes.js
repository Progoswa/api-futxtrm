var express = require('express');
var app = express();

const estadisticasCtrl = require('../controller/estadisticas.controller')


app.get('/usuarios',estadisticasCtrl.usuarios)

app.get('/categorias',estadisticasCtrl.categorias)

app.get('/pagos',estadisticasCtrl.pagos)

app.get('/plantillas',estadisticasCtrl.plantillas)

app.get('/monto',estadisticasCtrl.monto)

module.exports = app;
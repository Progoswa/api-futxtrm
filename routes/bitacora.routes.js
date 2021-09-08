var express = require('express');
var app = express();

const bitacoraCtrl = require('../controller/bitacora.controller')

app.get('/bitacora',bitacoraCtrl.getAll)

app.post('/bitacoraFilter', bitacoraCtrl.getBitacoraFilter)

app.get('/toExcel', bitacoraCtrl.toExcel)

app.post('/toExcelAll', bitacoraCtrl.toExcelAll)


module.exports = app;
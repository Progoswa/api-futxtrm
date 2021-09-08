var express = require('express');
var app = express();
const membresiaCtrl = require('../controller/membresia.controller');


app.post('/create',membresiaCtrl.create)

app.put('/update/:id',membresiaCtrl.updateMembresia)

app.put('/status/:id',membresiaCtrl.updateMembresiaStatus)

app.delete('/delete/:id',membresiaCtrl.deleteMembresia)

app.get('/all/:lang',membresiaCtrl.getMembresias)

app.get('/infoall/:lang',membresiaCtrl.getMembresiasInfo)

app.get('/one/:id',membresiaCtrl.getMembresiaInfo)

app.post('/owner',membresiaCtrl.haveMembership)







module.exports = app;
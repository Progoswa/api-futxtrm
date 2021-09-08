var express = require('express');
var app = express();
const pagosCtrl = require('../controller/pago.controller');
const pagos = require('../models/pagos');

app.post('/paypal',pagosCtrl.paymentWithPaypal)

app.post('/stripe',pagosCtrl.paymentWithStripe)

app.post('/membership/stripe',pagosCtrl.payMembershipStripe)

app.post('/membership/paypal',pagosCtrl.payMembershipPaypal)

app.post('/offline',pagosCtrl.paymentOffline)

app.put('/rechazar/:id/:admin',pagosCtrl.rechazarOffline)

app.put('/aceptar/:id/:admin',pagosCtrl.aceptarOffline)

app.get('/pagos',pagosCtrl.getAll)

app.get('/pago/:id',pagosCtrl.getPago)
app.get('/pagom/:id',pagosCtrl.getPagoM)

app.delete('/pago/:id/:admin',pagosCtrl.delete)
app.delete('/pagom/:id/:admin',pagosCtrl.deleteM)





module.exports = app;
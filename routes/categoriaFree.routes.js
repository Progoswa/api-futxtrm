var express = require('express');
var app = express();
const categoriaFreeCtrl = require('../controller/categorieFree.controller')

app.get('/msg/:lang',categoriaFreeCtrl.getMsg)

app.put('/msg/:lang',categoriaFreeCtrl.updateMsg)


app.get('/categories/:lang',categoriaFreeCtrl.getCategoriesFree)

app.post('/categorie',categoriaFreeCtrl.newCategorieFree)

app.post('/user',categoriaFreeCtrl.setCategorieUser)

app.delete('/categorie/:id',categoriaFreeCtrl.deleteCategorie)

module.exports = app;
var express = require('express');
var app = express();
const categoriaCtrl = require('../controller/categoria.controller')

app.get('/categorias/:lang',categoriaCtrl.categorias)
app.get('/miscategorias/:id',categoriaCtrl.misCategorias)
app.get('/categoriasinfo/:id',categoriaCtrl.misCategoriasInfo)

app.post('/comprar',categoriaCtrl.comprar)
app.post('/categoriaowner',categoriaCtrl.categoriaOwner)
app.get('/categoria/:id',categoriaCtrl.categoria)

app.post('/categoria',categoriaCtrl.crearCategoria)
app.get('/secciones/:id',categoriaCtrl.getSeccionesAndEntrenamientos)

app.get('/count/:id',categoriaCtrl.categoriesPerUser)

app.put('/categoria/:id',categoriaCtrl.editarCategoria)

app.delete('/categoria/:id/:usuario',categoriaCtrl.eliminarCategoria)

module.exports = app;
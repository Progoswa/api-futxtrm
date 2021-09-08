// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require("cors");
const process = require('process');
const createAdmin = require('./createAdminUserDefault')
const alertFree = require('./alertCategorieFree')
const cronPlantilla = require('./deletePlantilla')

var app = express();

// CORS
app.use(cors({ origin: "*" }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Credentials', false);
    next();
});


// bodyParser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



// Rutas

app.use('/', require('./routes/default.routes.js'));

app.use('/usuario', require('./routes/usuario.routes'));

app.use('/bitacora', require('./routes/bitacora.routes'));

app.use('/roles',require('./routes/roles.routes'));

app.use('/categoria',require('./routes/categoria.routes'))
app.use('/categoriafree',require('./routes/categoriaFree.routes'))

app.use('/entrenamiento',require('./routes/entrenamiento.routes'))

app.use('/seccion',require('./routes/seccion.routes'))

app.use('/plantilla',require('./routes/plantilla.routes'))

app.use('/calendario',require('./routes/calendario.routes'))

app.use('/pagos',require('./routes/pagos.routes'))

app.use('/notificaciones',require('./routes/notificaciones.routes'))

app.use('/roles',require('./routes/roles.routes'))

app.use('/estadisticas',require('./routes/estadisticas.routes'))

app.use('/carga',require('./routes/carga.routes'))

app.use('/membresia',require('./routes/membresia.routes'))


mongoose.connect('mongodb://localhost:27017/futxtrmDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    
});

// Escuchar peticiones
if(process.argv.indexOf('--prod') !== -1){
    const fs = require('fs');
const http = require('http');
const https = require('https');
//Inicializar variables


const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.futxtrm.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.futxtrm.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/www.futxtrm.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

  
    const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(3000)
}else{
   
    var server = app.listen(3000, () => {
        
    });
}


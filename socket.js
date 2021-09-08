const socketIO = require('socket.io');


if(process.argv.indexOf('--prod') !== -1){
    const fs = require('fs');
const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.futxtrm.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.futxtrm.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/www.futxtrm.com/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
var express = require('express');
var app = express();
  
    const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(3001)
        
module.exports = socketIO(httpsServer);
}else{
    
    const server = require('http').createServer();
    server.listen(3001);
    
module.exports = socketIO(server);
}






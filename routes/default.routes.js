var express = require('express');
var app = express();
app.get('/', async (req, res) => {
    res.send({
        code:200,
        status: 'Ok!',  
    });
  });
  
module.exports = app;
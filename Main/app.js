var http = require('http');
var express = require('express');

var comparison = require('./app/comparison');

var app = express();

app.post('comparison', comparison);

http.createServer(app).listen(config.port);
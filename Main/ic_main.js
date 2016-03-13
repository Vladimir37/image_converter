var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var comparison = require('./app/comparison');
var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/comparison', comparison);

http.createServer(app).listen(config.port);
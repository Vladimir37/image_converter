var http = require('http');
var express = require('express');
var engines = require('consolidate');
var actions = require('./actions');

var app = express();

app.set('views', __dirname + '/pages');
app.engine('.html', require('jade').renderFile);

app.get('/', actions.index);

app.post('/two_pics', actions.two_pics);
app.post('/all_pics', actions.all_pics);
app.post('/upload', actions.upload);

http.createServer(app).listen(3000);
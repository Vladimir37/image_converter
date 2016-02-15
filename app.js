var http = require('http');
var express = require('express');
var actions = require('./app/actions');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/pages');

app.get('/', actions.index);

app.post('/two_pics', actions.two_pics);
app.post('/all_pics', actions.all_pics);
app.post('/upload', actions.upload);

app.use('/src', express.static(__dirname + '/source'));

http.createServer(app).listen(3000);
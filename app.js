var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var actions = require('./app/actions');
var config = require('./config');
var auth = require('./app/db/auth');
var render = require('./app/render');

var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'jade');
app.set('views', __dirname + '/pages');

app.get('/', render.index);

app.get('/image/:num', auth.check, render.image);

app.get('/manage', auth.check, auth.check_status, render.manage_front);
app.get('/exit', auth.exit);

app.post('/manage', auth.check, auth.check_status, actions.manage_back);
app.post('/login', auth.auth);

app.post('/two_pics', auth.check, actions.two_pics);
app.post('/all_pics', auth.check, actions.all_pics);
app.post('/upload', auth.check, actions.upload);

app.use('/src', express.static(__dirname + '/source'));

http.createServer(app).listen(config.port);
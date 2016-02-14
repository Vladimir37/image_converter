var fs = require('fs');

var compare = require('./processing');
var saving = require('./saving');

//test ------------------------------------------------------------------
compare();


function index(req, res, next) {
    res.render('index.jade');
};

function two_pics(req, res, next) {
    saving('two', req, res);
};

function all_pics(req, res, next) {
    //
};

function upload(req, res, next) {
    saving('upload', req, res);
};

exports.index = index;
exports.two_pics = two_pics;
exports.all_pics = all_pics;
exports.upload = upload;

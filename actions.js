var fs = require('fs');

var compare = require('./processing');
var saving = require('./saving');

// router
function index(req, res, next) {
    res.render('index.jade');
};

function two_pics(req, res, next) {
    saving('two', req, res).then(function(names) {
        compare(names[0], names[1], res);
    });
};

function all_pics(req, res, next) {
    saving('all', req, res).then(function(names) {
        //add cycle
        res.end('END');
    });
};

function upload(req, res, next) {
    saving('upload', req, res);
};

exports.index = index;
exports.two_pics = two_pics;
exports.all_pics = all_pics;
exports.upload = upload;

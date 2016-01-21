var fs = require('fs');
var ffi = require('ffi');
var ref = require('ref');
var formidable = require('formidable');
var mime = require('mime-types');

//var RTLD_NOW = ffi.DynamicLibrary.FLAGS.RTLD_NOW;
//var RTLD_GLOBAL = ffi.DynamicLibrary.FLAGS.RTLD_GLOBAL;
//var mode = RTLD_NOW | RTLD_GLOBAL;

//function random
//var lib = ffi.DynamicLibrary('/usr/local/lib/libopencv_core.so.3.0');
//var lib = ffi.DynamicLibrary('./libcerno.so');
var my_rand = ffi.Library('./libcerno', {
    'my_rand': ['double', []]
});

function index(req, res, next) {
    console.log(my_rand());
    res.render('index.html');
};

function two_pics(req, res, next) {
    //
};

function all_pics(req, res, next) {
    //
};

function upload(req, res, next) {
    var form = new formidable.IncomingForm({
        uploadDir: "tmp"
    });
    form.parse(req, function(err, fields, files) {
        if(err) {
            console.log(err);
            res.end('Error!');
        }
        var img = files.one;
        var ext = mime.extension(img.type);
        fs.rename(img.path, 'images/' + new Date().getTime() + '.' + ext, function(err) {
            if (err) {
                res.end('Error!');
            }
            else {
                res.end('Success!');
            }
        });
    });
};

exports.index = index;
exports.two_pics = two_pics;
exports.all_pics = all_pics;
exports.upload = upload;
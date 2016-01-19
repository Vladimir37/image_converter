var fs = require('fs');
var ffi = require('ffi');
var formidable = require('formidable');
var mime = require('mime-types');

function index(req, res, next) {
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
                console.log('Error saving image');
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
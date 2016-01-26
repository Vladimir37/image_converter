var fs = require('fs');
var ffi = require('ffi');
var ref = require('ref');
var formidable = require('formidable');
var mime = require('mime-types');
var Struct = require('ref-struct');
var is = require('image-size');
var hexy = require('hexy');

var ffiImage = Struct({
    'rows': 'int',
    'cols': 'int',
    'data': 'int'
});

var ffi_image = ref.refType(ffiImage);

var libcerno = ffi.Library('./libcerno', {
    'my_rand': ['double', []],
    'compare_images': ['double', ['int', ffi_image, ffi_image, ffi_image, ffi_image]]
});

//test ------------------------------------------------------------------
var all = {
    img1: null,
    img2: null,
    resolution1: null,
    resolution2: null
};
var im_r1 = new Promise(function(resolve, reject) {
    fs.readFile('images/1453770075207.jpeg', function(err, result) {
        if(err) {
            reject(err);
        }
        else {
            all.img1 = result;
            resolve();
        }
    });
});
var im_r2 = new Promise(function(resolve, reject) {
    fs.readFile('images/1453775300708.jpeg', function(err, result) {
        if(err) {
            reject(err);
        }
        else {
            all.img2 = result;
            resolve();
        }
    });
});
var im_d1 = new Promise(function(resolve, reject) {
    is('images/1453770075207.jpeg', function(err, result) {
        if(err) {
            reject(err);
        }
        else {
            all.resolution1 = result;
            resolve();
        }
    });
});
var im_d2 = new Promise(function(resolve, reject) {
    is('images/1453775300708.jpeg', function(err, result) {
        if(err) {
            reject(err);
        }
        else {
            all.resolution2 = result;
            resolve();
        }
    });
});

Promise.all([im_r1, im_r2, im_d1, im_d2]).then(function(){
    var img_s_1 = new ffiImage({
        'rows': all.resolution1.height,
        'cols': all.resolution1.width,
        'data': all.img1
    });
    var img_s_2 = new ffiImage({
        'rows': all.resolution2.height,
        'cols': all.resolution2.width,
        'data': all.img2
    });
    var res1 = new ffiImage();
    var res2 = new ffiImage();
    console.log(hexy(all.img2));
    //var result = libcerno.compare_images(5, img_s_1.ref(), img_s_2.ref(), res1.ref(), res2.ref());
    console.log('END');
    console.log(result);
}, function(err) {
    console.log('ERROR');
});
//test ------------------------------------------------------------------

function index(req, res, next) {
    console.log(libcerno.my_rand());
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
        is(img.path, function(err, data) {
            if(err) {
                console.log(err);
            }
            else {
                console.log(data);
            }
            fs.rename(img.path, 'images/' + new Date().getTime() + '.' + ext, function (err) {
                if (err) {
                    res.end('Error!');
                }
                else {
                    res.end('Success!');
                }
            });
        });
    });
};

exports.index = index;
exports.two_pics = two_pics;
exports.all_pics = all_pics;
exports.upload = upload;

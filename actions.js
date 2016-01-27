var fs = require('fs');
var ffi = require('ffi');
var ref = require('ref');
var formidable = require('formidable');
var mime = require('mime-types');
var Struct = require('ref-struct');
var ArrayType = require('ref-array');
var is = require('image-size');
var pixel = require('pixel-getter');

var int = ref.types.int;
var IntArray = ArrayType(int);

var ffiImage = Struct({
    'rows': 'int',
    'cols': 'int',
    'data': IntArray
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
    img1_arr: null,
    img2_arr: null,
    resolution1: null,
    resolution2: null
};
//promises -------------------------
function im_r1() {
    return new Promise(function (resolve, reject) {
        fs.readFile('images/1453770075207.jpeg', function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                all.img1 = result;
                resolve();
            }
        });
    });
}
function im_r2() {
    return new Promise(function (resolve, reject) {
        fs.readFile('images/1453775300708.jpeg', function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                all.img2 = result;
                resolve();
            }
        });
    });
}
function im_d1() {
    return new Promise(function(resolve, reject) {
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
}
function im_d2() {
    return new Promise(function(resolve, reject) {
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
}
function im_a1() {
    return new Promise(function(resolve, reject) {
        pixel.get(all.img1, function(err, pixels) {
            if(err) {
                reject(err);
            }
            else {
                var image_result = [];
                pixels[0].forEach(function(item) {
                    image_result.push(item.r, item.g, item.b);
                });
                resolve(image_result);
            }
        });
    });
}
function im_a2() {
    return new Promise(function(resolve, reject) {
        pixel.get(all.img2, function(err, pixels) {
            if(err) {
                reject(err);
            }
            else {
                var image_result = [];
                pixels[0].forEach(function(item) {
                    image_result.push(item.r, item.g, item.b);
                });
                resolve(image_result);
            }
        });
    });
}
//promises -------------------------

Promise.all([im_r1(), im_r2(), im_d1(), im_d2()]).then(function(){
    return Promise.all([im_a1(), im_a2()]);
}).then(function(imgs_arr) {
    //input
    var img1_arr = new IntArray(all.resolution1.height*all.resolution1.width*3);
    var img2_arr = new IntArray(all.resolution2.height*all.resolution2.width*3);
    //output
    var res1_arr = new IntArray(all.resolution1.height*all.resolution1.width*4*4*3);
    var res2_arr =  new IntArray(all.resolution2.height*all.resolution1.width*4*4*3);
    //input
    var img_s_1 = new ffiImage({
        'rows': all.resolution1.height,
        'cols': all.resolution1.width,
        'data': img1_arr
    });
    var img_s_2 = new ffiImage({
        'rows': all.resolution2.height,
        'cols': all.resolution2.width,
        'data': img2_arr
    });
    //output
    var res1 = new ffiImage({
        'rows': all.resolution1.height*4,
        'cols': all.resolution1.width*4,
        'data': res1_arr
    });
    var res2 = new ffiImage({
        'rows': all.resolution2.height*4,
        'cols': all.resolution2.width*4,
        'data': res2_arr
    });
    var result = libcerno.compare_images(5, img_s_1.ref(), img_s_2.ref(), res1.ref(), res2.ref());
    console.log(result);
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

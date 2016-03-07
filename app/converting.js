var fs = require('fs');
var is = require('image-size');
var mime = require('mime-types');
var pixel = require('pixel-getter');

function image_convert(img, mime_type, name) {
    return new Promise(function (resolve, reject) {
        var image_data = {
            name,
            extension: null,
            width: null,
            height: null,
            pixels: null
        };
        var extension = mime.extension(mime_type);
        Promise.all([buffer(img), resolution(img)]).then(function(result) {
            image_data = {
                extension,
                width: result[1].width,
                height: result[1].height,
                file: result[0]
            };
            fs.unlink(img);
            resolve(image_data)
        }).catch(function(err) {
            console.log(err);
            reject(err);
        })
    });
}

// to image array START
function buffer(img) {
    return new Promise(function(resolve, reject) {
        fs.readFile(img, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.toString('base64'));
            }
        });
    })
}

//function pixels(buffer) {
//    return new Promise(function(resolve, reject) {
//        pixel.get(buffer, function (err, pixels) {
//            if (err) {
//                reject(err);
//            }
//            else {
//                var image_result = [];
//                pixels[0].forEach(function (item) {
//                    image_result.push(item.r, item.g, item.b);
//                });
//                resolve(image_result);
//            }
//        });
//    });
//}
//
//function image_array(img) {
//    return new Promise(function(resolve, reject) {
//        buffer(img).then(function(buffer) {
//            return pixels(buffer);
//        }).then(function(array) {
//            resolve(array);
//        }).catch(function(err) {
//            console.log(err);
//            reject();
//        })
//    });
//}
// to image array END

function resolution(img) {
    return new Promise(function (resolve, reject) {
        is(img, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

module.exports = image_convert;
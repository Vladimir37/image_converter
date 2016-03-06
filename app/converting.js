var fs = require('fs');

function image_convert(image) {
    return new Promise(function (resolve, reject) {
        var image_data = {
            extension: null,
            width: null,
            height: null,
            pixels: null
        }
    });
}

function buffer(img) {
    return new Promise(function(resolve, reject) {
        fs.readFile('images/' + img, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    })
}

function pixels(buffer) {
    return new Promise(function(resolve, reject) {
        pixel.get(buffer, function (err, pixels) {
            if (err) {
                reject(err);
            }
            else {
                var image_result = [];
                pixels[0].forEach(function (item) {
                    image_result.push(item.r, item.g, item.b);
                });
                resolve(image_result);
            }
        });
    });
}

function resolution(img) {
    return new Promise(function(resolve, reject) {
        //
    });
}
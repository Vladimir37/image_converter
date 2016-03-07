var is = require('image-size');
var im = require('imagemagick');
var config = require('../config');

function resizing(data) {
    return new Promise(function(resolve, reject) {
        var resize_options = {
            srcData: new Buffer(data.file, 'base64'),
            width: config.width,
            height: config.height
        };
        im.crop(resize_options, function (err, stdout) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve({
                    width: config.width,
                    height: config.height,
                    file: stdout
                });
            }
        });
    });
};

module.exports = resizing;
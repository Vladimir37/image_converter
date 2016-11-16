var is = require('image-size');
var im = require('imagemagick');
var fs = require('fs');

var config = require('../config');

function resizing(data) {
    return new Promise(function(resolve, reject) {
        var resize_options = {
            id: data.id,
            srcData: new Buffer(data.file, 'base64'),
            width: config.width,
            height: config.height
        };
        im.crop(resize_options, function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                var image_data = {
                    id: data.id,
                    width: config.width,
                    height: config.height,
                    file: new Buffer(stdout, 'binary')
                };
                resolve(image_data);
            }
        });
    });
};

module.exports = resizing;
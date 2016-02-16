var is = require('image-size');
var im = require('imagemagick');
var config = require('../config');

function resizing(path) {
    return new Promise(function(resolve, reject) {
        var resize_options = {
            srcPath: 'images/' + path,
            dstPath: 'images/' + path,
            width: config.width,
            height: config.height
        };
        im.crop(resize_options, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve('Success!');
            }
        });
    });
};

module.exports = resizing;
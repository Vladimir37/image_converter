var is = require('image-size');
var im = require('imagemagick');

function resizing(path) {
    return new Promise(function(resolve, reject) {
        is('images/' + path, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                var resize_options;
                if (data.height > 300 || data.width > 300) {
                    if (data.height > data.width) {
                        resize_options = {
                            srcPath: 'images/' + path,
                            dstPath: 'images/' + path,
                            height: 300
                        };
                    }
                    else {
                        resize_options = {
                            srcPath: 'images/' + path,
                            dstPath: 'images/' + path,
                            width: 300
                        };
                    }
                    im.resize(resize_options, function (err) {
                        if (err) {
                            reject(err);
                            console.log(err);
                        }
                        else {
                            resolve('Success!');
                        }
                    })
                }
                else {
                    resolve('Success!');
                }
            }
        });
    });
};

module.exports = resizing;
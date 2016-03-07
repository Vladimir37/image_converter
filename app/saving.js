var EventEmitter = require('events');
var fs = require('fs');
var formidable = require('formidable');
var mime = require('mime-types');

var resizing = require('./resizing');
var convert = require('./converting');
var models = require('./db/models');

function saving(type, req, res) {
    return new Promise(function(resolve, reject) {
        var form = new formidable.IncomingForm({
            uploadDir: "tmp"
        });
        if(type == 'upload') {
            form.parse(req, function(err, fields, files) {
                if(err) {
                    console.log(err);
                    reject('Error!');
                }
                // image filer
                var images_arr = [];
                for(var file in files) {
                    if(files[file].type.slice(0, 5) == 'image') {
                        images_arr.push(files[file]);
                    }
                };
                var convert_images = [];
                images_arr.forEach(function(image) {
                    convert_images.push(convert(image.path, image.type));
                });
                var user = res.user_id;
                Promise.all(convert_images).then(function(images) {
                    var for_saving = [];
                    images.forEach(function(img) {
                        for_saving.push(models.images.create({
                            width: img.width,
                            height: img.height,
                            user: user,
                            file: img.file,
                            ext: img.extension
                        }));
                    });
                    return Promise.all(for_saving);
                }).then(function() {
                   resolve();
                }).catch(function(err) {
                    reject(err);
                })
            });
        }
        else if(type == 'two') {
            var form = new formidable.IncomingForm({
                uploadDir: "tmp"
            });
            form.parse(req, function(err, fields, files) {
                if(err) {
                    console.log(err);
                    reject('Error!');
                }
                var CliqueCount = fields.count;
                Promise.all([
                    convert(files.one.path, files.one.type),
                    convert(files.two.path, files.two.type)
                ]).then(function(files) {
                    return Promise.all([
                        resizing(files[0]),
                        resizing(files[1])
                    ]);
                }).then(function(images) {
                    resolve(images);
                }).catch(function(err) {
                    console.log(err);
                    reject('Error!');
                });
            });
        }
        else if(type == 'all') {
            form.parse(req, function(err, fields, files) {
                if(err) {
                    console.log(err);
                    reject('Error!');
                }
                var CliqueCount = fields.count;
                var img = files.one;
                var ext = mime.extension(img.type);
                var date_name = new Date().getTime();
                fs.rename(img.path, 'images/all_pics/' + date_name + '.' + ext, function (err) {
                    if (err) {
                        reject('Error!');
                    }
                    else {
                        resizing('all_pics/' + date_name + '.' + ext).then(function() {
                            resolve([date_name + '.' + ext, CliqueCount]);
                        }, function(err) {
                            reject('Error!');
                        });
                    }
                });
            });
        }
        else {
            reject('Incorrect command.');
        }
    });
}

module.exports = saving;
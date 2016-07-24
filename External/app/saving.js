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
                var image = files.img;
                // image filer
                if(image.type.slice(0, 5) != 'image') {
                    reject('Error!');
                }
                var Converting = convert(image.path, image.type);
                var user = res.user_id;
                Converting.then(function(image) {
                    return models.images.create({
                        width: image.width,
                        height: image.height,
                        user: user,
                        file: image.file,
                        ext: image.extension,
                        name: fields.name,
                        gender: fields.gender,
                        nationality: fields.nation,
                        dob: new Date(fields.dob)
                    });
                }).then(function() {
                    resolve();
                }).catch(function(err) {
                    reject(err);
                })
            });
        }
        else if(type == 'two') {
            form.parse(req, function(err, fields, files) {
                if(err) {
                    console.log(err);
                    reject('Error!');
                }
                var CliqueCount = fields.CliqueCount;
                Promise.all([
                    convert(files.one.path, files.one.type),
                    convert(files.two.path, files.two.type)
                ]).then(function(files) {
                    return Promise.all([
                        resizing(files[0]),
                        resizing(files[1])
                    ]);
                }).then(function(images) {
                    resolve([images, CliqueCount]);
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
                var CliqueCount = fields.CliqueCount;
                var img = files.one;
                convert(img.path, img.type).then(function(image) {
                    return resizing(image);
                }).then(function(image) {
                    resolve([image, CliqueCount]);
                }).catch(function(err) {
                    reject(err);
                })
            });
        }
        else {
            reject('Incorrect command.');
        }
    });
}

module.exports = saving;
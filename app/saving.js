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
                var datetime = new Date().getTime().toString();
                var num = 0;
                images_arr.forEach(function(image) {
                    convert_images.push(convert(image.path, image.type, datetime + num));
                    num++;
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
            var date_name = new Date().getTime();
            fs.mkdir('images/two_pics/' + date_name, function() {
                var form = new formidable.IncomingForm({
                    uploadDir: "tmp"
                });
                form.parse(req, function(err, fields, files) {
                    if(err) {
                        console.log(err);
                        reject('Error!');
                    }
                    var CliqueCount = fields.count;
                    var img1 = files.one;
                    var img2 = files.two;
                    var ext1 = mime.extension(img1.type);
                    var ext2 = mime.extension(img2.type);
                    var loading = new EventEmitter();
                    var imgs_done = 0;
                    loading.on('error', function() {
                        reject('Error!');
                    });
                    loading.on('done', function() {
                        ++imgs_done;
                        if(imgs_done == 2) {
                            Promise.all([
                                resizing('two_pics/' + file1),
                                resizing('two_pics/' + file2)
                            ]).then(function() {
                                resolve(['two_pics/' + file1, 'two_pics/' + file2, CliqueCount]);
                            }, function(err) {
                                console.log(err);
                                reject('Error!');
                            });
                        }
                    });
                    var file1 = date_name + '/one.' + ext1;
                    var file2 = date_name + '/two.' + ext2;
                    fs.rename(img1.path, 'images/two_pics/' + file1, function (err) {
                        if (err) {
                            console.log(err);
                            loading.emit('error');
                        }
                        else {
                            loading.emit('done');
                        }
                    });
                    fs.rename(img2.path, 'images/two_pics/' + file2, function (err) {
                        if (err) {
                            console.log(err);
                            loading.emit('error');
                        }
                        else {
                            loading.emit('done');
                        }
                    });
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
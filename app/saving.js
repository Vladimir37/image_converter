var EventEmitter = require('events');
var fs = require('fs');
var formidable = require('formidable');
var mime = require('mime-types');
var is = require('image-size');

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
                var img = files.one;
                var ext = mime.extension(img.type);
                is(img.path, function(err, data) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(data);
                    }
                    fs.rename(img.path, 'images/saved/' + new Date().getTime() + '.' + ext, function (err) {
                        if (err) {
                            reject('Error!');
                        }
                        else {
                            resolve('Success!');
                        }
                    });
                });
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
                    var img1 = files.one;
                    var img2 = files.two;
                    var ext1 = mime.extension(img1.type);
                    var ext2 = mime.extension(img2.type);
                    var loading = new EventEmitter();
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
                    var imgs_done = 0;
                    loading.on('error', function() {
                        reject('Error!');
                    });
                    loading.on('done', function() {
                        ++imgs_done;
                        if(imgs_done == 2) {
                            resolve([file1, file2]);
                        }
                    })
                });
            });
        }
        else if(type == 'all') {
            form.parse(req, function(err, fields, files) {
                if(err) {
                    console.log(err);
                    reject('Error!');
                }
                var img = files.one;
                var ext = mime.extension(img.type);
                var date_name = new Date().getTime();
                fs.rename(img.path, 'images/all_pics/' + date_name + '.' + ext, function (err) {
                    if (err) {
                        reject('Error!');
                    }
                    else {
                        resolve(date_name + '.' + ext);
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
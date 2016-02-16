var compare = require('./processing');
var saving = require('./saving');
var PixelStack = require('pixel-stack');
var fs = require('fs');

// router
function index(req, res, next) {
    res.render('index.jade');
};

function two_pics(req, res, next) {
    saving('two', req, res).then(function(names) {
        return compare(names[0], names[1], names[2]);
    }).then(function(result) {
        res.render('result.jade', result);
    }).catch(function(err) {
        res.end(err);
    });
};

function all_pics(req, res, next) {
    var file_name;
    var CliqueCount;
    saving('all', req, res).then(function(name) {
        file_name = name[0];
        CliqueCount = name[1];
        return new Promise(function(resolve, reject) {
            fs.readdir('images/saved', function (err, data) {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(data);
                }
            });
        });
    }).then(function(images) {
        var all_images = [];
        images.forEach(function(item) {
            all_images.push(compare('all_pics/' + file_name, 'saved/' + item, CliqueCount));
        });
        return Promise.all(all_images);
    }).then(function(result) {
        result.sort(function(a, b) {
            return b.number - a.number;
        });
        result.forEach(function(item) {
            console.log(item.number);
        });
        res.render('result.jade', result[0]);
    }).catch(function(err) {
        console.log(err);
        res.end('Error!');
    });
};

function upload(req, res, next) {
    saving('upload', req, res).then(function() {
        res.end('Success!');
    }, function(err) {
        console.log(err);
        res.end(err);
    });
};

exports.index = index;
exports.two_pics = two_pics;
exports.all_pics = all_pics;
exports.upload = upload;
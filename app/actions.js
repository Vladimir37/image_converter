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
        console.log(names);
        return compare(names[0], names[1]);
    }).then(function(result) {
        //res.render('result.jade', result);
        res.render('result.jade', result);
    }).catch(function(err) {
        res.end(err);
    });
};

function all_pics(req, res, next) {
    var file_name;
    saving('all', req, res).then(function(name) {
        file_name = name;
        fs.readdir('images/saved', function (err, data) {
            if (err) {
                res.end(err);
            }
            else {
                return Promise.resolve(data);
            }
        })
    }).then(function(images) {
        var all_images = [];
        images.forEach(function(item) {
            all_images.push(compare('all_pics/' + file_name, 'saved/' + item));
        });
        return Promise.resolve(all_images);
    }).then(function(result) {
        result.sort(function(a, b) {
            return a.number - b.number;
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
var fs = require('fs');

var compare = require('./processing');
var saving = require('./saving');
var auth = require('./db/auth');
var models = require('./db/models');
var crypt = require('./crypt');
var convert = require('./converting');

// router
function manage_back(req, res, next) {
    var type = req.body.type;
    //creating
    if(type == 1) {
        var name = req.body.name;
        var raw_pass = req.body.pass;
        var status = req.body.status;
        var pass = crypt.encrupt(raw_pass);
        models.users.create({
            name,
            pass,
            status
        }).then(function () {
            res.end('Success');
        }, function (err) {
            console.log(err);
            res.end('Server error');
        });
    }
    //deleting
    else if(type == 2) {
        var id = req.body.id;
        models.users.destroy({
            where: {
                id
            }
        }).then(function () {
            res.end('Success');
        }, function (err) {
            console.log(err);
            res.end('Server error');
        });
    }
    else {
        res.end('Incorrect command');
    }
}

// image handling
function two_pics(req, res, next) {
    saving('two', req, res).then(function(images) {
        return compare(images[0], images[1]);
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

exports.two_pics = two_pics;
exports.all_pics = all_pics;
exports.upload = upload;
exports.manage_back = manage_back;
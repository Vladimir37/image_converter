var fs = require('fs');

//var compare = require('./processing');
var compare = require('./send');

var saving = require('./saving');
var auth = require('./db/auth');
var models = require('./db/models');
var crypt = require('./crypt');
var convert = require('./converting');
var resizing = require('./resizing');

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
    _create_row().then(function(num) {
        res.render('result.jade');
        return saving('two', req, res);
    }).then(function(images) {
        return compare(images[0][0], images[0][1], images[1]);
    }).then(function(result) {
        res.render('result.jade', result);
    }).catch(function(err) {
        console.log(err);
        res.end('Server error');
    });
};

function all_pics(req, res, next) {
    var user_id = res.user_id;
    var target_file;
    var CliqueCount;
    saving('all', req, res).then(function(name) {
        target_file = name[0];
        CliqueCount = name[1];
        return models.images.findAll({
            where: {
                user: user_id
            }
        });
    }).then(function(images) {
        var for_resizing = [];
        images.forEach(function(image) {
            for_resizing.push(resizing(image));
        });
        return Promise.all(for_resizing);
    }).then(function(images) {
        var for_compare = [];
        images.forEach(function(image) {
            for_compare.push(compare(target_file, image, CliqueCount));
        });
        return Promise.all(for_compare);
    }).then(function(result) {
        result.sort(function(a, b) {
            return b.number - a.number;
        });
        result.forEach(function(item) {
            console.log(item.number);
        });
        var first_three = {
            one: result[0],
            two: result[1],
            three: result[2]
        };
        res.render('result_many.jade', first_three);
    }).catch(function(err) {
        console.log(err);
        res.end('Error!');
    });
};

function upload(req, res, next) {
    saving('upload', req, res).then(function() {
        res.redirect('/gallery');
    }, function(err) {
        console.log(err);
        res.end('Server error');
    });
};

function _create_row() {
    return new Promise(function (resolve, reject) {
        models.comparison.create({
            completed: false,
            one: null,
            two: null,
            three: null
        }).then(function (row) {
            resolve(row.id);
        }, function(err) {
            reject(err);
        });
    });
}

exports.two_pics = two_pics;
exports.all_pics = all_pics;
exports.upload = upload;
exports.manage_back = manage_back;
var fs = require('fs');

var compare = require('./processing');
var saving = require('./saving');
var auth = require('./db/auth');
var users = require('./db/models');
var crypt = require('./crypt');
var convert = require('./converting');

// router
function index(req, res, next) {
    auth.check_bool(req).then(function(status) {
        res.locals.user_status = status;
        res.render('index.jade');
    }, function() {
        res.render('login.jade');
    });
};

function manage_front(req, res, next) {
    users.findAll().then(function(users) {
        res.render('manage.jade', {users: users});
    }, function(err) {
        console.log(err);
        res.end('Server error');
    });
}

function manage_back(req, res, next) {
    var type = req.body.type;
    //creating
    if(type == 1) {
        var name = req.body.name;
        var raw_pass = req.body.pass;
        var status = req.body.status;
        var pass = crypt.encrupt(raw_pass);
        users.create({
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
        users.destroy({
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
exports.manage_front = manage_front;
exports.manage_back = manage_back;
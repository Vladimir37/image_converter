var users = require('./models');
var crypt = require('../crypt');

function authentication(req, res, next) {
    var login = req.body.login;
    var pass = req.body.pass;
    if(!login || !pass) {
        res.end('Incorrect login or password!');
        return false;
    }
    users.findOne({
        where: {
            name: login
        }
    }).then(function(target_user) {
        if(!target_user) {
            res.end('Incorrect login or password!');
            return false;
        }
        var target_pass = crypt.decrypt(target_user.pass);
        if(target_pass == pass) {
            res.cookie('ic_login', crypt.encrupt(target_user.name));
            res.redirect('/');
        }
        else {
            res.end('Incorrect login or password!');
            return false;
        }
    }).catch(function(err) {
        console.log(err);
        res.end('Server error.')
    });
}

function check(req, res, next) {
    var cookie = crypt.decrypt(req.cookies.ic_login);
    if(cookie) {
        users.findOne({
            where: {
                name: cookie
            }
        }).then(function(user) {
            if(user) {
                next();
            }
            else {
                res.end('Error 403 - Forbidden');
            }
        });
    }
    else {
        res.end('Error 403 - Forbidden');
    }
}

function check_bool(req) {
    return new Promise(function(resolve, reject) {
        var cookie = crypt.decrypt(req.cookies.ic_login);
        if (cookie) {
            users.findOne({
                where: {
                    name: cookie
                }
            }).then(function (user) {
                if(Boolean(user)) {
                    resolve();
                }
                else {
                    reject();
                }
            });
        }
        else {
            reject();
        }
    });
}

function check_status(req, res, next) {
    var cookie = crypt.decrypt(req.cookies.ic_login);
    if(cookie) {
        users.findOne({
            where: {
                name: cookie
            }
        }).then(function(user) {
            if(user.status == 1) {
                next();
            }
            else {
                res.end('Error 403 - Forbidden');
            }
        });
    }
    else {
        res.end('Error 403 - Forbidden');
    }
}

exports.auth = authentication;
exports.check = check;
exports.check_bool = check_bool;
exports.check_status = check_status;
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
            res.cookie('ic_login', crypt.encrupt('ic_login'));
        }
        else {
            res.end('Incorrect login or password!');
            return false;
        }
    })
}

function check(req, res, next) {
    var cookie = req.cookies.ic_login;
    if(cookie && crypt.decrypt(cookie) == 'ic_login') {
        next();
    }
    else {
        res.end('Error 403 - Forbidden');
    }
}

function check_bool(req) {
    var cookie = req.cookies.ic_login;
    return cookie && crypt.decrypt(cookie) == 'ic_login';
}

exports.auth = authentication;
exports.check = check;
exports.check_bool = check_bool;
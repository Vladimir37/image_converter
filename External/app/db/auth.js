var models = require('./models');
var crypt = require('../crypt');

function authentication(req, res, next) {
    var login = req.body.login;
    var pass = req.body.pass;
    if(!login || !pass) {
        res.end('1');
        return false;
    }
    models.users.findOne({
        where: {
            name: login
        }
    }).then(function(target_user) {
        if(!target_user) {
            res.end('1');
            return false;
        }
        var target_pass = crypt.decrypt(target_user.pass);
        if(target_pass == pass) {
            res.cookie('ic_login', crypt.encrupt(target_user.name));
            res.end('0');
        }
        else {
            res.end('1');
            return false;
        }
    }).catch(function(err) {
        console.log(err);
        res.end('2');
    });
}

function check(req, res, next) {
    var cookie = crypt.decrypt(req.cookies.ic_login);
    if(cookie) {
        models.users.findOne({
            where: {
                name: cookie
            }
        }).then(function(user) {
            if(user) {
                res.user_id = user.id;
                res.user_status = user.status;
                res.locals.user_status = user.status;
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
            models.users.findOne({
                where: {
                    name: cookie
                }
            }).then(function (user) {
                if(Boolean(user)) {
                    resolve(user.status);
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
        models.users.findOne({
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

function exit(req, res, next) {
    res.clearCookie('ic_login');
    res.redirect('/');
}

exports.auth = authentication;
exports.check = check;
exports.check_bool = check_bool;
exports.check_status = check_status;
exports.exit = exit;
var auth = require('./db/auth');
var models = require('./db/models');

function index(req, res, next) {
    auth.check_bool(req).then(function(status) {
        res.locals.user_status = status;
        res.render('index.jade');
    }, function() {
        res.render('login.jade');
    });
};

function manage_front(req, res, next) {
    models.users.findAll().then(function(users) {
        res.render('manage.jade', {users: users});
    }, function(err) {
        console.log(err);
        res.end('Server error');
    });
}

function image_render(req, res, next) {
    var image_num = req.params.num;
    models.images.findOne({
        where: {
            id: image_num,
            user: res.user_id
        }
    }).then(function(img) {
        if(!img) {
            res.end('404 Not found');
        }
        else {
            var image_buffer = new Buffer(img.file, 'base64');
            res.end(image_buffer);
        }
    })
}

exports.index = index;
exports.manage_front = manage_front;
exports.image = image_render;
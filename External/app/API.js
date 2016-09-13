var models = require('./db/models');

function AllImages(req, res, next) {
    models.images.findAll({
        user: req.user_id
    }).then(function (images) {
        res.end(JSON.stringify({
            status: 0,
            body: images
        }));
    }).catch(function(err) {
        console.log(err);
        res.end(JSON.stringify({
            status: 1
        }));
    })
}

exports.allImages = AllImages;
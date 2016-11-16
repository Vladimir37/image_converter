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
    });
}

function CheckComparison(req, res, next) {
    var num = req.query.num;
    models.comparison.findById(num).then(function (comparison) {
        if (comparison && comparison.completed) {
            res.end(JSON.stringify({
                status: 0,
                body: comparison
            }));
        }
        else {
            res.end(JSON.stringify({
                status: 1
            }));
        }
    }).catch(function(err) {
        console.log(err);
        res.end(JSON.stringify({
            status: 2
        }));
    });
}

function checkPhoto(req, res, next) {
    var num = req.body.num;
    models.images.findById(num).then(function (data) {
        res.end(JSON.stringify({
            status: 0,
            body: data
        }));
    }).catch(function (err) {
        console.log(err);
        res.end(JSON.stringify({
            status: 1
        }));
    })
}

exports.allImages = AllImages;
exports.checkComparison = CheckComparison;
exports.checkPhoto = checkPhoto;
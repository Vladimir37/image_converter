var compare = require('./processing');

function comparison(req, res, next) {
    var image_one = req.body.one;
    var image_two = req.body.two;
    var clicks = req.body.clicks;
    var response = {
        status: null,
        body: null
    };
    compare(clicks, image_one, image_two).then(function(result) {
        response.status = 0;
        response.body = result;
        res.end(JSON.stringify(response));
    }).catch(function(err) {
        console.log(err);
        response.status = 1;
        res.end(JSON.stringify(response));
    })
}

module.exports = comparison;
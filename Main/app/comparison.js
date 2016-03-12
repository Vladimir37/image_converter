var compare = require('./processing');

function comparison(req, res, next) {
    var image_one = req.body.one;
    var image_two = req.body.two;
    var clicks = req.body.clicks;
    image_one.file = new Buffer(image_one.file, 'base64');
    image_two.file = new Buffer(image_two.file, 'base64');
    var response = {
        status: null,
        body: null
    };
    compare(image_one, image_two, clicks).then(function(result) {
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
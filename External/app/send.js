var request = require('request');
var fs = require('fs');

var config = require('../config.json');

function sending(image_one, image_two, clicks) {
    return new Promise(function(resolve, reject) {
        var form_data = {
            one: image_one,
            two: image_two,
            clicks: clicks
        };
        form_data.one.file = form_data.one.file.toString('base64');
        form_data.two.file = form_data.two.file.toString('base64');
        request.post(config.main_server + 'comparison', {form: form_data},
            function (error, response, body) {
                if(error) {
                    console.log(error);
                    reject(error);
                }
                else if (response.statusCode == 200) {
                    var response_obj = JSON.parse(body);
                    if(response_obj.status == 0) {
                        resolve(response_obj.body);
                    }
                    else {
                        console.log('Processing error!');
                        reject();
                    }
                }
                else {
                    console.log(response.statusCode);
                    console.log('Incorrect response');
                    reject(response);
                }
            }
        );
    });
}

module.exports = sending;
var process = require('process');

var users = require('./app/db/models').users;
var crypt = require('./app/crypt');

var name = process.argv[2];
var raw_pass = process.argv[3];

var pass = crypt.encrupt(raw_pass);

users.create({
    name,
    pass,
    status: 1
}).then(function() {
    console.log('Success!');
}, function(err) {
    console.log(err)
});
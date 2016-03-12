var Cipher = require('easy-encryption');

var cipher = new Cipher({
    secret: 'secret_text',
    iterations: 137
});

function encrypt(text) {
    try {
        var result = cipher.encrypt(text);
        return result;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

function decrypt(text) {
    try {
        var result = cipher.decrypt(text);
        return result;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

exports.encrupt = encrypt;
exports.decrypt = decrypt;
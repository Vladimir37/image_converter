var fs = require('fs');
var EventEmitter = require('events');

var ffi = require('ffi');
var ref = require('ref');
var Struct = require('ref-struct');
var ArrayType = require('ref-array');
var is = require('image-size');
var pixel = require('pixel-getter');

var int = ref.types.int;
var IntArray = ArrayType(int);
//var intPtr = ref.refType('int');

var ffiImage = Struct({
    'rows': 'int',
    'cols': 'int',
    'data': IntArray
});

var libcerno = ffi.Library('app/libcerno', {
    'my_rand': ['double', []],
    'compare_images': ['double', ['int', ffiImage, ffiImage, ffiImage, ffiImage]]
});

function compare(first, second) {
    return new Promise(function(resolve, reject) {
        var all = {
            img1: null,
            img2: null,
            img1_arr: null,
            img2_arr: null,
            resolution1: null,
            resolution2: null
        };
        //promises -------------------------
        function im_r1() {
            return new Promise(function (resolve, reject) {
                fs.readFile('images/' + first, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        all.img1 = result;
                        resolve();
                    }
                });
            });
        }

        function im_r2() {
            return new Promise(function (resolve, reject) {
                fs.readFile('images/' + second, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        all.img2 = result;
                        resolve();
                    }
                });
            });
        }

        function im_d1() {
            return new Promise(function (resolve, reject) {
                is('images/' + first, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        all.resolution1 = result;
                        resolve();
                    }
                });
            });
        }

        function im_d2() {
            return new Promise(function (resolve, reject) {
                is('images/' + second, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        all.resolution2 = result;
                        resolve();
                    }
                });
            });
        }

        function im_a1() {
            return new Promise(function (resolve, reject) {
                pixel.get(all.img1, function (err, pixels) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        var image_result = [];
                        pixels[0].forEach(function (item) {
                            image_result.push(item.r, item.g, item.b);
                        });
                        resolve(image_result);
                    }
                });
            });
        }

        function im_a2() {
            return new Promise(function (resolve, reject) {
                pixel.get(all.img2, function (err, pixels) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        var image_result = [];
                        pixels[0].forEach(function (item) {
                            image_result.push(item.r, item.g, item.b);
                        });
                        resolve(image_result);
                    }
                });
            });
        }

        //promises -------------------------

        Promise.all([im_r1(), im_r2(), im_d1(), im_d2()]).then(function () {
            return Promise.all([im_a1(), im_a2()]);
        }).then(function (imgs_arr) {
            //input
            var img1_arr = new IntArray(all.resolution1.height * all.resolution1.width * 3);
            var img2_arr = new IntArray(all.resolution2.height * all.resolution2.width * 3);
            //output
            var res1_arr = new IntArray(all.resolution1.height * all.resolution1.width * 4 * 4 * 3);
            // console.log(res1_arr.length);
            var res2_arr = new IntArray(all.resolution2.height * all.resolution1.width * 4 * 4 * 3);
            // console.log(res2_arr.length);
            //input
            var img_s_1 = new ffiImage({
                'rows': all.resolution1.height,
                'cols': all.resolution1.width,
                'data': img1_arr
            });
            var img_s_2 = new ffiImage({
                'rows': all.resolution2.height,
                'cols': all.resolution2.width,
                'data': img2_arr
            });
            //output
            var res1 = new ffiImage({
                'rows': all.resolution1.height * 4,
                'cols': all.resolution1.width * 4,
                'data': res1_arr
            });
            var res2 = new ffiImage({
                'rows': all.resolution2.height * 4,
                'cols': all.resolution2.width * 4,
                'data': res2_arr
            });
            var result_number = libcerno.compare_images(5, img_s_1, img_s_2, res1, res2);

            //saving result
            var saving = new EventEmitter();
            var name = new Date().getTime();
            var done_files = 0;
            var result = {
                number: result_number,
                first: name + '_first',
                second: name + '_second'
            };
            fs.writeFile('images/results/' + name + '_first', res1.data, function(err) {
                if(err) {
                    console.log(err);
                    saving.emit('error');
                }
                else {
                    saving.emit('done');
                }
            });
            fs.writeFile('images/results/' + name + '_second', res2.data, function(err) {
                if(err) {
                    console.log(err);
                    saving.emit('error');
                }
                else {
                    saving.emit('done');
                }
            });
            saving.on('error', function() {
                reject('Error!')
            });
            saving.on('done', function() {
                ++done_files;
                if(done_files == 2) {
                    resolve(result);
                }
            });
        });
    });
}

module.exports = compare;
var fs = require('fs');

var ffi = require('ffi');
var ref = require('ref');
var Struct = require('ref-struct');
var ArrayType = require('ref-array');
var is = require('image-size');
var pixel = require('pixel-getter');

var int = ref.types.int;
var IntArray = ArrayType(int);

var ffiImage = Struct({
    'rows': 'int',
    'cols': 'int',
    'data': IntArray
});

var libcerno = ffi.Library('app/libcerno', {
    'my_rand': ['double', []],
    'compare_images': ['double', ['int', ffiImage, ffiImage, ffiImage, ffiImage]]
});

function compare(first, second, count) {
    return new Promise(function(resolve, reject) {
        var all = {
            img1: first.file,
            img2: second.file,
            resolution1: {
                width: first.width,
                height: first.height
            },
            resolution2: {
                width: second.width,
                height: second.height
            }
        };
        //promises -------------------------
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

        Promise.all([im_a1(), im_a2()]).then(function (imgs_arr) {
            //input
            var img1_arr = new IntArray(imgs_arr[0]);
            var img2_arr = new IntArray(imgs_arr[1]);
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
            var result_number = libcerno.compare_images(count, img_s_1, img_s_2, res1, res2);
            var image_result_arr_first = [];
            for (var i = 0; i < res1.rows; ++i) {
                for (var j = 0; j < res1.cols; ++j) {
                    var pixel_first = [];
                    pixel_first.push(res1.data[3*res1.cols*i + 3*j + 0]);
                    pixel_first.push(res1.data[3*res1.cols*i + 3*j + 1]);
                    pixel_first.push(res1.data[3*res1.cols*i + 3*j + 2]);
                    image_result_arr_first.push(pixel_first);
                }
            }
            var image_result_arr_second = [];
            for (var k = 0; k < res2.rows; ++k) {
                for (var l = 0; l < res2.cols; ++l) {
                    var pixel_second = [];
                    pixel_second.push(res2.data[3*res2.cols*k + 3*l + 0]);
                    pixel_second.push(res2.data[3*res2.cols*k + 3*l + 1]);
                    pixel_second.push(res2.data[3*res2.cols*k + 3*l + 2]);
                    image_result_arr_second.push(pixel_second);
                }
            }
            var first = {
                cols: res1.cols,
                rows: res1.rows,
                data: image_result_arr_first
            };
            var second = {
                cols: res2.cols,
                rows: res2.rows,
                data: image_result_arr_second
            };
            resolve({
                first: first,
                second: second,
                number: result_number
            });
        });
    });
}

module.exports = compare;
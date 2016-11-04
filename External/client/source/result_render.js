$(document).ready(function() {
    var canvas_count = $('.result_canvas').length;
    console.log('start');
    for(var canv_num = 0; canv_num < canvas_count; canv_num++) {
        var canvas_first = document.getElementsByClassName("first_canv")[canv_num];
        var context_first = canvas_first.getContext("2d");
        var canvas_second = document.getElementsByClassName("second_canv")[canv_num];
        var context_second = canvas_second.getContext("2d");

        var sausage_first = $(canvas_first).data('elem');
        var width_first = canvas_first.width;
        var height_first = canvas_first.height;
        
        var pixel_num_first = 0;
        for (var i = 0; i < height_first; i++) {
            for (var j = 0; j < width_first; j++) {
                var pixel_color_first = sausage_first[pixel_num_first].join(',');
                context_first.fillStyle = 'rgb(' + pixel_color_first + ')';
                context_first.fillRect(j, i, 1, 1);
                pixel_num_first++;
            }
        }
        // ----
        var sausage_second = $(canvas_second).data('elem');
        var width_second = canvas_second.width;
        var height_second = canvas_second.height;
        var pixel_num_second = 0;
        for (var k = 0; k < height_second; k++) {
            for (var l = 0; l < width_second; l++) {
                var pixel_color_second = sausage_second[pixel_num_second].join(',');
                context_second.fillStyle = 'rgb(' + pixel_color_second + ')';
                context_second.fillRect(l, k, 1, 1);
                pixel_num_second++;
            }
        }
    }
});
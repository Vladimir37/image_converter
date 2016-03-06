$(document).ready(function() {
    var files_count = 1;
    $('.save_files').on('change', '.files_upload_field', function() {
        var old_file = Boolean(+$(this).data('used'));
        console.log(old_file);
        if(!old_file) {
            files_count++;
            $(this).data('used', 1);
            $('<input type="file" class="files_upload_field" name="file_' + files_count + '" data-used="0">').appendTo('.save_files');
        }
    })
});
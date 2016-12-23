var exec = require('child_process').exec;

function restart () {
    var child = exec('./restart.sh', function(error, stdout, stderr) {
        if (error) {
            console.log(error)
        };
    });
}

setInterval(restart, 86400000);
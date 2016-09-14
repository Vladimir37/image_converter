var app = angular.module('Cerno', ['ngMaterial']);

app.controller('login', function ($scope, $http) {
    $scope.user_data = {};
    $scope.error = null;
    $scope.EULA = false;
    $scope.EULA_click = function () {
        $scope.EULA = !$scope.EULA;
    };
    $scope.login_request = function () {
        if (!$scope.user_data.login || !$scope.user_data.pass) {
            $scope.error = 'Required fields are empty';
            return false;
        }
        if (!$scope.EULA) {
            $scope.error = 'You must agree to the EULA';
            return false;
        }
        $http({
            method: 'POST',
            url: '/login',
            data: $scope.user_data
        }).then(function (res) {
            res = res.data;
            if (res == 0) {
                window.location.reload();
            }
            else if (res == 1) {
                $scope.error = 'Incorrect login or password';
            }
            else {
                $scope.error = 'Server error';
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };
});

app.controller('manage', function($scope, $http) {
    $scope.user_data = {
        type: '1',
        status: '0'
    };

    $scope.create_user = function() {
        if (!$scope.user_data.name || !$scope.user_data.pass) {
            $scope.error = 'Required fields are empty';
            return false;
        }
        $http({
            method: 'POST',
            url: '/manage',
            data: $scope.user_data
        }).then(function () {
            window.location.reload();
        });
    };
    $scope.delete_user = function (id) {
        var deleted_data = {
            type: '2',
            id
        };
        $http({
            method: 'POST',
            url: '/manage',
            data: deleted_data
        }).then(function () {
            window.location.reload();
        });
    }
});
app.controller('index', function($scope, $http) {
    $scope.image = {};

    $scope.upload_click = function () {
        var image = $scope.image;
        if (!image.dob || !image.name || !image.gender || !image.nation) {
            $scope.error = 'Required fields are empty';
        }
        else {
            angular.element('#upload_form').submit();
        }
    };

    // uploading
    $scope.value_upload = 'Upload image';
    setInterval(function () {
        var value = angular.element('#upload_but').val();
        $scope.$apply(function () {
            $scope.value_upload = value ? 'Uploaded' : 'Upload image';
        });
    }, 500);

    $scope.value_all = 'Upload image';
    setInterval(function () {
        var value = angular.element('#all_but').val();
        $scope.$apply(function () {
            $scope.value_all = value ? 'Uploaded' : 'Upload image';
        });
    }, 500);

    $scope.value_compare_one = 'Upload image';
    setInterval(function () {
        var value = angular.element('#one_but').val();
        $scope.$apply(function () {
            $scope.value_compare_one = value ? 'Uploaded' : 'Upload image';
        });
    }, 500);

    $scope.value_compare_two = 'Upload image';
    setInterval(function () {
        var value = angular.element('#two_but').val();
        $scope.$apply(function () {
            $scope.value_compare_two = value ? 'Uploaded' : 'Upload image';
        });
    }, 500);

    $scope.upload_image = function () {
        angular.element('#upload_but').click();
    };
    $scope.upload_all = function () {
        angular.element('#all_but').click();
    };
    $scope.upload_compare_one = function () {
        angular.element('#one_but').click();
    };
    $scope.upload_compare_two = function () {
        angular.element('#two_but').click();
    };
});
app.controller('result', function($scope, $http) {
    $scope.number = document.getElementById('number').value;
    $scope.error = null;
    $scope.loading = true;
    $scope.processing = true;
    $scope.data = null;

    $scope.checking = setInterval(checkLoading, 2000);

    function checkLoading() {
        $http({
            method: 'GET',
            url: '/api/check',
            params: {num: $scope.number}
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.processing = false;
                $scope.data = JSON.parse(response.body.one);
                clearInterval($scope.checking);
                rendering();
            }
            else if (response.status == 2) {
                $scope.error = 'Server error';
            }
        })
    }

    function rendering() {
        var canvas_first = document.getElementsByClassName("first_canv")[0];
        var context_first = canvas_first.getContext("2d");
        var canvas_second = document.getElementsByClassName("second_canv")[0];
        var context_second = canvas_second.getContext("2d");

        var sausage_first = $scope.data.first.data;
        var width_first = canvas_first.width;
        var height_first = canvas_first.height;

        canvas_first.setAttribute('width', width_first);
        canvas_first.setAttribute('height', height_first);

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
        var sausage_second = $scope.data.second.data;
        var width_second = canvas_second.width;
        var height_second = canvas_second.height;

        canvas_second.setAttribute('width', width_second);
        canvas_second.setAttribute('height', height_second);

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

    function minPicsLoad() {
        $http({
            method: 'GET',
            url: '/api/images'
        }).then(function (response) {
            response = response.data;
            if (response.status > 0) {
                console.log(response);
                $scope.error = 'Server error';
            }
            else {
                var images = response.body;
                if (images.length > 8) {
                    images = images.slice(0, 8);
                }
                if (images.length < 8) {
                    var additional = 8 - images.length;
                    for (var i = 0; i < Math.floor(additional) / 2; i++) {
                        images.unshift({});
                        images.push({});
                    }
                    if (additional % 2 != 0) {
                        images.push({});
                    }
                }
                $scope.images = images;
                $scope.loading = false;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error!';
        });
    }
    minPicsLoad();
});
app.controller('result_many', function($scope, $http) {
    $scope.number = document.getElementById('number').value;
    $scope.error = null;
    $scope.loading = true;
    $scope.processing = true;
    $scope.data = null;

    $scope.checking = setInterval(checkLoading, 2000);

    function checkLoading() {
        $http({
            method: 'GET',
            url: '/api/check',
            params: {num: $scope.number}
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.processing = false;
                $scope.data = {
                    one: JSON.parse(response.body.one),
                    two: JSON.parse(response.body.two),
                    three: JSON.parse(response.body.three)
                };
                clearInterval($scope.checking);
                rendering();
            }
            else if (response.status == 2) {
                $scope.error = 'Server error';
            }
        })
    }

    function rendering() {
        var canvas_count = $('.result_canvas').length;
        var numbers = ['one', 'two', 'three'];

        for(var canv_num = 0; canv_num < canvas_count; canv_num++) {
            var canvas_first = document.getElementsByClassName("first_canv")[canv_num];
            var context_first = canvas_first.getContext("2d");
            var canvas_second = document.getElementsByClassName("second_canv")[canv_num];
            var context_second = canvas_second.getContext("2d");

            if (!$scope.data[numbers[canv_num]]) {
                $(canvas_first).closest('.result_canvas').hide();
                break;
            }

            var sausage_first = $scope.data[numbers[canv_num]].first.data;
            var width_first = canvas_first.width;
            var height_first = canvas_first.height;

            canvas_first.setAttribute('width', width_first);
            canvas_first.setAttribute('height', height_first);

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
            var sausage_second = $scope.data[numbers[canv_num]].second.data;
            var width_second = canvas_second.width;
            var height_second = canvas_second.height;

            canvas_second.setAttribute('width', width_second);
            canvas_second.setAttribute('height', height_second);

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
    }

    function minPicsLoad() {
        $http({
            method: 'GET',
            url: '/api/images'
        }).then(function (response) {
            response = response.data;
            if (response.status > 0) {
                console.log(response);
                $scope.error = 'Server error';
            }
            else {
                var images = response.body;
                if (images.length > 8) {
                    images = images.slice(0, 8);
                }
                if (images.length < 8) {
                    var additional = 8 - images.length;
                    for (var i = 0; i < Math.floor(additional) / 2; i++) {
                        images.unshift({});
                        images.push({});
                    }
                    if (additional % 2 != 0) {
                        images.push({});
                    }
                }
                $scope.images = images;
                $scope.loading = false;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error!';
        });
    }
    minPicsLoad();
});
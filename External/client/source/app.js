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
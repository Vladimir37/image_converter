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
        })
    };
});
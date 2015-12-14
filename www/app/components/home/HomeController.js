(function () {
    'use strict';

    var controllers = angular.module('directive-test.controllers');

    controllers.controller('HomeController', function ($scope, $http, $interval) {
        $scope.testValue = 'Test Value';
        $scope.form = {};

        $http.get('data/ExampleData1.json')
            .then(function (resp) {
                $scope.form = resp.data;
            }, function (err) {
                throw 'example data not found!';
            });

        $scope.watcherCount;

        $interval(function () {
            $scope.GetWatcherCount();
        }, 500);

        $scope.GetWatcherCount = function () {
            var root = angular.element(document.getElementsByTagName('html'));

            var watchers = [];

            var f = function (element) {
                angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) {
                    if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                        angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
                            watchers.push(watcher);
                        });
                    }
                });

                angular.forEach(element.children(), function (childElement) {
                    f(angular.element(childElement));
                });
            };

            f(root);

            // Remove duplicate watchers
            var watchersWithoutDuplicates = [];
            angular.forEach(watchers, function (item) {
                if (watchersWithoutDuplicates.indexOf(item) < 0) {
                    watchersWithoutDuplicates.push(item);
                }
            });

            $scope.watcherCount = watchersWithoutDuplicates.length;
        }
    });
})();
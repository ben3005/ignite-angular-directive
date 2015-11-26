(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igFormRender', ['$ionicSlideBoxDelegate', '$timeout', function ($ionicSlideBoxDelegate, $timeout) {
        var directiveDefinition = {
            restrict: 'E',
            scope: {
                form: '='
            },
            link: function (scope, element, attrs, controller, transcludeFn) {
                scope.$on('$ionicView.enter', function () {
                    $timeout(function () {
                        $ionicSlideBoxDelegate.$getByHandle('ig-form-slide-box').update();
                    }, 0)
                });

                scope.currentSlideIndex = 0;

                scope.updateSlideIndex = function ($index) {
                    console.log($index);
                    scope.currentSlideIndex = $index;
                };
                // From angular docs, Best Practice to clean up when directive is removed
                scope.$on('$destroy', function () {

                });
            },
            templateUrl: 'js/directives/ig-form-render/ig-form-render.html'
        };
        return directiveDefinition;
    }]);
})();
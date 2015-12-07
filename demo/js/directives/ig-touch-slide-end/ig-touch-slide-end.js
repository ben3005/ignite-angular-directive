(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');
    directives.directive('igTouchSlideEnd', function ($ionicSlideBoxDelegate) {
        var directiveDefinition = {
            restrict: 'A',
            priority: 100,
            scope: true,
            controller: function ($element, $attrs, $transclude, $window) {
            },
            controllerAs: 'TouchSlideEnd',
            bindToController: {
            },
            compile: function compile(tElement, tAttrs) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller, transcludeFn) {

                    },
                    post: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
                        iElement.on('touchend', function (event) {
                            $ionicSlideBoxDelegate.enableSlide(true);
                            event.preventDefault();
                        });

                        // From angular docs, Best Practice to clean up when directive is removed
                        scope.$on('$destroy', function () {

                        });
                    }
                };
            }
        };
        return directiveDefinition;
    });
})();
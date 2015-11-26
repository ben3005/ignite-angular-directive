(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igFormRender', function () {
        var directiveDefinition = {
            restrict: 'E',
            scope: {
                form: '='
            },
            link: function (scope, element, attrs, controller, transcludeFn) {


                // From angular docs, Best Practice to clean up when directive is removed
                scope.$on('$destroy', function () {

                });
            },
            templateUrl: 'js/directives/ig-form-render/ig-form-render.html'
        };
        return directiveDefinition;
    });
})();
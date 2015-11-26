(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igCheckboxRender', function () {
        var directiveDefinition = {
            restrict: 'E',
            scope: {
                field: '='
            },
            link: function (scope, element, attrs, controller, transcludeFn) {


                // From angular docs, Best Practice to clean up when directive is removed
                scope.$on('$destroy', function () {

                });
            },
            templateUrl: 'js/directives/ig-checkbox-render/ig-checkbox-render.html'
        };

        return directiveDefinition;
    });
})();
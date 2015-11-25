(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igMultiChoiceRender', function () {
        var directiveDefinition = {
            restrict: 'E',
            scope: {
                field: '='
            },
            link: function (scope, element, attrs, controller, transcludeFn) {
                scope.resolveSize = function () {
                    return (scope.field.multiType === 4) ? 3 : 1;
                }

                // From angular docs, Best Practice to clean up when directive is removed
                scope.$on('$destroy', function () {

                });
            },
            templateUrl: 'app/directives/ig-multi-choice-render/ig-multi-choice-render.html'
        };

        return directiveDefinition;
    });
})();
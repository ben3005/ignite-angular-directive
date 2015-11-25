(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igSectionRender', function () {
        var directiveDefinition = {
            restrict: 'E',
            scope: {
                section: '='
            },
            link: function (scope, element, attrs, controller, transcludeFn) {


                // From angular docs, Best Practice to clean up when directive is removed
                scope.$on('$destroy', function () {

                });
            },
            templateUrl: 'app/directives/ig-section-render/ig-section-render.html'
        };

        return directiveDefinition;
    });
})();
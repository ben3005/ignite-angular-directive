(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igSectionPager', ['$timeout', function ($timeout) {
        var directiveDefinition = {
            restrict: 'E',
            scope: true,
            controller: function ($element, $attrs, $transclude, $window) {

            },
            controllerAs: 'SectionPager',
            bindToController: true,
            compile: function compile(tElement, tAttrs) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller, transcludeFn) {
                    },
                    post: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
                        if (iElement.parent().find('ion-content').length)
                            iElement.parent().find('ion-content').css('margin-bottom', '20px');
                        else
                            iElement.css('display', 'none');
                    }
                };
            },
            templateUrl: 'js/directives/ig-section-pager-render/ig-section-pager-render.html'
        };
        return directiveDefinition;
    }]);
})();
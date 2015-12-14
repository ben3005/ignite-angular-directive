(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igFormRender', ['$document', function ($document) {
        var directiveDefinition = {
            restrict: 'E',
            scope: true,
            controller: function ($element, $attrs, $transclude, $window) {
                this.swiperOptions = {
                    autoHeight: false,
                    paginationHide: false
                };
                this.slider;
            },
            controllerAs: 'FormRender',
            bindToController: {
                form: '='
            },
            compile: function compile(tElement, tAttrs) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller, transcludeFn) {
                        
                    },
                    post: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
                        scope.$on('ig-disable-slide', function () {
                            controller.slider.detachEvents();
                        });

                        scope.$on('ig-enable-slide', function () {
                            controller.slider.attachEvents();
                        });

                        scope.$watch(function () { return controller.slider }, function (newValue, oldValue) {
                            console.log(newValue);
                            console.log(oldValue);
                        })

                        // From angular docs, Best Practice to clean up when directive is removed
                        scope.$on('$destroy', function () {

                        });
                    }
                };
            },
            templateUrl: 'js/directives/ig-form-render/ig-form-render.html'
        };
        return directiveDefinition;
    }]);
})();
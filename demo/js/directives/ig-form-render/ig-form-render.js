(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igFormRender', ['$document', function ($document) {
        var directiveDefinition = {
            restrict: 'E',
            scope: true,
            controller: function ($element, $attrs, $transclude, $window) {
                this.currentSlideIndex = 0;
                this.pagerHeight = 20;
                this.swiperOptions = {
                    autoHeight: true,
                    paginationHide: false,
                    mode: 'vertical'
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
                        //if (!$document.find('ig-section-pager').length)
                        //    throw 'ignite form render requires ig-section-pager to place the pager!';

                        //$document.find('ig-section-pager').append(iElement.children()[2]);

                        controller.updateSlideIndex = function ($index) {
                            controller.currentSlideIndex = $index;
                        };

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
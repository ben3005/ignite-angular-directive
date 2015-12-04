(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igAnnotateImageRender', function () {
        var directiveDefinition = {
            restrict: 'E',
            scope: true,
            controller: function ($element, $attrs, $transclude, $window) {
                //Define + set-up variables here
                this.locked = true;
                this.erasing = false;
                this.drawSize = 1;
                this.colourNum = 1;
                this.showDrawMenu = false;
                this.drawMenuType;
                this.penSizes = [1, 2, 3, 4, 5];
                this.penColours = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            },
            controllerAs: 'AnnotateImageRender',
            bindToController: {
                field: '='
            },
            compile: function compile(tElement, tAttrs) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller, transcludeFn) {

                    },
                    post: function postLink(scope, iElement, iAttrs, controller, transcludeFn) {
                        //Define methods here
                        controller.toggleLock = function () {
                            controller.locked = !controller.locked;
                        };

                        controller.toggleColourMenu = function () {
                            if (controller.drawMenuType === 'colour')
                                controller.drawMenuType = undefined;
                            else
                                controller.drawMenuType = 'colour'
                        }

                        controller.toggleSizeMenu = function () {
                            if (controller.drawMenuType === 'size')
                                controller.drawMenuType = undefined;
                            else
                                controller.drawMenuType = 'size'
                        }

                        controller.clearDrawing = function () {

                        }

                        controller.setDrawColour = function (colourNum) {
                            controller.colourNum = colourNum;
                            controller.drawMenuType = undefined;
                        }

                        controller.setDrawSize = function (drawSize) {
                            controller.drawSize = drawSize;
                            controller.drawMenuType = undefined;
                        }
                        //Dom manipulation here

                        // From angular docs, Best Practice to clean up when directive is removed
                        scope.$on('$destroy', function () {

                        });
                    }
                };
            },
            templateUrl: 'js/directives/ig-annotate-image-render/ig-annotate-image-render.html'
        };

        return directiveDefinition;
    });
})();
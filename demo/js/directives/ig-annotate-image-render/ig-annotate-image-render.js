(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igAnnotateImageRender', function ($compile, $window) {
        var directiveDefinition = {
            restrict: 'E',
            scope: true,
            controller: function ($element, $attrs, $transclude, $window) {
                //Define + set-up variables here
                this.locked = true;
                this.erasing = false;
                this.drawSize = 1;
                this.colourNum = 0;
                this.showDrawMenu = false;
                this.drawMenuType = null;
                this.penSizes = [1, 2, 3, 4, 5];
                this.penColours = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                this.drawPad = null;
                this.annotateCanvas = null
                this.fieldID = this.field.FieldID;
                this.Text = this.field.Text;
                this.colourDefinitions = [
                    '#000000',
                    '#ffffff',
                    '#e6007e',
                    '#724d92',
                    '#3798dc',
                    '#52b36e',
                    '#e33c35',
                    '#e67f22',
                    '#f1c40f'
                ];
                this.annotateImageStyle;
                this.annotateImageDimensions;


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
                        angular.element($window).bind('resize', windowResize);

                        function windowResize(e) {
                            var imageTest = new Image();
                            var imageHeight;
                            var imageWidth;
                            var self = this;
                            imageTest.onload = function () {
                                imageHeight = imageTest.height;
                                imageWidth = imageTest.width;
                                if ($window.innerWidth >= imageWidth)
                                    imageHeight = imageHeight / ($window.innerWidth / imageWidth);
                                else
                                    imageHeight = imageHeight / (imageWidth / $window.innerWidth);

                                controller.annotateImageStyle = { "height": Math.floor(imageHeight) + 'px', "width": $window.innerWidth + 'px' };
                                controller.annotateImageDimensions = { height: Math.floor(imageHeight), width: $window.innerWidth };
                            };
                            imageTest.src = 'data:image/png;base64,' + controller.field.AnnotateImage;

                            // manual $digest required as resize event
                            // is outside of angular
                            if (e)
                                scope.$digest();
                        }

                        controller.toggleLock = function () {
                            controller.locked = !controller.locked;
                            controller.annotateLock();
                        };

                        controller.toggleColourMenu = function () {
                            if (controller.locked) {
                                return;
                            }

                            if (controller.drawMenuType === 'colour') {
                                controller.drawMenuType = null;
                            }
                            else {
                                controller.drawMenuType = 'colour';
                            }
                        }

                        controller.toggleSizeMenu = function () {
                            if (controller.locked) {
                                return;
                            }

                            if (controller.drawMenuType === 'size') {
                                controller.drawMenuType = null;
                            }
                            else {
                                controller.drawMenuType = 'size';
                            }
                        }

                        controller.setDrawColour = function (colourNum) {
                            if (controller.locked) {
                                return;
                            }

                            controller.colourNum = colourNum;
                            controller.drawMenuType = null;
                        }

                        controller.setDrawSize = function (drawSize) {
                            if (controller.locked) {
                                return;
                            }

                            controller.drawSize = drawSize;
                            controller.drawMenuType = null;
                        }

                        controller.annotateLock = function () {
                            controller.drawMenuType = null;

                            if (controller.drawpad) {
                                controller.drawpad.off();
                            }

                            if (controller.annotatecanvas) {
                                controller.annotatecanvas.remove(); //also removes all bound events
                                controller.annotatecanvas = null;
                            }

                            controller.drawpad = null;

                            if (controller.locked) {
                                return;
                            }

                            var bgimg = angular.element(document.getElementById('igAnnotatableImage' + controller.fieldID));
                            var widget = angular.element(document.getElementById('igAnnotateImage' + controller.fieldID));

                            controller.annotatecanvas = angular.element('<canvas height="' + bgimg[0].height + '" width="' + bgimg[0].width + '" ng-style="{{ AnnotateImageRender.annotateImageStyle }}" ig-touch-slide-start ig-touch-slide-end >')[0];
                            widget.append(controller.annotatecanvas);
                            $compile(controller.annotatecanvas)(scope);

                            var canstackforundo = false;

                            var updateobj = (function (field, freshdrawing, sWidth, sHeight, width, height) {
                                return function () {
                                    if (canstackforundo) {
                                        canstackforundo = false;
                                        //controller.stackforundo(field.fieldID, field.fieldID, 1);//force stack for undo on first draw only, field is its own root as it's never in table
                                    }
                                    var tempCanvas = document.createElement('canvas');
                                    tempCanvas.width = width;
                                    tempCanvas.height = height;
                                    var tempContext = tempCanvas.getContext('2d');

                                    tempContext.drawImage(freshdrawing, 0, 0, sWidth, sHeight, 0, 0, width, height);
                                    field.Text = tempCanvas.toDataURL();
                                    //scope.dirty(controller.fieldID, field);
                                }
                            })(controller.field, controller.annotatecanvas, bgimg[0].width, bgimg[0].height, bgimg[0].naturalWidth, bgimg[0].naturalHeight);

                            controller.drawpad = new SignaturePad(controller.annotatecanvas, { minWidth: controller.drawSize, maxWidth: controller.drawSize, penColor: controller.colourDefinitions[controller.colourNum], onEnd: updateobj });
                            if (controller.field.Text) {
                                var overlayimg = document.getElementById('igAnnotation' + controller.fieldID);
                                controller.drawpad.fromDataURL(controller.field.Text);
                            }
                            controller.drawMode();
                        }

                        controller.drawMode = function () {
                            if (controller.locked) {
                                return;
                            }

                            //controller.drawpad._ctx.globalCompositeOperation = "source-over";
                            controller.drawpad.penColor = controller.colourDefinitions[controller.colourNum];
                            controller.erasing = false;
                        }


                        controller.eraseMode = function () {
                            if (controller.locked) {
                                return;
                            }

                            //controller.drawpad._ctx.globalCompositeOperation = "destination-out";
                            controller.drawpad.penColor = "white";
                            controller.erasing = true;
                        }

                        controller.colorPallette = function () {
                            if (controller.locked) {
                                return;
                            }

                            controller.drawMenuType = 'color';
                        }

                        controller.setDrawColour = function (event, colourNumber) {
                            if (controller.locked) {
                                return;
                            }

                            //drawpad._disabledrawing = true;
                            controller.colourNum = colourNumber;
                            controller.drawMenuType = null;
                            controller.drawpad.penColor = controller.colourDefinitions[controller.colourNum];
                            //setTimeout(function () { drawpad._disabledrawing = false; }, 200)
                        }

                        controller.sizePallette = function () {
                            if (controller.locked) {
                                return;
                            }

                            controller.drawMenuType = 'size';
                        }

                        controller.setDrawSize = function (event, size) {
                            if (controller.locked) {
                                return;
                            }

                            //drawpad._disabledrawing = true;
                            controller.drawSize = size;
                            controller.drawMenuType = null;

                            controller.drawpad.minWidth = controller.drawSize;
                            controller.drawpad.maxWidth = controller.drawSize;

                            //$timeout(function () { drawpad._disabledrawing = false; }, 200)
                        }

                        controller.clearDrawing = function () {
                            if (controller.locked) {
                                return;
                            }

                            controller.drawpad.clear();
                            controller.field.Text = null;
                        }

                        //Dom manipulation here
                        windowResize();
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
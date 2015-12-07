(function () {
    'use strict';

    var directives = angular.module('directive-test.directives');

    directives.directive('igAnnotateImageRender', function ($compile) {
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
                this.annotateImageHeightStyle;

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

                    self.annotateImageHeightStyle = { "height": imageHeight + 'px' };
                };
                imageTest.src = 'data:image/png;base64,' + this.field.AnnotateImage;
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
                            if (!controller.locked) {
                                controller.annotateLock();
                            }
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
                                controller.drawpad.stoplistening();
                            }

                            if (controller.annotatecanvas) {
                                controller.annotatecanvas.remove(); //also removes all bound events
                                controller.annotatecanvas = null;
                            }

                            controller.drawpad = null;

                            ////if called for null object or for current object, lock it
                            //if ((obj === null) || ($scope.currentAnnotateID && (obj.FieldID == $scope.currentAnnotateID))) {
                            //    $scope.currentAnnotateID = null;
                            //    return;
                            //}

                            //$scope.currentAnnotateID = obj.FieldID;
                            //lastannotateobj = obj;
                            //console.log(obj);
                            //if (!$scope.drawpadcontrols[obj.FieldID]) {
                            //    $scope.drawpadcontrols[obj.FieldID] = {
                            //        erasing: false,
                            //        color: 1,
                            //        size: 1
                            //    }
                            //}

                            var bgimg = angular.element(document.getElementById('igAnnotatableImage' + controller.fieldID));
                            var widget = angular.element(document.getElementById('igAnnotateImage' + controller.fieldID));

                            controller.annotatecanvas = angular.element('<canvas height="' + bgimg[0].height + '" width="' + bgimg[0].width + '" ig-touch-slide-start ig-touch-slide-end >')[0];
                            widget.append(controller.annotatecanvas);
                            $compile(controller.annotatecanvas)(scope);

                            var canstackforundo = false;

                            //var updateobj = (function (field, freshdrawing, sw, sh, dw, dh) {
                            //    return function () {
                            //        console.log('something drew');
                            //        console.log(obj);
                            //        if (canstackforundo) {
                            //            canstackforundo = false;
                            //            controller.stackforundo(obj.fieldID, obj.fieldID, 1);//force stack for undo on first draw only, field is its own root as it's never in table
                            //        }

                            //        var can2 = document.createElement('canvas');
                            //        can2.width = dw;
                            //        can2.height = dh;
                            //        var ctx2 = can2.getContext('2d');

                            //        ctx2.drawImage(freshdrawing, 0, 0, sw, sh, 0, 0, dw, dh);
                            //        obj.Text = can2.toDataURL();
                            //        scope.dirty(controller.fieldID, obj);
                            //    }
                            //})(controller.field, annotatecanvas, bgimg[0].width, bgimg[0].height, bgimg[0].naturalWidth, bgimg[0].naturalHeight);

                            controller.drawpad = new SignaturePad(controller.annotatecanvas, { minWidth: controller.drawSize, maxWidth: controller.drawSize, penColor: controller.colourDefinitions[controller.colourNum] });

                            if (controller.field.Text) {
                                var overlayimg = document.getElementById('igAnnotation' + controller.fieldID);
                                console.log(overlayimg);
                                controller.drawpad._ctx.drawImage(overlayimg, 0, 0, overlayimg.naturalWidth, overlayimg.naturalHeight, 0, 0, overlayimg.width, overlayimg.height);
                            }
                            controller.drawMode();
                        }

                        controller.drawMode = function () {
                            if (controller.locked) {
                                return;
                            }

                            controller.drawpad._ctx.globalCompositeOperation = "source-over";
                            controller.drawpad.penColor = controller.colourDefinitions[controller.colourNum];
                            controller.erasing = false;
                        }


                        controller.eraseMode = function () {
                            if (controller.locked) {
                                return;
                            }

                            controller.drawpad._ctx.globalCompositeOperation = "destination-out";
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
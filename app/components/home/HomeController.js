(function () {
    'use strict';

    var controllers = angular.module('directive-test.controllers');

    controllers.controller('HomeController', function ($scope) {
        $scope.testValue = 'Test Value';
        $scope.form = {
            name: 'Template Name',
            id: 1,
            sections: [
                {
                    id: 1,
                    title: 'Section 1',
                    fields: [
                        {
                            id: 1,
                            label: 'Single Line Text',
                            type: 1
                        },
                        {
                            id: 2,
                            label: 'Multi Line Text',
                            rows: 3,
                            type: 2
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Section 2',
                    fields: [
                        {
                            id: 3,
                            label: 'Date Picker',
                            type: 3
                        },
                        {
                            id: 4,
                            label: 'Multi Choice',
                            type: 4,
                            multiType: 2,
                            items: [
                                {
                                    id: 1,
                                    value: 1,
                                    text : 'Option 1'
                                },
                                {
                                    id: 2,
                                    value: 2,
                                    text: 'Option 2'
                                },
                                {
                                    id: 3,
                                    value: 3,
                                    text: 'Option 3'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Section 3',
                    fields: [
                        {
                            id: 5,
                            label: 'Check box',
                            type: 5
                        }
                    ]
                },
            ]
        };
    });
})();
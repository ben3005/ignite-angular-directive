(function () {
    'use strict';

    var app = angular.module('directive-test', ['directive-test.controllers', 'directive-test.services', 'directive-test.directives', 'ui.router']);

    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/components/home/homeView.html',
            controller: 'HomeController'
        })


        $urlRouterProvider.otherwise('/');
    });
})();
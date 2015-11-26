(function () {
    'use strict';

    var app = angular.module('directive-test', ['ionic', 'directive-test.controllers', 'directive-test.services', 'directive-test.directives', 'ui.router']);

    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/components/home/homeView.html',
            controller: 'HomeController'
        })
        $urlRouterProvider.otherwise('/');
    });

    app.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
        });
    });


})();
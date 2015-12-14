(function () {
    'use strict';

    angular
        .module('directive-test', [
            'ionic',
            'directive-test.controllers',
            'directive-test.services',
            'directive-test.directives',
            'ui.router'
        ])
        .config(configure)
        .run(run);


    configure.$inject = ['$stateProvider', '$urlRouterProvider'];
    run.$inject = ['$ionicPlatform'];

    function configure($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/components/home/homeView.html',
                controller: 'HomeController'
            });
        $urlRouterProvider.otherwise('/');
    }

    function run($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard && ionic.Platform.isIOS()) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
        });
    }
})();
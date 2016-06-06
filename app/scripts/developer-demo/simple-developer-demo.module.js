(function() {
  'use strict';

  angular
    .module('app.developerDemo', [

    ])
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('developer-demo', {
          url: '/developer-demo',
          controller: "SimpleDemoCtrl",
          templateUrl: 'views/developer-demo/demo-form.html',
          data: {
            requireLogin: true
          }
        });
    });
})();

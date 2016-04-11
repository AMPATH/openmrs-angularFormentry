(function() {
  'use strict';

  angular
    .module('app.formDesigner', [

    ])
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('form-designer', {
          url: '/form-designer',
          controller: "FormDesignerCtrl",
          templateUrl: 'views/form-designer/form-designer.html',
          data: {
            requireLogin: true
          }
        });
    });
})();

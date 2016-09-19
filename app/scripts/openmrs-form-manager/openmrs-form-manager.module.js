(function() {
  'use strict';

  angular
    .module('app.openmrsFormManager', [
      'openmrs.RestServices'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('openmrs-authenticate', {
          url: '/openmrs/authenticate',
          templateUrl: 'views/openmrs-form-manager/authentication.htm',
          params: {
            redirectTo: {
              value: {
                state: 'form.manage',
                stateParams: null,
              },
              squash: true
            }
          }
        })
        .state('form', {
          abstract: true,
          templateUrl: 'views/openmrs-form-manager/header.htm',
          data: {
            requireLogin: true
          }
        })
        .state('form.manage', {
          url: '/form/manage',
          views: {
            'form-content@form': {
              templateUrl: 'views/openmrs-form-manager/openmrs-form-manager.htm',
              controller: 'OpenmrsFormManagerCtrl'
            }
          }
        })
        .state('form.create', {
          url: '/form/create',
          views: {
            'form-content@form': {
              templateUrl: 'views/openmrs-form-manager/create-form.htm',
              controller: 'CreateFormCtrl'
            }
          }
        })
        .state('form.view', {
          url: '/form/view/:formUuid',
          views: {
            'form-content@form': {
              templateUrl: 'views/openmrs-form-manager/view-form.htm',
              controller: 'ViewEditFormCtrl'
            }
          }
        })
        .state('form.edit', {
          url: '/form/edit/:formUuid',
          views: {
            'form-content@form': {
              templateUrl: 'views/openmrs-form-manager/edit-form.htm',
              controller: 'ViewEditFormCtrl',
            }
          }
        });
    })
    .run(function($rootScope, $state, AuthService) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        if(toState.data && toState.data.requireLogin) {
          if(!AuthService.authenticated()) {
            event.preventDefault();
            if(toState) {
              var params = {
                redirectTo: {
                  state: toState.name,
                  stateParams:toParams,
                }
              };
              $state.go('openmrs-authenticate', params);
            } else {
              $state.go('openmrs-authenticate');
            }
          }
        }
      })
    })
    .run(function(formlyConfig) {
      formlyConfig.setType({
        name:'aceJsonEditor',
        template: '<div ui-ace="{'
                      + 'mode: \'json\''
                    +'}" ng-model="model[options.key]"></div>'
      });
      
      formlyConfig.setType({
        name: 'fileUpload',
        template: '<input type="file" file-model="model[options.key]"/>'
      });
    });
})();

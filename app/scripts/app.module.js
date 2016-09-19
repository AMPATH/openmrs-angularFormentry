/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
'use strict';

/**
 * @ngdoc overview
 * @name angularFormentryApp
 * @description
 * # angularFormentryApp
 *
 * Main module of the application.
 */
angular
  .module('angularFormentry', [
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngResource',
    'openmrs-ngresource.models',
    'openmrs-ngresource.restServices',
    'openmrs.angularFormentry',
    'ui.ace',
    'openmrs.RestServices',
    'app.openmrsFormManager',
    'app.formDesigner',
    'app.developerDemo',
    'ui.bootstrap',
    'dialogs.main',
    'pascalprecht.translate'
  ])
  .config(function ($provide) {
    $provide.decorator('$q', function ($delegate) {
      function allSettled(promises) {
        var deferred = $delegate.defer(),
          counter = 0,
          results = angular.isArray(promises) ? [] : {};

        angular.forEach(promises, function (promise, key) {
          counter++;
          $delegate.when(promise).then(function (value) {
            if (results.hasOwnProperty(key)) return;
            results[key] = { status: "fulfilled", value: value };
            if (!(--counter)) deferred.resolve(results);
          }, function (reason) {
            if (results.hasOwnProperty(key)) return;
            results[key] = { status: "rejected", reason: reason };
            if (!(--counter)) deferred.resolve(results);
          });
        });

        if (counter === 0) {
          deferred.resolve(results);
        }

        return deferred.promise;
      }
      $delegate.allSettled = allSettled;
      return $delegate;
    });
  })
  .config(function($stateProvider, $translateProvider, dialogsProvider) {
    dialogsProvider.useBackdrop('static');
    dialogsProvider.useEscClose(false);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('sm');

    $translateProvider.translations('en-US', {
        DIALOGS_ERROR: 'Error',
        DIALOGS_OK: 'Ok',
        DIALOGS_YES: 'Yes',
        DIALOGS_NO: 'No',
        DIALOGS_CLOSE: 'Close'
    });

    $translateProvider.preferredLanguage('en-US');
    
    $stateProvider
        .state('about', {
          url: '/about',
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl'
        })
        .state('recursive-test', {
          url: '/recursive-test',
          templateUrl: 'views/form-editor.html',
          controller: 'EditorCtrl'
        });
  });

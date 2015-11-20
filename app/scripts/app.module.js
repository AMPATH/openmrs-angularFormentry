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
    'openmrs.angularFormentry',
    'ui.ace'
  ])
  .config(function($stateProvider) {
      $stateProvider
          .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          })
        .state('about', {
          url: '/about',
          templateUrl: 'views/recursive-test.html',
          controller: 'AboutCtrl'
        })
        .state('recursive-test', {
          url: '/recursive-test',
          templateUrl: 'views/recursive-test.html',
          controller: 'RecursiveTestCtrl'
        });

  });

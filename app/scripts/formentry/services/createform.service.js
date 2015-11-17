/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation,
requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry')
        .factory('createFormService', createFormService);

  factory.$inject = ['dependencies'];

  function createFormService(dependencies) {
    var fieldHandlers = {};

    //registerCoreFieldHandler
    fieldHandlers['obsFieldHandler'] = obsFieldHandler;
    fieldHandlers['encounterFieldHandler'] = encounterFieldHandler;
    fieldHandlers['obsPersonAttributeFieldHandler'] = obsFieldHandler;

    var service = {};

    return service;
  }
})();

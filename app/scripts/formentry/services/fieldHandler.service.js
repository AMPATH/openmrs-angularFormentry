/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry')
        .factory('fieldHandlerService', fieldHandlerService);

  fieldHandlerService.$inject = ['$log'];

  function fieldHandlerService($log) {
    var fieldHandlers = {};

    //registerCoreFieldHandler
    fieldHandlers['obsFieldHandler'] = obsFieldHandler;
    fieldHandlers['encounterTypeFieldHandler'] = encounterTypeFieldHandler;
    fieldHandlers['personAttributeFieldHandler'] = personAttributeFieldHandler;
    fieldHandlers['encounterDatetimeFieldHandler'] = encounterDatetimeFieldHandler;
    fieldHandlers['encounterProviderFieldHandler'] = encounterProviderFieldHandler;
    fieldHandlers['encounterLocationFieldHandler'] = encounterLocationFieldHandler;
    fieldHandlers['obsDrugFieldHandler'] = obsDrugFieldHandler;
    fieldHandlers['obsProblemFieldHandler'] = obsProblemFieldHandler;
    fieldHandlers['conceptSearchFieldHandler'] = conceptSearchFieldHandler;
    fieldHandlers['locationAttributeFieldHandler'] = locationAttributeFieldHandler;
    var service = {
      getFieldHandler: getFieldHandler,
      registerCustomFieldHandler: registerCustomFieldHandler
    };

    return service;

    function getFieldHandler(handlerName) {
      $log.info('loading fieldHandler', handlerName);
      $log.info('fieldHandlers', fieldHandlers);
      $log.info('fieldHandlers specific', fieldHandlers[handlerName]);
      return fieldHandlers[handlerName];
    }

    function registerCustomFieldHandler(handlerName, handlerMethod) {
      fieldHandlers[handlerName] = handlerMethod;
    }

    function obsFieldHandler(_field) {
      $log.info('loading fieldHandlerXXXXXX');
    }

    function encounterTypeFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function encounterDatetimeFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function encounterLocationFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function encounterProviderFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function obsDrugFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function obsProblemFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function conceptSearchFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function locationAttributeFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function personAttributeFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }
  }
})();

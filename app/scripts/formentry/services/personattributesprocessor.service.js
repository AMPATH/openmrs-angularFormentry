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
    .factory('PersonAttributesProcessorService', PersonAttributesProcessorService);

  PersonAttributesProcessorService.$inject = ['$filter', '$log'];

  function PersonAttributesProcessorService($filter, $log) {
    var service = {
      generatePersonAttributesPayload: generatePersonAttributesPayload,
      addExistingPersonAttributesToForm: addExistingPersonAttributesToForm
    };

    return service;

    function generatePersonAttributesPayload(model) {
      return _getSections(model);
    }

    function addExistingPersonAttributesToForm(model, restObs) {
      // callback(_getSections(model));
    }

    function _getSections(model) {
      var attributeRestPayload = [];

      var sectionKeys = Object.keys(model);
      // $log.debug('Section Keys', sectionKeys);
      _.each(sectionKeys, function(section) {
        var sectionModel = model[section];
        _generateSectionPayLoad(sectionModel, attributeRestPayload);
      });

      return attributeRestPayload;
    }

    function _generateSectionPayLoad(sectionModel, personAttributeRestPayload) {
      _.each(sectionModel, function(field) {
        if (field.attributeType !== '' && !_.isNull(field.attributeType) && !_.isUndefined(field.attributeType)) {
          _addFieldToPayload(field, personAttributeRestPayload);
        }

      });
    }

    function _setValue(field) {
      var attribute = {};
      var initialValue = field.initialValue;
      var value = field.value;

      if (_.isUndefined(initialValue) && (!_.isNull(value) && value !== '' && !_.isUndefined(value))) {

        attribute = {
          attributeType: field.attributeType,
          value: value
        };

      } else if (initialValue !== value && (!_.isNull(value) &&
          value !== '' && !_.isUndefined(value))) {
        attribute = {
          uuid: field.initialUuid,
          attributeType: field.attributeType,
          value: value
        };
      }

      return attribute;
    }

    function _addFieldToPayload(field, personAttributeRestPayload) {
      var personAttribute = {};
      if (angular.isDefined(field.attributeType)) {
        personAttribute = _setValue(field);
        if (Object.keys(personAttribute).length > 0) {
          personAttributeRestPayload.push(personAttribute);
        }
      }
    }
  }
})();

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
        .factory('ObsProcessorService', ObsProcessService);

  ObsProcessService.$inject = ['$filter', '$log'];

  function ObsProcessService($filter, $log) {
      var service = {
        generateObsPayload: generateObsPayload
      };

      return service;

      function generateObsPayload(model, callback) {
        callback(_getSections(model));
      }

      function _parseDate(value, format, offset) {
        var format = format || 'yyyy-MM-dd HH:mm:ss';
        var offset = offset || '+0300';

        if (!(value instanceof Date)) {
          value = new Date(value);
          if (value === null || value === undefined) {
            return '';
          }
        }

        return $filter('date')(value, format, offset);
      }

      function _getSections(model) {
        var obsRestPayload = [];
        var sectionKeys = Object.keys(model);
        _.each(sectionKeys, function(section) {
          var sectionModel = model[section];
          _generateSectionPayLoad(sectionModel, obsRestPayload);
        });

        return obsRestPayload;
      }

      function _generateSectionPayLoad(sectionModel, obsRestPayload) {
        var fieldKeys = Object.keys(sectionModel);
        _.each(fieldKeys, function(fieldKey) {
          if (fieldKey.startsWith('obsGroup')) {
            var sectionFields = sectionModel[fieldKey];
            var sectionKeys = Object.keys(sectionFields);
            var sectionObs = [];
            var obs = {
                concept:sectionKeys[0],
                groupMembers:sectionObs
              };
            _generateSectionPayLoad(sectionFields, sectionObs);
            obsRestPayload.push(obs);
          } else if (fieldKey.startsWith('obsRepeating')) {
            var sectionFields = sectionModel[fieldKey];
            var sectionKeys = Object.keys(sectionFields[0]);
            // some repeating sections may miss the concept and schemaQuestion
            // attributes, therefore we will be need to rebuild this b4 passing
            // it on for processing
            _.each(sectionFields, function(_sectionFields) {
              var sectionObs = [];
              var obs = {
                  concept:sectionKeys[0],
                  groupMembers:sectionObs
                };
              _generateSectionPayLoad(_sectionFields, sectionObs);
              obsRestPayload.push(obs);
            });

          } else if (fieldKey.startsWith('obs')) {
            var field = sectionModel[fieldKey];
            _generateFieldPayload(field, obsRestPayload);
          }

        });
      }

      function _setValue(obs, field) {
        var initialValue = field.initialValue;
        var value = field.value;
        if (field.schemaQuestion.questionOptions.rendering === 'date') {
          value = _parseDate(field.value);
        }

        if (initialValue === undefined) {
          obs = {
            concept: field.concept,
            value:field.value
          };

        } else if (initialValue !== value && (value !== '' || value !== null ||
        value !== undefined)) {
          obs = {
            uuid:field.initialUuid,
            concept: field.concept,
            value:value
          };
        }
      }

      function _generateFieldPayload(field, obsRestPayload) {
        var obs;
        var qRender = field.schemaQuestion.questionOptions.rendering;
        if (qRender === 'number' || qRender === 'text' || qRender === 'select' ||
        qRender === 'radio') {
          _setValue(obs, field);
          if (obs) {obsRestPayload.push(obs);}
        } else if (qRender === 'multiCheckbox') {
          initialValue = field.initialValue;
          value = field.value;
          if (initialValue === undefined) {
            _.each(value, function(val) {
              obs = {
                concept: field.concept,
                value:val
              };
              if (obs) {obsRestPayload.push(obs);}
            });

          } else if (initialValue !== value && (value !== '' ||
          value !== null || value !== undefined)) {
            var existingObs = _.intersection(initialValue, value);
            var newObs = [];
            var obsToFilter = [];
            var obsToVoid = [];
            var i = 0;
            _.each(initialValue, function(val) {
              if (!(val in value)) {
                obs = {
                  concept: field.concept,
                  value:val,
                  uuid: initialUuid[i]
                };
                obsToVoid.push(val);
                obsRestPayload.push(obs);
              }

              i++;
            });

            obsToFilter = _.union(obsToVoid, existingObs);
            newObs = _.difference(value, obsToFilter);
            _.each(newObs, function(val) {
              obs = {
                concept: field.concept,
                value:val
              };
              obsRestPayload.push(obs);
            });
          }
        } else if (qRender === 'date') {
          _setValue(obs, field);
        }

      }
    }
})();

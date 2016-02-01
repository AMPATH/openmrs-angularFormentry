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
      generateObsPayload: generateObsPayload,
      addExistingObsSetToForm: addExistingObsSetToForm
    };

    return service;

    function generateObsPayload(model) {
      return _getSections(model);
    }

    function addExistingObsSetToForm(model, openmrsRestObj) {
      _addExistingObsToSections(model, openmrsRestObj);
    }

    function _parseDate(value, format, offset) {
      var format = format || 'yyyy-MM-dd HH:mm:ss';
      var offset = offset || '+0300';

      if (!(value instanceof Date)) {
        value = new Date(value);
        if (_.isNull(value) || _.isUndefined(value)) {
          return '';
        }
      }

      return $filter('date')(value, format, offset);
    }

    function _addExistingObsToSections(model, openmrsRestObj) {
      var obsRestPayload = [];
      // $log.debug('Model', model);
      var sectionKeys = Object.keys(model);
      // $log.debug('Section Keys', sectionKeys);
      _.each(sectionKeys, function(section) {
        var sectionModel = model[section];
        // $log.debug('Section Models', sectionModel);
        _addObsToSection(sectionModel, openmrsRestObj);
      });
    }

    function _addObsToField(field, obs) {
      var val = _.filter(obs, function(o) {
        if (o.concept.uuid === field.concept) {
          return o;
        }
      });

      var opts = [];
      var optsUuid = [];
      _.each(val, function(o) {
        if (field.obsDatetime) {
          //special case for fields having showDate property
          field.initialValue = new Date(o.obsDatetime);
          field.initialUuid = o.uuid;
          field.value = new Date(o.obsDatetime);
        } else if (field.schemaQuestion.questionOptions.rendering === 'date') {
          field.initialValue = new Date(o.value);
          field.initialUuid = o.uuid;
          field.value = new Date(o.value);
        } else if (field.schemaQuestion.questionOptions.rendering === 'multiCheckbox') {
          if (!(_.isUndefined(o.value.uuid))) {
            opts.push(o.value.uuid);
            optsUuid.push(o.uuid);
          } else {
            opts.push(o.value);
            optsUuid.push(o.uuid);
          }

          field.initialValue = opts;
          field.initialUuid = optsUuid;
          field.value = opts;
        } else {
          if (!(_.isUndefined(o.value.uuid))) {
            field.initialValue = o.value.uuid;
            field.initialUuid = o.uuid;
            field.value = o.value.uuid;
          } else {
            field.initialValue = o.value;
            field.initialUuid = o.uuid;
            field.value = o.value;
          }
        }
      });
    }

    function getGroupSectionObs(obs, concept) {
      var results = {
        obs: []
      };
      var val = _.filter(obs, function(o) {
        if (o.concept.uuid === concept) {
          return o;
        }
      });

      if (!_.isUndefined(val)) {
        results.repeatObs = val;
        _.each(val, function(o) {
          if (!_.isNull(o.groupMembers)) {
            results.obs = _.union(results.obs, o.groupMembers);
          } else {
            results.obs.push(o);
          }
        });
      }

      return results;
    }

    function _addObsToSection(sectionModel, openmrsRestObj) {
      var fieldKeys = Object.keys(sectionModel);
      //geting obs data without obs groups
      var obsData = _.filter(openmrsRestObj.obs, function(obs) {
        if (_.isNull(obs.groupMembers)) {
          return obs;
        }
      });

      //geting obs data with obs groups
      var obsGroupData = _.filter(openmrsRestObj.obs, function(obs) {
        if (obs.groupMembers !== null) {
          return obs;
        }
      });

      _.each(fieldKeys, function(fieldKey) {
        if (fieldKey.startsWith('obsGroup')) {
          var sectionFields = sectionModel[fieldKey];
          var sectionKeys = Object.keys(sectionFields);
          var concept = sectionFields[sectionKeys[0]];
          var sectionObs = getGroupSectionObs(obsGroupData, concept);
          _addObsToSection(sectionFields, sectionObs);

        } else if (fieldKey.startsWith('obsRepeating')) {
          var sectionFields = sectionModel[fieldKey];
          var sectionKeys = Object.keys(sectionFields[0]);
          // some repeating sections may miss the concept and schemaQuestion
          // attributes, therefore we will need to rebuild this b4 passing
          // it for processing
          /*
          get the number of repeats and add the extra repeats in the model
          This is also need to handle repeating groups without obs groups
          Ideally this ends up as an array of rest obs
          */

          var concept = sectionFields[0][sectionKeys[0]];
          /*
          for repeating obs with obsGroup there will always be some grouping concept.
          However there are cases where one mya allow repeating section without a grouping
          concept. In this case, the obs we expect is simply an array without group members
          otherwise we will always have group members
          */
          var sectionObs;
          if (concept) {
            sectionObs = getGroupSectionObs(obsGroupData, concept);
          } else {
            /*
            handle repeating fields without obs group concept
            */
            var customObs = [];
            for (var i = 1; i < sectionKeys.length; i++) {
              var f = sectionFields[0][sectionKeys[i]];
              var c = f.concept;
              sectionObs = getGroupSectionObs(obsData, c);
              _.each(sectionObs.obs, function(o, k) {
                var obj = {
                  groupMembers: []
                };
                if (customObs.length < k + 1) {
                  obj.groupMembers.push(o);
                  customObs.push(obj);
                } else {
                  obj = customObs[k];
                  obj.groupMembers.push(o);
                }
              });
            }

            sectionObs.repeatObs = customObs;
          }

          // $log.debug('fields tests obs', sectionObs.repeatObs);
          if (sectionObs.repeatObs.length > 1) {
            for (var i = 1; i < sectionObs.repeatObs.length; i++) {
              //create duplicate fields if we have more repeating values in the rest obs
              sectionFields.push(angular.copy(sectionFields[0]));
            }
          }

          var results = {
            obs: []
          };
          var repeatObs = sectionObs.repeatObs;
          _.each(sectionFields, function(_sectionFields, k) {
            if (repeatObs[k]) {
              results.obs = repeatObs[k].groupMembers;
              sectionObs = results;
            }

            _addObsToSection(_sectionFields, sectionObs);
          });
        } else if (fieldKey.startsWith('obs')) {
          var field = sectionModel[fieldKey];
          _addObsToField(field, obsData);
        }
      });
    }

    function _getSections(model) {
      var obsRestPayload = [];
      // $log.debug('Model', model);
      var sectionKeys = Object.keys(model);
      // $log.debug('Section Keys', sectionKeys);
      _.each(sectionKeys, function(section) {
        var sectionModel = model[section];
        // $log.debug('Section Models', sectionModel);
        _generateSectionPayLoad(sectionModel, obsRestPayload);
      });

      return obsRestPayload;
    }

    function _generateSectionPayLoad(sectionModel, obsRestPayload) {
      var fieldKeys = Object.keys(sectionModel);
      // $log.debug('fieldKeys', fieldKeys);
      _.each(fieldKeys, function(fieldKey) {
        if (fieldKey.startsWith('obsGroup')) {
          var sectionFields = sectionModel[fieldKey];
          var sectionKeys = Object.keys(sectionFields);
          var concept = sectionFields[sectionKeys[0]];
          var sectionObs = [];
          var obs = {
            concept: concept,
            groupMembers: sectionObs
          };

          _generateSectionPayLoad(sectionFields, sectionObs);
          if (sectionObs.length > 0) {
            obsRestPayload.push(obs);
          }

        } else if (fieldKey.startsWith('obsRepeating')) {
          var sectionFields = sectionModel[fieldKey];
          var sectionKeys = Object.keys(sectionFields[0]);
          $log.debug('Repeating section', sectionKeys);
          $log.debug('Repeating fields', sectionFields);
          var objProps = sectionFields[0];
          _.each(sectionFields, function(_sectionFields) {
            var fieldKeys = Object.keys(_sectionFields);
            var sectionObs = [];
            var concept = sectionFields[0][sectionKeys[0]];
            // some repeating sections may miss the concept and schemaQuestion
            // attributes, therefore we will be need to rebuild this b4 passing
            // it on for processing
            _.each(sectionKeys, function(key) {
              if (!key.startsWith('$$') && key !== 'groupConcept') {
                if (_.contains(fieldKeys, key)) {
                  var obj = objProps[key]; //object with all the required properties
                  var thisField = _sectionFields[key];
                  thisField.concept = obj.concept;
                  thisField.schemaQuestion = obj.schemaQuestion;
                }
              }
            });

            var obs = {
              concept: concept,
              groupMembers: sectionObs
            };
            _generateSectionPayLoad(_sectionFields, sectionObs);
            if (sectionObs.length > 0) {
              if (!_.isUndefined(obs.concept)) {
                obsRestPayload.push(obs);
              } else {
                _.each(sectionObs, function(o) {
                  obsRestPayload.push(o);
                });
              }

            }
          });

        } else if (fieldKey.startsWith('obs')) {
          var field = sectionModel[fieldKey];
          _generateFieldPayload(field, obsRestPayload);
        }

      });
    }

    function _setValue(field) {
      // $log.debug('Field b4 payload', field);
      // $log.debug('Field b4 payload  value', field.value);
      var obs = {};
      var initialValue = field.initialValue;
      var value = field.value;
      if (field.schemaQuestion.questionOptions.rendering === 'date') {
        if (_.isDate(value)) {
          value = _parseDate(field.value);
        }
      }

      if (_.isUndefined(initialValue) && (!_.isNull(value) &&
          value !== '' && !_.isUndefined(value))) {

        obs = {
          concept: field.concept,
          value: value
        };

      } else if (initialValue !== value && (!_.isNull(value) &&
          value !== '' && !_.isUndefined(value))) {
        obs = {
          uuid: field.initialUuid,
          concept: field.concept,
          value: value
        };
      }

      return obs;
    }

    function _generateFieldPayload(field, obsRestPayload) {
      var obs = {};
      var qRender = field.schemaQuestion.questionOptions.rendering;
      if (field.schemaQuestion.questionOptions.showDate &&
        field.obsDatetime) {
        //This shld be an obs date for the previous field
        var lastFieldPayload = obsRestPayload[obsRestPayload.length - 1];
        $log.debug('last obs payload', lastFieldPayload);
        lastFieldPayload.obsDatetime = _parseDate(field.value);
      } else if (qRender === 'number' || qRender === 'text' || qRender === 'select' ||
        qRender === 'radio') {
        obs = _setValue(field);
        if (Object.keys(obs).length > 0) {
          obsRestPayload.push(obs);
        }
      } else if (qRender === 'multiCheckbox') {
        var initialValue = field.initialValue;
        var value = field.value;
        if (initialValue === undefined && (!_.isNull(value) &&
            value !== '' && !_.isUndefined(value))) {
          _.each(value, function(val) {
            obs = {
              concept: field.concept,
              value: val
            };
            if (obs) {
              $log.debug('obs payload', obs);
              obsRestPayload.push(obs);
            }

            $log.debug('obs REST payload', obsRestPayload);
          });

        } else if (initialValue !== value && (!_.isNull(value) &&
            value !== '' && !_.isUndefined(value))) {
          var existingObs = _.intersection(initialValue, value);
          var newObs = [];
          var obsToFilter = [];
          var obsToVoid = [];
          var i = 0;
          _.each(initialValue, function(val) {
            if (!(val in value)) {
              obs = {
                concept: field.concept,
                value: val,
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
              value: val
            };
            obsRestPayload.push(obs);
          });
        }
      } else if (qRender === 'date') {
        obs = _setValue(field);
        if (Object.keys(obs).length > 0) {
          obsRestPayload.push(obs);
        }
      }

    }
  }
})();

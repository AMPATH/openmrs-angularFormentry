/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
  'use strict';

  angular
    .module('openmrs.angularFormentry')
    .factory('ObsProcessorService', ObsProcessService);

  ObsProcessService.$inject = ['$filter', '$log'];

  function ObsProcessService($filter, $log) {
    var updatedModel;
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
      updatedModel = angular.copy(model);
    }

    function _getRepeatingFieldsModel() {
      var repeatingFieldsModel = {};
      for (var i in updatedModel) {
        var sectionModel = updatedModel[i];
        for (var p in sectionModel) {
          var f = sectionModel[p];
          if (p.startsWith('obsRepeating')) {
            repeatingFieldsModel[p] = f;
          }
        }
      }
      // $log.error('Repeating model', repeatingFieldsModel);
      return repeatingFieldsModel;
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
      _.each(sectionKeys, function (section) {
        var sectionModel = model[section];
        // $log.debug('Section Models', sectionModel);
        _addObsToSection(sectionModel, openmrsRestObj);
      });
    }

    function _addObsToField(field, obs) {
      var val = _.filter(obs, function (o) {
        if (o.concept.uuid === field.concept) {
          return o;
        }
      });

      var opts = [];
      var optsUuid = [];
      _.each(val, function (o) {
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
          if (!(_.isEmpty(o.value) || _.isUndefined(o.value.uuid))) {
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
          if (!(_.isEmpty(o.value) || _.isUndefined(o.value.uuid))) {
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
      var val = _.filter(obs, function (o) {
        if (o.concept.uuid === concept) {
          return o;
        }
      });

      if (!_.isUndefined(val)) {
        results.repeatObs = val;
        _.each(val, function (o) {
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
      var fieldKeys = typeof sectionModel === 'object' ? Object.keys(sectionModel) : '';
      //geting obs data without obs groups
      var obsData = _.filter(openmrsRestObj.obs, function (obs) {
        if (_.isNull(obs.groupMembers)) {
          return obs;
        }
      });

      //geting obs data with obs groups
      var obsGroupData = _.filter(openmrsRestObj.obs, function (obs) {
        if (obs.groupMembers !== null) {
          return obs;
        }
      });

      _.each(fieldKeys, function (fieldKey) {
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
              _.each(sectionObs.obs, function (o, k) {
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
          if (sectionObs.repeatObs.length > 1 && sectionFields.length < sectionObs.repeatObs.length) {
            //there is need to get if the group has the repeating column before
            //determining how many times the columns are to be repeated
            var colDetails = sectionFields[0];
            var nRows = 0;
            for (var x in colDetails) {
              if (x !== 'groupConcept') {
                var thisCol = colDetails[x];
                var thisColConcept = thisCol.concept;
                var n = 0; // no of repeats for the current field
                for (var r = 0; r < sectionObs.repeatObs.length; r++) {
                  var thisObs = sectionObs.repeatObs[r];
                  //get if concept is available in the group members
                  for (var gm = 0; gm < thisObs.groupMembers.length; gm++) {
                    if (thisObs.groupMembers[gm].concept.uuid === thisColConcept) {
                      n++;
                    }
                  }
                  if (n > nRows) nRows = n;
                }
              }
            }

            for (var i = 1; i < nRows; i++) {
              //create duplicate fields if we have more repeating values in the rest obs
              sectionFields.push(angular.copy(sectionFields[0]));
              // $log.error('Repeating tests', sectionFields[0]);
            }
          }

          var results = {
            obs: []
          };
          var repeatObs = sectionObs.repeatObs;
          _.each(sectionFields, function (_sectionFields, k) {
            var concepLists = [];
            for (var vx in _sectionFields) {
              if (vx !== 'groupConcept') {
                var thisCol = _sectionFields[vx];
                concepLists.push(thisCol.concept);
              }
            }
            var fieldRestObs = [];
            // $log.error('Repeating Concept Lists ++  ', concepLists);
            for (var r = 0; r < repeatObs.length; r++) {
              var thisObs = repeatObs[r];
              // $log.error('Repeating Lists ++  ', thisObs);
              //get if concept is available in the group members
              for (var gm = 0; gm < thisObs.groupMembers.length; gm++) {
                if (_.contains(concepLists, thisObs.groupMembers[gm].concept.uuid)) {
                  // $log.error('Repeating Values ++  ', thisObs.groupMembers);
                  if (!_.contains(fieldRestObs, thisObs)) {
                    fieldRestObs.push(thisObs);
                  }
                }
              }
            }
            // sectionObs = results;
            // $log.error('Repeating Values ++3  ', fieldRestObs);
            if (fieldRestObs[k]) {
              results.obs = fieldRestObs[k].groupMembers;
              sectionObs = results;
            }
            // $log.error('Repeating Field obs ', sectionObs);

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
      _.each(sectionKeys, function (section) {
        var sectionModel = model[section];
        // $log.debug('Section Models', sectionModel);
        _generateSectionPayLoad(sectionModel, obsRestPayload);
      });

      return obsRestPayload;
    }

    function _generateSectionPayLoad(sectionModel, obsRestPayload) {
      var repeatingFieldsModel = _getRepeatingFieldsModel();
      var fieldKeys = typeof sectionModel === 'object' ? Object.keys(sectionModel) : [];
      // $log.debug('fieldKeys', fieldKeys);
      _.each(fieldKeys, function (fieldKey) {
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
          var originalModel;
          var sectionKeys;
          if (sectionFields.length > 0) {
            sectionKeys = Object.keys(sectionFields[0]);
          } else {
            if (_.has(repeatingFieldsModel, fieldKey)) {
              originalModel = repeatingFieldsModel[fieldKey];
              sectionKeys = Object.keys(originalModel[0]);
            }
          }

          if (sectionFields.length === 0) {
            // $log.debug('Repeating section', sectionKeys);
            // $log.debug('Repeating fields', sectionFields);
            //if the current model has no values
            //take the original model but set the value property to null
            _.each(originalModel, function (_sectionFields) {
              for (var i in _sectionFields) {
                var f = _sectionFields[i];
                if (_.has(f, 'value')) {
                  f.value = "";
                }
              }
            });

            // set the current model to the original model
            sectionFields = originalModel;
          } else {
            //compare the original model and the current model
            // to determine the variances before rebuilding the model that
            // will finally be used for generating the payload
            originalModel = repeatingFieldsModel[fieldKey];
            _.each(originalModel, function (_sectionFields) {
              var found = false;
              var f;
              var fm;
              for (var i in _sectionFields) {
                f = _sectionFields[i];
                if (_.has(f, 'initialValue')) {
                  f.value = "";
                  _.each(sectionFields, function (_sf) {
                    for (var j in _sf) {
                      fm = _sf[j];
                      if (_.has(fm, 'initialValue')) {
                        if (f.initialValue === fm.initialValue) {
                          found = true;
                        }
                      }
                    }
                  });
                }
              }

              if (found === false) {
                sectionFields.push(_sectionFields);
              }
            });
          }
          // $log.debug('Repeating fieldsxxx', sectionFields);
          _.each(sectionFields, function (_sectionFields) {
            var fieldKeys = Object.keys(_sectionFields);
            var sectionObs = [];
            var concept = sectionFields[0][sectionKeys[0]];

            var obs = {
              concept: concept,
              groupMembers: sectionObs
            };
            _generateSectionPayLoad(_sectionFields, sectionObs);
            // console.log('Repeating obs b4 updating payload', obs);
            if (sectionObs.length > 0) {
              if (!_.isUndefined(obs.concept)) {
                obsRestPayload.push(obs);
              } else {
                _.each(sectionObs, function (o) {
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
      var obs = {};
      var initialValue = field.initialValue;
      var value = field.value;
      if (field.schemaQuestion.questionOptions.rendering === 'date') {
        if (_.isDate(value) || (!_.isUndefined(value) && !_.isNull(value) && value !== '')) {
          value = _parseDate(field.value);
          console.log('test value', value, field.value);
        }
        if (_.isDate(initialValue) || (!_.isUndefined(initialValue) && !_.isNull(initialValue))) {
          initialValue = _parseDate(field.initialValue);
        }
      }

      if (_.isUndefined(initialValue) && (!_.isNull(value) &&
        value !== '' && !_.isUndefined(value) && !_.isObject(value))) {
        obs = {
          concept: field.concept,
          value: value
        };

      } else if (initialValue !== value && (!_.isNull(value) &&
        value !== '' && !_.isUndefined(value) && !_.isObject(value))) {
        obs = {
          uuid: field.initialUuid,
          concept: field.concept,
          value: value
        };
      } else if (initialValue !== value && (!_.isNull(value) &&
        value === '' && !_.isUndefined(value) && !_.isUndefined(initialValue) && !_.isObject(value))) {
        obs = {
          uuid: field.initialUuid,
          concept: field.concept,
          value: value,
          voided: true
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
        var lastFieldPayload;
        if (obsRestPayload.length > 0) {
          lastFieldPayload = obsRestPayload[obsRestPayload.length - 1];
          $log.debug('last obs payload', lastFieldPayload);

          if (!_.isEmpty(field.value) && _.isEmpty(lastFieldPayload.obsDatetime)) {
            lastFieldPayload.obsDatetime = _parseDate(field.value);
          }
        }

      } else if (_.isString(field.value) || _.isNumber(field.value)) {
        obs = _setValue(field);
        if (Object.keys(obs).length > 0) {
          obsRestPayload.push(obs);
        }
      } else if (_.isArray(field.value) || _.isArray(field.initialValue)) {
        var initialValue = field.initialValue;
        var initialUuid = field.initialUuid;
        var value = field.value;
        if (initialValue === undefined && (!_.isNull(value) &&
          value !== '' && !_.isUndefined(value))) {
          _.each(value, function (val) {
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
          _.each(initialValue, function (val) {
            if (!(_.contains(value, val))) {
              obs = {
                concept: field.concept,
                value: val,
                uuid: initialUuid[i],
                voided: true
              };
              obsToVoid.push(val);
              obsRestPayload.push(obs);
            }
            i++;
          });

          obsToFilter = _.union(obsToVoid, existingObs);
          newObs = _.difference(value, obsToFilter);
          _.each(newObs, function (val) {
            obs = {
              concept: field.concept,
              value: val
            };
            obsRestPayload.push(obs);
          });
        }
      } else if (qRender === 'date' || _.isDate(field.value)) {
        obs = _setValue(field);
        if (Object.keys(obs).length > 0) {
          obsRestPayload.push(obs);
        }
      } else {
        obs = _setValue(field);
        if (Object.keys(obs).length > 0) {
          obsRestPayload.push(obs);
        }
      }
    }
  }
})();

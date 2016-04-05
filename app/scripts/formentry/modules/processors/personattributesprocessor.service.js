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


        function _getSections(model) {
            var attributeRestPayload = [];
            var sectionKeys = Object.keys(model);
            _.each(sectionKeys, function (section) {
                var sectionModel = model[section];
                _generateSectionPayLoad(sectionModel, attributeRestPayload);
            });

            return attributeRestPayload;
        }

        function _generateSectionPayLoad(sectionModel, personAttributeRestPayload) {
            _.each(sectionModel, function (field) {
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
                    hydratedObject:value
                };

            } else if (initialValue !== value && (!_.isNull(value) &&
                value !== '' && !_.isUndefined(value))) {
                attribute = {
                    uuid: field.initialUuid,
                    attributeType: field.attributeType,
                    hydratedObject:value
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

        function addExistingPersonAttributesToForm(restDataSet, model) {
            _addExistingPersonAttributesToSections(restDataSet, model);
        }

        function getPersonAttributeValue(personAttributes, formlyFieldkey) {
            var attributeType = formlyFieldkey.split('_')[1].replace(/n/gi, '-');
            var filteredPersonAttributes = _.filter(personAttributes, function (attribute_) {
                if (personAttributes !== undefined && angular.isDefined(attribute_.attributeType)) {
                    if (attribute_.attributeType === attributeType) {
                        return attribute_.value;
                    }
                }
            });

            if (filteredPersonAttributes.length > 1) {
                $log.debug('The person attribute ' + filteredPersonAttributes + 'has multiple values, one value is expected');
            }

            return filteredPersonAttributes;
        }

        function _addPersonAttributeToField(field, existingPersonAttribute) {
            if (angular.isDefined(existingPersonAttribute) && existingPersonAttribute.length>0) {
               field.initialValue = existingPersonAttribute[0].value.uuid;
               field.value = existingPersonAttribute[0].value.uuid;
               field.initialUuid = existingPersonAttribute.uuid;
            }

            return field;
        }


        function _addPersonAttributesToSection(restDataSet, sectionModel) {
            var fieldKeys = typeof sectionModel === 'object'? Object.keys(sectionModel):'';
            _.each(fieldKeys, function (fieldKey) {
                if (fieldKey.startsWith('personAttribute')) {
                    var field = sectionModel[fieldKey];
                    var existingPersonAttribute = getPersonAttributeValue(restDataSet, fieldKey);
                    _addPersonAttributeToField(field, existingPersonAttribute);
                }
            });
        }

        function _addExistingPersonAttributesToSections(restDataSet, model) {
            var sectionKeys = Object.keys(model);
            _.each(sectionKeys, function (section) {
                var sectionModel = model[section];
                _addPersonAttributesToSection(restDataSet, sectionModel);
            });
        }


    }
})();

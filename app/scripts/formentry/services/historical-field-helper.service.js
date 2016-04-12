/* global angular */
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .service('HistoricalFieldHelperService', HistoricalFieldHelperService);

    HistoricalFieldHelperService.$inject = ['$log'];
    function HistoricalFieldHelperService($log) {


        var service = {
            //field model blueprint functions
            createModelForRegularField: createModelForRegularField,
            createModelForGroupSection: createModelForGroupSection,

            //field value setters
            fillPrimitiveValue: fillPrimitiveValue,
            fillArrayOfPrimitives: fillArrayOfPrimitives,
            fillGroups: fillGroups,

            //get display text given a field value
            getDisplayText: getDisplayText,
            getDisplayTextFromOptions: getDisplayTextFromOptions,

            //handle field properties for historical data
            handleHistoricalExpressionProperty: handleHistoricalExpressionProperty,
            handleModelBluePrintFunctionForGroupsProperty: handleModelBluePrintFunctionForGroupsProperty,
            handleGetDisplayValueFunctionForGroupsProperty: handleGetDisplayValueFunctionForGroupsProperty,

            //historic display fields
            createHistoricalTextField: createHistoricalTextField
        };

        return service;

        function createHistoricalTextField(parentField, parentFieldModel, parentFieldKey, prepopulateValue) {
            return {
                key: 'historical-text-val',
                type: 'historical-text',
                templateOptions: {
                    parentFieldKey: parentFieldKey,
                    parentFieldModel: parentFieldModel,
                    parentField: parentField,
                    prepopulate: prepopulateValue
                }
            };
        }

        function handleHistoricalExpressionProperty(field, schemaQuestion) {
            if (schemaQuestion.historicalExpression) {
                field['templateOptions']['historicalExpression'] = schemaQuestion.historicalExpression;
            }
        }

        function handleGetDisplayValueFunctionForGroupsProperty(field, schemaQuestion) {
            if (field.fieldGroup) {
                field['templateOptions']['getDisplayValue'] =
                _getDisplayValueFunctionForGroup(field, schemaQuestion);
            }
            else {
                field['templateOptions']['getDisplayValue'] =
                _getDisplayValueFunctionForRepeatingGroup(field, schemaQuestion);
            }

        }

        function _getDisplayValueFunctionForRepeatingGroup(obsField, schemaQuestion) {
            return function (values, callback, skipDelimiters) {
                var displayText = '';
                _.each(values, function (value) {

                    if(skipDelimiters !== true)
                        displayText = displayText+ "[ ";

                    _.each(obsField.templateOptions.fields, function (field) {
                        _.each(field.fieldGroup, function (innerfield) {
                            if (innerfield.templateOptions &&
                                typeof innerfield.templateOptions.getDisplayValue === 'function') {
                                innerfield.templateOptions.getDisplayValue(
                                    value[innerfield.data.concept],
                                    function (display) {
                                        displayText = displayText + display + ', ';
                                    }, true);
                            }
                        });
                    });
                    displayText = displayText.trim();
                    displayText = displayText.replace(/,(?=[^,]*$)/, '');
                     if(skipDelimiters !== true)
                        displayText = displayText + " ] ";
                });
                callback(displayText);
            };
        }

        function _getDisplayValueFunctionForGroup(obsField, schemaQuestion) {
            return function (values, callback) {
                var displayText = '';
                _.each(values, function (value) {
                    _.each(obsField.fieldGroup, function (field) {
                        if (field.templateOptions &&
                            typeof field.templateOptions.getDisplayValue === 'function') {
                            field.templateOptions.getDisplayValue(
                                value[field.data.concept],
                                function (display) {
                                    displayText = displayText + display + ', ';
                                });
                        }
                    });
                });
                displayText = displayText.trim();
                displayText = displayText.replace(/,(?=[^,]*$)/, '');
                callback(displayText);
            };
        }

        function handleModelBluePrintFunctionForGroupsProperty(field, schemaQuestion) {
            if (field.fieldGroup) {
                field['templateOptions']['createModelBluePrint'] =
                _getModelBluePrintFunctionForGroups(field, schemaQuestion);
            }
            else {
                field['templateOptions']['createModelBluePrint'] =
                _getModelBluePrintFunctionForRepeatingGroups(field, schemaQuestion);
            }

        }

        function _getModelBluePrintFunctionForGroups(obsField, schemaQuestion) {
            return function (parentModel, value) {
                var groupModel = createModelForGroupSection(parentModel,
                    obsField.key, schemaQuestion, schemaQuestion.questionOptions.concept);

                _.each(obsField.fieldGroup, function (field) {
                    if (field.templateOptions &&
                        typeof field.templateOptions.createModelBluePrint === 'function') {
                        field.templateOptions.createModelBluePrint(groupModel,
                            value?value[0][field.data.concept]:null);
                    }
                });
                return groupModel;
            };
        }

        function _getModelBluePrintFunctionForRepeatingGroups(obsField, schemaQuestion) {
            return function (parentModel, values) {
                var repeatingGroupModel = [];
                _.each(values, function (value) {

                    var groupModel = createModelForGroupSection(null,
                        obsField.key, schemaQuestion, schemaQuestion.questionOptions.concept);
                    _.each(obsField.templateOptions.fields, function (field) {
                        _.each(field.fieldGroup, function (innerfield) {
                            if (innerfield.templateOptions &&
                                typeof innerfield.templateOptions.createModelBluePrint === 'function') {
                                innerfield.templateOptions.createModelBluePrint(groupModel,
                                    value[innerfield.data.concept]);
                            }
                        });
                    });
                    repeatingGroupModel.push(groupModel);
                });
                if (parentModel) {
                    parentModel[obsField.key] = repeatingGroupModel;
                }
                return repeatingGroupModel;
            };
        }


        //#region Functions to create model chunks for a particular fields

        function createModelForRegularField(parentModel, modelKey, schemaQuestion, concept, value) {

            var model = {
                concept: schemaQuestion.questionOptions.concept,
                schemaQuestion: schemaQuestion,
                value: value
            };

            if (parentModel !== null && parentModel !== undefined) {
                var effectiveKey = modelKey.split('.')[0];
                parentModel[effectiveKey || modelKey] = model;
            }

            return model;
        }

        function createModelForGroupSection(parentModel, modelKey, schemaQuestion, concept) {
            var model = {
                groupConcept: schemaQuestion.questionOptions.concept,
                schemaQuestion: schemaQuestion
            };

            if (parentModel !== null && parentModel !== undefined) {
                parentModel[modelKey] = model;
            }

            return model;
        }

        //#endregion

        //#region Functions to handle setting of values and display
        function fillPrimitiveValue(field, newValue) {
            field.value(newValue);
        }

        function fillArrayOfPrimitives(field, newValue) {
            field.value(newValue);
        }

        function fillGroups(field, newValue) {
            var parentModel = field.templateOptions.createModelBluePrint(undefined, newValue);
            field.value(parentModel);
        }

        function getDisplayText(value, callback, fieldLabel) {
            callback(value);
        }

        function getDisplayTextFromOptions(value, options, valueProperty,
            displayProperty, callback, fieldLabel) {
            var displayText = '';
            if (angular.isArray(value)) {
                var valueConverted = 0;
                _.each(value, function (val) {
                    _.each(options, function (option) {
                        if (option[valueProperty] === val) {
                            if(valueConverted === 0){
                              displayText = displayText + option[displayProperty];
                            } else {
                            displayText = displayText + ", " + option[displayProperty];
                            }
                            valueConverted++;
                        }
                    });
                });
            } else {
                _.each(options, function (option) {
                    if (option[valueProperty] === value) {
                        displayText = option[displayProperty];
                    }

                });
            }
            callback(displayText);
        }

        //#endregion
    }
})();

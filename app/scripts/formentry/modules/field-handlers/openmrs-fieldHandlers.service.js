/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('OpenmrsFieldHandlerService', OpenmrsFieldHandler);

    OpenmrsFieldHandler.$inject = [
        '$log',
        'SearchDataService',
        'FormValidator',
        'FormentryConfig',
        'HistoricalFieldHelperService'
    ];

    var obsId = 0;

    function OpenmrsFieldHandler($log, SearchDataService, FormValidator,
        FormentryConfig, HistoricalFieldHelperService) {
        var currentQuestionMap = {};

        // Register Openmrs specific handlers
        FormentryConfig.registerFieldHandler('obsFieldHandler',
            obsFieldHandler);
        FormentryConfig.registerFieldHandler('encounterTypeFieldHandler',
            encounterTypeFieldHandler);
        FormentryConfig.registerFieldHandler('personAttributeFieldHandler',
            personAttributeFieldHandler);
        FormentryConfig.registerFieldHandler('encounterDatetimeFieldHandler',
            encounterDatetimeFieldHandler);
        FormentryConfig.registerFieldHandler('encounterProviderFieldHandler',
            encounterProviderFieldHandler);
        FormentryConfig.registerFieldHandler('encounterLocationFieldHandler',
            encounterLocationFieldHandler);
        FormentryConfig.registerFieldHandler('conceptSearchFieldHandler',
            conceptSearchFieldHandler);
        FormentryConfig.registerFieldHandler('locationAttributeFieldHandler',
            locationAttributeFieldHandler);
        FormentryConfig.registerFieldHandler('defaultFieldHandler',
            defaultFieldHandler);

        var service = {
            getFieldHandler: FormentryConfig.getFieldHandler
        };

        return service;

        function encounterTypeFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function encounterDatetimeFieldHandler(_question, model, questionMap) {
            $log.info('loading datetime fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            field.type = 'datetimepicker';
            _addToQuestionMap(_question, field, questionMap);
            return field;
        }

        function encounterLocationFieldHandler(_question, model, questionMap) {
            $log.info('loading location fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            _handleFieldUiSelect(field);
            field['templateOptions']['deferredFilterFunction'] = SearchDataService.findLocation;
            field['templateOptions']['getSelectedObjectFunction'] = SearchDataService.getLocationByUuid;
            _addToQuestionMap(_question, field, questionMap);
            return field;
        }

        function encounterProviderFieldHandler(_question, model, questionMap) {
            $log.info('loading provider fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            _handleFieldUiSelect(field);
            field['templateOptions']['valueProp'] = 'personUuid';
            field['templateOptions']['deferredFilterFunction'] = SearchDataService.findProvider;
            field['templateOptions']['getSelectedObjectFunction'] = SearchDataService.getProviderByUuid;
            _addToQuestionMap(_question, field, questionMap);
            return field;
        }

        function conceptSearchFieldHandler(_question, model, questionMap) {
            $log.info('loading fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            field['templateOptions']['type'] = 'concept-search-select';
            _addToQuestionMap(_question, field, questionMap);
            return field;
        }

        function locationAttributeFieldHandler(_question, model, questionMap) {
            $log.info('loading fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            _handleFieldUiSelect(field);
            field['templateOptions']['type'] = _question.questionOptions.rendering;
            field['templateOptions']['deferredFilterFunction'] = SearchDataService.findLocation;
            field['templateOptions']['getSelectedObjectFunction'] = SearchDataService.getLocationByUuid;
            _addToQuestionMap(_question, field, questionMap);
            return field;
        }

        function personAttributeFieldHandler(_question, model, questionMap) {
            $log.info('loading person attribute fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            _handlePersonAttributeField(field);
            field['templateOptions']['type'] = _question.questionOptions.rendering;
            field['templateOptions']['deferredFilterFunction'] = SearchDataService.findLocation;
            field['templateOptions']['getSelectedObjectFunction'] = SearchDataService.getLocationByUuid;
            _addToQuestionMap(_question, field, questionMap);
            return field;
        }

        function defaultFieldHandler(_question, model, questionMap) {
            $log.info('loading default fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            _addToQuestionMap(_question, field, questionMap);
            var fieldArray = [];
            var obsDateField;
            if (_question.questionOptions.showDate === 'true') {
                obsDateField = angular.copy(field);
                _handleShowDate(obsDateField);
                fieldArray.push(field);
                fieldArray.push(obsDateField);
                return fieldArray;
            } else {
                return field;
            }
        }

        function obsFieldHandler(_question, model, questionMap) {
            $log.info('loading obs fieldHandler');
            var obsField = {};
            obsField = _createObsFormlyField(_question, model, questionMap);
            currentQuestionMap = questionMap;
            return obsField;
        }

        function createFieldKey(_question, _id) {
            var key;
            var fKey;
            var id = _id + 1;
            if (_question.type === 'obs') {
                fKey = _question.questionOptions.concept;
                key = 'obs' + id + '_' + fKey.replace(/-/gi, 'n'); // $$ Inserts a "$".
            } else if (_question.type === 'personAttribute') {
                fKey = _question.questionOptions.attributeType;
                key = 'personAttribute' + '_' + fKey.replace(/-/gi, 'n');
            } else {
                key = _question.type;
            }

            return key;
        }

        function _handleExpressionProperties(_field, _required, _disabled, _listener) {
            var field = _field || {};
            var required = typeof _required === 'boolean' ? _required : _required ? FormValidator.getConditionalRequiredExpressionFunction(_required) : 'false';
            var disabled = typeof _disabled === 'boolean' ? _required : _disabled ? FormValidator.getHideDisableExpressionFunction_JS(_disabled) : 'false';
            var listener = _listener || '';
            field['expressionProperties'] = {
                'templateOptions.required': required,
                'templateOptions.disabled': disabled,
                'templateOptions.hasListeners': listener,
                'templateOptions.onValueChanged': onFieldValueChanged
            };
        }

        function _handleDefaultValue(_field, _defaultValue) {
            var field = _field || {};
            var defaultVal = _defaultValue || '';
            field['defaultValue'] = defaultVal;
        }

        function _handleValidators(_field, _validators, questionMap) {
            var field = _field || {};
            //set the validator to default validator
            var defaultValidator = {
                expression: function (viewValue, modelValue, scope) {
                    return true;
                },
                message: ''
            };

            var compiledValidators = FormValidator.getFieldValidators(_validators);
            compiledValidators['defaultValidator'] = defaultValidator;
            field['validators'] = compiledValidators;
        }

        function _handleHistoricalValueSetters(field) {
            //handle external value setters
            if (typeof field['templateOptions']['setFieldValue'] !== 'function') {
                field['templateOptions']['setFieldValue'] =
                HistoricalFieldHelperService.fillPrimitiveValue;
            }
        }

        function _handleFieldModelBlueprintCreators(field, question) {
            //handle external model blue print creators
            field['templateOptions']['createModelBluePrint'] = function (parentModel) {
                return HistoricalFieldHelperService.
                    createModelForRegularField(parentModel, field.key,
                        question, question.questionOptions.concept, 20);
            };
        }



        function _handleHide(_field, _hide) {
            var field = _field || {};
            var hide = typeof _hide === 'boolean' ? _hide : _hide ? FormValidator.getHideDisableExpressionFunction_JS(_hide) : 'false';
            field['hideExpression'] = hide;
        }

        function _handleFieldAnswers(_field, _answers) {
            var field = _field || {};
            var answerList = [];
            // answerList.push({name:'unselect', value:undefined});
            // get the anserq options for radio/select options/multicheckbox
            if (angular.isArray(_answers)) {
                _.each(_answers, function (answer) {
                    var item = {
                        name: answer.label,
                        value: answer.concept
                    };
                    answerList.push(item);
                });
            } else {
                $log.error('Error: Expected ' + _answers + ' to be an Array but got: ',
                    typeof _answers);
            }

            field['templateOptions']['valueProp'] = 'value';
            field['templateOptions']['labelProp'] = 'name';
            field['templateOptions']['options'] = answerList;
        }

        function _handleFieldUiSelect(_field) {
            var field = _field || {};
            field['type'] = 'ui-select-extended';
            field['templateOptions']['valueProp'] = 'uuId';
            field['templateOptions']['labelProp'] = 'display';
            field['templateOptions']['options'] = [];
        }

        function _handlePersonAttributeField(_field) {
            var field = _field || {};
            field['type'] = 'ui-select-extended';
            field['templateOptions']['valueProp'] = 'uuId';
            field['templateOptions']['labelProp'] = 'display';
            field['templateOptions']['options'] = [];
        }

        function _handleShowDate(_field) {
            var field = _field || {};
            field.templateOptions = {};
            var key = field.key;
            field['key'] = key.replace(/obs/gi, 'obsDate');;
            field['type'] = 'datepicker';
            field['templateOptions']['datepickerPopup'] = 'dd-MMMM-yyyy';
            field['templateOptions']['label'] = 'Date';
            field['templateOptions']['type'] = 'text';
        }

        function _updateModelObsDateField(_question, model, field) {
            var m = {
                concept: _question.questionOptions.concept,
                schemaQuestion: _question,
                value: '',
                obsDatetime: 'true'
            };
            var fieldKey = field.key.split('.')[0];
            model[fieldKey] = m;
        }

        function onFieldValueChanged(viewVal, modelVal, fieldScope) {
            if (fieldScope.options.data.id) {
                FormValidator.updateListeners(fieldScope.options.data.id);
            }
        }

        function _createFormlyFieldHelper(_question, model, questionMap) {
            var field = {};
            var m = {};
            m = {
                concept: _question.questionOptions.concept,
                schemaQuestion: _question,
                value: ''
            };

            if (_question.type === 'personAttribute') {
                m = {
                    attributeType: _question.questionOptions.attributeType,
                    schemaQuestion: _question,
                    value: ''
                };
            }

            var fieldKey = createFieldKey(_question, obsId);
            var _model = {};
            _model[fieldKey] = m;
            var key = _model[fieldKey]; //'value';
            var keyNames = Object.keys(_model);
            // $log.debug('debug key ...', key);
            field = {
                key: keyNames[0] + '.value',
                data: {
                    concept: _question.questionOptions.concept,
                    id: _question.id
                },
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: _question.label
                }
            };

            $log.debug('debug key field ...', field);
            _handleExpressionProperties(field, _question.required, _question.disable, undefined);
            _handleDefaultValue(field, _question.default);
            _handleHide(field, _question.hide);
            _handleValidators(field, _question.validators, questionMap);
            _handleHistoricalValueSetters(field);
            _handleFieldModelBlueprintCreators(field, _question);
            HistoricalFieldHelperService.handleHistoricalExpressionProperty(field, _question);

            // if (_question.questionOptions.concept in model) { //add m to the array
            if (fieldKey in model) { //add m to the array
                // model[_question.questionOptions.concept].push(m);
                model[fieldKey] = key;
            } else { //create array with just m
                // model[_question.questionOptions.concept] = [m];
                model[fieldKey] = m;
            }

            return field;
        }

        function _addToQuestionMap(_question, _field, questionMap) {
            if ('id' in _question) {
                if (_question.id in questionMap) {
                    questionMap[_question.id].push(_field);
                } else {
                    questionMap[_question.id] = [_field];
                }
            }
        }

        function _createObsFormlyField(_question, _model, questionMap) {
            var obsField = {};
            obsField = _createFormlyFieldHelper(_question, _model, obsId);
            if (_question.questionOptions.rendering === 'date') {
                obsField['type'] = 'datepicker';
                obsField['templateOptions']['datepickerPopup'] = 'dd-MMMM-yyyy';

                if (typeof obsField['templateOptions']['setFieldValue'] !== 'function') {
                    obsField['templateOptions']['setFieldValue'] =
                    HistoricalFieldHelperService.fillPrimitiveValue;
                }

                if (typeof obsField['templateOptions']['getDisplayValue'] !== 'function') {
                    obsField['templateOptions']['getDisplayValue'] =
                    function (value, callback) {
                        HistoricalFieldHelperService.
                            getDisplayText(value, callback, _question.label);
                    };
                }

            } else if (_question.questionOptions.rendering === 'number') {
                obsField['templateOptions']['type'] = _question.questionOptions.rendering;
                obsField['templateOptions']['min'] = _question.questionOptions.min;
                obsField['templateOptions']['max'] = _question.questionOptions.max;

                if (typeof obsField['templateOptions']['setFieldValue'] !== 'function') {
                    obsField['templateOptions']['setFieldValue'] =
                    HistoricalFieldHelperService.fillPrimitiveValue;
                }

                if (typeof obsField['templateOptions']['getDisplayValue'] !== 'function') {
                    obsField['templateOptions']['getDisplayValue'] =
                    function (value, callback) {
                        HistoricalFieldHelperService.getDisplayText(value, callback, _question.label);
                    };
                }

            } else if (_question.questionOptions.rendering === 'problem') {
                _handleFieldUiSelect(obsField);
                obsField['templateOptions']['deferredFilterFunction'] = SearchDataService.findProblem;
                obsField['templateOptions']['getSelectedObjectFunction'] = SearchDataService.getProblemByUuid;

                if (typeof obsField['templateOptions']['setFieldValue'] !== 'function') {
                    obsField['templateOptions']['setFieldValue'] =
                    HistoricalFieldHelperService.fillPrimitiveValue;
                }
            } else if (_question.questionOptions.rendering === 'drug') {
                _handleFieldUiSelect(obsField);
                obsField['templateOptions']['deferredFilterFunction'] = SearchDataService.findDrugConcepts;
                obsField['templateOptions']['getSelectedObjectFunction'] = SearchDataService.getDrugConceptByUuid;

                if (typeof obsField['templateOptions']['setFieldValue'] !== 'function') {
                    obsField['templateOptions']['setFieldValue'] =
                    HistoricalFieldHelperService.fillPrimitiveValue;
                }
            } else if (_question.questionOptions.rendering === 'select-concept-answers') {
                obsField['type'] = 'concept-search-select';
                obsField['templateOptions']['options'] = [];
                obsField['templateOptions']['displayMember'] = 'label';
                obsField['templateOptions']['valueMember'] = 'concept';
                obsField['templateOptions']['questionConceptUuid'] = _question.questionOptions.concept;
                obsField['templateOptions']['type'] = _question.questionOptions.rendering;
                obsField['templateOptions']['fetchOptionsFunction'] = SearchDataService.getDrugConceptByUuid;
                if (typeof obsField['templateOptions']['setFieldValue'] !== 'function') {
                    obsField['templateOptions']['setFieldValue'] =
                    HistoricalFieldHelperService.fillPrimitiveValue;
                }
            } else if ((_question.questionOptions.rendering === 'radio') ||
                (_question.questionOptions.rendering === 'select') ||
                (_question.questionOptions.rendering === 'multiCheckbox')) {
                _handleFieldAnswers(obsField, _question.questionOptions.answers);

                if (typeof obsField['templateOptions']['setFieldValue'] !== 'function') {
                    obsField['templateOptions']['setFieldValue'] =
                    HistoricalFieldHelperService.fillArrayOfPrimitives;
                }

                obsField['templateOptions']['getDisplayValue'] =
                function (value, callback) {
                    HistoricalFieldHelperService.
                        getDisplayTextFromOptions(value, _question.questionOptions.answers,
                            'concept', 'label', callback, _question.label);
                };

                if (_question.questionOptions.rendering === 'multiCheckbox') {
                    obsField['type'] = 'ui-select-multiple';
                } else if (_question.questionOptions.rendering === 'select') {
                    obsField['type'] = 'ui-select-single';
                } else {
                    obsField['type'] = 'radio';
                }
            }

            obsField['templateOptions']['createModelBluePrint'] = function (parentModel, value) {
                return HistoricalFieldHelperService.
                    createModelForRegularField(parentModel, obsField.key,
                        _question, _question.questionOptions.concept, value);
            };

            //finally, ensure all fields have getDisplayValue
            if (typeof obsField['templateOptions']['getDisplayValue'] !== 'function') {
                obsField['templateOptions']['getDisplayValue'] =
                function (value, callback) {
                    HistoricalFieldHelperService.getDisplayText(value, callback, _question.label);
                };
            }

            _addToQuestionMap(_question, obsField, questionMap);

            var fieldArray = [];
            var obsDateField = {};
            if (_question.questionOptions.showDate === 'true') {
                var key = angular.copy(obsField.key);
                obsDateField.key = key;
                _handleShowDate(obsDateField);
                _updateModelObsDateField(angular.copy(_question), _model, obsDateField);
                fieldArray.push(obsField);
                fieldArray.push(obsDateField);
                return fieldArray;
            } else {
                return obsField;
            }
        }
    }
})();

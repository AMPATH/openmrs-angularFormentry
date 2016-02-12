/* global angular */
/* global Exception */
/* global _ */
/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .service('FormValidator', FormValidator);

    FormValidator.$inject = ['$filter', 'CurrentLoadedFormService', 'moment'];

    function FormValidator($filter, CurrentLoadedFormService, moment) {

        var service = {
            extractQuestionIds: extractQuestionIds,
            replaceQuestionsPlaceholdersWithValue: replaceQuestionsPlaceholdersWithValue,
            replaceMyValuePlaceholdersWithActualValue: replaceMyValuePlaceholdersWithActualValue,
            evaluateExpression: evaluateExpression,
            getFieldValueToValidate: getFieldValueToValidate,
            getFieldValidator: getFieldValidatorObject,
            getFieldValidators: getFieldValidators,
            getConditionalRequiredExpressionFunction: getConditionalRequiredExpressionFunction,
            getConditionalAnsweredValidatorObject: getConditionalAnsweredValidatorObject,
            getDateValidatorObject: getDateValidatorObject,
            getJsExpressionValidatorObject: getJsExpressionValidatorObject,
            getHideDisableExpressionFunction_JS: getHideDisableExpressionFunction_JS,
            addToListenersMetadata: addToListenersMetadata,
            updateListeners: updateListeners,
            getCalculateExpressionFunction_JS:getCalculateExpressionFunction_JS
        };

        return service;

        function getFieldValidators(arrayOfValidations) {
            var validator = {};
            var index = 1;
            _.each(arrayOfValidations, function (validate) {
                var validatorKey = validate.type;

                validatorKey = validatorKey + index;
                index++;

                if (validate.type !== 'conditionalRequired') {
                    validator[validatorKey] = getFieldValidatorObject(validate);
                }
            });
            return validator;
        }

        function getFieldValidatorObject(params) {
            switch (params.type) {
                case 'date':
                    return getDateValidatorObject(params);
                case 'js_expression':
                    return getJsExpressionValidatorObject(params);
                case 'conditionalAnswered':
                    return getConditionalAnsweredValidatorObject(params);
                case 'conditionalRequired':
                    return getConditionalRequiredExpressionFunction(params);
            }

        }

        function getDateValidatorObject(params) {
            var validator = new Validator('', undefined);
            if (params.allowFutureDates !== 'true') {
                //case does not allow future dates
                validator.expression = function (viewValue, modelValue) {
                    /*
                    using datejs library
                    */
                    var value = modelValue || viewValue;
                    var dateValue;
                    var curDate = new Date(formatDate(new Date(), 'd-MMM-yyyy'));
                    if ((value !== undefined) && (value !== null)) {
                        dateValue = new Date(formatDate(value, 'd-MMM-yyyy'));
                    }
                    if (dateValue !== undefined) {
                        return !moment(dateValue).isAfter(curDate);
                    }
                    if (dateValue !== undefined || dateValue !== null || value !== '') {
                        return true;
                    }

                };
                validator.message = '"Should not be a future date!"';

            }
            else {
                //case should be a date
                validator.expression = function (viewValue, modelValue, elementScope) {
                    /*
                    using datejs library
                    */
                    var value = modelValue || viewValue;
                    var dateValue;
                    //var curDate = Date.parse(Date.today(), 'd-MMM-yyyy');
                    console.log('date Value ++', value);
                    if (value !== undefined && value !== null && value !== '') {
                        console.log('date Value ++', value);
                        dateValue = Date.parse(value, 'd-MMM-yyyy').clearTime();
                    }
                    if (dateValue !== undefined || dateValue !== null || value !== '') {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                validator.message = '"Should be a date!"';
            }
            return validator;
        }

        function getJsExpressionValidatorObject(schemaValidatorObject) {

            var validator = new Validator('"' + schemaValidatorObject.message + '"',
                function (viewValue, modelValue, elementScope) {

                    var val = getFieldValueToValidate(viewValue, modelValue, elementScope);

                    if (elementScope.options && elementScope.options.data
                    && elementScope.options.data.id) {
                        var fields =
                        service.extractQuestionIds(schemaValidatorObject.failsWhenExpression,
                            CurrentLoadedFormService.questionMap);
                        addToListenersMetadata(elementScope.options.data.id, fields);
                    }

                    var referencedQuestions =
                    service.extractQuestionIds(schemaValidatorObject.failsWhenExpression,
                        CurrentLoadedFormService.questionMap);

                    var keyValue = {};

                    _.each(referencedQuestions, function (qId) {
                        if (keyValue[qId] === undefined) {
                            var referenceQuestionkey =
                            CurrentLoadedFormService.getFieldKeyFromGlobalById(qId);
                            var referenceQuestionCurrentValue =
                                CurrentLoadedFormService.
                                getAnswerByQuestionKey(CurrentLoadedFormService.formModel,
                                    referenceQuestionkey);
                            keyValue[qId] = referenceQuestionCurrentValue;
                        }
                    });

                    var expressionToEvaluate =
                        service.
                        replaceQuestionsPlaceholdersWithValue(schemaValidatorObject.failsWhenExpression,
                        keyValue);

                    expressionToEvaluate =
                    service.replaceMyValuePlaceholdersWithActualValue(expressionToEvaluate, val);
                    console.log('Evaluates val', val);
                    console.log('Evaluates model', elementScope);
                    console.log('expressionToEvaluate', expressionToEvaluate);

                    var isInvalid = service.evaluateExpression(expressionToEvaluate);

                    console.log('isInvalid', isInvalid);

                    return !isInvalid;
                });
            return validator;

        }


        function getFieldValueToValidate(viewValue, modelValue, elementScope) {
            var val = modelValue || viewValue;

            //special case for multicheck box
            if (elementScope.$parent && elementScope.$parent.multiCheckbox) {
                console.log('validating multicheck box..', elementScope.$parent.multiCheckbox);
                var selectedOptions =
                elementScope.$parent.model[elementScope.$parent.options.key];
                var mergedOptions = selectedOptions ? [].concat(selectedOptions) : [];

                if (val === true) {
                    if (elementScope.option.value) {
                        mergedOptions.push(elementScope.option.value);
                    }
                }
                else {
                    var index = mergedOptions.indexOf(elementScope.option.value);
                    if (index >= 0) {
                        mergedOptions = _.without(mergedOptions, elementScope.option.value);
                    }
                }

                val = mergedOptions;
            }

            return val;
        }

        function getConditionalAnsweredValidatorObject(schemaValidatorObject) {
            var validator = new Validator('"' + schemaValidatorObject.message + '"',
                function (viewValue, modelValue, elementScope) {
                    var val = modelValue || viewValue;

                    if (elementScope.options && elementScope.options.data
                    && elementScope.options.data.id) {
                        var fields = [schemaValidatorObject.referenceQuestionId];
                        addToListenersMetadata(elementScope.options.data.id, fields);
                    }

                    if (val === true && elementScope.$parent && elementScope.$parent.multiCheckbox) {
                        val = elementScope.option.value;
                    }
                    var modelOptions;
                    if (elementScope.$parent && elementScope.$parent.multiCheckbox) {
                        modelOptions = elementScope.$parent.model[elementScope.$parent.options.key];
                    }

                    var modelIsNonEmptyArray =
                    (modelOptions !== undefined && Array.isArray(modelOptions) &&
                    modelOptions.length !== 0);

                    var hasValue = modelIsNonEmptyArray ||
                        (val !== undefined && val !== null && val !== '' && val !== false);
                    if (!hasValue) {
                        //question was not answered therefore it is always valid
                        return true;
                    }

                    //question was asnwered, therefore establish that the reference questions have the required answers
                    var referenceQuestionkey =
                    CurrentLoadedFormService.
                    getFieldKeyFromGlobalById(schemaValidatorObject.referenceQuestionId);
                    var referenceQuestionCurrentValue =
                    CurrentLoadedFormService.
                    getAnswerByQuestionKey(CurrentLoadedFormService.formModel,
                    referenceQuestionkey);



                    var answersThatPermitThisQuestionAnswered =
                    schemaValidatorObject.referenceQuestionAnswers;

                    var isValid = false;

                    _.each(answersThatPermitThisQuestionAnswered, function (answer) {
                        if (referenceQuestionCurrentValue === answer) {
                            isValid = true;
                        }
                    });

                    console.log('isValid', isValid);
                    return isValid;
                });

            return validator;
        }

        function getConditionalRequiredExpressionFunction(schemaValidatorObject) {

            return function ($viewValue, $modelValue, scope, element) {
                var i = 0;
                var isRequired;
                var result;

                var referenceQuestionkey =
                    CurrentLoadedFormService.
                        getFieldKeyFromGlobalById(schemaValidatorObject.referenceQuestionId);

                if (scope.options && scope.options.data && scope.options.data.id) {
                    var fields = [schemaValidatorObject.referenceQuestionId];
                    addToListenersMetadata(scope.options.data.id, fields);
                }

                _.each(schemaValidatorObject.referenceQuestionAnswers, function (val) {

                    var referencedQuestionCurrentAnswer =
                        CurrentLoadedFormService.
                            getAnswerByQuestionKey(CurrentLoadedFormService.formModel,
                             referenceQuestionkey);
                    result = referencedQuestionCurrentAnswer === val;

                    if (i === 0) {
                        isRequired = result;
                    }
                    else {
                        isRequired = isRequired || result;
                    }
                    i = i + 1;
                });
                console.log('isRequired', isRequired);
                return isRequired;
            };

        }

        function getHideDisableExpressionFunction_JS(schemaValidatorObject) {
            return function ($viewValue, $modelValue, scope, element) {
                var val = getFieldValueToValidate($viewValue, $modelValue, scope);

                if (scope.options && scope.options.data && scope.options.data.id) {
                    var fields =
                    service.extractQuestionIds(schemaValidatorObject.disableWhenExpression ||
                    schemaValidatorObject.hideWhenExpression,
                    CurrentLoadedFormService.questionMap);

                    addToListenersMetadata(scope.options.data.id, fields);
                }

                var referencedQuestions =
                service.extractQuestionIds(schemaValidatorObject.disableWhenExpression ||
                schemaValidatorObject.hideWhenExpression,
                CurrentLoadedFormService.questionMap);

                var keyValue = {};

                _.each(referencedQuestions, function (qId) {
                    if (keyValue[qId] === undefined) {
                        var referenceQuestionkey =
                        CurrentLoadedFormService.getFieldKeyFromGlobalById(qId);

                        var referenceQuestionCurrentValue =
                        CurrentLoadedFormService.
                        getAnswerByQuestionKey(CurrentLoadedFormService.formModel,
                        referenceQuestionkey);

                        keyValue[qId] = referenceQuestionCurrentValue;
                    }
                });

                var expressionToEvaluate =
                service.
                replaceQuestionsPlaceholdersWithValue(schemaValidatorObject.disableWhenExpression ||
                schemaValidatorObject.hideWhenExpression, keyValue);

                expressionToEvaluate =
                service.replaceMyValuePlaceholdersWithActualValue(expressionToEvaluate, val);
                console.log('Evaluates val', val);
                console.log('Evaluates model', scope);
                console.log('expressionToEvaluate', expressionToEvaluate);

                var isDisabled = service.evaluateExpression(expressionToEvaluate);

                console.log('isDisabled/isHidden', isDisabled);

                if (isDisabled === true) {
                    if (element) {
                        //case hide
                        CurrentLoadedFormService.clearQuestionValueByKey(scope.model,
                        element.options.key.split('.')[0]);
                    }
                    else {
                        //case disable
                        CurrentLoadedFormService.clearQuestionValueByKey(scope.model,
                        scope.options.key.split('.')[0]);
                    }
                }

                return isDisabled;
            };
        }

        function getCalculateExpressionFunction_JS(schemaValidatorObject) {
            return function ($viewValue, $modelValue, scope, element) {
                var val = getFieldValueToValidate($viewValue, $modelValue, scope);

                if (scope.options && scope.options.data && scope.options.data.id) {
                    var fields =
                    service.extractQuestionIds(schemaValidatorObject.calculateExpression ||
                    schemaValidatorObject.hideWhenExpression,
                    CurrentLoadedFormService.questionMap);

                    addToListenersMetadata(scope.options.data.id, fields);
                }

                var referencedQuestions =
                service.extractQuestionIds(schemaValidatorObject.calculateExpression ||
                schemaValidatorObject.hideWhenExpression,
                CurrentLoadedFormService.questionMap);

                var keyValue = {};

                _.each(referencedQuestions, function (qId) {
                    if (keyValue[qId] === undefined) {
                        var referenceQuestionkey =
                        CurrentLoadedFormService.getFieldKeyFromGlobalById(qId);

                        var referenceQuestionCurrentValue =
                        CurrentLoadedFormService.
                        getAnswerByQuestionKey(CurrentLoadedFormService.formModel,
                        referenceQuestionkey);

                        keyValue[qId] = referenceQuestionCurrentValue;
                    }
                });

                var expressionToEvaluate =
                service.
                replaceQuestionsPlaceholdersWithValue(schemaValidatorObject.calculateExpression ||
                schemaValidatorObject.hideWhenExpression, keyValue);

                expressionToEvaluate =
                service.replaceMyValuePlaceholdersWithActualValue(expressionToEvaluate, val);
                console.log('Evaluates val', val);
                console.log('Evaluates model', scope);
                console.log('expressionToEvaluate', expressionToEvaluate);

                var result = service.evaluateExpression(expressionToEvaluate);
                console.log('Evaluates Results', result);
                scope.options.value(result);
            };
        }

        function addToListenersMetadata(listenerId, fieldsIds) {
            _.each(fieldsIds, function (fieldId) {
                if (CurrentLoadedFormService.listenersMetadata[fieldId] === undefined) {
                    console.log('adding listeners entry', fieldId);
                    CurrentLoadedFormService.listenersMetadata[fieldId] = [];
                }
                if (CurrentLoadedFormService.listenersMetadata[fieldId].indexOf(listenerId) < 0) {
                    console.log('adding to listeners', listenerId);
                    CurrentLoadedFormService.listenersMetadata[fieldId].push(listenerId);
                }
                console.log('listeners', CurrentLoadedFormService.listenersMetadata);
            });
        }

        function updateListeners(fieldId) {
            if (CurrentLoadedFormService.listenersMetadata[fieldId] !== undefined) {
                _.each(CurrentLoadedFormService.listenersMetadata[fieldId], function (listenerId) {
                    var fields = CurrentLoadedFormService.questionMap[listenerId];

                    if (Array.isArray(fields)) {
                        _.each(fields, function (field) {
                            if (field.runExpressions) {
                                field.runExpressions();
                            }
                            if (field.formControl) {
                                field.formControl.$validate();
                            }
                        });
                    }
                    else {
                        if (fields.runExpressions) {
                            fields.runExpressions();
                        }
                        if (fields.formControl) {
                            fields.formControl.$validate();
                        }
                    }

                });
            }
        }


        function Validator(message, expressionFunction) {
            this.message = message;
            this.expression = expressionFunction;
        }

        function replaceQuestionsPlaceholdersWithValue(expression, keyValuObject) {
            var fieldIds = Object.keys(keyValuObject);
            var replaced = expression;
            _.each(fieldIds, function (key) {
                var toReplace = keyValuObject[key];
                if (typeof keyValuObject[key] === 'string') {
                    toReplace = '"' + toReplace + '"';
                }

                if (Array.isArray(keyValuObject[key])) {
                    toReplace = convertArrayToString(toReplace);
                }

                var beforeReplaced = replaced;

                replaced = replaced.replace(key, toReplace);

                while (replaced.localeCompare(beforeReplaced) !== 0) {
                    beforeReplaced = replaced;
                    replaced = replaced.replace(key, toReplace);
                }
            });
            return replaced;
        }

        function replaceMyValuePlaceholdersWithActualValue(expression, myValue) {
            var replaced = expression;
            var toReplace = myValue;
            if (typeof toReplace === 'string') {
                toReplace = '"' + toReplace + '"';
            }
            if (Array.isArray(toReplace)) {
                toReplace = convertArrayToString(toReplace);
            }

            var beforeReplaced = replaced;
            replaced = replaced.replace('myValue', toReplace);
            while (replaced.localeCompare(beforeReplaced) !== 0) {
                beforeReplaced = replaced;
                replaced = replaced.replace('myValue', toReplace);
            }
            return replaced;
        }

        function extractQuestionIds(expression, questionMap) {
            var fieldIds = Object.keys(questionMap);
            var extracted = [];
            _.each(fieldIds, function (key) {
                var findResult = expression.search(key);
                if (findResult !== -1) {
                    extracted.push(key);
                }
            });

            return extracted;
        }


        function evaluateExpression(expression) {
            return eval(expression);
        }

        function convertArrayToString(array) {
            var converted = '[';
            for (var i = 0; i < array.length; i++) {
                if (i !== 0) {
                    converted = converted + ",";
                }
                converted = converted + "'" + array[i] + "'";
            }
            converted = converted + ']';
            return converted;
        }

        function calcBMI(height, weight) {
          var r;
          if (height && weight){
            r = (weight/(height/100*height/100)).toFixed(1);
          }
          return height && weight? parseFloat(r): null
        }

        function isEmpty(val) {

            if (val === undefined || val === null || val === '' || val === 'null'
            || val === 'undefined') {
                return true;
            }
            if (Array.isArray(val) && val.length === 0) {
                return true;
            }
            return false;
        }

        function arrayContains(array, members) {
            if (Array.isArray(members)) {
                if (members.length === 0) {
                    return true;
                }
                var contains = true;
                _.each(members, function (val) {
                    if (array.indexOf(val) === -1) {
                        contains = false;
                    }
                });
                return contains;
            }
            else {
                return array.indexOf(members) !== -1;
            }
        }

        function formatDate(value, format, offset) {
            var format = format || 'yyyy-MM-dd';
            var offset = offset || '+0300';

            if (!(value instanceof Date)) {
                value = new Date(value);
                if (value === null || value === undefined) {
                    throw new Exception('DateFormatException: value passed ' +
                        'is not a valid date');
                }
            }
            return $filter('date')(value, format, offset);
        }

        function arrayContainsAny(array, members) {
            if (Array.isArray(members)) {
                if (members.length === 0) {
                    return true;
                }
                var contains = false;
                _.each(members, function (val) {
                    if (array.indexOf(val) !== -1) {
                        contains = true;
                    }
                });
                return contains;
            }
            else {
                return array.indexOf(members) !== -1;
            }
        }

    }
})();

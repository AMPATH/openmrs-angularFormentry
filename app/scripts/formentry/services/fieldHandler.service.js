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
        .factory('FieldHandlerService', FieldHandlerService);

  FieldHandlerService.$inject = ['$log'];
  var obsId = 0;
  function FieldHandlerService($log) {
    var fieldHandlers = {};

    //registerCoreFieldHandler
    fieldHandlers['obsFieldHandler'] = obsFieldHandler;
    fieldHandlers['encounterTypeFieldHandler'] = encounterTypeFieldHandler;
    fieldHandlers['personAttributeFieldHandler'] = personAttributeFieldHandler;
    fieldHandlers['encounterDatetimeFieldHandler'] = encounterDatetimeFieldHandler;
    fieldHandlers['encounterProviderFieldHandler'] = encounterProviderFieldHandler;
    fieldHandlers['encounterLocationFieldHandler'] = encounterLocationFieldHandler;
    fieldHandlers['obsGroupFieldHandler'] = obsGroupFieldHandler;
    fieldHandlers['obsGroupRepeatingFieldHandler'] = obsGroupRepeatingFieldHandler;
    fieldHandlers['conceptSearchFieldHandler'] = conceptSearchFieldHandler;
    fieldHandlers['locationAttributeFieldHandler'] = locationAttributeFieldHandler;
    fieldHandlers['defaultFieldHandler'] = defaultFieldHandler;
    var service = {
      getFieldHandler: getFieldHandler,
      registerCustomFieldHandler: registerCustomFieldHandler
    };

    return service;

    function getFieldHandler(handlerName) {
      if (handlerName in fieldHandlers) {
        return fieldHandlers[handlerName];
      } else {
        $log.warn('Failed to get the required fieldHandler, returning defaultFieldHandler');
        return fieldHandlers['defaultFieldHandler'];
      }
    }

    function registerCustomFieldHandler(handlerName, handlerMethod) {
      fieldHandlers[handlerName] = handlerMethod;
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

    function obsGroupRepeatingFieldHandler(_field) {
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

    function obsGroupFieldHandler(_field) {
      $log.info('loading obs Group FieldHandler');
      var field = {};
      gpSectionRnd = 0;
      field = createGroupFormlyField(_obsField, gpSectionRnd);
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
      return obsField;
    }

    function createFieldKey(_question, _id)
    {
      var key;
      var fKey;
      var id = _id + 1;
      if (_question.type === 'obs') {
        fKey = _question.questionOptions.concept;
        key = 'obs' + id + '_' + fKey.replace(/-/gi, 'n'); // $$ Inserts a "$".
      } else {
        key = _question.type;
      }

      return key;
    }

    function _handleExpressionProperties(_field, _required, _disabled, _listener)
    {
      var field = _field || {};
      var required = _required || 'false';
      var disabled = _disabled || '';
      var listener = _listener || '';
      field['expressionProperties'] = {
        'templateOptions.required':required,
        'templateOptions.disabled':disabled,
        'templateOptions.hasListeners':listener
      };
    }

    function _handleDefaultValue(_field, _defaultValue)
    {
      var field = _field || {};
      var defaultVal = _defaultValue || '';
      field['defaultValue'] = defaultVal;
    }

    function _handleValidators(_field, _validators)
    {
      var field = _field || {};
      //set the validator to default validator
      var defaultValidator = {
        expression: function(viewValue, modelValue, scope) {
          return true;
        },

        message: ''
      };
      var compiledValidators = {};
      //this should change once we plugin the validators
      compiledValidators['defaultValidator'] = defaultValidator || _validators;
      field['validators'] = compiledValidators;
    }

    function _handleHide(_field, _hide)
    {
      var field = _field || {};
      var hide = hide || '';
      field['hideExpression'] = hide;
    }

    function _handleFieldAnswers(_field, _answers) {
      var field = _field || {};
      var answerList = [];
      answerList.push({name:'', value:undefined});
      //get the anserq options for radio/select options/multicheckbox
      if (angular.isArray(_answers)) {
        _.each(_answers, function(answer) {
          var item = {
            name:answer.label,
            value:answer.concept
          };
          answerList.push(item);
        });
      } else {
        $log.error('Error: Expected ' + _answers + ' to be an Array but got: ',
        typeof _answers);
      }

      field['templateOptions']['options'] = answerList;
    }

    function _handleFieldUiSelect(_field, _answers) {
      var field = _field || {};
      var answerList = [];
      answerList.push({name:'', value:undefined});
      //get the anserq options for radio/select options/multicheckbox
      _.each(_answers, function(answer) {
        var item = {
          name:answer.label,
          value:answer.concept
        };
        answerList.push(item);
      });

      field['templateOptions'] = {
        type: 'text',
        options:answerList
      };
    }

    function _handleShowDate(_field) {
      var field = _field || {};
      var key = field.key;
      field.key = key.replace(/obs/gi, 'obsDate');
      field.type = 'datepicker';
      field.templateOptions['datepickerPopup'] = 'dd-MMMM-yyyy';
      field.templateOptions['label'] = 'Date';
      field.expressionProperties = {
        'templateOptions.required': function($viewValue, $modelValue, scope, element) {
          var value = $viewValue || $modelValue;
          var fkey = selField.key;
          return scope.model[fkey] !== undefined && scope.model[fkey] !== null && scope.model[fkey] !== '';
        }
      };
      field.validators = {
        dateValidator: '' //FormValidator.getDateValidatorObject(curField.validators[0]) //this  will require refactoring as we move forward
      };
    }

    function _createFormlyFieldHelper(_question, model, _id) {
      var field = {};
      var m = {
        concept:_question.questionOptions.concept,
        schemaQuestion: _question, value:''
      };
      var fieldKey = createFieldKey(_question, _id);
      var _model = {};
      _model[fieldKey] = m;
      var key = _model[fieldKey]; //'value';
      var keyNames = Object.keys(_model);
      $log.debug('debug key ...', key);
      field = {
        key:keyNames[0] + '.value',
        data: {concept:_question.questionOptions.concept,
          id:_question.id},
        type: 'input',
        templateOptions: {
          type: 'text',
          label: _question.label
        }
      };

      $log.debug('debug key field ...', field);
      _handleExpressionProperties(field, _question.required, _question.disable);
      _handleDefaultValue(field, _question.default);
      _handleHide(field, _question.hide);
      _handleValidators(field, _question.validators);

      // if (_question.questionOptions.concept in model) { //add m to the array
      if (fieldKey in model) { //add m to the array
        // model[_question.questionOptions.concept].push(m);
        model[fieldKey] = key;
      } else { //create array with just m
        // model[_question.questionOptions.concept] = [m];
        model[fieldKey] = m;
      }

      // field.model = _model;
      $log.debug('loosing value property', model);
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

      } else if (_question.questionOptions.rendering === 'number') {
        obsField['templateOptions']['type'] = _question.questionOptions.rendering;
        obsField['templateOptions']['min'] = _question.questionOptions.min;
        obsField['templateOptions']['max'] = _question.questionOptions.max;

      } else if ((_question.questionOptions.rendering === 'radio') ||
      (_question.questionOptions.rendering === 'select') ||
      (_question.questionOptions.rendering === 'multiCheckbox')) {
        _handleFieldAnswers(obsField, _question.questionOptions.answers);
        obsField['type'] = _question.questionOptions.rendering;
      }

      _addToQuestionMap(_question, obsField, questionMap);

      var fieldArray = [];
      var obsDateField;
      if (_question.questionOptions.showDate === 'true') {
        obsDateField = angular.copy(obsField);
        _handleShowDate(obsDateField);
        fieldArray.push(obsField);
        fieldArray.push(obsDateField);
        return fieldArray;
      } else {
        return obsField;
      }
    }

  }
})();

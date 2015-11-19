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
  var obsId = 0;
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
        $log.warn('Failed to get the required field returning defaultFieldHandler');
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

    function defaultFieldHandler(_field) {
      $log.info('loading fieldHandler');
    }

    function createFieldKey(_field, _id)
    {
      var key;
      var fKey;
      var id = _id + 1;
      if (_field.type === 'obs') {
        fKey = _field.questionOptions.concept;
        key = 'obs' + id + fKey.replace(/-/gi, 'n'); // $$ Inserts a "$".
      }

      return key;
    }

    function obsFieldHandler(_field) {
      var obsField = {};
      obsField = _createObsFormlyField(_field);
      return obsField;
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
      var compiledValidators = _validators || defaultValidator;
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
      _.each(_answers, function(answer) {
        var item = {
          name:answer.label,
          value:answer.concept
        };
        answerList.push(item);
      });

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

    function _obsFieldHandlerHelper(_field, _obsId) {
      var obsField = {};
      obsField = {
        key: createFieldKey(_field, _obsId),
        data: {concept:_field.questionOptions.concept,
          id:_field.id},
        type: 'input',
        templateOptions: {
          type: 'text',
          label: _field.label
        }
      };

      _handleExpressionProperties(obsField, _field.required, _field.disable);
      _handleDefaultValue(obsField, _field.default);
      _handleHide(obsField, _field.hide);
      _handleValidators(obsField, _field.validators);
      return obsField;
    }

    function _createObsFormlyField(_obsField) {
      var obsField = {};
      obsField = _obsFieldHandlerHelper(_obsField, obsId);
      if (_obsField.questionOptions.rendering === 'date') {
        obsField['type'] = 'datepicker';
        obsField['templateOptions']['datepickerPopup'] = 'dd-MMMM-yyyy';

      } else if (_obsField.questionOptions.rendering === 'number') {
        obsField['templateOptions']['type'] = _obsField.questionOptions.rendering;
        obsField['templateOptions']['min'] = _obsField.questionOptions.min;
        obsField['templateOptions']['max'] = _obsField.questionOptions.max;

      } else if ((_obsField.questionOptions.rendering === 'radio') ||
      (_obsField.questionOptions.rendering === 'select') ||
      (_obsField.questionOptions.rendering === 'multiCheckbox')) {
        _handleFieldAnswers(obsField, _obsField.answers);
        obsField['type'] = _obsField.questionOptions.rendering;
      }
      // console.log('Obs field', obsField);
      return obsField;
    }

  }
})();

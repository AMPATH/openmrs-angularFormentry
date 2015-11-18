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

    function createFieldKey(key)
    {
      return key.replace(/-/gi, 'n'); // $$ Inserts a "$".
    }

    function obsFieldHandler(_field) {
      var obsField = {};
      obsField = _createObsFormlyField(_field);
      return obsField;
    }

    function _handleRequired(_field, _required)
    {
      var field = _field || {};
      var required = _required || 'false';
      field = {
        expressionProperties:{
          'templateOptions.required': required
        }
      };
    }

    function _handleDefaultValue(_field, _defaultValue)
    {
      var field = _field || {};
      var defaultVal = _defaultValue || '';
      field = {
        defaultValue:defaultVal
      };
    }

    function _handleDisabled(_field, _disabled)
    {
      var field = _field || {};
      var disabled = _disabled || '';
      field = {
        expressionProperties:{
          'templateOptions.disabled': disabled
        }
      };
    }

    function _handleListeners(_field, _listener)
    {
      var field = _field || {};
      var listener = _listener || '';
      field = {
        expressionProperties:{
          'templateOptions.hasListeners': listener
        }
      };
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
      field = {
        validators:compiledValidators
      };
    }

    function _handleHide(_field, _hide)
    {
      var field = _field || {};
      var hide = hide || '';
      field = {
        hideExpression:hide
      };
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

      field = {
        templateOptions: {
          type: 'text',
          options:answerList
        }
      };
    }

    function _obsFieldHandlerHelper(_field, obsId) {
      var obsField = {};
      obsField = {
        key: 'obs' + obsId + '_' + createFieldKey(_field.questionOptions.concept),
        data: {concept:_field.questionOptions.concept,
          id:_field.id},
        type: 'input',
        templateOptions: {
          type: 'text',
          label: _field.label,
        }
      };
      _handleRequired(obsField, _field.required);
      _handleDefaultValue(obsField, _field.default);
      _handleHide(obsField, _field.hide);
      _handleDisabled(obsField, _field.disable);
      _handleValidators(obsField, _field.validators);
      return obsField;
    }

    function _createObsFormlyField(_obsField) {
      //console.log(_obsField)
      obsId = obsId + 1;
      var obsField = {};
      obsField = _obsFieldHandlerHelper(_obsField, obsId);
      if (_obsField.questionOptions.rendering === 'date') {
        obsField = {
          type:'datepicker',
          templateOptions: {
            datepickerPopup: 'dd-MMMM-yyyy'
          }
        };
      } else if (_obsField.questionOptions.rendering === 'number') {
        obsField = {
          templateOptions: {
            type: _obsField.questionOptions.rendering,
            min:_obsField.min,
            max:_obsField.max
          }
        };
      } else if ((_obsField.questionOptions.rendering === 'radio') ||
      (_obsField.questionOptions.rendering === 'select') ||
      (_obsField.questionOptions.rendering === 'multiCheckbox')) {
        _handleFieldAnswers(obsField, _obsField.answers);
      }
      // console.log('Obs field', obsField);
      return obsField;
    }

  }
})();

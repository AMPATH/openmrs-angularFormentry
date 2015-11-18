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
    var service = {
      getFieldHandler: getFieldHandler,
      registerCustomFieldHandler: registerCustomFieldHandler
    };

    return service;

    function getFieldHandler(handlerName) {
      $log.info('loading fieldHandler', handlerName);
      $log.info('fieldHandlers', fieldHandlers);
      $log.info('fieldHandlers specific', fieldHandlers[handlerName]);
      return fieldHandlers[handlerName] || fieldHandlers['default'];
    }

    function registerCustomFieldHandler(handlerName, handlerMethod) {
      fieldHandlers[handlerName] = handlerMethod;
    }

    function obsFieldHandler(_field) {
      var obsField = {};
      obsField = createFormlyField(_field);
      return obsField;
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

    function createObsFormlyField(_obsField) {
      //console.log(_obsField)
      obsId = obsId + 1;
      var defaultValue_;
      if (_obsField.default !== undefined) {
        defaultValue_ = _obsField.default;
      }

      var hideExpression_;
      var disableExpression_ = '';

      var id_;
      if (_obsField.id !== undefined) {
        id_ = _obsField.id;
      }

      if (_obsField.hide !== undefined) {
        hideExpression_ = '';
      } else {
        hideExpression_ = '';
      }

      if (_obsField.disable !== undefined) {
        disableExpression_ = '';
      }

      if (_obsField.disableExpression !== undefined) {
        disableExpression_ = '';
      }

      var obsField = {};
      // if (validateFieldFormat(_obsField) !== true) {
      //   console.log('Something Went Wrong While creating this field', _obsField);
      // }
      //console.log('validators', _obsField);
      var validators;
      if (_obsField.showDate === undefined) //load if the field has no this property (this obs datatime)
          validators = _obsField.validators;

      //set the validator to default validator
      var defaultValidator = {
        expression: function(viewValue, modelValue, scope) {
          return true;
        },

        message: ''
      };
      var compiledValidators = {};

      if (_obsField.questionOptions.rendering === 'date') {
        var required = 'false';

        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.questionOptions.concept),
          type: 'datepicker',
          data: {concept:_obsField.questionOptions.concept,
            id:id_},
          defaultValue: defaultValue_,
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            datepickerPopup: 'dd-MMMM-yyyy'
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': ''
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.questionOptions.rendering === 'text') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.questionOptions.concept),
          type: 'input',
          defaultValue: defaultValue_,
          data: {concept:_obsField.questionOptions.concept,
            id:id_},
          templateOptions: {
            type: _obsField.questionOptions.rendering,
            label: _obsField.label
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': ''
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.questionOptions.rendering === 'number')
      {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;

        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.questionOptions.concept),
          type: 'input',
          defaultValue: defaultValue_,
          data: {concept:_obsField.questionOptions.concept,
            id:id_},
          templateOptions: {
            type: _obsField.questionOptions.rendering,
            label: _obsField.label,
            min:_obsField.min,
            max:_obsField.max
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': ''
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if ((_obsField.questionOptions.rendering === 'radio') ||
      (_obsField.questionOptions.rendering === 'select') ||
      (_obsField.questionOptions.rendering === 'multiCheckbox')) {
        var opts = [];
        //Adding unselect option
        if (_obsField.questionOptions.rendering !== 'multiCheckbox')
          opts.push({name:'', value:undefined});
        //get the radio/select options/multicheckbox
        //console.log(_obsField);
        _.each(_obsField.answers, function(answer) {
          // body...
          var item = {
            name:answer.label,
            value:answer.concept
          };
          opts.push(item);
        });

        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;

        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.questionOptions.concept),
          type: _obsField.questionOptions.rendering,
          defaultValue: defaultValue_,
          data: {concept:_obsField.questionOptions.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            options:opts
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': ''
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.questionOptions.rendering === 'problem') {
        obsField = {
          key: 'obs' + obsId + '_' +
           createFieldKey(_obsField.questionOptions.concept),
          defaultValue: defaultValue_,
          type: 'ui-select-extended',
          data: {concept:_obsField.questionOptions.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            valueProp: 'uuId',
            labelProp:'display',
            deferredFilterFunction: '',
            getSelectedObjectFunction: '',
            options:[]
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': ''
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.questionOptions.rendering === 'drug') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'obs' + obsId + '_' +
          createFieldKey(_obsField.questionOptions.concept),
          type: 'ui-select-extended',
          defaultValue: defaultValue_,
          data: {concept:_obsField.questionOptions.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            valueProp: 'uuId',
            labelProp:'display',
            deferredFilterFunction: '',
            getSelectedObjectFunction: '',
            options:[]
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': ''
          },
          validators: compiledValidators
        };
      } else if (_obsField.questionOptions.rendering === 'select-concept-answers') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'obs' + obsId + '_' + createFieldKey(_obsField.questionOptions.concept),
          defaultValue: defaultValue_,
          type: 'concept-search-select',
          data: {concept:_obsField.questionOptions.concept,
            id:id_},
          templateOptions: {
            type: 'text',
            label: _obsField.label,
            options:[],
            displayMember:'label',
            valueMember:'concept',
            questionConceptUuid:_obsField.questionOptions.concept,
            fetchOptionsFunction:''
          },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required,
            'templateOptions.hasListeners': ''
          },
          hideExpression:hideExpression_,
          validators: compiledValidators
        };
      } else if (_obsField.questionOptions.rendering === 'location-attribute') {
        var required = 'false';
        if (_obsField.required !== undefined) required = _obsField.required;
        obsField = {
          key: 'personAttribute' + obsId + '_' + createFieldKey(_obsField.attributeType),
          type: 'ui-select-extended',
          defaultValue: defaultValue_,
          data: {attributeType:_obsField.attributeType,
          id:id_},
          templateOptions: {
          type: 'text',
          label: _obsField.label,
          valueProp: 'uuId',
          labelProp:'display',
          deferredFilterFunction: '',
          getSelectedObjectFunction: '',
          options:[]
        },
          expressionProperties: {
            'templateOptions.disabled': disableExpression_,
            'templateOptions.required': required
          },
          validators: compiledValidators
        };
      }
      // console.log('Obs field', obsField);
      return obsField;
    }

    function createFieldKey(key)
    {
      return key.replace(/-/gi, 'n'); // $$ Inserts a "$".
    }
  }
})();

/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry', [
          'ngMessages',
          'ngResource',
          'formly',
          'formlyBootstrap',
          'ui.bootstrap',
          'openmrs.RestServices',
          'ui.bootstrap.datetimepicker',
	        'ui.select',
          'ngSanitize'
        ])

        .run(function(formlyConfig, formlyValidationMessages, formlyApiCheck) {
      formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
      formlyValidationMessages.addStringMessage('required', 'This field is required');
      formlyValidationMessages.addTemplateOptionValueMessage('max', 'max', 'The max value allowed is ', '', 'Too Big');
      formlyValidationMessages.addTemplateOptionValueMessage('min', 'min', 'The min value allowed is ', '', 'Too Small');
      formlyConfig.extras.removeChromeAutoComplete = true;

      formlyConfig.setType({
          name: 'customInput',
          extends: 'input',
          apiCheck: function() {
            formlyApiCheck.shape({
              foo: formlyApiCheck.string.optional
            });
          }
        });

      formlyConfig.setType({
          name: 'section',
          extends: 'input',
          apiCheck: function() {
            formlyApiCheck.shape({
              foo: formlyApiCheck.string.optional
            });
          }
        });

      formlyConfig.setWrapper({
          name: 'validation',
          types: ['input', 'customInput','datepicker', 'select', 'section', 'multiCheckbox', 'select-concept-answers'],
          templateUrl: 'error-messages.html'
        });
    });
})();

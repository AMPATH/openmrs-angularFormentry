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
          'ui.bootstrap.datetimepicker',
	        'ui.select'
        ]);
})();

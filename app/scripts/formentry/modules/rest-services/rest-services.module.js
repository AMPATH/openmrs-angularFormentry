/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
        .module('openmrs.RestServices', [
            'base64',
            'ngResource',
            'ngCookies',
            'models',
            'restangular',
        ])
        .run(RestangularConfig);

  RestangularConfig.$inject = ['Restangular', 'FormentryConfig'];

  function RestangularConfig(Restangular, FormentryConfig) {  // jshint ignore:line
    // Should of the form /ws/rest/v1 or https://host/ws/rest/v1
    Restangular.setBaseUrl(FormentryConfig.getOpenmrsBaseUrl());
  }
})();

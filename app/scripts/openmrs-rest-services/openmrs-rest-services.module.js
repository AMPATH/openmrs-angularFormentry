/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
        .module('openmrsRestServices', [
            'base64',
            'ngResource',
            'ngCookies',
            'models',
            'restangular',
        ])
        .run(RestangularConfig);

  RestangularConfig.$inject = ['Restangular'];

  function RestangularConfig(Restangular, envService) {  // jshint ignore:line
    // Should of the form /ws/rest/v1 or https://host/ws/rest/v1
    Restangular.setBaseUrl('http://host.com/');
  }
})();

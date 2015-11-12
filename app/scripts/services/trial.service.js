/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('angularFormentry')
        .factory('CreateForm', CreateForm);

  CreateForm.$inject = [];

  function CreateForm() {
    var service = {
          testForm: testForm
        };

    return service;

    function testForm() {
      console.info('this works fine');
    }
  }
})();

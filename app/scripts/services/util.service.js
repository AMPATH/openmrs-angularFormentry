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
        .factory('UtilService', UtilService);

  UtilService.$inject = ['$http', '$log'];

  function UtilService($http, $log) {
    var service = {
          getFormSchema: getFormSchema
        };

    return service;

    function getFormSchema(formName, callback) {
      var schema = {};
      // formName = createValidFormName(formName);
      // this should de dropped once we align all forms related issues
      if (formName !== undefined) {
        formName = formName + '.json';
      } else {
        formName = 'test.json';
      }

      var url = 'scripts/formentry/schema/' + formName;
      $http.get(url, {cache: true})
            .success(function(response) {
              callback(response);
            })
              .error(function(data, status, headers, config) {
                if (status === 404) {alert('Form Resource not Available');}
              });
    }
  }
})();

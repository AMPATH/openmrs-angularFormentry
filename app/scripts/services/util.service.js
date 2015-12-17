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

  UtilService.$inject = ['$http', '$log', '$resource'];

  function UtilService($http, $log, $resource) {
    var service = {
          getFormSchema: getFormSchema,
          getTestEncounterData:getTestEncounterData,
          getServerUrl:getServerUrl
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
              $log.info('getting schema', response);
              callback(response);
            })
              .error(function(data, status, headers, config) {
                if (status === 404) {alert('Form Resource not Available');}
              });
    }

    function _getResource() {
      var _server = 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/';
      var _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                        'patient:(uuid,uuid),form:(uuid,name),' +
                        'location:ref,encounterType:ref,provider:ref,' +
                        'obs:(uuid,obsDatetime,concept:(uuid,uuid),value:ref,groupMembers))';

      return $resource(_server + 'encounter/:uuid?v=' + _customDefaultRep,
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getTestEncounterData(uuid, successCallback, failedCallback) {
      var testUuid = '2b863113-1996-4562-b246-d23766175d73';
      var resource = _getResource();
      return resource.get({ uuid: testUuid }).$promise
        .then(function(response) {
          successCallback(response);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          $log.error(error);
        });
    }
    
    function getServerUrl() {
      return 'http://localhost:8080/amrs/ws/rest/v1';
    }
    
  }
})();

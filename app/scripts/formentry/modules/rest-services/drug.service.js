/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('openmrs.RestServices')
    .service('DrugResService', DrugResService);

  DrugResService.$inject = ['$resource'];

  function DrugResService($resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getSearchResource: getSearchResource,
      getDrugByUuid: getDrugByUuid,
      findDrugs: findDrugs,
    };

    return serviceDefinition;

    function getResource() {
      return $resource('/drug/:uuid?v=custom:(uuid,name,concept)',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getSearchResource() {
      return $resource('/drug?q=:q&v=custom:(uuid,name,concept)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }


    function getDrugByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function findDrugs(searchText, successCallback, failedCallback) {
      var resource = getSearchResource();
      return resource.get({ search: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

  }
})();

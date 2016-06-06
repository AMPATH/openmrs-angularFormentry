/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name angularFormentryApp.controller:SimpleDemoCtrl
   * @module angularFormentry
   * @description
   * # SimpleDemoCtrl: has only 3 main fx : setAuthenticationHeaders, renderFormSchema and savePayload
   * Controller of the angularFormentry Developer DemoApp
   * This is a simple demo containing basic OpenMRS Angular Formentry Functionalities
   * We want you to have an easy time while you start consuming/using  OpenMRS Angular Formentry.
   * It contains basic feature --> for advanced features like field-handlers, historical auto-population see AdvancedDemoCtrl
   * Note that all logic have been implemented in one controller (for simplicity purposes): angular best practice guides in
   * development of real-world app requires these logic to be refactored to services/factories and directives
   */
  angular
    .module('angularFormentry')
    .controller('SimpleDemoCtrl', SimpleDemoCtrl);

  SimpleDemoCtrl.$inject = [
    '$log', '$scope', 'FormentryUtilService', 'FormEntry', '$resource', '$http', '$base64'
  ];

  function SimpleDemoCtrl($log, $scope, FormentryUtilService, FormEntry, $resource, $http, base64) {
    //form properties
    $scope.model = {};
    $scope.questionMap = {};
    $scope.selectedSchema = 'demo-triage'; //schema :: see openmrs-angularFormentry/app/scripts/formentry/schema/demo-triage.json

    //openMrs rest service base Url for ref app demo.openmrs.org
    $scope.openMrsRestServiceBaseUrl = 'http://demo.openmrs.org/openmrs/ws/rest/v1/'; //url

    //UX control flags
    $scope.showSuccessMsg = false; //flag to show/hide "form saved successfully" message --> replace it with angular-dialog-service
    $scope.errors = [];
    $scope.isBusy = false; //busy indicator flag -->replace it with (bower install angular-loading)

    //member functions
    $scope.setAuthenticationHeaders = setAuthenticationHeaders; //this method implements user authentication
    $scope.renderFormSchema = renderFormSchema; //this method  renders  form schema to the view
    $scope.submitForm = submitForm; //submits payload to the rest server *only creates encounter/obs
    $scope.savePayload = savePayload; //method that hits the rest api: returns a callback or fallback;
    $scope.init = init; //initializes the controller

    $scope.init(); //run the app

    /**
     * @ngdoc function init
     * @name init
     * @description
     * this function initializes the controller by calling authentication method and form schema rendering fx
     */
    function init() {
      //authenticate user
      $scope.setAuthenticationHeaders('admin', 'Admin123'); //-->replace this with a login page
      //render schema
      $scope.renderFormSchema();

    }

    /**
     * @ngdoc function
     * @name setAuthenticationHeaders
     * @param password
     * @param userName
     * @todo handle move this to a service or create login page
     * @description
     * function do do basic authentication: takes in userName, password
     */
    function setAuthenticationHeaders(userName, password) {
      //authenticate
      $log.log('authenticating user...');
      $http.defaults.headers.common.Authorization = 'Basic ' + base64.encode(userName + ':' + password);
    }

    /**
     * @ngdoc function
     * @name renderFormSchema
     * @description
     * this function renders form schema on the view
     */
    function renderFormSchema() {
      FormentryUtilService.getFormSchema($scope.selectedSchema, function (schema) {
        $scope.schema = angular.toJson(schema, true); //bind schema to scope
        var _schema = angular.fromJson(schema); //Deserializes form schema (JSON).
        var model = {};
        var formObject = FormEntry.createForm(_schema, model);
        var newForm = formObject.formlyForm;
        $scope.result = {
          "formObject": formObject,
          "newForm": newForm,
          "model": model
        };
        $scope.tabs = newForm;
        $scope.questionMap = formObject.questionMap;
        $scope.model = model;
        $scope.errors = formObject.error;
        $log.debug('schema --->', newForm);

      });
    }

    /**
     * @ngdoc function
     * @name submitForm
     * @todo handle provider, patient, location --> this should be moved to a service
     * @description
     * this function listens to save button --> it calls save payload function
     */
    function submitForm() {
      $scope.errors = []; //clear all errors
      $scope.isBusy = true; //busy indicator
      $scope.showSuccessMsg = false; //clear all success msg
      try {
        var payload = FormEntry.getFormPayload($scope.model);
        payload.provider = "fdf2bba3-ee9e-11e4-8e55-52540016b979"; //admin Admin123 (demo.openmrs.org)
        payload.encounterType = "67a71486-1a54-468f-ac3e-7091a9a79584"; //Vitals (demo.openmrs.org)
        payload.patient = "deb0905c-3b82-4631-88b2-b71425755cdf"; //Elizabeth Johnson (demo.openmrs.org)
        payload.location = "b1a8b05e-3542-4037-bbd3-998ee9c40574"; //Inpatient Ward (demo.openmrs.org)

        $log.debug('payload ---->', JSON.stringify(payload));
        $log.debug('model ---->', $scope.model);

        //hit the server
        savePayload(JSON.stringify(payload),
          onSuccessCallback, onErrorFailback);
      } catch (ex) {
        $scope.errors.push(ex);
      }
    };

    /**
     * @ngdoc function
     * @name onSuccessCallback
     * @param encounter
     * @callback successCallback
     * @callback errorCallback
     * @description
     * this functions hits the openMrs rest service: has a 2 callbacks (error and success)
     */
    function savePayload(encounter, successCallback, errorCallback) {
      $log.log('Submitting new obs...');

      var v = 'custom:(uuid,encounterDatetime,' +
        'patient:(uuid,uuid),form:(uuid,name),' +
        'location:ref,encounterType:ref,provider:ref,' +
        'obs:(uuid,obsDatetime,concept:(uuid,uuid),value:ref,groupMembers))';
      var encounterResource = $resource($scope.openMrsRestServiceBaseUrl + 'encounter/:uuid',
        {uuid: '@uuid', v: v},
        {query: {method: 'GET', isArray: false, cache: false}});

      encounterResource.save(encounter).$promise
        .then(function (data) {
          console.log('Encounter saved successfully');
          if (typeof successCallback === 'function')
            successCallback(data);
        })
        .catch(function (error) {
          console.log('Error saving encounter');
          if (typeof errorCallback === 'function')
            errorCallback(error);
        });
    }

    /**
     * @ngdoc function
     * @name onSuccessCallback
     * @params data
     * @description
     * this a success callback function for the savePayload function
     */
    function onSuccessCallback(data) {
      $log.log('Submitting new obs successful', data);
      $scope.showSuccessMsg = true;
      $scope.isBusy = false;
      //TODO: Display success popup
    }

    /**
     * @ngdoc function
     * @name onErrorFailback
     * @param error
     * @description
     * this an error callback function for the savePayload function
     */
    function onErrorFailback(error) {
      $log.error('Submitting new obs failed', error);
      //TODO: Handle errors
      $scope.errors.unshift(error);
      $scope.isBusy = false;

    }


  }
})();

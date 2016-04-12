/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
 jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
 jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma
 */
(function () {
  'use strict';

  angular
    .module('app.formDesigner')
    .factory('FormDesignerService', FormDesignerService);

  FormDesignerService.$inject = ["$log","FormEntry"];
  //FormDesignerService.$inject = ["EncounterDataService"];

  function FormDesignerService($log,FormEntry) {
  //function FormDesignerService() {

    var service = {
      renderForm: renderForm
    };

    //schema: json object converted from string
    //payload: json object converted from string
    function renderForm(schema,payload) {
      console.log(payload);
      var model = {};
      var formObject = FormEntry.createForm(schema, model);
      var newForm = formObject.formlyForm;
      $log.debug('schema xxx', newForm);
      return {
          "formObject":formObject,
          "newForm":newForm,
          "model":model
      };
    }


    return service;
  }
})();

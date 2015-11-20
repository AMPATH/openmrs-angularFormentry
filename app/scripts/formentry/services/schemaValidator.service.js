/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry')
        .factory('schemaValidatorService', schemaValidatorService);

    schemaValidatorService.$inject = ['$log', 'UtilService'];

  function schemaValidatorService($log, UtilService) {
      var service = {
          validateSchema: validateSchema,
          validatePage: validatePage,
          validateSection: validateSection,
          validateField: validateField
      };

      return service;

      function validateSchema(schema, callback) {
          var pass = true;
          //valid schema type, should be an {}
          if (typeof schema !== 'object') {
              pass = false;
              $log.log('Ensure you schema is a valid json object. Enclose it in {}');
          }
          //validate schema properties
          if (!schema.name || !schema.version || !schema.encounterType || !schema.form
              || !schema.processor || !schema.pages){
              pass = false;
              $log.log('Ensure you schema has all the 6 properties. You have provided this ' +
                'schema which is not complete::-->', schema);
          } else {
              //Validate structure of each properties
              _.each(schema.pages, function (page) {
                  validatePage(page, function (status) {
                     pass=status;
                  });
                  _.each(page.sections, function (section) {
                      validateSection(section, function (status) {
                          pass=status;
                      });
                      _.each(section.questions, function (field) {
                          validateField(field, function (status) {
                            pass=status;
                          });

                      });

                  });

              });
          }
          var result;
          if (pass==true){result='Pass'}else{result='Fail'}
          callback(result);

      }
      function validatePage(page, callback){
          var pass = true;
        //type validation
          if(typeof page !== 'object'){
            pass=false;
            $log.log('Your schema page is not an object, You have provided this -->', page);
            $log.log('instead it should be an object: {}');
          }
          if(pass===false) $log.error('Page Validation has Failed');
          if(pass===true) $log.info('Page Validation has Passed');
          callback(pass);
      }
      function validateSection(section, callback){
         var pass = true;
        //type validation
         if(typeof section !== 'object'){
            pass=false;
            $log.log('Your page section is not an object, You have provided this -->', section);
            $log.log('instead it should be an object:{}');
         }
         if(pass===false) $log.error('Section Validation has Failed');
         if(pass===true) $log.info('Section Validation has Passed');
         callback(pass);
      }
      function validateField(field, callback){
          var pass = true;
          //type validation
          if(typeof field !== 'object'){
            pass=false;
            $log.log('Your section question is not an object, You have provided this -->', section);
            $log.log('instead it should be an object:{}');
          }
        if(pass===false) $log.error('Field Validation has Failed');
          if(pass===true) $log.info('Field Validation has Passed');
          callback(pass);
      }

  }

})();

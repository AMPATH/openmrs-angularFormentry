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
        .factory('createFormService', createFormService);

  factory.$inject = [$log];

  function createFormService($log) {
    var fieldHandlers = {};

    //registerCoreFieldHandler
    fieldHandlers['obsFieldHandler'] = obsFieldHandler;
    fieldHandlers['encounterFieldHandler'] = encounterFieldHandler;
    fieldHandlers['obsPersonAttributeFieldHandler'] = obsFieldHandler;

    var service = {
      createForm: createForm
    };

    return service;

    function createForm(schema, model, callback) {
      var questionIndex = 0;
      var pages = schema.pages;
      var tab;
      var tabs = [];
      var field;
      var sectionFields = [];
      var pageFields = [];
      var sectionId = 0;
      var gpSectionRnd = 0; //this a random number for grp sections without an obs group
      var i = 0; //page id
      _.each(pages, function(page) {
        pageFields = [];
        _.each(page.sections, function(section) {
          sectionFields = [];
          //section fields
          _.each(section.questions, function(sectionField) {
            if (sectionField.type === 'encounterDate') {
              // call encounter handler
            } else if (sectionField.type === 'encounterLocation') {
              // call encounter handler
            } else if (sectionField.type === 'encounterProvider') {
              // call encounter handler
            } else if (sectionField.type === 'obs') {
                // call encounter handler
            } else if (sectionField.type === 'obsDrug') {
              // call encounter handler
            } else if (sectionField.type === 'conceptSearch') {
              // call encounter handler
            } else if (sectionField.type === 'obsProblem') {
              // call encounter handler
            } else if (sectionField.type === 'personAttribute') {
              // call encounter handler
            } else if (sectionField.type === 'locationAttribute') {
              // call encounter handler
            } else if (sectionField.type === 'obsGroup') {
              gpSectionRnd = gpSectionRnd + 1;
              field = createGroupFormlyField(sectionField, gpSectionRnd);
            } else if (sectionField.type === 'group_repeating') {
              gpSectionRnd = gpSectionRnd + 1;
              field = createRepeatingFormlyField(sectionField, gpSectionRnd);
            } else {
              field = createFormlyField(sectionField);
            }

            sectionFields.push(field);
          });
          //creating formly field section
          sectionId = sectionId  + 1;
          var sectionField =
          {
            key:'section_' + sectionId,
            type: 'section',
            templateOptions: {
              label:section.label
            },
            data:{
              fields:sectionFields
            }
          };

          pageFields.push(sectionField);
        });
        //create page fields
        tab = {
          title: page.label,
          form:{
            model:model,
            options:{},
            fields:pageFields
          }
        };
        if (i === 0) {
          tab.active = true;
        }

        tabs.push(tab);
        i = i + 1;
      });

      $log.info('this works fine');
    }

    function obsFieldHandler(_field) {
      $log.log('blala');
    }

    function encounterFieldHandler(_field) {
      $log.log('blala');
    }

    function obsPersonAttributeFieldHandler(_field) {
      console.log('blala');
    }
  }
})();

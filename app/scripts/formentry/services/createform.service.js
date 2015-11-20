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

  createFormService.$inject = ['$log', 'fieldHandlerService'];

  function createFormService($log, fieldHandlerService) {
    var service = {
      createForm: createForm
    };

    return service;

    function createForm(schema, model, callback) {
      var questionIndex = 0;
      var pages = schema.pages;
      var tabs = [];
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
             //creating formly fields
            var formlyField =createFormlyField(sectionField);
            if(formlyField) sectionFields.push(formlyField);
           });
             //creating formly section
             console.log('SectionFields--->>', sectionFields);
         pageFields.push(createFormlySection(sectionId, sectionFields,section.label));
         });
            //create formly tab
         tabs.push(createFormlyTab(pageFields,page.label,model, i));
         i++;
       });
        callback(tabs);
      $log.info('Formly form Created successfully',tabs );
    }

  /**
   * Create Form Helper Function
   * return formly field
   * @params includes @SectionFields, @pageField, etc.
   */
    function createFormlySection (sectionId, sectionFields,sectionLabel )
    {
      //creating formly field section
      sectionId ++;
      var sectionField =
      {
        key:'section_' + sectionId,
        type: 'section',
        templateOptions: {
          label:sectionLabel
        },
        data:{
          fields:sectionFields
        }
      };
      return sectionField;
    }
    function createFormlyTab(pageFields,pageLabel,model, i)
    {
      var tab = {
        title: pageLabel,
        form:{
          model:model,
          options:{},
          fields:pageFields
        }
      };
      if (i === 0)tab.active = true;
      return tab;
    }
    function createFormlyField(sectionField) {

        switch (sectionField.type)
        {
            case 'encounterDate':return  getFormlyField(sectionField,'encounterDateFieldHandler');
            case 'encounterLocation':return  getFormlyField(sectionField,'encounterLocationFieldHandler');
            case 'encounterProvider':return  getFormlyField(sectionField,'encounterProviderFieldHandler');
            case 'obs':return  getFormlyField(sectionField,'obsFieldHandlerFieldHandler');
            case 'obsDrug':return  getFormlyField(sectionField,'obsDrugFieldHandler');
            case 'conceptSearch':return  getFormlyField(sectionField,'conceptSearchFieldHandler');
            case 'obsProblem':return  getFormlyField(sectionField,'obsProblemFieldHandler');
            case 'personAttribute':return  getFormlyField(sectionField,'personAttributeFieldHandler');
            case 'locationAttribute':return  getFormlyField(sectionField,'locationAttributeFieldHandler');
            case 'obsGroup':return  getFormlyField(sectionField,'obsGroupFieldHandler');
            case 'group_repeating':return  getFormlyField(sectionField,'group_repeatingFieldHandler');
            default:return  getFormlyField(sectionField,'defaultFieldHandler')
        }
   }
    function getFormlyField(sectionField,handlerName){
        var fieldHandler =fieldHandlerService.getFieldHandler(handlerName);
        return fieldHandler(sectionField);
    }
  }
})();

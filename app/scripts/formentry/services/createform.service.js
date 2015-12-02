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
      .factory('CreateFormService', CreateFormService);

  CreateFormService.$inject = ['$log', 'FieldHandlerService'];
  function CreateFormService($log, fieldHandlerService) {
    var service = {
      createForm: createForm
    };

    return service;

    function createForm(schema, model, callback) {
      var form;
      form =  _createFormlyForm(schema);
      $log.debug('inspect compiled', form);
      var formlyForm = _createModel(form, model);
      callback(formlyForm);
    }

    function _createSectionId(seectionName) {
      return seectionName.replace(/ /gi, '_');
    }

    function _createFormlyForm(schema) {
      var compiledSchema = [];
      var questionMap = {};
      var pageFields = [];

      _.each(schema.pages, function(page) {
        var compiledPage = [];
        _.each(page.sections, function(section) {
          var sectionModel = {};
          var fields = [];
          var sectionId;
          _createFieldsFactory(section.questions, fields, sectionModel, questionMap);
          sectionId = _createSectionId(section.label);
          $log.debug('Secion ID: ', sectionId);
          var sectionField =
          {
            key:'section_' + sectionId,
            type: 'section',
            templateOptions: {
              label:section.label
            },
            data:{
              fields:fields
            }
          };
          // model['section_' + sectionId] = sectionModel;
          pageFields.push(sectionField);
          compiledPage.push({section:section, formlyFields:sectionField, sectionModel:sectionModel});
        });

        compiledSchema.push({page:page,compiledPage:compiledPage});
      });

      return ({compiledSchema:compiledSchema,questionMap:questionMap});
    }

    function _createModel(form, model) {
      var tabs = [];
      _.each(form.compiledSchema, function(page) {
        tabs.push(
          {
            title: page.page.label,
            form: {
              options: {},
              model: model,
              fields: _generateFormlySections(page.compiledPage)
            }
          }
        );

        _.each(page.compiledPage, function(section) {
          var sectionId = _createSectionId(section.section.label);
          model['section_' + sectionId] = section.sectionModel;
        });
      });

      return tabs;
    }

    function _generateFormlySections(compiledPage) {
      var fields = [];
      var field;
      _.each(compiledPage, function(section) {
        fields.push(section.formlyFields);
      });

      return fields;
    }

    function _createFieldsFactory(questions, fields, model, questionMap) {
      for (var i in questions) {
        var question = questions[i];
        var handlerName;
        var handlerMethod;
        var modelType = question.type;

        if (question.type === 'obs') {
          handlerMethod = fieldHandlerService.getFieldHandler('obsFieldHandler');
          $log.debug('about to create: ', question);
          var field = handlerMethod(question, model, questionMap);
          $log.debug('Field Created', field);
          if (angular.isArray(field)) {
            _.each(field, function(f) {
                fields.push(f);
              });
          } else {
            fields.push(field);
          }

        } else if (question.type === 'obsGroup') {
          var fieldsArray = [];
          // model.obsGroup;
          // model['obsGroup' + '_' + question.label] = {};
          var groupModel;
          var obsField = {};
          var groupId = _createSectionId(question.label);
          if (question.questionOptions.rendering === 'group') {
            model['obsGroup' + '_' + groupId] = {};
            groupModel =  model['obsGroup' + '_' + groupId];
            groupModel.groupConcept = question.questionOptions.concept;
            obsField = {
              className: 'row',
              key:'obsGroup' + '_' + groupId,
              fieldGroup:fieldsArray
            };
            _createFieldsFactory(question.questions, fieldsArray,
              groupModel, questionMap);
            fields.push(obsField);
          } else if (question.questionOptions.rendering === 'repeating') {
            model['obsRepeating' + '_' + groupId] = [];
            groupModel =  {};
            groupModel.groupConcept = question.questionOptions.concept;
            obsField = {
              type: 'repeatSection',
              key:'obsRepeating' + '_' + groupId,
              templateOptions: {
                label:question.label,
                btnText:'Add',
                fields:[
                  {
                    className: 'row',
                    fieldGroup:fieldsArray
                  }
                ]
              }
            };
            _createFieldsFactory(question.questions, fieldsArray,
              groupModel, questionMap);
            //convert to array
            var updateRepeatModel = [];
            updateRepeatModel.push(groupModel);

            model['obsRepeating' + '_' + groupId] = updateRepeatModel;
            fields.push(obsField);
          }

        } else {
          handlerMethod = fieldHandlerService.getFieldHandler('defaultFieldHandler');
          var field = handlerMethod(question, model, questionMap);

          if (angular.isArray(field)) {
            _.each(field, function(f) {
              fields.push(f);
            });
          } else {
            fields.push(field);
          }
        }
      }

      return fields;
    }

  }
})();

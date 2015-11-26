/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
 */
/*
 jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
 */
(function () {
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

    function _createFormlyForm(schema) {
      var compiledSchema = [];
      var questionMap = {};
      var pageFields = [];

      _.each(schema.pages, function(page) {
        var compiledPage = [];
        _.each(page.sections, function(section) {
          var sectionModel = {};
          var fields = [];
          _createFieldsFactory(section.questions, fields, sectionModel, questionMap);
          var sectionField =
          {
            key:'section_' + section.label,
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
          model['section_' + section.section.label] = section.sectionModel;
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
          if (question.questionOptions.rendering === 'group') {
            model['obsGroup' + '_' + question.label] = {};
            groupModel =  model['obsGroup' + '_' + question.label];
            groupModel.groupConcept = question.questionOptions.concept;
            obsField = {
              className: 'row',
              key:'obsGroup' + '_' + question.label,
              fieldGroup:fieldsArray
            };
            _createFieldsFactory(question.questions, fieldsArray,
              groupModel, questionMap);
            fields.push(obsField);
          } else if (question.questionOptions.rendering === 'repeating') {
            model['obsRepeating' + '_' + question.label] = [];
            groupModel =  {};
            groupModel.groupConcept = question.questionOptions.concept;
            obsField = {
              type: 'repeatSection',
              key:'obsRepeating' + '_' + question.label,
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

            model['obsRepeating' + '_' + question.label] = updateRepeatModel;
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
        }}}

        function _createFormlyForm(schema) {
            var compiledSchema = [];
            var questionMap = {};
            var pageFields = [];

            _.each(schema.pages, function (page) {
                var compiledPage = [];
                _.each(page.sections, function (section) {
                    var sectionModel = {};
                    var fields = [];
                    _createFieldsFactory(section.questions, fields, sectionModel, questionMap);
                    var sectionField =
                            {
                                key: section.label,
                                type: 'section',
                                templateOptions: {
                                    label: section.label
                                },
                                data: {
                                    fields: fields
                                }
                            };
                    // model['section_' + sectionId] = sectionModel;
                    pageFields.push(sectionField);
                    compiledPage.push({section: section, formlyFields: sectionField, sectionModel: sectionModel});
                });

                compiledSchema.push({page: page, compiledPage: compiledPage});
            });

            return ({compiledSchema: compiledSchema, questionMap: questionMap});
        }

        function _createModel(form, model) {
            var tabs = [];
            _.each(form.compiledSchema, function (page) {
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
                _.each(page.compiledPage, function (section) {
                    model[section.section.label] = section.sectionModel;
                });
            });

            return tabs;
        }

        function _generateFormlySections(compiledPage) {
            var fields = [];
            var field;
            _.each(compiledPage, function (section) {
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
                        _.each(field, function (f) {
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
                    if (question.questionOptions.rendering === 'group') {
                        model['obsGroup' + '_' + question.label] = {};
                        groupModel = model['obsGroup' + '_' + question.label];
                        obsField = {
                            className: 'row',
                            key: 'obsGroup' + '_' + question.label,
                            fieldGroup: fieldsArray
                        };
                        _createFieldsFactory(question.questions, fieldsArray,
                                groupModel, questionMap);
                        fields.push(obsField);
                    } else if (question.questionOptions.rendering === 'repeating') {
                        model['obsRepeating' + '_' + question.label] = [];
                        groupModel = {};
                        obsField = {
                            type: 'repeatSection',
                            key: 'obsRepeating' + '_' + question.label,
                            templateOptions: {
                                label: question.label,
                                btnText: 'Add',
                                fields: [
                                    {
                                        className: 'row',
                                        fieldGroup: fieldsArray
                                    }
                                ]
                            }
                        };
                        _createFieldsFactory(question.questions, fieldsArray,
                                groupModel, questionMap);
                        //convert to array
                        var updateRepeatModel = [];
                        $log.debug('Model Just before update', Object.keys(groupModel));
                        updateRepeatModel.push(groupModel);

                        model['obsRepeating' + '_' + question.label] = updateRepeatModel;
                        fields.push(obsField);
                    }

                } else {
                    handlerMethod = fieldHandlerService.getFieldHandler('defaultFieldHandler');
                    $log.debug('About to create field: ', question);
                    var field = handlerMethod(question, model, questionMap);
                    $log.debug('Field Created', field);
                    if (angular.isArray(field)) {
                        _.each(field, function (f) {
                            fields.push(f);
                        });
                    } else {
                        fields.push(field);
                    }
                }
            }

            return fields;
        }
    }}
)();

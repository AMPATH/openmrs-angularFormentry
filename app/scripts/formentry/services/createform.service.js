/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('CreateFormService', CreateFormService);

    CreateFormService.$inject = ['$log', 'OpenmrsFieldHandlerService'];

    function CreateFormService($log, OpenmrsFieldHandler) {
        var service = {
            createForm: createForm
        };

        return service;

        function createForm(schema, model) {
            var form;
            form = _createFormlyForm(schema);
            $log.debug('inspect compiled', form);
            var formlyForm = _createModel(form, model);
            form.questionMap.model = model;
            return {
                formlyForm: formlyForm,
                questionMap: form.questionMap
            };
        }

        function _createSectionId(seectionName) {
            return seectionName.replace(/ /gi, '_');
        }

        function _createFormlyForm(schema) {
            var compiledSchema = [];
            var questionMap = {};
            var pageFields = [];

            _.each(schema.pages, function (page) {
                var compiledPage = [];
                _.each(page.sections, function (section) {
                    var sectionModel = {};
                    var fields = [];
                    var sectionId;
                    _createFieldsFactory(section.questions, fields, sectionModel, questionMap);
                    sectionId = _createSectionId(section.label);
                    $log.debug('Secion ID: ', sectionId);
                    var sectionField = {
                        key: 'section_' + sectionId,
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
                    compiledPage.push({
                        section: section,
                        formlyFields: sectionField,
                        sectionModel: sectionModel
                    });
                });

                compiledSchema.push({
                    page: page,
                    compiledPage: compiledPage
                });
            });

            return ({
                compiledSchema: compiledSchema,
                questionMap: questionMap
            });
        }

        function _createModel(form, model) {
            var tabs = [];
            _.each(form.compiledSchema, function (page) {
                tabs.push({
                    title: page.page.label,
                    form: {
                        options: {},
                        model: model,
                        fields: _generateFormlySections(page.compiledPage)
                    }
                });

                _.each(page.compiledPage, function (section) {
                    var sectionId = _createSectionId(section.section.label);
                    model['section_' + sectionId] = section.sectionModel;
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
    
        //Add form information to Model
        function __addFormInfoToModel(schema, model) {
            model.form_info = {
                name: schema.name,
                version: schema.version
            };

            if (schema.encounterType) {
                model.form_info.encounterType = schema.encounterType;
            }

            if (schema.form) {
                model.form_info.form = schema.form;
            }
        }

        function _createFieldsFactory(questions, fields, model, questionMap) {
            for (var i in questions) {
                var question = questions[i];
                var handlerName;
                var handlerMethod;
                var modelType = question.type;

                if (question.type === 'obs') {
                    handlerMethod = OpenmrsFieldHandler.getFieldHandler('obsFieldHandler');
                    // $log.debug('about to create: ', question);
                    var field = handlerMethod(question, model, questionMap);
                    // $log.debug('Field Created', field);
                    if (angular.isArray(field)) {
                        _.each(field, function (f) {
                            fields.push(f);
                        });
                    } else {
                        fields.push(field);
                        fields.push({
                            key: 'historical-text-val',
                            type: 'historical-text',
                            templateOptions: {
                                parentFieldKey: field.key,
                                parentFieldModel: model,
                                parentField: field
                            }
                        });
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
                        groupModel = model['obsGroup' + '_' + groupId];
                        groupModel.groupConcept = question.questionOptions.concept;
                        obsField = {
                            className: 'row',
                            key: 'obsGroup' + '_' + groupId,
                            fieldGroup: fieldsArray,
                            data: {
                                concept: question.questionOptions.concept
                            },
                        };
                        _createFieldsFactory(question.questions, fieldsArray,
                            groupModel, questionMap);

                        if (obsField['templateOptions'] === undefined) {
                            obsField['templateOptions'] = {};
                        }

                        obsField['templateOptions']['createModelBluePrint'] =
                        function (parentModel, value) {
                            var groupModel = OpenmrsFieldHandler.createModelForGroupSection(parentModel,
                                obsField.key, question, question.questionOptions.concept);

                            _.each(obsField.fieldGroup, function (field) {
                                if (field.templateOptions &&
                                    typeof field.templateOptions.createModelBluePrint === 'function') {
                                    field.templateOptions.createModelBluePrint(groupModel,
                                        value[0][field.data.concept]);
                                }
                            });
                            return groupModel;
                        };

                        obsField['templateOptions']['getDisplayValue'] =
                        function (values, callback) {
                            var displayTest = '';
                            _.each(values, function (value) {
                                displayTest = displayTest + obsField.label + "[ ";

                                _.each(obsField.fieldGroup, function (field) {
                                    if (field.templateOptions &&
                                        typeof field.templateOptions.getDisplayValue === 'function') {
                                        field.templateOptions.getDisplayValue(
                                            value[field.data.concept],
                                            function (display) {
                                                displayTest = displayTest + display + ', ';
                                            });
                                    }
                                });


                                displayTest = displayTest + " ] ";
                            });
                            callback(displayTest);
                        };
                        fields.push(obsField);
                    } else if (question.questionOptions.rendering === 'repeating') {
                        model['obsRepeating' + '_' + groupId] = [];
                        groupModel = {};
                        groupModel.groupConcept = question.questionOptions.concept;
                        obsField = {
                            type: 'repeatSection',
                            key: 'obsRepeating' + '_' + groupId,
                            data: {
                                concept: question.questionOptions.concept
                            },
                            templateOptions: {
                                label: question.label,
                                btnText: 'Add',
                                fields: [{
                                    className: 'row',
                                    fieldGroup: fieldsArray
                                }]
                            }
                        };
                        _createFieldsFactory(question.questions, fieldsArray,
                            groupModel, questionMap);
                        
                        OpenmrsFieldHandler.handleHistoricalExpressionProperty(obsField, question);    

                        if (typeof obsField['templateOptions']['setFieldValue'] !== 'function') {
                            obsField['templateOptions']['setFieldValue'] = OpenmrsFieldHandler.fillGroups;
                        }
                        obsField['templateOptions']['createModelBluePrint'] =
                        function (parentModel, values) {
                            var repeatingGroupModel = [];
                            _.each(values, function (value) {

                                var groupModel = OpenmrsFieldHandler.createModelForGroupSection(null,
                                    obsField.key, question, question.questionOptions.concept);
                                _.each(obsField.templateOptions.fields, function (field) {
                                    _.each(field.fieldGroup, function (innerfield) {
                                        if (innerfield.templateOptions &&
                                            typeof innerfield.templateOptions.createModelBluePrint === 'function') {
                                            innerfield.templateOptions.createModelBluePrint(groupModel,
                                                value[innerfield.data.concept]);
                                        }
                                    });
                                });
                                repeatingGroupModel.push(groupModel);
                            });
                            if (parentModel) {
                                parentModel[obsField.key] = repeatingGroupModel;
                            }
                            return repeatingGroupModel;
                        };

                        obsField['templateOptions']['getDisplayValue'] =
                        function (values, callback) {
                            var displayTest = '';
                            _.each(values, function (value) {
                                displayTest = displayTest + question.label + "[ ";
                                _.each(obsField.templateOptions.fields, function (field) {
                                    displayTest = displayTest + "(";
                                    _.each(field.fieldGroup, function (innerfield) {
                                        if (innerfield.templateOptions &&
                                            typeof innerfield.templateOptions.getDisplayValue === 'function') {
                                            innerfield.templateOptions.getDisplayValue(
                                                value[innerfield.data.concept],
                                                function (display) {
                                                    displayTest = displayTest + display + ', ';
                                                });
                                        }
                                    });

                                    displayTest = displayTest + " ) ";
                                });
                                displayTest = displayTest + " ], ";
                            });
                            callback(displayTest);
                        };
                        
                        //convert to array
                        var updateRepeatModel = [];
                        updateRepeatModel.push(groupModel);

                        model['obsRepeating' + '_' + groupId] = updateRepeatModel;
                        fields.push(obsField);
                        fields.push({
                            key: 'historical-text-val',
                            type: 'historical-text',
                            templateOptions: {
                                parentFieldKey: obsField.key,
                                parentFieldModel: model,
                                parentField: obsField
                            }
                        });
                    }

                } else if (question.type.startsWith('encounter')) {
                    handlerMethod = OpenmrsFieldHandler.getFieldHandler(question.type + 'FieldHandler');
                    var field = handlerMethod(question, model, questionMap);
                    fields.push(field);

                } else if (question.type.startsWith('personAttribute')) {
                    handlerMethod = OpenmrsFieldHandler.getFieldHandler('personAttributeFieldHandler');
                    var field = handlerMethod(question, model, questionMap);
                    fields.push(field);

                } else {
                    handlerMethod = OpenmrsFieldHandler.getFieldHandler('defaultFieldHandler');
                    var field = handlerMethod(question, model, questionMap);

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

    }
})();

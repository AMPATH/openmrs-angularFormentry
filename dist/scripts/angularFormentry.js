/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry', [
          'ngMessages',
          'ngResource',
          'formly',
          'formlyBootstrap',
          'ui.bootstrap',
          'ui.bootstrap.datetimepicker',
	        'ui.select'
        ]);
})();

/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
 */
/*
 jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
 */


/*
 algorithm for populating model with existing data:
 1. the result from openmrs provides a concept uuid. therefore, the concept uuid should be used to create the key.
 2. look for all keys in the model that "contain" the uuid. we must assume there is no order to questions on the same level. so if a question twice, we fill the answer with the first empty field. We determine if a field is not-empty by the presence of an "initialValue" property in the field.data array which is not undefined.
 3. if empty, set field.data.initialValue.
 4. If non-empty, keep looking for another a question.
 5. If the question is a repeating_field, then add the answer to the array modeling that repeating field. This means that a form should only have a single repeating field on the same schema "level" as it's not possible to know if the nth obs in an existing encounter belongs to either a repeating element or another question with the same uuid.
 6.
 */
(function() {
  'use strict';



  angular
    .module('openmrs.angularFormentry')
    .factory('TestService', TestService);

  TestService.$inject = ['$log'];

  function TestService($log) {
    var _ = window._;
    var service = {
      "getCompiledForm" : getCompiledForm,
      "toFormlySections": toFormlySections
    };


    /*
     algorithm for populating model with existing data:
     1. the result from openmrs provides a concept uuid. therefore, the concept uuid should be used to create the key.
     2. look for all keys in the model that "contain" the uuid. we must assume there is no order to questions on the same level. so if a question twice, we fill the answer with the first empty field. We determine if a field is not-empty by the presence of an "initialValue" property in the field.data array which is not undefined.
     3. if empty, set field.data.initialValue.
     4. If non-empty, keep looking for another a question.
     5. If the question is a repeating_field, then add the answer to the array modeling that repeating field. This means that a form should only have a single repeating field on the same schema "level" as it's not possible to know if the nth obs in an existing encounter belongs to either a repeating element or another question with the same uuid.
     6.
     */


    service.schema =
    {
      name:"",
      uuid:"",
      processor:"",
      "pages": [
        {
          "label": "Encounter Details",
          "sections": [
            {
              "label": "Encounter Details",

              "questions": [
                {
                  "concept": "a8b02524-1350-11df-a1f1-0026b9348838",
                  "label": "Patient covered by NHIF:",
                  "modelType":"obsType",
                  "type": "select",
                  "questionOptions":{
                    "repeating":true
                  },
                  "answers": [
                    {
                      "concept": "8b715fed-97f6-4e38-8f6a-c167a42f8923",
                      "label": "Yes"
                    },
                    {
                      "concept": "a899e0ac-1350-11df-a1f1-0026b9348838",
                      "label": "No"
                    }
                  ],
                  "validators": []
                },
                {
                  "concept": "a89ff9a6-1350-11df-a1f1-0026b9348838",
                  "modelType":"obsType",
                  "label": "Was this visit scheduled?",
                  "id": "scheduledVisit",
                  "answers": [
                    {
                      "concept": "a89b6440-1350-11df-a1f1-0026b9348838",
                      "label": "Scheduled visit"
                    },
                    {
                      "concept": "a89ff816-1350-11df-a1f1-0026b9348838",
                      "label": "Unscheduled Visit Early"
                    },
                    {
                      "concept": "a89ff8de-1350-11df-a1f1-0026b9348838",
                      "label": "Unscheduled Visit Late"
                    }
                  ],
                  "type": "select",
                  "validators": []
                },
                {
                  "modelType":"obsType",
                  "concept": "dc1942b2-5e50-4adc-949d-ad6c905f054e",
                  "label": "If Unscheduled, actual scheduled date",
                  "id": "q7b",
                  "type": "date",
                  "validators": [
                    {
                      "type": "date",
                      "allowFutureDates": "true"
                    },
                    {
                      "type": "js_expression",
                      "failsWhenExpression": "!isEmpty(scheduledVisit) && arrayContains(['a89ff816-1350-11df-a1f1-0026b9348838','a89ff8de-1350-11df-a1f1-0026b9348838'], scheduledVisit) && isEmpty(myValue)",
                      "message": "Patient visit marked as unscheduled. Please provide the scheduled date."
                    },
                    {
                      "type": "conditionalRequired",
                      "message": "Patient visit marked as unscheduled. Please provide the scheduled date.",
                      "referenceQuestionId": "scheduledVisit",
                      "referenceQuestionAnswers": [
                        "a89ff816-1350-11df-a1f1-0026b9348838",
                        "a89ff8de-1350-11df-a1f1-0026b9348838"
                      ]
                    }
                  ],
                  "disableExpression": [
                    {
                      "disableWhenExpression": "!arrayContains(['a89ff816-1350-11df-a1f1-0026b9348838','a89ff8de-1350-11df-a1f1-0026b9348838'], scheduledVisit)"
                    }
                  ]
                },
                {
                  "modelType":"obsType",
                  "concept": "a8a003a6-1350-11df-a1f1-0026b9348838",
                  "type": "group_repeating",
                  "label": "Was patient hospitalized?",
                  "questionOptions": {
                    "repeating":true
                  },
                  "questions": [
                    {
                      "modelType":"obsType",
                      "concept": "a8a07a48-1350-11df-a1f1-0026b9348838",
                      "label": "Reason for hospitalization",
                      "type": "problem",
                      "id":"hospitalizationReason",
                      "validators": [
                        {
                          "type": "conditionalAnswered",
                          "message": "Providing diagnosis but didn't answer that patient was hospitalized in question 11a",
                          "referenceQuestionId": "wasHospitalized",
                          "referenceQuestionAnswers": [
                            "a899b35c-1350-11df-a1f1-0026b9348838"
                          ]
                        }
                      ]
                    },
                    {
                      "modelType":"obsType",
                      "concept":"made-up-concept",
                      "label": "Date of hospitalization",
                      "type":"input",
                      "questions": [
                        {
                          "modelType":"obsType",
                          "concept":"made-up-concept-2",
                          "label": "Start Date",
                          "type":"input"
                        },
                        {
                          "modelType":"obsType",
                          "concept":"made-up-concept-3",
                          "label": "End Date",
                          "type":"input"
                        }

                      ]
                    }
                  ]
                }

              ]
            },
            {
              "label":"Test Section",
              "questions": [
                {
                  "modelType": "obsType",
                  "concept": "a8a003a6-1350-11df-a1f1-0026b9348838",
                  "type": "group_repeating",
                  "label": "Was patient hospitalized?",
                  "questions": [
                    {
                      "modelType": "obsType",
                      "concept": "a8a07a48-1350-11df-a1f1-0026b9348838",
                      "label": "Reason for hospitalization",
                      "type": "problem",
                      "id": "hospitalizationReason",
                      "validators": [
                        {
                          "type": "conditionalAnswered",
                          "message": "Providing diagnosis but didn't answer that patient was hospitalized in question 11a",
                          "referenceQuestionId": "wasHospitalized",
                          "referenceQuestionAnswers": [
                            "a899b35c-1350-11df-a1f1-0026b9348838"
                          ]
                        }
                      ]
                    },
                    {
                      "modelType": "obsType",
                      "concept": "made-up-concept",
                      "label": "Date of hospitalization",
                      "type": "input",
                      "questions": [
                        {
                          "modelType": "obsType",
                          "concept": "made-up-concept-2",
                          "label": "Start Date",
                          "type": "input"
                        },
                        {
                          "modelType": "obsType",
                          "concept": "made-up-concept-3",
                          "label": "End Date",
                          "type": "input"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    var modelType = {
      createFormlyField: function(schemaQuestion) {
      },
      setModelValue: function(model,schemaQuestion) {},
      getModelValue: function(model,schemaQuestion) {}
    };


    /*
     schema rules
     0. A question can on be asked once on a common level of a particular branch. In other words, you can not ask, "Are you on ARVs?" in more than one place on the form unless the question is nested within another question (and that question does not already ask the question).
     1. A question can be asked have multiple answers only if it is of an appropriate type, e.g. "group_repeating", "multi-checkbox"
     2. A question can have unlimited levels of nested questions.
     */


    var modelTypes = {
      "obsType":obsTypeToFormlyField
    };


//each uuid only allowed to occur once per level.
//for convenience, make each key point to an array. if the schema allows, this will have multiple objects, or just one if not allowed to //repeat.
    function obsTypeToFormlyField(question,model) {
      var key = 'value';
      var field = {key:key};
//      var m = {concept:question.concept,schemaQuestion: question, formlyField:field,value:""};
      var m = {concept:question.concept,schemaQuestion: question, value:""};
//      var m = {concept:question.concept,value:""};
      field.templateOptions = {
        type: 'text',
        label: question.label,
      };

      if("questions" in question) {
        m.obsGroup = {};
        field.type = "section";
        field.data = {"recursiveModel":m.obsGroup};
      }
      else {
        field.type = "input"; //TEMPORARY: This needs to reflect the actual type
      }
      if(question.concept in model) { //add m to the array
        model[question.concept].push(m);
      }
      else { //create array with just m
        model[question.concept] = [m];
      }

      field.model = m;
      return field;
    }


    function questionsToFormlyFields(questions,fields,model,questionMap) {
      for(var i in questions) {
        var question = questions[i];
        var modelType = question.modelType;

        //Not the best solution but a quick attempt to generalize how to get a type and produce a field
        var field = modelTypes[modelType](question,model);

        if("id" in question) {
          if(question.id in questionMap) {
            questionMap[question.id].push(field);
          }
          else {
            questionMap[question.id] = [field];
          }

        }

        fields.push(field);
        if("questions" in question) {
          //if(fields.data === undefined) field.data = {"fields":[]};
          field.data.fields = [];
          questionsToFormlyFields(question.questions,field.data.fields,field.data.recursiveModel,questionMap);
        }


      };
      return fields;

    }

    /*
     This function allows you to clone a question schema and insert it into the fields array
     at a specific index.
     index: the location in the fields array at which point this field is to be inserted
     question : the json schema of this particular question
     fields : the array of formly fields into which this new field will be inserted
     model : this model maps to the same level as fields. In other words, it should be the
             the model which contains the models for each of the fields. More specifically
             it is NOT the model for a specific field.
     questionMap : a hash linking user specified id's (from the schema) to formly fields
     */
    function insertIntoFormlyFields(index,question,fields,model,questionMap) {

      if(index === undefined || index === null) index = fields.length - 1;

      var modelType = question.modelType;
      //Not the best solution but a quick attempt to generalize how to get a type and produce a formly field
      var field = modelTypes[modelType](question, model);

      if("id" in question) {
        if(question.id in questionMap) {
          questionMap[question.id].push(field);
        }
        else {
          questionMap[question.id] = [field];
        }

      }


      var front = _.slice(fields,0,index);
      var back = _.slice(fields,index);

      front.push(field);
      _.remove(fields); //this strategy used to maintain reference of fields array.
      Array.prototype.push.apply(fields,front);

      if ("questions" in question) {
        //the last model will be the one just created
        var nestedFields = [];
        field.data.fields = [];
        //questionsToFormlyFields(question.questions, nestedFields, field.data.recursiveModel, questionMap);
        questionsToFormlyFields(question.questions, field.data.fields, field.data.recursiveModel, questionMap);
        //Array.prototype.push.apply(fields,nestedFields);
      }
      Array.prototype.push.apply(fields,back);
    }


    function schemaToFormlyForm(schema) {
      var compiledSchema = [];
      var questionMap = {};

      _.each(schema.pages,function(page) {
        var compiledPage = [];
        _.each(page.sections,function(section) {
          var sectionModel = {};
          var fields = [];
          questionsToFormlyFields(section.questions,fields,sectionModel,questionMap);
          compiledPage.push({section:section,formlyFields:fields,sectionModel:sectionModel});
        });
        compiledSchema.push({page:page,compiledPage:compiledPage});
      });

      return {compiledSchema:compiledSchema,questionMap:questionMap};
    }


//uses question.type to determine if this can be asked more than once.
    function allowsRepeating(question) {
      return (question.questionOptions !== undefined && question.questionOptions.repeating);
    }



//obs payload
    var obsRestPayload =
      [
        {concept:"a8b02524-1350-11df-a1f1-0026b9348838",value:"value1",obsId:"1"},
        {concept:"a8a003a6-1350-11df-a1f1-0026b9348838",obsId:"2","obsGroup": [{obsId:"3","concept":"a8a07a48-1350-11df-a1f1-0026b9348838","value":"value3"}]}
      ];

    var obsRestPayloadRepeatingObs =
      [
        {concept:"a8b02524-1350-11df-a1f1-0026b9348838",value:"value1",obsId:"1"},
        {concept:"a8b02524-1350-11df-a1f1-0026b9348838",value:"a repeat",obsId:"5"},
        {concept:"a8a003a6-1350-11df-a1f1-0026b9348838",obsId:"2","obsGroup": [{obsId:"3","concept":"a8a07a48-1350-11df-a1f1-0026b9348838","value":"value3"}]}
      ];

    var obsRestPayloadRepeatingObsGroup =
      [
        {concept:"a8b02524-1350-11df-a1f1-0026b9348838",value:"value1",obsId:"1"},
        {concept:"a8b02524-1350-11df-a1f1-0026b9348838",value:"a repeat",obsId:"5"},
        {concept:"a8a003a6-1350-11df-a1f1-0026b9348838",obsId:"2",
          "obsGroup": [
            {obsId:"3","concept":"a8a07a48-1350-11df-a1f1-0026b9348838","value":"value3"},
            {obsId:"53","concept":"a8a07a48-1350-11df-a1f1-0026b9348838","value":"hello erick"}
          ]
        },
        {concept:"a8a003a6-1350-11df-a1f1-0026b9348838",obsId:"10","obsGroup": [{obsId:"11","concept":"a8a07a48-1350-11df-a1f1-0026b9348838","value":"value43"}]}
      ];

    service.payload = obsRestPayloadRepeatingObsGroup;

    function isEmpty(value) {
      return (value === null || value === undefined || value === "");
    }

    function getFormlyFieldByModelKey(key,value,formlyFields,mustBeEmpty) {
      var field,f;
      var index = 0;
      for(var i=0; i< formlyFields.length;i++) {
        f = formlyFields[i];

        if(f.model[key] === value) {
          if ((mustBeEmpty && isEmpty(f.model.initialValue)) || mustBeEmpty === false) {
            field = f;
            index = i;
          }
        }
      }
      return {"field":field,"index":index};
    }


//A question may only be asked once per section. It may be allowed to have multiple answers.
//This means that we can use the concept uuid as the key and in the model, use an array to hold multiple answers.
//OpenMRS does not support ordering to the way these questions are answered. i.e. if there are multiple obs with the same concept,
//you can not know by looking at the database the order of these obs's.
//returns true if found and populated


    function addObsToFormlyField(obs,field,questionMap) {
      field.model.value = obs.value;
      field.model.obsId = obs.obsId;
      field.model.initialValue = obs.value;
      _.each(obs.obsGroup,function(o) {
        addObsToSection(o,field.data.fields,field.model.obsGroup,questionMap);
      });
    }


    function addObsToSection(o,formlyFields,sectionModel,questionMap) {
      var field;
      var questionModel = sectionModel[o.concept];
      var schemaQuestion = questionModel[0].schemaQuestion;

      if(questionModel[0].obsId === undefined ) {
        field = getFormlyFieldByModelKey("concept",o.concept,formlyFields,true).field;
      }
      else if(allowsRepeating(schemaQuestion)) {
        var index = 1 + getFormlyFieldByModelKey("concept", o.concept,formlyFields,true).index;
        insertIntoFormlyFields(index,schemaQuestion,formlyFields,sectionModel,questionMap);
        field = formlyFields[index];
      }

      //console.log("found field:",field);
      if(field) {
        addObsToFormlyField(o, field, questionMap);
        return true;
      }
      else {
        $log.debug("NO FIELD FOUND FOR OBS: ",o);
        return false;
      }
    }


    function addExistingObsSetToForm(form,restObs) {
      var found,pageResult,sectionResult,curPage, curSection,page, section;
      _.each(restObs,function(o) {
        found = false;
        curPage = 0;
        while (!found && curPage < form.compiledSchema.length) {
          page = form.compiledSchema[curPage];
          curSection = 0;
          while (!found && curSection < page.compiledPage.length) {
            section = page.compiledPage[curSection];
            _.find(section.sectionModel, function (questionModel) {
              if (o.concept === questionModel[0].concept) {
                found = addObsToSection(o, section.formlyFields, section.sectionModel, form.questionMap);
              }
              return found;
            });
            curSection += 1;
          }
          curPage += 1
        }
      });
    }

    function toFormlySections(compiledPage) {
      var fields = [];
      var field;
      _.each(compiledPage,function(section){
        field = {
          key: section.section.label,
          type: 'section',
          templateOptions: {
            label: section.section.label
          },
          data: {fields: section.formlyFields}
        };

        fields.push(field);
      });
      return fields;

    }

    function getCompiledForm(schema,payload) {
      if(schema) this.schema = schema;
      if(payload) this.payload = payload;
      var form = schemaToFormlyForm(this.schema);
      // console.log(payload);
      // addExistingObsSetToForm(form,this.payload);

      console.log(form);
      window.form = form;
      return form;
    }


    return service;
  }
})();

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
        .factory('FormEntry', FormEntry);

  FormEntry.$inject = ['createFormService', '$log', 'fieldHandlerService'];

  function FormEntry(createFormService, $log, fieldHandlerService) {

    var service = {
          createForm: createForm,
          registerCustomFieldHandler: registerCustomFieldHandler
        };

    return service;

    function registerCustomFieldHandler(_handlerName, _handlerMethod) {
      if (typeof _handlerMethod === 'function') {
        fieldHandlerService
        .registerCustomFieldHandler(_handlerName, _handlerMethod);
      } else {
        $log.info('Handler was not registered!!');
      }
    }

    function createForm(schema, model, callback) {
      var testMethod = fieldHandlerService.getFieldHandler('obsFieldHandler');
      $log.info('successfully called', testMethod);
      // testMethod('22');
    }

  }
})();

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
            .factory('createFormService', createFormService);

    createFormService.$inject = ['$log'];

    function createFormService($log) {
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
            // _.each(pages, function(page) {
            //   pageFields = [];
            //   _.each(page.sections, function(section) {
            //     sectionFields = [];
            //     //section fields
            //     _.each(section.questions, function(sectionField) {
            //       if (sectionField.type === 'encounterDate') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'encounterLocation') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'encounterProvider') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'obs') {
            //           // call encounter handler
            //       } else if (sectionField.type === 'obsDrug') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'conceptSearch') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'obsProblem') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'personAttribute') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'locationAttribute') {
            //         // call encounter handler
            //       } else if (sectionField.type === 'obsGroup') {
            //         gpSectionRnd = gpSectionRnd + 1;
            //         field = createGroupFormlyField(sectionField, gpSectionRnd);
            //       } else if (sectionField.type === 'group_repeating') {
            //         gpSectionRnd = gpSectionRnd + 1;
            //         field = createRepeatingFormlyField(sectionField, gpSectionRnd);
            //       } else {
            //         field = createFormlyField(sectionField);
            //       }
            //
            //       sectionFields.push(field);
            //     });
            //     //creating formly field section
            //     sectionId = sectionId  + 1;
            //     var sectionField =
            //     {
            //       key:'section_' + sectionId,
            //       type: 'section',
            //       templateOptions: {
            //         label:section.label
            //       },
            //       data:{
            //         fields:sectionFields
            //       }
            //     };
            //
            //     pageFields.push(sectionField);
            //   });
            //   //create page fields
            //   tab = {
            //     title: page.label,
            //     form:{
            //       model:model,
            //       options:{},
            //       fields:pageFields
            //     }
            //   };
            //   if (i === 0) {
            //     tab.active = true;
            //   }
            //
            //   tabs.push(tab);
            //   i = i + 1;
            // });

            $log.info('this works fine');
        }

    }
})();

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
      .factory('createForm', createForm);

  createForm.$inject = ['$log', 'fieldHandlerService'];

  function createForm($log, fieldHandlerService) {
    var service = {
      createForm: createForm
    };

    return service;

    function createForm(schema, model, callback) {
      var form;
      form =  _createFormlyForm(schema);
      $log.info('inspect compiled', form);
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
            key:section.label,
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
          model[section.section.label] = section.sectionModel;
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
          model.obsGroup = {};
          var obsField = {};
          if (question.questionOptions.rendering === 'group') {
            obsField = {
              className: 'row',
              // key:'obsGroup' + '_' + question.label,
              fieldGroup:fieldsArray
            };
          } else if (question.questionOptions.rendering === 'repeating') {
            model.obsGroup = {repeating:[]};
            obsField = {
              type: 'repeatSection',
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
          }

          // model['obsGroup' + '_' + createFieldKey(sectionKey)] = obsGroupModel;
          _createFieldsFactory(question.questions, fieldsArray,
            model.obsGroup, questionMap);
          fields.push(obsField);

        } else {
          handlerMethod = fieldHandlerService.getFieldHandler('defaultFieldHandler');
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
        }
      }

      return fields;
    }

  }
})();

/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
 */
/*
 jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
 */
(function () {
    'use strict';

    angular.module('openmrs.angularFormentry')
            .factory('fieldHandlerService', fieldHandlerService);

    fieldHandlerService.$inject = ['$log'];
    var obsId = 0;
    function fieldHandlerService($log) {
        var fieldHandlers = {};

        //registerCoreFieldHandler
        fieldHandlers['obsFieldHandler'] = obsFieldHandler;
        fieldHandlers['encounterTypeFieldHandler'] = encounterTypeFieldHandler;
        fieldHandlers['personAttributeFieldHandler'] = personAttributeFieldHandler;
        fieldHandlers['encounterDatetimeFieldHandler'] = encounterDatetimeFieldHandler;
        fieldHandlers['encounterProviderFieldHandler'] = encounterProviderFieldHandler;
        fieldHandlers['encounterLocationFieldHandler'] = encounterLocationFieldHandler;
        fieldHandlers['obsGroupFieldHandler'] = obsGroupFieldHandler;
        fieldHandlers['obsGroupRepeatingFieldHandler'] = obsGroupRepeatingFieldHandler;
        fieldHandlers['conceptSearchFieldHandler'] = conceptSearchFieldHandler;
        fieldHandlers['locationAttributeFieldHandler'] = locationAttributeFieldHandler;
        fieldHandlers['defaultFieldHandler'] = defaultFieldHandler;
        var service = {
            getFieldHandler: getFieldHandler,
            registerCustomFieldHandler: registerCustomFieldHandler
        };

        return service;

        function getFieldHandler(handlerName) {
            if (handlerName in fieldHandlers) {
                return fieldHandlers[handlerName];
            } else {
                $log.warn('Failed to get the required fieldHandler, returning defaultFieldHandler');
                return fieldHandlers['defaultFieldHandler'];
            }
        }

        function registerCustomFieldHandler(handlerName, handlerMethod) {
            fieldHandlers[handlerName] = handlerMethod;
        }

        function encounterTypeFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function encounterDatetimeFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function encounterLocationFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function encounterProviderFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function obsGroupRepeatingFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function conceptSearchFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function locationAttributeFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function personAttributeFieldHandler(_field) {
            $log.info('loading fieldHandler');
        }

        function obsGroupFieldHandler(_field) {
            $log.info('loading obs Group FieldHandler');
            var field = {};
            gpSectionRnd = 0;
            field = createGroupFormlyField(_obsField, gpSectionRnd);
            return field;
        }

        function defaultFieldHandler(_question, model, questionMap) {
            $log.info('loading default fieldHandler');
            var field = {};
            field = _createFormlyFieldHelper(_question, model, questionMap);
            _addToQuestionMap(_question, field, questionMap);
            var fieldArray = [];
            var obsDateField;
            if (_question.questionOptions.showDate === 'true') {
                obsDateField = angular.copy(field);
                _handleShowDate(obsDateField);
                fieldArray.push(field);
                fieldArray.push(obsDateField);
                return fieldArray;
            } else {
                return field;
            }
        }

        function obsFieldHandler(_question, model, questionMap) {
            $log.info('loading obs fieldHandler');
            var obsField = {};
            obsField = _createObsFormlyField(_question, model, questionMap);
            return obsField;
        }

        function createFieldKey(_question, _id)
        {
            var key;
            var fKey;
            var id = _id + 1;
            if (_question.type === 'obs') {
                fKey = _question.questionOptions.concept;
                key = 'obs' + id + '_' + fKey.replace(/-/gi, 'n'); // $$ Inserts a "$".
            } else {
                key = _question.type;
            }

            return key;
        }

        function _handleExpressionProperties(_field, _required, _disabled, _listener)
        {
            var field = _field || {};
            var required = _required || 'false';
            var disabled = _disabled || '';
            var listener = _listener || '';
            field['expressionProperties'] = {
                'templateOptions.required': required,
                'templateOptions.disabled': disabled,
                'templateOptions.hasListeners': listener
            };
        }

        function _handleDefaultValue(_field, _defaultValue)
        {
            var field = _field || {};
            var defaultVal = _defaultValue || '';
            field['defaultValue'] = defaultVal;
        }

        function _handleValidators(_field, _validators)
        {
            var field = _field || {};
            //set the validator to default validator
            var defaultValidator = {
                expression: function (viewValue, modelValue, scope) {
                    return true;
                },
                message: ''
            };
            var compiledValidators = defaultValidator || _validators;
            field['validators'] = compiledValidators;
        }

        function _handleHide(_field, _hide)
        {
            var field = _field || {};
            var hide = hide || '';
            field['hideExpression'] = hide;
        }

        function _handleFieldAnswers(_field, _answers) {
            var field = _field || {};
            var answerList = [];
            answerList.push({name: '', value: undefined});
            //get the anserq options for radio/select options/multicheckbox
            if (angular.isArray(_answers)) {
                _.each(_answers, function (answer) {
                    var item = {
                        name: answer.label,
                        value: answer.concept
                    };
                    answerList.push(item);
                });
            } else {
                $log.error('Error: Expected ' + _answers + ' to be an Array but got: ',
                        typeof _answers);
            }

            field['templateOptions']['options'] = answerList;
        }

        function _handleFieldUiSelect(_field, _answers) {
            var field = _field || {};
            var answerList = [];
            answerList.push({name: '', value: undefined});
            //get the anserq options for radio/select options/multicheckbox
            _.each(_answers, function (answer) {
                var item = {
                    name: answer.label,
                    value: answer.concept
                };
                answerList.push(item);
            });

            field['templateOptions'] = {
                type: 'text',
                options: answerList
            };
        }

        function _handleShowDate(_field) {
            var field = _field || {};
            var key = field.key;
            field.key = key.replace(/obs/gi, 'obsDate');
            field.type = 'datepicker';
            field.templateOptions['datepickerPopup'] = 'dd-MMMM-yyyy';
            field.templateOptions['label'] = 'Date';
            field.expressionProperties = {
                'templateOptions.required': function ($viewValue, $modelValue, scope, element) {
                    var value = $viewValue || $modelValue;
                    var fkey = selField.key;
                    return scope.model[fkey] !== undefined && scope.model[fkey] !== null && scope.model[fkey] !== '';
                }
            };
            field.validators = {
                dateValidator: '' //FormValidator.getDateValidatorObject(curField.validators[0]) //this  will require refactoring as we move forward
            };
        }

        function _createFormlyFieldHelper(_question, model, _id) {
            var field = {};
            var modelKey = createFieldKey(_question, _id);
            var key = 'value';
            field = {
                key: key,
                data: {concept: _question.questionOptions.concept,
                    id: _question.id},
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: _question.label
                }
            };

            _handleExpressionProperties(field, _question.required, _question.disable);
            _handleDefaultValue(field, _question.default);
            _handleHide(field, _question.hide);
            // _handleValidators(field, _question.validators);

            var m = {
                concept: _question.questionOptions.concept,
                schemaQuestion: _question, value: ''
            };

            // if ('questions' in question) {
            //   m.obsGroup = {};
            //   field.type = 'section';
            //   field.data = {recursiveModel:m.obsGroup};
            // } else {
            //   field.type = 'input'; //TEMPORARY: This needs to reflect the actual type
            // }

            if (_question.questionOptions.concept in model) { //add m to the array
                // if (modelKey in model) { //add m to the array
                model[_question.questionOptions.concept].push(m);
            } else { //create array with just m
                model[_question.questionOptions.concept] = [m];
            }

            field.model = m;
            $log.debug('loosing value property', model);
            return field;
        }

        function _addToQuestionMap(_question, _field, questionMap) {
            if ('id' in _question) {
                if (_question.id in questionMap) {
                    questionMap[_question.id].push(_field);
                } else {
                    questionMap[_question.id] = [_field];
                }
            }
        }

        function _createObsFormlyField(_question, _model, questionMap) {
            var obsField = {};
            obsField = _createFormlyFieldHelper(_question, _model, obsId);
            if (_question.questionOptions.rendering === 'date') {
                obsField['type'] = 'datepicker';
                obsField['templateOptions']['datepickerPopup'] = 'dd-MMMM-yyyy';

            } else if (_question.questionOptions.rendering === 'number') {
                obsField['templateOptions']['type'] = _question.questionOptions.rendering;
                obsField['templateOptions']['min'] = _question.questionOptions.min;
                obsField['templateOptions']['max'] = _question.questionOptions.max;

            } else if ((_question.questionOptions.rendering === 'radio') ||
                    (_question.questionOptions.rendering === 'select') ||
                    (_question.questionOptions.rendering === 'multiCheckbox')) {
                _handleFieldAnswers(obsField, _question.questionOptions.answers);
                obsField['type'] = _question.questionOptions.rendering;
            }

            _addToQuestionMap(_question, obsField, questionMap);

            var fieldArray = [];
            var obsDateField;
            if (_question.questionOptions.showDate === 'true') {
                obsDateField = angular.copy(obsField);
                _handleShowDate(obsDateField);
                fieldArray.push(obsField);
                fieldArray.push(obsDateField);
                return fieldArray;
            } else {
                return obsField;
            }
        }

    }
})();

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

  UtilService.$inject = ['$http', '$log'];

  function UtilService($http, $log) {
    var service = {
          getFormSchema: getFormSchema
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
  }
})();

/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {

  'use strict';

  var mod =
    angular
      .module('openmrs.angularFormentry');

  mod.run(function(formlyConfig) {
    var attributes = [
      'date-disabled',
      'custom-class',
      'show-weeks',
      'starting-day',
      'init-date',
      'min-mode',
      'max-mode',
      'format-day',
      'format-month',
      'format-year',
      'format-day-header',
      'format-day-title',
      'format-month-title',
      'year-range',
      'shortcut-propagation',
      'datepicker-popup',
      'show-button-bar',
      'current-text',
      'clear-text',
      'close-text',
      'close-on-date-selection',
      'datepicker-append-to-body'
    ];

    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];

    var ngModelAttrs = {};

    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = { attribute: attr };
    });

    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = { bound: binding };
    });

    formlyConfig.setType({
      name: 'datepicker',
      template: '<input class="form-control" ng-model="model[options.key]"  ' +
      'is-open="to.isOpen" ng-click="open($event)"  ' +
      'datepicker-options="to.datepickerOptions" />',

      wrapper: ['bootstrapLabel', 'bootstrapHasError'],

      controller: ['$scope','$log', function($scope, $log) {
        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $log.info('controller does a good job!');
          $scope.opened = true;
        };

      }],

      overwriteOk: true,

      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {

          addonLeft: {
            class: 'glyphicon glyphicon-calendar',
            onClick: function(options, scope) {
              options.templateOptions.isOpen = !options.templateOptions.isOpen;
            }
          },
          onFocus: function($viewValue, $modelValue, scope) {
            scope.to.isOpen = !scope.to.isOpen;
          },

          datepickerOptions: {}
        }
      }
    });

    function camelize(string) {
      string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.replace(/^([A-Z])/, function(match, chr) {
        return chr ? chr.toLowerCase() : '';
      });
    }
  });

})();

/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry')
            .run(createDatetimePickerType);

  function createDatetimePickerType(formlyConfig, $filter, $log) {
    $log.info('A new type is being created!!');
    var attributes = [
            'hour-step',
            'minute-step',
            'show-meridian',
            'date-disabled',
            'enable-date',
            'current-text',
            'time-text',
            'date-text',
            'now-text',
            'today-text',
            'clear-text',
            'close-text',
            'close-on-date-selection',
        ];

    var bindings = [
            'datepicker-mode',
            'min-date',
            'max-date',
            'hour-step',
            'minute-step',
            'show-meridian'
        ];

    var ngModelAttrs = {};

    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = { attribute: attr };
    });

    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = { bound: binding };
    });

    formlyConfig.setType({
          name: 'datetimepicker',
          extends: 'input',
          template: '<input class="form-control" ng-model="model[options.key]" ' +
                    'is-open="to.isOpen" ng-click="open($event)"  ' +
                    'datetime-picker="dd-MMM-yyyy hh:mm:ss a" ' +
                    'datepicker-options="to.datepickerOptions"></input>',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          overwriteOk: true,
          defaultOptions: {
              ngModelAttrs: ngModelAttrs,
              templateOptions: {
                addonLeft: {
                  class: 'glyphicon glyphicon-calendar',
                  onClick: function(options, scope) {
                    options.templateOptions.isOpen = !options.templateOptions.isOpen;
                  }
                },
                onFocus: function($viewValue, $modelValue, scope) {
                  scope.to.isOpen = !scope.to.isOpen;
                  $log.log('View value: ', $viewValue, 'Model value: ', $modelValue);
                },

                datepickerOptions: {},
                timepickerOptions: {},
              }
            }
        });

    function camelize(string) {
          string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : '';
          });
          // Ensure 1st char is always lowercase
          return string.replace(/^([A-Z])/, function(match, chr) {
            return chr ? chr.toLowerCase() : '';
          });
        }
  }
})();

/*
jshint -W106, -W098, -W109, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {

  'use strict';

  var mod =
        angular
            .module('openmrs.angularFormentry');

  mod.run(function(formlyConfig) {
      formlyConfig.setType({
        name: 'ui-select-extended',
        wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
        template: '<ui-select ng-model="model[options.key]" theme="bootstrap" ng-required="{{to.required}}" ng-disabled="{{to.disabled}}" reset-search-input="false"> <ui-select-match placeholder="{{to.placeholder}}"> {{evaluateFunction($select.selected[to.labelProp || \'name\'])}} </ui-select-match> <ui-select-choices refresh="refreshItemSource($select.search)" group-by="to.groupBy" repeat="(evaluateFunction(option[to.valueProp || \'value\'])) as option in itemSource" > <div ng-bind-html="evaluateFunction(option[to.labelProp || \'name\']) | highlight: $select.search"></div> </ui-select-choices> </ui-select>',
        link: function(scope, el, attrs, vm) {
          //incase we need link function
        },

        controller: function($scope, $log) {
          var vm = this;
          $scope.itemSource = [];
          $scope.refreshItemSource = refreshItemSource;
          $scope.evaluateFunction = evaluateFunction;
          vm.getSelectedObject = getSelectedObject;

          $scope.$watch(function(scope) {
            return evaluateFunction(scope.model[scope.options.key]);
          },

          function(val) {
            if ($scope.itemSource !== undefined && $scope.itemSource.length === 0) {
              getSelectedObject();
            }
          });

          activate();
          function activate() {
            validateTemplateOptions();
            getSelectedObject();
          }

          function getSelectedObject() {
            var selectedValue = typeof $scope.model[$scope.options.key] === 'function' ?
            $scope.model[$scope.options.key]() : $scope.model[$scope.options.key];
            if (selectedValue !== undefined && selectedValue !== null && selectedValue !== '')
             $scope.to.getSelectedObjectFunction(selectedValue, function(object) {
               $scope.itemSource = [object];
             },

            function(error) {
              $log.error(error);
            });
          }

          function refreshItemSource(value) {
            if (isBlank(value) === false)
             $scope.to.deferredFilterFunction(value, function(results) {
               $scope.itemSource = results;
             },

            function(error) {
              $log.error(error);
            });
          }

          function evaluateFunction(obj) {
            if (obj && (typeof obj) === 'function') {
              return obj();
            }

            return obj;
          }

          function isBlank(str) {
            if (str === null || str.length === 0 || str === ' ') return true;
            return false;

          }

          function validateTemplateOptions() {
            if (!$scope.to.deferredFilterFunction) {
              $log.error('Template Options must define deferredFilterFunction');
              $log.error($scope.to);
            }

            if ($scope.to.deferredFilterFunction && (typeof $scope.to.deferredFilterFunction) !== 'function') {
              $log.error('Template Options deferredFilterFunction is a function');
              $log.error($scope.to);
            }

            if (!$scope.to.getSelectedObjectFunction) {
              $log.error('Template Options must define getSelectedObjectFunction');
              $log.error($scope.to);
            }

            if ($scope.to.getSelectedObjectFunction && (typeof $scope.to.getSelectedObjectFunction) !== 'function') {
              $log.error('Template Options getSelectedObjectFunction is a function');
              $log.error($scope.to);
            }
          }
        }
      });
    });

})();

/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  var mod =
          angular
              .module('openmrs.angularFormentry');

  mod.run(function config(formlyConfig) {
    formlyConfig.setType({
      name: 'repeatSection',
      templateUrl: 'repeatSection.html',
      controller: function($scope, $log) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;

        $scope.copyFields = copyFields;

        function copyFields(fields) {
          return angular.copy(fields);
        }

        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          $log.log('Repeat section');
          $log.log($scope.model);
          var repeatsection = $scope.model[$scope.options.key];
          $log.log('Repeat section Val');
          $log.log(repeatsection);
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          // if (lastSection) {
          //   newsection = angular.copy(lastSection);
          // }

          repeatsection.push(newsection);
        }
      }
    });
  });
})();

/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  var mod =
          angular
              .module('openmrs.angularFormentry');

  mod.run(function config(formlyConfig) {

    /*
    Testing nested sections in formly way
    */
    // set templates here
    formlyConfig.setType({
      name: 'section',
      template: '<formly-form model="model[options.key]" fields="options.data.fields"></formly-form>'
    });

	  formlyConfig.setWrapper({
      name: 'panel',
      types: ['section'],
      templateUrl: 'section.html'
    });
  });
})();

/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {

  'use strict';
  var mod =
    angular
      .module('openmrs.angularFormentry');

  mod.run(function(formlyConfig) {
    formlyConfig.setType({
      name: 'concept-search-select',
      wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
      extends: 'select',
      defaultOptions: {
        templateOptions: {

        }
      },
      controller:function($scope, $filter, $log) {
        activate();
        function activate() {
          validateTemplateOptions();
          fetchOptions();
        }

        function fetchOptions() {
          $scope.to.fetchOptionsFunction($scope.to.questionConceptUuid,
            fetchOptionsSuccess, fetchOptionsFail);
        }

        function fetchOptionsSuccess(options) {
          $scope.to.options = [];
          angular.forEach(options, function(value, key) {
            var valueMember = $scope.to.valueMember;
            var displayMember = $scope.to.displayMember;
            var val = evaluateFunction(value[valueMember]);
            var display = evaluateFunction(value[displayMember]);
            var displayFormated = $filter('titlecase')(display);
            var option = {name:displayFormated,value:val};
            $scope.to.options.push(option);
          });
        }

        function fetchOptionsFail(error) {
          $log.log(error);
        }

        function validateTemplateOptions() {
          if (!$scope.to.fetchOptionsFunction) {
            $log.error('Template Options must define fetchOptionsFunction function');
            $log.error($scope.to);
          }

          if ($scope.to.fetchOptionsFunction && (typeof $scope.to.fetchOptionsFunction) !== 'function') {
            $log.error('Template Options fetchOptionsFunction is Not a function');
            $log.error($scope.to);
          }

          if (!$scope.to.questionConceptUuid) {
            $log.error('Template Options must define questionConceptUuid');
            $log.error($scope.to);
          }

        }

        function evaluateFunction(obj) {
          if (obj && (typeof obj) === 'function') {
            return obj();
          }

          return obj;
        }

        function isBlank(str) {

          if (str === null || str.length  === 0 || str === ' ') return true;
          return false;

        }
      }
    });
  });

})();

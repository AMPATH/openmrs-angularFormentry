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
      return true;
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

      if(field) {
        addObsToFormlyField(o, field, questionMap);
        return true;
      }
      else {
        return false;
      }
    }


    function addExistingObsSetToForm(form,restObs) {
      var found;
      _.each(restObs,function(o) {
        _.each(form.compiledSchema, function (page) {
          _.each(page.compiledPage, function (section) {
            _.each(section.sectionModel, function (questionModel) {
              if (o.concept === questionModel[0].concept) {
                found = addObsToSection(o,section.formlyFields, section.sectionModel,form.questionMap);
              }
            });
          });
        });
      });
    }

    function getCompiledForm() {

      var form = schemaToFormlyForm(this.schema);
      addExistingObsSetToForm(form,obsRestPayloadRepeatingObsGroup);
      console.log(form);
      window.form = form;
      return form;
    }


    return service;
  }
})();

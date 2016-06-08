[![Build Status](https://travis-ci.org/AMPATH/openmrs-angularFormentry.svg?branch=master)](https://travis-ci.org/AMPATH/openmrs-angularFormentry)
# angular-formentry

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Installing

To install via bower
bower install https://github.com/AMPATH/openmrs-angularFormentry.git

## Introduction

Angular OpenMRS formentry is a module that aims at using angular framework to create a standalone module that can be used by the community and angular AMRS project to create forms.
This Module will require a schema in a given format. This schema will be passed to this module which will generate a form based on the schema specification.


## Getting Started
Here is an example of a simple app that will get you started. This app saves triage form on the openmrs reference app: demo.openmrs.org.
If you clone this repo and run (grunt serve) you will be able to save obs (Simple Demo Tab). To verify that obs have been saved, login to 
http://demo.openmrs.org/openmrs/login.htm. 

- username:admin 
- password:Admin123 
- location:Inpatient Ward
- patient:Elizabeth Johnson

Here are the links:
- module: https://github.com/AMPATH/openmrs-angularFormentry/blob/master/app/scripts/developer-demo/simple-developer-demo.module.js
- controller: https://github.com/AMPATH/openmrs-angularFormentry/blob/master/app/scripts/developer-demo/simple-developer-demo.controller.js
- views: https://github.com/AMPATH/openmrs-angularFormentry/blob/master/app/views/developer-demo/demo-form.html

In a nutshell you need 3 main methods: setAuthenticationHeaders, renderFormSchema and savePayload. see the controller below
````
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

````

## Module Components

The openmrs-angularFormentry module has the following key components:
- Field Handlers
- Form/field Validators
- Payload generators

This module does the following
- Converts a form schema into Formly Schema/one that the form can consume.
- Creates a model for you given an empty model
- Populates the model with existing data when viewing/editting data
- Generates a payload that you can submit to openmrs rest endpoints to save/update/delete data

## Consuming the module
This module does the following
- Converts a form schema into Formly Schema/one that the form can consume.
- Creates a model for you given an empty model
- Populates the model with existing data when viewing/editting data
- Generates a payload that you can submit to openmrs rest endpoints to save/update/delete data

For code snippets on how you can consume the module, see the GIST:
https://gist.github.com/nkimaina/9bb43eade884f40d43c8cd5dd6342d3c
 

## FORM SCHEMA FORMAT


A form schema is a json document made up of the following main properties:

1. name - name of the form,
2. uuid - form uuid,
3. processor - form processor e.g. EncounterFormProcessor ObsFormProcessor etc,
4. referencedForms - Other forms that can be used to build the current form
5. pages - Holds the form contents organized into pages. A page is made up of several sections and the sections contains various fields.

## FIELDS

The fields are supposed to be used to represent the questions on form. The module supports a wide range of field types namely:
- a. encounterProvider,
- b. encounterLocation,
- c. encounterDatetime,
- d. obs,
- e. obsGroup
- f. personAttributes

Each of this fields can be rendered in various forms using the rendering property of the field: The rendering types allowable by the this module are:
- a) text,
- b) number
- c) select/dropdown
- d) checkbox
- e) multi-checkbox
- f) ui-select-extended
- g) date
- h) problem
- i) text area

## Field Structure: A field should be of the following format:
```
{
 label:"field label/title",
 type: "as describe above e.g. obs/obsGroup/etc"
 id:"optional uinque Id for a field",
 questionOptions:{
  concept:"question concept uuid or concept mapping",
  rendering:"field rendering option as listed above",
  answers :[used only for select and multi-checkbox- has an array of answer objects in this format {concept:uuuid, label:"answer label"}]
  },
  validators : [an array of validator objects used to validate the field],
  disable:"expression to disable the field",
  hide: "expression to hide the field"
}
```


## Structure of a Page:

A page is a way of grouping related fields/questions on the a given page on the form. A page can have several sections. ### ### Page structure:
```
{
  label : "page label",
  sections: [
  {
    label:"section label",
    questions: [
    {
      label:"field label/title",
      type: "as describe above e.g. obs/obsGroup/etc"
      id:"optional uinque Id for a field",
      questionOptions:{
        concept:"question concept uuid or concept mapping",
        rendering:"field rendering option as listed above",
      answers :[used only for select and multi-checkbox- has an array of answer objects in this format {concept:uuuid, label:"answer label"}]
      },
      validators : [an array of validator objects used to validate the field],
      disable:"expression to disable the field",
      hide: "expression to hide the field"
    },
    {
      label:"field label/title",
      type: "as describe above e.g. obs/obsGroup/etc"
      id:"optional uinque Id for a field",
      questionOptions:{
        concept:"question concept uuid or concept mapping",
        rendering:"field rendering option as listed above",
        answers :[used only for select and multi-checkbox- has an array of answer objects in this format {concept:uuuid, label:"answer label"}]
      },
      validators : [an array of validator objects used to validate the field],
      disable:"expression to disable the field",
      hide: "expression to hide the field"
    }
    ]
  }
  ]
}
```
## Sample form showing pages sections and fields
```
{
    "name": "example_form_v0.01",
    "uuid": "xxxx",
    "processor": "EncounterFormProcessor",
    "pages": [
        {
            "label": "Page 1",
            "sections": [
                {
                    "label": "Encounter Details",
                    "questions": [
                        {
                            "label": "Visit Date",
                            "type": "encounterDatetime",
                            "required": "true",
                            "default": "",
                            "id": "encDate",
                            "questionOptions": {
                                "rendering": "date"
                            },
                            "validators": [
                                {
                                    "type": "date"
                                }
                            ]
                        },
                        {
                            "type": "encounterProvider",
                            "label": "Provider",
                            "id": "provider",
                            "required": "true",
                            "default": "",
                            "questionOptions": {
                                "rendering": "ui-select-extended"
                            }
                        },
                        {
                            "type": "encounterLocation",
                            "label": "Facility name (site/satellite clinic required):",
                            "id": "location",
                            "required": "true",
                            "questionOptions": {
                                "rendering": "ui-select-extended"
                            }
                        },
                        {
                            "label": "Patient covered by NHIF:",
                            "questionOptions": {
                                "rendering": "select",
                                "concept": "a8b02524-1350-11df-a1f1-0026b9348838",
                                "answers": [
                                    {
                                        "concept": "8b715fed-97f6-4e38-8f6a-c167a42f8923",
                                        "label": "Yes"
                                    },
                                    {
                                        "concept": "a899e0ac-1350-11df-a1f1-0026b9348838",
                                        "label": "No"
                                    }
                                ]
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "type": "personAttribute",
                            "label": "Transfer in from other AMPATH clinic (specify):",
                            "id": "transfered_in_to_ampath",
                            "required": "false",
                            "default": "",
                            "questionOptions": {
                                "rendering": "ui-select-extended",
                                "attributeType": "7ef225db-94db-4e40-9dd8-fb121d9dc370"
                            }
                        },
                        {
                            "label": "Was this visit scheduled?",
                            "id": "scheduledVisit",
                            "questionOptions": {
                                "rendering": "select",
                                "concept": "a89ff9a6-1350-11df-a1f1-0026b9348838",
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
                                ]
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "If Unscheduled, actual scheduled date",
                            "id": "q7b",
                            "type": "obs",
                            "questionOptions": {
                                "rendering": "date",
                                "concept": "dc1942b2-5e50-4adc-949d-ad6c905f054e"
                            },
                            "required": {
                                "type": "conditionalRequired",
                                "message": "Patient visit marked as unscheduled. Please provide the scheduled date.",
                                "referenceQuestionId": "scheduledVisit",
                                "referenceQuestionAnswers": [
                                    "a89ff816-1350-11df-a1f1-0026b9348838",
                                    "a89ff8de-1350-11df-a1f1-0026b9348838"
                                ]
                            },
                            "validators": [
                                {
                                    "type": "date",
                                    "allowFutureDates": "true"
                                },
                                {
                                    "type": "js_expression",
                                    "failsWhenExpression": "!isEmpty(scheduledVisit) && arrayContains(['a89ff816-1350-11df-a1f1-0026b9348838','a89ff8de-1350-11df-a1f1-0026b9348838'], scheduledVisit) && isEmpty(myValue)",
                                    "message": "Patient visit marked as unscheduled. Please provide the scheduled date."
                                }
                            ],
                            "disable": {
                                "disableWhenExpression": "!arrayContains(['a89ff816-1350-11df-a1f1-0026b9348838','a89ff8de-1350-11df-a1f1-0026b9348838'], scheduledVisit)"
                            }
                        }
                    ]
                },
                {
                    "label": "PWPs",
                    "questions": [
                        {
                            "label": "Civil Status:",
                            "type": "obs",
                            "questionOptions": {
                                "rendering": "select",
                                "concept": "a899a9f2-1350-11df-a1f1-0026b9348838",
                                "answers": [
                                    {
                                        "concept": "a899af10-1350-11df-a1f1-0026b9348838",
                                        "label": "Cohabitating"
                                    },
                                    {
                                        "concept": "a899af10-1350-11df-a1f1-0026b9348838",
                                        "label": "Divorced"
                                    },
                                    {
                                        "concept": "a8aa76b0-1350-11df-a1f1-0026b9348838",
                                        "label": "Married monogamous"
                                    },
                                    {
                                        "concept": "a8b03712-1350-11df-a1f1-0026b9348838",
                                        "label": "Married polygamous"
                                    },
                                    {
                                        "concept": "a899aba0-1350-11df-a1f1-0026b9348838",
                                        "label": "Separated"
                                    },
                                    {
                                        "concept": "a899ac7c-1350-11df-a1f1-0026b9348838",
                                        "label": "Single"
                                    },
                                    {
                                        "concept": "a899ae34-1350-11df-a1f1-0026b9348838",
                                        "label": "Widowed"
                                    }
                                ]
                            },
                            "validators": []
                        },
                        {
                            "label": "Discordant couple:",
                            "questionOptions": {
                                "answers": [
                                    {
                                        "concept": "a899b35c-1350-11df-a1f1-0026b9348838",
                                        "label": "Yes"
                                    },
                                    {
                                        "concept": "a899b42e-1350-11df-a1f1-0026b9348838",
                                        "label": "NO"
                                    },
                                    {
                                        "concept": "a899b50a-1350-11df-a1f1-0026b9348838",
                                        "label": "Unknown"
                                    },
                                    {
                                        "concept": "a89ad3a4-1350-11df-a1f1-0026b9348838",
                                        "label": "N/A"
                                    }
                                ],
                                "concept": "a8af49d8-1350-11df-a1f1-0026b9348838",
                                "rendering": "select"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "Prevention With Positives: At risk population:",
                            "questionOptions": {
                                "concept": "93aa3f1d-1c39-4196-b5e6-8adc916cd5d6",
                                "answers": [
                                    {
                                        "concept": "5da55301-e28e-4fdf-8b64-02622dedc8b0",
                                        "label": "Client of sex worker"
                                    },
                                    {
                                        "concept": "a89ff438-1350-11df-a1f1-0026b9348838",
                                        "label": "Commercial sex worker"
                                    },
                                    {
                                        "concept": "a8af49d8-1350-11df-a1f1-0026b9348838",
                                        "label": "Discordant couple"
                                    },
                                    {
                                        "concept": "a890d57a-1350-11df-a1f1-0026b9348838",
                                        "label": "IV drug use"
                                    },
                                    {
                                        "concept": "e19c35f0-12f0-46c2-94ea-97050f37b811",
                                        "label": "MSM"
                                    },
                                    {
                                        "concept": "a89ad3a4-1350-11df-a1f1-0026b9348838",
                                        "label": "N/A"
                                    }
                                ],
                                "rendering": "select"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "Prevention With Positives: PWP Services:",
                            "questionOptions": {
                                "concept": "9ce5dbf0-a141-4ad8-8c9d-cd2bf84fe72b",
                                "answers": [
                                    {
                                        "concept": "f0a280e8-eb88-41a8-837a-f9949ed1b9cd",
                                        "label": "Condom promotion/provision"
                                    },
                                    {
                                        "concept": "bf51f71e-937c-4da5-ae07-654acf59f5bb",
                                        "label": "Couple counseling"
                                    },
                                    {
                                        "concept": "a8af49d8-1350-11df-a1f1-0026b9348838",
                                        "label": "Needle exchange"
                                    },
                                    {
                                        "concept": "05656545-86be-4605-9527-34fb580534b1",
                                        "label": "Targeted risk reduction"
                                    },
                                    {
                                        "concept": "a89ad3a4-1350-11df-a1f1-0026b9348838",
                                        "label": "N/A"
                                    }
                                ],
                                "rendering": "select"
                            },
                            "type": "obs",
                            "validators": []
                        }
                    ]
                },
                {
                    "label": "Vital Signs:",
                    "questions": [
                        {
                            "label": "BP:Systolic:",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a8a65d5a-1350-11df-a1f1-0026b9348838",
                                "max": "250",
                                "min": "0"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "BP:Diastolic:",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a8a65e36-1350-11df-a1f1-0026b9348838",
                                "max": "150",
                                "min": "0"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "Pulse(Rate/Min):",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a8a65f12-1350-11df-a1f1-0026b9348838",
                                "max": "230",
                                "min": "0"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "Temp(C):",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a8a65fee-1350-11df-a1f1-0026b9348838",
                                "max": "43",
                                "min": "25"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "Weight(Kg):",
                            "id": "weight",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a8a660ca-1350-11df-a1f1-0026b9348838",
                                "max": "150",
                                "min": "0"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "Height(CM):",
                            "id": "height",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a8a6619c-1350-11df-a1f1-0026b9348838",
                                "max": "350",
                                "min": "0"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "Sp02:",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a8a66354-1350-11df-a1f1-0026b9348838",
                                "max": "100",
                                "min": "0"
                            },
                            "type": "obs",
                            "validators": []
                        },
                        {
                            "label": "BMI:Kg/M2",
                            "questionOptions": {
                                "rendering": "number",
                                "concept": "a89c60c0-1350-11df-a1f1-0026b9348838",
                                "max": "100",
                                "min": "0",
                                "calculate": {
                                    "calculateExpression": "calcBMI(height,weight)"
                                }
                            },
                            "type": "obs",
                            "validators": []
                        }
                    ]
                }
            ]
        }
    ]
}
```


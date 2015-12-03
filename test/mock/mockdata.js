/* jshint -W079, -W098, -W026, -W003, -W106 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  var mockedDataModule = angular
        .module('mock.data', []);
  mockedDataModule.factory('mockData', mockData);
  mockData.$inject = [];

  function mockData() {

    var mock = {
            getMockSchema: getMockSchema,
            getMockStates: getMockStates,
            getMockObs: getMockObs,
            getMockPersonAttribute:getMockPersonAttribute,
            getMockPersonAttributesArray:getMockPersonAttributesArray,
            getMockModel: getMockModel,
            getMockPatient: getMockPatient,
            getMockObsField:getMockObsField,
            getMockLocations: getMockLocations,
            getMockEtlLocations: getMockEtlLocations,
            getMockedFormList:getMockedFormList
          };

    return mock;

    function getMockPatient() {
      return {
        identifiers:['test-patient'],
        person:{
        age: 63,
        birthdate: '1951-12-09T00:00:00.000+0245',
        dead: false,
        deathDate: null,
        gender: 'F',
        preferredName:{
          familyName: 'Testty',
          givenName: 'Testty',
          middleName: 'Testty'
        },
        preferredAddress: {
          address1: null,
          address2: null,
          address3: null,
          address4: 'AINABKOI',
          address5: 'KIPKURERE',
          address6: 'TIMBOROA',
          cityVillage: 'KAHUHO A',
          country: null,
          countyDistrict: 'ELDORET EAST',
          postalCode: null,
          preferred: true,
          stateProvince: null},
        attributes: '_attributes'
      },
        uuid: 'xxxx',
      };
    }

    function getMockEtlLocations() {
        return {
          startIndex:0, size:1,
          result: [{locationId: 1,
          name: 'Location-1',
          description: 'Moi Teaching and Referral Hospital - Module 1',
          address1: 'P.O Box 30100-3 Eldoret',
          address2: 'xxx',
          uuid: 'passed-uuid'}]
        };
      }

    function getMockedFormList(uuid) {
      return {
        results: [
                {
                  uuid: 'passed-uuid',
                  name: 'AMPATH POC Adult Return Visit Form v0.01',
                  version: '0.01',
                  encounterType: {
                    uuid: '0010c6dffd0f',
                    display: 'ADULTRETURN',
                    name: 'ADULTRETURN',
                    description: 'Outpatient Adult Return Visit',
                  }
                },
                {
                  uuid: 'f42f7c5f2ab',
                  name: 'AMPATH POC Pead Return Visit Form v0.01',
                  version: '0.01',
                  encounterType: {
                    uuid: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                    display: 'ADULTRETURN',
                    name: 'ADULTRETURN',
                    description: 'Outpatient Adult Return Visit'
                  }
                }
              ]
      };

    }

    function getMockLocations() {
      var testLocations = [
        {
          uuid: 'uuid_1',
          name: 'Location-1',
          display: 'Location-1',
          description: 'Mock Location 1'
        },
        {
          uuid: 'uuid_100',
          name: 'Location-100',
          display: 'Location-100',
          description: 'Mock Location 2'
        },
        {
          uuid: 'uuid_101',
          name: 'Location-101',
          display: 'Location-101',
          description:'Mock Location 3'
        }
      ];

      return testLocations;
    }

    function getMockObs()  {
      return {
        uuid: 'passed-uuid',
        display: 'PROBLEM RESOLVED: MALARIA',
        concept: {
          uuid: 'a8af4aa0-1350-11df-a1f1-0026b9348838',
          display: 'PROBLEM RESOLVED'
        }
      };
    }

    function getMockPersonAttribute() {
      return {
        results: [{
                display:  'Health Center 2 = 9',
                uuid:  'passed-uuid',
                value: {
                  uuid:  'location1-uuid',
                  display:  'Location 5 = 5'
                },
                attributeType: {
                  uuid:  'fb121d9dc370',
                  display:  'Health Center 2'
                }
              },
              {
                display:  'Health Center = 4',
                uuid:  'passed-uuid-2',
                value: {
                  uuid:  'location2-uuid',
                  display:  'Location 9 '
                },
                attributeType: {
                  uuid:  '8d87236c-c2cc-11de-8d13-0010c6dffd0f',
                  display:  'Health Center 2'
                }
              }]
      };
    }

    function getMockPersonAttributesArray() {
      var testData = [{uuid:'f123244d-8f1d-4430-9191-98ce60f3723b',
            attributeType:'8d87236c-c2cc-11de-8d13-0010c6dffd0f',
            name:'Health Center',
            value:{uuid:'c09380bc-1691-11df-97a5-7038c432aabf',
            display:'Location-5'}},
            {uuid:'413e25e9-12ad-4cbe-8197-d487e2da1959',
            attributeType:'7ef225db-94db-4e40-9dd8-fb121d9dc370',
            name:'Health Center 2',
            value:{uuid:'c093879e-1691-11df-97a5-7038c432aabf',
            display:'Location-9'}}];
      return testData;

    }

    function getMockStates() {
      return [
            {
              state: 'dashboard',
              config: {
                url: '/',
                templateUrl: 'app/dashboard/dashboard.html',
                title: 'dashboard',
                settings: {
                      nav: 1,
                      content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
              }
            }
        ];
    }

    function getMockObsField()
    {
      var obsField = {
        key: 'obs1_a89ff9a6n1350n11dfna1f1n0026b9348838',
        type: 'select',
        data: {concept:'a89ff9a6-1350-11df-a1f1-0026b9348838',
          id:'q7a'},
        defaultValue: '',
        templateOptions: {
          type: 'text',
          label: '7a. Visit Type',
          required:false,
          options:[]
        },
        expressionProperties: {
          'templateOptions.disabled': false
        },
        hideExpression:''
      };
      return obsField;
    }

    function getMockSchema() {
      return {
          name: 'test-form',
          uuid: 'xxxx',
          processor: 'postEncounterForm',
          pages: [
            {
              label:'page 1',
              sections:[
                {
                  label:'Encounter Details',
                  questions:[
                    {
                      label: 'Visit Date',
                      type: 'encounterDate',
                      required: 'true',
                      id:'encDate',
                      questionOptions:{
                        rendering:'date'
                      },
                      validators:[{type:'date'}]
                    },
                    {
                      type: 'encounterProvider',
                      label: 'Provider',
                      id:'provider',
                      questionOptions:{
                        rendering:'ui-select-extended'
                      },
                      required: 'true'
                    },
                    {
                      type: 'encounterLocation',
                      label: 'Facility Name',
                      id:'location',
                      questionOptions:{
                        rendering:'ui-select-extended'
                      },
                      required: 'true'
                    }
                  ]
                }
              ]
            },
            {
              label:'Page 2',
              sections:[
                {
                  label: 'Visit Type',
                  questions: [
                    {
                      id:'q7a',
                      label: '7a. Visit Type',
                      type: 'obs',
                      required:'true',
                      questionOptions:{
                        concept: 'a89ff9a6-1350-11df-a1f1-0026b9348838',
                        rendering:'select',
                        answers:[
                          {value: 'a89b6440-1350-11df-a1f1-0026b9348838', label: 'Scheduled visit'},
                          {value: 'a89ff816-1350-11df-a1f1-0026b9348838', label: 'Unscheduled Visit Early'},
                          {value: 'a89ff8de-1350-11df-a1f1-0026b9348838', label: 'Unscheduled Visit Late'}
                        ]
                      },
                      validators: []
                    },
                    {
                      type: 'obs',
                      questionOptions:{
                        concept: 'dc1942b2-5e50-4adc-949d-ad6c905f054e',
                        rendering:'date'
                      },
                      validators: [{type: 'date', allowFutureDates: 'true'}],
                      label: '7b. If Unscheduled, actual scheduled date'
                    },
                    {
                      label: 'tabs/day',
                      questionOptions:{
                        concept: 'dc1942b2-5e50-4adc-949d-ad6c905f054e',
                        rendering:'number',
                        max: 30,
                        min: 0
                      },
                      type: 'obs',
                      hide: [
                        {
                          field: 'tb_current',
                          value: [
                            'a899f51a-1350-11df-a1f1-0026b9348838',
                            'a897d1a4-1350-11df-a1f1-0026b9348838',
                            'a8a382ba-1350-11df-a1f1-0026b9348838'
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  label:'Problem List',
                  questions:[
                    {
                      type: 'obsGroup',
                      label: '23a. Problem Added',
                      questionOptions: {
                        rendering:'repeating',
                        concept: 'a89c2d8a-1350-11df-a1f1-0026b9348838'
                      },
                      questions:[
                        {
                          label: 'Problem Added',
                          type: 'problem',
                          questionOptions: {
                            rendering:'text',
                            concept: 'a8ae835e-1350-11df-a1f1-0026b9348838'
                          },
                          validators: []
                        }
                      ]
                    }
              ]
                }
            ]
            },
           {
            label:'Lab Results',
            sections:[
              {
                label: 'Tests Results and Test Date',
                questions: [
                  {
                    type: 'obsGroup',
                    label: 'Lab Results',
                    questionOptions: {
                      rendering:'group',
                      concept: 'a8a003a6-1350-11df-a1f1-0026b9348838'
                    },
                    questions: [
                      {
                        label: 'WBC/mm3',
                        type: 'obs',
                        questionOptions:{
                          concept: 'a896dea2-1350-11df-a1f1-0026b9348838',
                          rendering:'number',
                          showDate: 'true',
                          max: 500,
                          min: 0
                        },
                        validators: [
                          {
                            type: 'date'
                          }
                        ]
                      },
                      {
                        label: 'Hgb g/dL',
                        type: 'obs',
                        questionOptions:{
                          concept: 'a8908a16-1350-11df-a1f1-0026b9348838',
                          rendering:'number',
                          showDate: 'true',
                          max: 50,
                          min: 0
                        },
                        validators: [
                          {
                            type: 'date'
                          }
                        ]
                      }
                    ]
                  }]},
            ]
          }
          ]
        };
    }

    function getMockModel() {
    return {
      "section_Encounter Details": {
        "encounterDate": {
          "schemaQuestion": {
            "label": "Visit Date",
            "type": "encounterDate",
            "required": "true",
            "default": "",
            "id": "encDate",
            "questionOptions": {
              "rendering": "date"
            }
          },
          value: ''
        },
        "encounterProvider": {
          "schemaQuestion": {
            "type": "encounterProvider",
            "label": "Provider",
            "id": "provider",
            "required": "true",
            "default": "",
            "questionOptions": {
              "rendering": "ui-select-extended"
            }
          },
          value:''
        },
        "encounterLocation": {
          "schemaQuestion": {
            "type": "encounterLocation",
            "label": "Facility name (site/satellite clinic required):",
            "id": "location",
            "required": "true",
            "questionOptions": {
              "rendering": "ui-select-extended"
            }
          },
          value: ''
        }
      },
      "section_Section Name": {
        "obs1_1232": {
          "concept": "1232",
          "schemaQuestion": {
            "type": "obs",
            "label": "question1",
            "id": "q1",
            "required": "true",
            "default": "",
            "questionOptions": {
              "rendering": "text",
              "concept": "1232"
            }
          },
          "value": "Test question 1"
        },
        "obs1_1234": {
          "concept": "1234",
          "schemaQuestion": {
            "type": "obs",
            "label": "question2",
            "id": "q2",
            "required": "true",
            "default": "",
            "questionOptions": {
              "rendering": "date",
              "concept": "1234"
            }
          },
          "value": "2015-11-24T21:00:00.000Z"
        },
        "obs1_1233": {
          "concept": "1233",
          "schemaQuestion": {
            "type": "obs",
            "label": "question3",
            "id": "q3",
            "required": "true",
            "default": "",
            "questionOptions": {
              "rendering": "number",
              "concept": "1233"
            }
          },
          "value": 2678
        }
      },
      "section_test Groups": {
        "obsGroup_Was patient hospitalized?": {
          "groupConcept": "a8a003a6-1350-11df-a1f1-0026b9348838",
          "obs1_a8a07a48n1350n11dfna1f1n0026b9348838": {
            "concept": "a8a07a48-1350-11df-a1f1-0026b9348838",
            "schemaQuestion": {
              "label": "Reason for hospitalization",
              "type": "obs",
              "questionOptions": {
                "rendering": "text",
                "concept": "a8a07a48-1350-11df-a1f1-0026b9348838"
              },
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
            "value": "Group Malaria"
          },
          "obsGroup_Date of hospitalization": {
            "groupConcept": "made-up-concept",
            "obs1_madenupnconceptn2": {
              "concept": "made-up-concept-2",
              "schemaQuestion": {
                "type": "obs",
                "label": "Start Date",
                "questionOptions": {
                  "rendering": "date",
                  "concept": "made-up-concept-2"
                }
              },
              "value": "2015-09-30T21:00:00.000Z"
            },
            "obs1_madenupnconceptn3": {
              "concept": "made-up-concept-3",
              "schemaQuestion": {
                "type": "obs",
                "label": "End Date",
                "questionOptions": {
                  "rendering": "date",
                  "concept": "made-up-concept-3"
                }
              },
              "value": "2015-11-29T21:00:00.000Z"
            }
          }
        }
      },
      "section_test Group Repeating": {
        "obsRepeating_Was patient hospitalized?": [
          {
            "groupConcept": "a8a003a6y1350y11dfya1f1y0026b9348838",
            "obs1_a8a07a48x1350x11dfxa1f1n0026b9348838": {
              "concept": "a8a07a48x1350x11dfxa1f1-0026b9348838",
              "schemaQuestion": {
                "label": "Reason for hospitalization",
                "type": "obs",
                "questionOptions": {
                  "rendering": "text",
                  "concept": "a8a07a48x1350x11dfxa1f1-0026b9348838"
                },
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
              "value": "Malaria"
            },
            "obsGroup_Date of hospitalization": {
              "groupConcept": "made-up-concept-4",
              "obs1_madenupnconceptn5": {
                "concept": "made-up-concept-5",
                "schemaQuestion": {
                  "type": "obs",
                  "label": "Start Date",
                  "questionOptions": {
                    "rendering": "date",
                    "concept": "made-up-concept-5"
                  }
                },
                "value": "2015-10-31T21:00:00.000Z"
              },
              "obs1_madenupnconceptn6": {
                "concept": "made-up-concept-6",
                "schemaQuestion": {
                  "type": "obs",
                  "label": "End Date",
                  "questionOptions": {
                    "rendering": "date",
                    "concept": "made-up-concept-6"
                  }
                },
                "value": "2015-12-08T21:00:00.000Z"
              }
            }
          }
          // ,
          // {
          //   "obs1_a8a07a48x1350x11dfxa1f1n0026b9348838": {
          //     "value": "Stomach complications"
          //   },
          //   "obsGroup_Date of hospitalization": {
          //     "obs1_madenupnconceptn5": {
          //       "value": "2015-10-31T21:00:00.000Z"
          //     },
          //     "obs1_madenupnconceptn6": {
          //       "value": "2015-11-24T21:00:00.000Z"
          //     }
          //   }
          // }
        ]
      }
    };
  }

  }
})();

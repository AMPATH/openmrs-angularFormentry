[![Build Status](https://travis-ci.org/AMPATH/openmrs-angularFormentry.svg?branch=master)](https://travis-ci.org/AMPATH/openmrs-angularFormentry)
# angular-formentry

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Introduction

Angular OpenMRS formentry is a module that aims at using angular framework to create a standalone module that can be used by the community and angular AMRS project to create forms.
This Module will require a schema in a given format. This schema will be passed to this module which will generate a form based on the schema specification.


## Module Components

This module has the following key components:
- Field Handlers
- Form/field Validators
- Payload generators

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


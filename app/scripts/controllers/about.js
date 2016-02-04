/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
    'use strict';
    /**
     * @ngdoc function
     * @name angularFormentryApp.controller:AboutCtrl
     * @description
     * # AboutCtrl
     * Controller of the angularFormentryApp
     */
    angular
        .module('angularFormentry')
        .controller('AboutCtrl', AboutCtrl);

  AboutCtrl.$inject = ['$log', '$location', '$scope','FormEntry', '$timeout', 
    '$filter','TestService', 'FormentryUtilService', '$rootScope', 'configService',
    'AuthService', 'SearchDataService'
  ];

    function AboutCtrl($log, $location, $scope, FormEntry,
        $timeout, $filter, TestService, FormentryUtilService, $rootScope, configService, AuthService, SearchDataService) {
        $scope.vm = {};
        $scope.vm.model = {};
        $scope.vm.questionMap = {};
        $scope.vm.hasClickedSubmit = false;
        var schema;
        var newForm;
        var testSchema = 'schema_encounter';

        //connect to database
        configService.addJsonSchema('hostServer', 'http://localhost:8080/amrs/ws/rest/v1/');

        //broad cast server connection
        $rootScope.$broadcast('hostServer', configService.getSchema('hostServer'));
        var user = { username: 'akwatuha', password: 'ttt' };
        AuthService.isAuthenticated(user, function (authenticated) {
            if (!authenticated) // check if user is authenticated
            {
                console.log('Invalid user name or password. Please try again');
            } else {
                console.log(authenticated);
            }

        }); 
       
        //testing search connection
        SearchDataService.findLocation('abu', function (success) {
            console.log(JSON.stringify(success));
        },
            function (error) {
                console.log(JSON.stringify(error));
            });


        FormentryUtilService.getFormSchema(testSchema, function (data) {
            schema = data;
            $log.info('Schema Controller', schema);
            var formObject = FormEntry.createForm(schema, $scope.vm.model);
            newForm = formObject.formlyForm;
            $log.debug('schema xxx', newForm);
            $scope.vm.tabs = newForm;
            $scope.vm.questionMap = formObject.questionMap;
            console.log('final question map', $scope.vm.questionMap);
        });


        var restObs = {
            uuid: "test-uuid",
            encounterDatetime: "2015-11-30T14:44:38.000+0300",
            form: {
                uuid: "a2b811ed-6942-405a-b7f8-e7ad6143966c",
                name: "Triage Encounter Form v0.01"
            },
            location: {
                uuid: "08fec056-1352-11df-a1f1-0026b9348838",
                display: "Location-13"
            },
            encounterType: {
                uuid: "a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7",
                display: "TRIAGE"
            },
            provider: {
                uuid: "5b6e31da-1359-11df-a1f1-0026b9348838",
                display: "Giniton Giniton Giniton"
            },
            obs: [
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "9ce5dbf0-a141-4ad8-8c9d-cd2bf84fe72b"
                    },
                    value: {
                        uuid: "a89ad3a4-1350-11df-a1f1-0026b9348838",
                        display: "NOT APPLICABLE"
                    },
                    groupMembers: null
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a894b1cc-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a893516a-1350-11df-a1f1-0026b9348838",
                        display: "CONDOMS"
                    },
                    groupMembers: null
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a894b1cc-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "b75702a6-908d-491b-9399-6495712c81cc",
                        display: "EMERGENCY OCP"
                    },
                    groupMembers: null
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a899e6d8-1350-11df-a1f1-0026b9348838"
                    },
                    value: null,
                    groupMembers: [
                        {
                            uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a65e36-1350-11df-a1f1-0026b9348838"
                            },
                            value: 80,
                            groupMembers: null
                        },
                        {
                            uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a65fee-1350-11df-a1f1-0026b9348838"
                            },
                            value: 35,
                            groupMembers: null
                        }
                    ]
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a003a6y1350y11dfya1f1y0026b9348838"
                    },
                    value: null,
                    groupMembers: [
                        {
                            uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a07a48x1350x11dfxa1f1-0026b9348838"
                            },
                            value: 'testing repeating',
                            groupMembers: null
                        },
                        {
                            uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "made-up-concept-4"
                            },
                            value: null,
                            groupMembers: [
                                {
                                    uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-5"
                                    },
                                    value: "2015-11-30T14:44:38.000+0300",
                                    groupMembers: null
                                },
                                {
                                    uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-6"
                                    },
                                    value: "2015-12-30T14:44:38.000+0300",
                                    groupMembers: null
                                }
                            ]
                        }
                    ]
                },
                {
                    uuid: "655fb051-499f-4240-9a1d-0dff5f8b5730",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a003a6y1350y11dfya1f1y0026b9348838"
                    },
                    value: null,
                    groupMembers: [
                        {
                            uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "a8a07a48x1350x11dfxa1f1-0026b9348838"
                            },
                            value: 'testing repeating 2 now',
                            groupMembers: null
                        },
                        {
                            uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                            obsDatetime: "2015-11-30T14:44:38.000+0300",
                            concept: {
                                uuid: "made-up-concept-4"
                            },
                            value: null,
                            groupMembers: [
                                {
                                    uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-5"
                                    },
                                    value: "2015-04-30T14:44:38.000+0300",
                                    groupMembers: null
                                },
                                {
                                    uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                                    concept: {
                                        uuid: "made-up-concept-6"
                                    },
                                    value: "2015-05-30T14:44:38.000+0300",
                                    groupMembers: null
                                }
                            ]
                        }
                    ]
                },
                {
                    uuid: "d168285f-636b-4558-aaf1-7036e4a49f80",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65e36-1350-11df-a1f1-0026b9348838"
                    },
                    value: 80,
                    groupMembers: null
                },
                {
                    uuid: "fcf67bd7-612a-48a3-9e8d-5097af648c05",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65fee-1350-11df-a1f1-0026b9348838"
                    },
                    value: 35,
                    groupMembers: null
                },
                {
                    uuid: "29953cdb-d4e3-4024-9bb1-e1c0a7fca6ce",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8b02524-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "8b715fed-97f6-4e38-8f6a-c167a42f8923",
                        display: "KENYA NATIONAL HEALTH INSURANCE FUND"
                    },
                    groupMembers: null
                },
                {
                    uuid: "5e12a2f5-678b-4b1e-a646-23221bad8797",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65f12-1350-11df-a1f1-0026b9348838"
                    },
                    value: 50,
                    groupMembers: null
                },
                {
                    uuid: "51e18815-8032-4cb4-b2e8-8c561ee53093",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a6619c-1350-11df-a1f1-0026b9348838"
                    },
                    value: 180,
                    groupMembers: null
                },
                {
                    uuid: "f26402b1-5226-4afd-a60c-c2ea096783c1",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "93aa3f1d-1c39-4196-b5e6-8adc916cd5d6"
                    },
                    value: {
                        uuid: "a89ad3a4-1350-11df-a1f1-0026b9348838",
                        display: "NOT APPLICABLE"
                    },
                    groupMembers: null
                },
                {
                    uuid: "aaaf883b-ba97-45ef-8b32-d37a48bb2342",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a899a9f2-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a899ac7c-1350-11df-a1f1-0026b9348838",
                        display: "NEVER MARRIED"
                    },
                    groupMembers: null
                },
                {
                    uuid: "2cc74686-92ba-49cc-af49-6f1a02e608ba",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a65d5a-1350-11df-a1f1-0026b9348838"
                    },
                    value: 120,
                    groupMembers: null
                },
                {
                    uuid: "5d268f3a-a6c9-495a-bf15-605e94a7eb08",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a89ff9a6-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a89b6440-1350-11df-a1f1-0026b9348838",
                        display: "SCHEDULED VISIT"
                    },
                    groupMembers: null
                },
                {
                    uuid: "557a1246-b3a7-49d2-9f27-e1a6c1059496",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8a660ca-1350-11df-a1f1-0026b9348838"
                    },
                    value: 65,
                    groupMembers: null
                },
                {
                    uuid: "ccfba5fc-8202-4506-a2ab-7a9dd04569bb",
                    obsDatetime: "2015-11-30T14:44:38.000+0300",
                    concept: {
                        uuid: "a8af49d8-1350-11df-a1f1-0026b9348838"
                    },
                    value: {
                        uuid: "a899b42e-1350-11df-a1f1-0026b9348838",
                        display: "NO"
                    },
                    groupMembers: null
                }
            ]
        };
        // UtilService.getTestEncounterData('xx', function(data) {
        //   restObs = data;
        // },
        //
        // function(error) {
        //   $log.error(error);
        // }
        // );

        $scope.vm.anyFieldsInError = function (fields) {
            if (fields && fields.length !== 0) {
                var hasError = false;
                _.each(fields, function (field) {
                    if (field.formControl && field.formControl.$error && Object.keys(field.formControl.$error).length > 0) {
                        hasError = true;
                    }
                });
                return hasError;
            }
            return false;
        };

        $scope.vm.onSubmit = function () {
            $scope.vm.hasClickedSubmit = true;
            var obsPayload = FormEntry.getFormPayload($scope.vm.model);
            $log.debug('test payload', JSON.stringify(obsPayload));

            var personAttributePayload = FormEntry.getPersonAttributesPayload($scope.vm.model);
            $log.debug('test person attribute payload', JSON.stringify(personAttributePayload));
        };

        // var form = TestService.getCompiledForm();
        // $scope.vm.model = form.compiledSchema[0].compiledPage[0].sectionModel;

        $scope.vm.submitLabel = 'Save';

        _activate();
        function parseDate(value) {
            return $filter('date')(value || new Date(), 'yyyy-MM-dd HH:mm:ss', '+0300');
        }

        function _activate() {
            // $scope.vm.tabs =
            // [
            //   {
            //     title: 'Tab 1',
            //     active: true,
            //     form: {
            //       options: {},
            //       model: $scope.vm.model,
            //       fields: [
            //       {
            //         key: 'section_1',
            //         type: 'section',
            //         templateOptions: {
            //           label: 'Tarehe'
            //         },
            //         data: {
            //           fields: [
            //             {
            //                 key: 'encounterDate',
            //                 type: 'datetimepicker',
            //                 defaultValue: parseDate(new Date()),
            //                 templateOptions: {
            //                     type: 'text',
            //                     label: 'Tarehe',
            //                     // datepickerPopup: 'dd-MMM-yyyy HH:mm:ss'
            //                   }
            //               },
            //               {
            //                 key: 'email',
            //                 type: 'input',
            //                 templateOptions: {
            //                   label: 'Username',
            //                   type: 'email',
            //                   placeholder: 'Email address'
            //                 },
            //                 expressionProperties: {
            //                   'templateOptions.required': 'true'
            //                 },
            //               },
            //               {
            //                 key: 'marvel1',
            //                 type: 'select',
            //                 data:{concept:'a899e444-1350-11df-a1f1-0026b9348838'},
            //                 templateOptions: {
            //                   required:true,
            //                   label: 'Normal Select',
            //                   options: [
            //                     {name: 'Iron Man', value: 'iron_man'},
            //                     {name: 'Captain America', value: 'captain_america'},
            //                     {name: 'Black Widow', value: 'black_widow'},
            //                     {name: 'Hulk', value: 'hulk'},
            //                     {name: 'Captain Marvel', value: 'captain_marvel'}
            //                   ]
            //                 }
            //               }
            //             ]
            //         }
            //       },
            //       {
            //         key: 'other_Fields',
            //         type: 'section',
            //         templateOptions: {
            //           label: 'Other Fields'
            //         },
            //         data: {
            //           fields: [
            //             {
            //               key: 'town2',
            //               type: 'input',
            //               templateOptions: {
            //                 required: true,
            //                 type: 'text',
            //                 label: 'Test Town'
            //               }
            //             },
            //             {
            //               key: 'country2',
            //               type: 'input',
            //               templateOptions: {
            //                 required: true,
            //                 type: 'text',
            //                 label: 'Test Country'
            //               }
            //             }
            //           ]
            //         }
            //       }
            //     ]
            //     }
            //   },
            //   {
            //     title: 'Tab 2',
            //     form: {
            //       options: {},
            //       model: $scope.vm.model,
            //       fields: [
            //         {
            //           key: 'address',
            //           type: 'section',
            //           templateOptions: {
            //             label: 'Address'
            //           },
            //           data: {
            //             fields: [
            //               {
            //                 key: 'town',
            //                 type: 'input',
            //                 templateOptions: {
            //                   required: true,
            //                   type: 'text',
            //                   label: 'Town'
            //                 }
            //               },
            //               {
            //                 key: 'country',
            //                 type: 'input',
            //                 templateOptions: {
            //                   required: true,
            //                   type: 'text',
            //                   label: 'Country'
            //                 }
            //               }
            //             ]
            //           }
            //         }
            //       ]
            //     }
            //   },
            //   {
            //     "title": "Example From JJ",
            //     options: {},
            //     form: {
            //       model: $scope.vm.model,
            //       fields: form.compiledSchema[0].compiledPage[0].formlyFields
            //     }
            //   }
            // ];

        }

    }
}
    )();

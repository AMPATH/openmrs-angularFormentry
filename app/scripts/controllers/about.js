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

  AboutCtrl.$inject = ['$log', '$location',  '$scope',
    'FormEntry', '$timeout', '$filter',
    'TestService', 'UtilService'
  ];

  function AboutCtrl($log, $location, $scope, FormEntry,
        $timeout, $filter,TestService, UtilService) {
    $scope.vm = {};
    $scope.vm.model = {};
    var schema;
    var newForm;
    UtilService.getFormSchema('schema_encounter', function(data) {
      schema = data;
      $log.info('Schema Controller', schema);
      FormEntry.createForm(schema, $scope.vm.model, function(_form) {
        newForm = _form;
        $log.debug('schema xxx', newForm);
        $scope.vm.tabs = newForm;
      });

    });

    $scope.vm.onSubmit = function() {
      FormEntry.getFormPayload($scope.vm.model, function(payload) {
        var obsPayload = payload;
        $log.debug('test payload', JSON.stringify(obsPayload));
      });
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

        function _activate() {
            $scope.vm.tabs = [
                {
                    title: 'Tab 1',
                    active: true,
                    form: {
                        options: {},
                        model: $scope.vm.model,
                        fields: [
                            {
                                key: 'section_1',
                                type: 'section',
                                templateOptions: {
                                    label: 'Tarehe'
                                },
                                data: {
                                    fields: [
                                        {
                                            key: 'encounterDate',
                                            type: 'datetimepicker',
                                            defaultValue: parseDate(new Date()),
                                            templateOptions: {
                                                type: 'text',
                                                label: 'Tarehe'
                                                        // datepickerPopup: 'dd-MMM-yyyy HH:mm:ss'
                                            }
                                        },
                                        {
                                            key: 'email',
                                            type: 'input',
                                            templateOptions: {
                                                label: 'Username',
                                                type: 'email',
                                                placeholder: 'Email address'
                                            },
                                            expressionProperties: {
                                                'templateOptions.required': 'true'
                                            },
                                        },
                                        {
                                            key: 'marvel1',
                                            type: 'select',
                                            data: {concept: 'a899e444-1350-11df-a1f1-0026b9348838'},
                                            templateOptions: {
                                                required: true,
                                                label: 'Normal Select',
                                                options: [
                                                    {name: 'Iron Man', value: 'iron_man'},
                                                    {name: 'Captain America', value: 'captain_america'},
                                                    {name: 'Black Widow', value: 'black_widow'},
                                                    {name: 'Hulk', value: 'hulk'},
                                                    {name: 'Captain Marvel', value: 'captain_marvel'}
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                key: 'other_Fields',
                                type: 'section',
                                templateOptions: {
                                    label: 'Other Fields'
                                },
                                data: {
                                    fields: [
                                        {
                                            key: 'town2',
                                            type: 'input',
                                            templateOptions: {
                                                required: true,
                                                type: 'text',
                                                label: 'Test Town'
                                            }
                                        },
                                        {
                                            key: 'country2',
                                            type: 'input',
                                            templateOptions: {
                                                required: true,
                                                type: 'text',
                                                label: 'Test Country'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Tab 2',
                    form: {
                        options: {},
                        model: $scope.vm.model,
                        fields: [
                            {
                                key: 'address',
                                type: 'section',
                                templateOptions: {
                                    label: 'Address'
                                },
                                data: {
                                    fields: [
                                        {
                                            key: 'town',
                                            type: 'input',
                                            templateOptions: {
                                                required: true,
                                                type: 'text',
                                                label: 'Town'
                                            }
                                        },
                                        {
                                            key: 'country',
                                            type: 'input',
                                            templateOptions: {
                                                required: true,
                                                type: 'text',
                                                label: 'Country'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ];

            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        }
    }
})();

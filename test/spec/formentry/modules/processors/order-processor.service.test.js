/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation*/
/*jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
    'use strict';

    describe('Order Processor Unit Tests', function () {
        beforeEach(function () {
            module('angularFormentry');
            module('openmrs.angularFormentry');
            module('mock.data');
        });

        var orderProcessorService;

        var newOrderModelSample = {
            concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            type: 'testorder',
            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
        };

        var existingOrderModelSample = {
            uuid: 'bbd17798-27da-4d71-aeef-7f624e135a09',
            concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            type: 'testorder',
            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66',
            orderNumber: 'ORD-2'
        };

        var modifiedStateOfVirtualGroupOrderModelSample = {
            orderType: 'testorder',
            orderConcepts: ['5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept3'],
            orderSetting: 'orderSetting',
            orders: [
                newOrderModelSample,
                existingOrderModelSample
            ],
            deletedOrders: [
                {
                    concept: 'concept3',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                },
                {
                    uuid: 'deleteduuid',
                    concept: 'concept4',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                }
            ]
        };

        var modifiedStateOfVirtualGroupOrderModelSample2 = {
            orderType: 'testorder',
            orderConcepts: ['5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept3'],
            orderSetting: 'orderSetting',
            orders: [
                {
                    concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                },
                {
                    uuid: 'anotherValue',
                    concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                }
            ],
            deletedOrders: [
                {
                    concept: 'concept3',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                },
                {
                    uuid: 'deleteduuid2',
                    concept: 'concept4',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                }
            ]
        };

        var orderPayloadArraySample = [
            {
                "uuid": "bbd17798-27da-4d71-aeef-7f624e135a09",
                "orderNumber": "ORD-2",
                "patient": {
                    "uuid": "8af822e7-fadf-44dd-a65b-cb2f0ad98179",
                    "display": "10018C - alfayo t test",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/patient/8af822e7-fadf-44dd-a65b-cb2f0ad98179"
                        }
                    ]
                },
                "concept": {
                    "uuid": "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "display": "Blood oxygen saturation",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/concept/5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                        }
                    ]
                },
                "action": "NEW",
                "careSetting": {
                    "uuid": "c365e560-c3ec-11e3-9c1a-0800200c9a66",
                    "display": "Inpatient",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/caresetting/c365e560-c3ec-11e3-9c1a-0800200c9a66"
                        }
                    ]
                },
                "previousOrder": null,
                "dateActivated": "2016-05-16T09:58:54.000-0400",
                "dateStopped": null,
                "autoExpireDate": null,
                "encounter": {
                    "uuid": "0ef81af7-6f5f-4e95-b188-9967fc3c916c",
                    "display": "Visit Note 05/04/2016",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/encounter/0ef81af7-6f5f-4e95-b188-9967fc3c916c"
                        }
                    ]
                },
                "orderer": {
                    "uuid": "f9badd80-ab76-11e2-9e96-0800200c9a66",
                    "display": "UNKNOWN - Super User",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/provider/f9badd80-ab76-11e2-9e96-0800200c9a66"
                        }
                    ]
                },
                "orderReason": null,
                "orderReasonNonCoded": null,
                "urgency": "ROUTINE",
                "instructions": null,
                "commentToFulfiller": null,
                "display": "Blood oxygen saturation",
                "specimenSource": null,
                "laterality": null,
                "clinicalHistory": null,
                "frequency": null,
                "numberOfRepeats": null,
                "links": [
                    {
                        "rel": "self",
                        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/order/bbd17798-27da-4d71-aeef-7f624e135a09"
                    },
                    {
                        "rel": "full",
                        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/order/bbd17798-27da-4d71-aeef-7f624e135a09?v=full"
                    }
                ],
                "type": "testorder",
                "resourceVersion": "1.10"
            },
            {
                "uuid": "cb505914-f29b-440a-955b-acfbd29488ac",
                "orderNumber": "ORD-3",
                "patient": {
                    "uuid": "8af822e7-fadf-44dd-a65b-cb2f0ad98179",
                    "display": "10018C - alfayo t test",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/patient/8af822e7-fadf-44dd-a65b-cb2f0ad98179"
                        }
                    ]
                },
                "concept": {
                    "uuid": "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "display": "Systolic blood pressure",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/concept/5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                        }
                    ]
                },
                "action": "NEW",
                "careSetting": {
                    "uuid": "c365e560-c3ec-11e3-9c1a-0800200c9a66",
                    "display": "Inpatient",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/caresetting/c365e560-c3ec-11e3-9c1a-0800200c9a66"
                        }
                    ]
                },
                "previousOrder": null,
                "dateActivated": "2016-05-16T09:58:54.000-0400",
                "dateStopped": null,
                "autoExpireDate": null,
                "encounter": {
                    "uuid": "0ef81af7-6f5f-4e95-b188-9967fc3c916c",
                    "display": "Visit Note 05/04/2016",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/encounter/0ef81af7-6f5f-4e95-b188-9967fc3c916c"
                        }
                    ]
                },
                "orderer": {
                    "uuid": "f9badd80-ab76-11e2-9e96-0800200c9a66",
                    "display": "UNKNOWN - Super User",
                    "links": [
                        {
                            "rel": "self",
                            "uri": "NEED-TO-CONFIGURE/ws/rest/v1/provider/f9badd80-ab76-11e2-9e96-0800200c9a66"
                        }
                    ]
                },
                "orderReason": null,
                "orderReasonNonCoded": null,
                "urgency": "ROUTINE",
                "instructions": null,
                "commentToFulfiller": null,
                "display": "Systolic blood pressure",
                "specimenSource": null,
                "laterality": null,
                "clinicalHistory": null,
                "frequency": null,
                "numberOfRepeats": null,
                "links": [
                    {
                        "rel": "self",
                        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/order/cb505914-f29b-440a-955b-acfbd29488ac"
                    },
                    {
                        "rel": "full",
                        "uri": "NEED-TO-CONFIGURE/ws/rest/v1/order/cb505914-f29b-440a-955b-acfbd29488ac?v=full"
                    }
                ],
                "type": "testorder",
                "resourceVersion": "1.10"
            }
        ];



        beforeEach(inject(function ($injector) {
            orderProcessorService = $injector.get('OrderProcessorService');
        }));

        it('should inject an Order Processor service',
            function () {
                expect(orderProcessorService).to.be.defined;
            });
        it('should create the right order model when createOrderModel is called',
            function () {
                var expectedModel = existingOrderModelSample;
                var orderPayload = orderPayloadArraySample[0];
                var createdModel = orderProcessorService.createOrderModel(orderPayload);

                //console.log('expectedModel', JSON.stringify(expectedModel));
                //console.log('created Model', JSON.stringify(createdModel));
                expect(expectedModel).to.deep.equal(createdModel);

            });

        it('should find the right virtual group for an order by concept when ' +
            'findVirtualGroupModelByConcept is invoked',
            function () {
                var virtualGroups = [
                    {
                        orderConcepts: ['concept3', '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA']
                    },
                    {
                        orderConcepts: ['5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept4']
                    }
                ];

                var found = orderProcessorService.findVirtualGroupModelByConcept(
                    '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', virtualGroups
                );

                expect(found).to.equal(virtualGroups[0]);

                found = orderProcessorService.findVirtualGroupModelByConcept(
                    '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', virtualGroups
                );

                expect(found).to.equal(virtualGroups[1]);

            });


        it('should find the right virtual group for an order by concept when ' +
            'fillVirtualGroupsModelWithPayload is invoked',
            function () {
                var virtualGroups = [
                    {
                        orderConcepts: ['concept3', '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
                        orders: []
                    },
                    {
                        orderConcepts: ['5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept4'],
                        orders: []
                    }
                ];

                var expectedVirtualGroupsAfterFilling = [
                    {
                        orderConcepts: ['concept3', '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
                        orders: [existingOrderModelSample]
                    },
                    {
                        orderConcepts: ['5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept4'],
                        orders: [
                            {
                                uuid: 'cb505914-f29b-440a-955b-acfbd29488ac',
                                concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                                type: 'testorder',
                                orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                                careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66',
                                orderNumber: 'ORD-3'
                            }
                        ]
                    }
                ];

                orderProcessorService.fillVirtualGroupsModelWithPayload(orderPayloadArraySample, virtualGroups);
                expect(virtualGroups).to.deep.equal(expectedVirtualGroupsAfterFilling);
            });

        it('should extract virtual order groups from the model when ' +
            'extractVirtualOrderGroupsFromModel is invoked',
            function () {
                var expectedVirtualGroups = [
                    {
                        orderType: 'testorder',
                        orderConcepts: ['5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept4'],
                        orderSetting: 'orderSetting',
                        orders: []
                    },
                    {
                        orderType: 'testorder',
                        orderConcepts: ['concept3', '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
                        orderSetting: 'orderSetting',
                        orders: []
                    }
                ];

                var modelWithVirtualGroups = {
                    someproperty: {
                        some2ndLevelProperty: {
                            someDeeperProperty: {
                                orderType: 'testorder',
                                orderConcepts: ['5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept4'],
                                orderSetting: 'orderSetting',
                                orders: []
                            }
                        }
                    },
                    someArrayProperty: [
                        {
                            somePrimitiveProperty: 123,
                            someDateProperty: new Date(),
                            someStringProperty: 'string',
                            someBooleanProperty: true
                        },
                        {
                            someArrayProperty: [
                                {
                                    somePrimitiveValue: 'primitive'
                                },
                                {
                                    orderType: 'testorder',
                                    orderConcepts: ['concept3', '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
                                    orderSetting: 'orderSetting',
                                    orders: []
                                }
                            ]
                        }
                    ]
                };

                var actualExtractedVirtualGroups =
                    orderProcessorService.extractVirtualOrderGroupsFromModel(modelWithVirtualGroups);
                expect(actualExtractedVirtualGroups).to.deep.equal(expectedVirtualGroups);
            });

        it('should extract virtual order groups from the model when ' +
            'extractVirtualOrderGroupsFromModel is invoked',
            function () {

                var modelWithVirtualGroups = {
                    someproperty: {
                        some2ndLevelProperty: {
                            someDeeperProperty: {
                                orderType: 'testorder',
                                orderConcepts: ['5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept4'],
                                orderSetting: 'orderSetting',
                                orders: []
                            }
                        }
                    },
                    someArrayProperty: [
                        {
                            somePrimitiveProperty: 123,
                            someDateProperty: new Date(),
                            someStringProperty: 'string',
                            someBooleanProperty: true
                        },
                        {
                            someArrayProperty: [
                                {
                                    somePrimitiveValue: 'primitive'
                                },
                                {
                                    orderType: 'testorder',
                                    orderConcepts: ['concept3', '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
                                    orderSetting: 'orderSetting',
                                    orders: []
                                }
                            ]
                        }
                    ]
                };

                var filledModel = {
                    someproperty: {
                        some2ndLevelProperty: {
                            someDeeperProperty: {
                                orderType: 'testorder',
                                orderConcepts: ['5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'concept4'],
                                orderSetting: 'orderSetting',
                                orders: [
                                    {
                                        uuid: 'cb505914-f29b-440a-955b-acfbd29488ac',
                                        concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                                        type: 'testorder',
                                        orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                                        careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66',
                                        orderNumber: 'ORD-3'
                                    }
                                ]
                            }
                        }
                    },
                    someArrayProperty: [
                        {
                            somePrimitiveProperty: 123,
                            someDateProperty: new Date(),
                            someStringProperty: 'string',
                            someBooleanProperty: true
                        },
                        {
                            someArrayProperty: [
                                {
                                    somePrimitiveValue: 'primitive'
                                },
                                {
                                    orderType: 'testorder',
                                    orderConcepts: ['concept3', '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
                                    orderSetting: 'orderSetting',
                                    orders: [existingOrderModelSample]
                                }
                            ]
                        }
                    ]
                };

                orderProcessorService.populateModel(modelWithVirtualGroups, orderPayloadArraySample);
                expect(modelWithVirtualGroups).to.deep.equal(filledModel);
            });

        it('should create the right single order payload when getOrderPayload is called',
            function () {
                //case new order
                var newOrderModel = newOrderModelSample;
                var expectedPayloadObject = {
                    concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                };

                var actualPayloadObject = orderProcessorService.getOrderPayload(newOrderModel);

                expect(expectedPayloadObject).to.deep.equal(actualPayloadObject);

                //case existing order
                var existingOrderModel = existingOrderModelSample;

                expectedPayloadObject = {
                    uuid: 'bbd17798-27da-4d71-aeef-7f624e135a09'
                    //concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', Not Editable
                    //type: 'testorder', Not Editable
                    //orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66', Not Editable
                    //careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66', Not Editable
                    //orderNumber: 'ORD-2', Not Editable
                };

                actualPayloadObject = orderProcessorService.getOrderPayload(existingOrderModel);
                expect(expectedPayloadObject).to.deep.equal(actualPayloadObject);
            });

        it('should create the right virtual group order payload when getVirtualGroupOrderPayload is called',
            function () {
                var groupOrder = modifiedStateOfVirtualGroupOrderModelSample;

                var expectedPayloadObject = {
                    encounterAppendableOrderPayload: [
                        {
                            concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                            type: 'testorder',
                            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                        },
                        {
                            uuid: 'bbd17798-27da-4d71-aeef-7f624e135a09'
                        }
                    ],
                    deletedOrdersUuid: ['deleteduuid']
                };

                var actualPayloadObject = orderProcessorService.getVirtualGroupOrderPayload(groupOrder);
                expect(expectedPayloadObject).to.deep.equal(actualPayloadObject);

            });

        it('should merge virtual group order payloads when mergeVirtualGroupOrderPayLoads is called',
            function () {

                var payloadObject1 = {
                    encounterAppendableOrderPayload: [
                        {
                            concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                            type: 'testorder',
                            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                        },
                        {
                            uuid: 'bbd17798-27da-4d71-aeef-7f624e135a09'
                        }
                    ],
                    deletedOrdersUuid: ['deleteduuid']
                };

                var payloadObject2 = {
                    encounterAppendableOrderPayload: [
                        {
                            concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                            type: 'testorder',
                            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                        },
                        {
                            uuid: 'anotherValue'
                        }
                    ],
                    deletedOrdersUuid: ['deleteduuid2']
                };

                var expectededFinalPayloadObject = {
                    encounterAppendableOrderPayload: [
                        {
                            concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                            type: 'testorder',
                            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                        },
                        {
                            uuid: 'bbd17798-27da-4d71-aeef-7f624e135a09'
                        },
                        {
                            concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                            type: 'testorder',
                            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                        },
                        {
                            uuid: 'anotherValue'
                        }
                    ],
                    deletedOrdersUuid: ['deleteduuid', 'deleteduuid2']
                };

                var actualFinalPayloadObject = orderProcessorService.
                    mergeVirtualGroupOrderPayLoads([payloadObject1, payloadObject2]);
                expect(expectededFinalPayloadObject).to.deep.equal(actualFinalPayloadObject);

            });

        it('should generate order payload when generateOrderPayload is called',
            function () {

                var sampleModel = {
                    someProperty: 'property',
                    someObject: {
                        someArray: [
                            {
                                someproperty: 'someprop',
                                someOrder: modifiedStateOfVirtualGroupOrderModelSample
                            }
                        ]
                    },
                    someOject2: {
                        someProperty: {
                            someOrder: modifiedStateOfVirtualGroupOrderModelSample2
                        }
                    }
                };

                var expectededFinalPayloadObject = {
                    encounterAppendableOrderPayload: [
                        {
                            concept: '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                            type: 'testorder',
                            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                        },
                        {
                            uuid: 'bbd17798-27da-4d71-aeef-7f624e135a09'
                        },
                        {
                            concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                            type: 'testorder',
                            orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                            careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66'
                        },
                        {
                            uuid: 'anotherValue'
                        }
                    ],
                    deletedOrdersUuid: ['deleteduuid', 'deleteduuid2']
                };

                var actualFinalPayloadObject = orderProcessorService.
                    generateOrderPayload(sampleModel);

                expect(expectededFinalPayloadObject).to.deep.equal(actualFinalPayloadObject);

            });

        it('should populate orderer when populatePayloadProvider is called',
            function () {
                var providerUuid = 'provider-uuid';

                //case single order payload
                var sampleSinglePayload = {
                    concept: 'concept',
                    type: 'type',
                    orderer: undefined,
                    careSetting: 'care-setting'
                };

                var expected = {
                    concept: 'concept',
                    type: 'type',
                    orderer: 'provider-uuid',
                    careSetting: 'care-setting'
                };

                orderProcessorService.populatePayloadProvider(sampleSinglePayload, providerUuid);

                expect(sampleSinglePayload).to.deep.equal(expected);


                //case array of orders
                var sampleArray = [
                    {
                        concept: 'concept',
                        type: 'type',
                        orderer: undefined,
                        careSetting: 'care-setting'
                    },
                    {
                        concept: 'concept 2',
                        type: 'type',
                        orderer: undefined,
                        careSetting: 'care-setting'
                    }
                ];

                var expectedArray = [
                    {
                        concept: 'concept',
                        type: 'type',
                        orderer: 'provider-uuid',
                        careSetting: 'care-setting'
                    },
                    {
                        concept: 'concept 2',
                        type: 'type',
                        orderer: 'provider-uuid',
                        careSetting: 'care-setting'
                    }
                ];

                orderProcessorService.populatePayloadProvider(sampleArray, providerUuid);

                expect(JSON.stringify(sampleArray)).to.equal(JSON.stringify(expectedArray));

            });

    });
})();
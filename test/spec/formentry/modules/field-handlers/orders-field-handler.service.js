/*jshint -W026, -W030, -W106, -W117 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
    'use strict';
    describe('Order Field Handler Service unit tests', function () {
        beforeEach(function () {
            module('angularFormentry');
            module('openmrs.angularFormentry');
        });

        var ordersFieldHanlderService;

        beforeEach(inject(function ($injector) {
            ordersFieldHanlderService = $injector.get('OrdersFieldHandler');
        }));

        it('should create the right order field when createOrderField is invoked with a question',
            function () {
                var question = {
                    label: 'Tests Ordered',
                    id: 'order1',
                    type: 'testOrder',
                    questionOptions: {
                        rendering: 'repeating',
                        selectableOrders: [
                            {
                                concept: 'a898f50c-1350-11df-a1f1-0026b9348838',
                                label: 'CBC'
                            },
                            {
                                concept: 'a896cce6-1350-11df-a1f1-0026b9348838',
                                label: 'CD4'
                            }
                        ],
                        orderCareSetting: 'some-setting-uuid',
                        orderType:'testorder'
                    }
                };

                var expectedField = {
                    type: "orderSection",
                    key: 'testorder1',
                    data: {
                        selectableOrders: [
                            {
                                concept: 'a898f50c-1350-11df-a1f1-0026b9348838',
                                label: 'CBC'
                            },
                            {
                                concept: 'a896cce6-1350-11df-a1f1-0026b9348838',
                                label: 'CD4'
                            }
                        ]
                    },
                    templateOptions: {
                        label: 'Tests Ordered',
                        fields: [
                            {
                                className: 'row',
                                fieldGroup: []
                            }
                        ],
                        createChildFieldModel: function(concept){
                            
                        }
                    }
                };


                var createdField = ordersFieldHanlderService.createOrderField(question,
                    {}, [], 'testorder1');
                console.log(JSON.stringify(createdField));
                console.log(JSON.stringify(expectedField));

                expect(JSON.stringify(createdField)).to.equal(JSON.stringify(expectedField));

            });

    });
})();

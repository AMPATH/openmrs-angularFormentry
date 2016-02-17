/* global inject */
/* global sinon */
/* global expect */
/* global it */
/* global beforeEach */
/* global describe */
/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
/*jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('schemaValidatorService Service unit tests', function() {
    beforeEach(function() {
        module('openmrs.angularFormentry');
        module('mock.data');
      });

    var mockData;
    var functionStub;
    var spy;
    var log;
    var schemaValidatorService;

    beforeEach(inject(function($injector) {
      log = $injector.get('$log');
      mockData = $injector.get('mockData');
      schemaValidatorService = $injector.get('schemaValidatorService');
    }));
    describe('validateSchema Method unit Tests with valid schema', function () {
            var mockSchema;
            var mockErrors;
            beforeEach(function () {
                functionStub = sinon.spy(schemaValidatorService, 'validateSchema');
                mockSchema = mockData.getMockSchema();
                mockErrors = schemaValidatorService.validateSchema(mockSchema);
            });

            it('should be called with parameters', function () {
                expect(functionStub).to.have.been.calledOnce;
                expect(functionStub.firstCall.calledWithExactly(sinon.match.object)).to.be.true;
                expect(functionStub.firstCall.calledWithExactly(mockSchema)).to.be.true;
            });

            it('should return an error object with required properties', function () {
                expect(mockErrors).to.be.an('object');
                expect(mockErrors.pass).to.equal(true);
                expect(mockErrors.errors).to.be.an('array');
            });
    });
    describe('validateSchema Method unit Tests with Invalid schema', function () {
            var mockSchema = {
              name: 'test-form',
              uuid: 'xxxx',
              processor: 'postEncounterForm',
              pages:[
                {
                  label:'page 1',
                  sections:[
                    {
                      label:'Encounter Details',
                      questions:[
                        {
                          label: 'Visit Date',
                          required: 'true',
                          id:'encDate',
                          questionOptions:{
                            rendering:'date'
                          },
                          validators:[{type:'date'}]
                        },
                        {
                          type: 'obs',
                          questionOptions:{
                            rendering:'date'
                          },
                          validators: [{type: 'date', allowFutureDates: 'true'}],
                          label: '7b. If Unscheduled, actual scheduled date'
                        },
                        {
                          type: 'obs',
                          questionOptions:{
                            concept: 'a896dea2-1350-11df-a1f1-0026b9348838',
                            rendering:'number',
                            max: 500,
                            min: 0
                          }
                        },
                        {
                          id:'q7a',
                          label: '7a. Visit Type',
                          type: 'obs',
                          required:'true',
                          questionOptions:{
                            concept: 'a89ff9a6-1350-11df-a1f1-0026b9348838',
                            type:'select',
                            answers:[
                              {value: 'a89b6440-1350-11df-a1f1-0026b9348838', label: 'Scheduled visit'},
                              {value: 'a89ff816-1350-11df-a1f1-0026b9348838', label: 'Unscheduled Visit Early'},
                              {value: 'a89ff8de-1350-11df-a1f1-0026b9348838', label: 'Unscheduled Visit Late'}
                            ]
                          },
                          validators: []
                        },
                        {
                          id:'q7a',
                          label: '7a. Visit Type',
                          type: 'obs',
                          required:'true',
                          questionOptions:{
                            concept: 'xxxx',
                            rendering:'select'
                          },
                          validators: []
                        }
                      ]
                    }
                  ]
                }
              ]
            };
            var mockErrors;
            beforeEach(function () {
                mockErrors = schemaValidatorService.validateSchema(mockSchema);
            });

            it('should return an error with the error message and id', function () {
                expect(mockErrors.pass).to.equal(false);
                expect(mockErrors.errors[0].error).to.equal('Field Missing Type property');
                expect(mockErrors.errors[0].id).to.equal('Visit Date');
                expect(mockErrors.errors[1].error).to.equal('Field Missing questionOptions.concept property');
                expect(mockErrors.errors[1].id).to.equal('7b. If Unscheduled, actual scheduled date');
                expect(mockErrors.errors[2].error).to.equal('Field Missing label property');
                expect(mockErrors.errors[3].error).to.equal('Field Missing questionOptions.rendering property');
                expect(mockErrors.errors[4].error).to.equal('Field Missing questionOptions.answers property');
            });
    });
  });
})();

/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation*/
/*jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';

    var encProcessor;
    var mockData;
    describe('Encounter Processor Unit Tests', function(){
        beforeEach(function(){
            module('angularFormentry');
            module('openmrs.angularFormentry');
            module('mock.data');
        });

        beforeEach(inject(function($injector){
            encProcessor = $injector.get('EncounterProcessorService');
            mockData = $injector.get('mockData');
        }));

        describe('generateEncounterPayload tests', function(){
            it('Should have all required fields', function(){
                var requiredFields = [
                    'encounterDatetime',
                    'provider',
                    'location'
                ];
                var payload = encProcessor
                                .generateEncounterPayload(mockData.getMockModel());

                expect(payload).to.contain.all.keys(requiredFields);
                expect(payload.provider).to.be.string;
                expect(payload).to.contain.keys('obs');
            });
        });

        describe('populateModel tests', function() {
            it('Should populate model with correct values from OpenMRS Rest ' +
               'encounter', function() {
                var encounter = mockData.getMockRestEncounter();
                var model = mockData.getTriageFormModel();
                var encSection = model['section_Encounter_Details'];

                encProcessor.populateModel(model, encounter);

                expect(encSection.encounterDatetime.value).to.equal(encounter.encounterDatetime);
                expect(encSection.encounterLocation.value).to.equal(encounter.location.uuid);
                expect(encSection.encounterProvider.value).to.equal(encounter.provider.uuid);
            });
        });
    });
})();

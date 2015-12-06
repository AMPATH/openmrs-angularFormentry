/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation*/
/*jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';
    
    var encProcessor;
    var mockData;
    describe('Encounter Processor Unit Tests', function(){
        beforeEach(function(){
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
                    'encounterProviders',
                    'location'
                ];
                var payload = encProcessor
                                .generateEncounterPayload(mockData.getMockModel());
                                
                expect(payload).to.contain.all.keys(requiredFields);
                expect(payload.encounterProviders).to.be.array;
                expect(payload).to.contain.keys('obs');
            });
        });
    });
})();

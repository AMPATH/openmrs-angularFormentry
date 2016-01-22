/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation*/
/*jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';
    
    var encData;
    var mocks;
    var histData;
    describe('Encounter Data Test', function(){
        beforeEach(function(){
            module('openmrs.angularFormentry');
            module('mock.data');
        });
        
        beforeEach(inject(function($injector){
            encData = $injector.get('EncounterDataService');
            mocks = $injector.get('mockData');
            histData = $injector.get('HistoricalDataService');
        }));
        
        describe('registerPreviousEncounters tests', function() {
            
            it('should register an encounter', function(){ 
                var repMocks = mocks.getOpenmrsRestAndHistoricalEncounterRepMocks();
                var openmrsRestRep = repMocks.openmrsEncounter;
                var expected = repMocks.prevEncounterRepresentation;
                
                // Register encounter historical data
                encData.registerPreviousEncounters('prevEnc', openmrsRestRep);   
                expect(histData.getObject('prevEnc').getSingleObject())
                                                    .to.deep.equal(expected);
            });
            
            it('should register in reverse chronological order', function() {
                var encArray = [{
                    "uuid": "encounter-uuid-kasa",
                    "encounterDatetime": "2016-01-01T16:17:46.000+0300",
                    "provider": {
                        "uuid": "provider-uuid",
                        "display": "5566790 - H Dengue Provider",
                    },
                    "obs": [{
                        "uuid": "ac55c445-9661-4d42-86b5-4d6ec33a6274",
                        "obsDatetime": "2016-01-21T16:17:46.000+0300",
                        "concept": {
                            "uuid": "a8a666ba-1350-11df-a1f1-0026b9348838"
                        },
                        "value": "2016-02-26T00:00:00.000+0300",
                        "groupMembers": null
                    }]
                }, {
                    "uuid": "encounter-uuid-kisi",
                    "encounterDatetime": "2016-01-21T16:17:46.000+0300",
                    "provider": {
                        "uuid": "provider-uuid",
                        "display": "5566790 - H Dengue Provider",
                    },
                    "obs": [{
                        "uuid": "ac55c445-9661-4d42-86b5-4d6ec33a6274",
                        "obsDatetime": "2016-01-21T16:17:46.000+0300",
                        "concept": {
                            "uuid": "a8a666ba-1350-11df-a1f1-0026b9348838"
                        },
                        "value": "2016-02-15T00:00:00.000+0300",
                        "groupMembers": null
                    }]
                }, {
                    "uuid": "encounter-uuid-koso",
                    "encounterDatetime": "2016-01-11T16:17:46.000+0300",
                    "provider": {
                        "uuid": "provider-uuid",
                        "display": "5566790 - H Dengue Provider",
                    },
                    "obs": [{
                        "uuid": "ac55c445-9661-4d42-86b5-4d6ec33a6274",
                        "obsDatetime": "2016-01-21T16:17:46.000+0300",
                        "concept": {
                            "uuid": "a8a666ba-1350-11df-a1f1-0026b9348838"
                        },
                        "value": "2016-02-28T00:00:00.000+0300",
                        "groupMembers": null
                    }]
                }];
                
                var name = 'prevEncs';      //name in histData store
                encData.registerPreviousEncounters(name, encArray);
                
                // Get all
                var stored = histData.getObject(name).getAllObjects();
                expect(stored).to.be.array;
                expect(stored.length).to.be.equal(encArray.length);
                expect(stored[0].encounterDatetime)
                            .to.equal(encArray[1].encounterDatetime);
                
                expect(stored[1].encounterDatetime)
                            .to.equal(encArray[2].encounterDatetime);            
            });
            
            it('getValue() should get the correct value', function() {
                var repMocks = mocks.getOpenmrsRestAndHistoricalEncounterRepMocks();
                var openmrsRestRep = repMocks.openmrsEncounter;
                var expected = repMocks.prevEncounterRepresentation;
                
                // Register encounter historical data
                var name = 'prevEnc'
                encData.registerPreviousEncounters('prevEnc', openmrsRestRep);
                expect(histData.getObject(name).getValue('encounterDatetime'))
                    .to.equal(openmrsRestRep.encounterDatetime);
                
                expect(histData.getObject(name).getValue('location'))
                    .to.equal(openmrsRestRep.location.uuid); 
                
                expect(histData.getObject(name).getValue('patient'))
                    .to.equal(openmrsRestRep.patient.uuid);
                
                expect(histData.getObject(name).getValue('form'))
                    .to.equal(openmrsRestRep.form.uuid);
                
                expect(histData.getObject(name).getValue('encounterType'))
                    .to.equal(openmrsRestRep.encounterType.uuid);                   
            });
        });
    });
})();

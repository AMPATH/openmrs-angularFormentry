/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation*/
/*jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';
    
    var histData;
    describe('Historical Data Test', function(){
        beforeEach(function(){
            module('openmrs.angularFormentry');
        });
        
        beforeEach(inject(function($injector){
            histData = $injector.get('HistoricalDataService');
        }));
        
        describe('put, get and hasKey tests', function(){
            it('Should register/replace object', function(){
                var obj = {
                    key1: 'value1',
                    key2: ['item1', 'item2']
                };
                histData.putObject('testObject', obj);
                
                var retrieved = histData.getObject('testObject');
                expect(obj).to.deep.equal(retrieved);
            });
            
            it('Should return true if key already present', function(){
                var key = 'objectName'
                histData.putObject(key,[]);
                expect(histData.hasKey(key)).to.be.true;
                expect(histData.hasKey('not there')).to.be.false;
            });
        });
    });
})();

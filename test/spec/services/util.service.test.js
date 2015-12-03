/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';
    var utilService;
    describe('Util Service tests', function() {
        beforeEach(function() {
            //debugger;
            module('angularFormentry');
            
        });
        
        beforeEach(inject(function($injector){
            utilService = $injector.get('UtilService');
        }));
    });
})();

/*jshint -W026, -W030, -W106, -W117 */
/*jscs: disable disallowMixedSpacesAndTabs, requireDotNotation, 
/*jscs: requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  
  var fieldHandlerUtil;
  describe('OpenmrsFieldHandlerService Service unit tests', function() {
    beforeEach(function() {
    //   module('angularFormentry');
      module('openmrs.angularFormentry')
    });

    beforeEach(inject(function($injector) {
      fieldHandlerUtil = $injector.get('FieldHandlerUtil');
    }));

    describe('FieldHandlerUtilProvider Unit Tests', function() {
      it('It should register a custom handler during config phase',function() {
        var ret = false;
        fieldHandlerUtil.registerFieldHandler('customHandler', function(){
            return true;
        });
        ret = fieldHandlerUtil.getFieldHandler('customHandler');
        
        expect(ret).to.be.function;
        expect(ret()).to.be.true;
      });
    });
  });
})();

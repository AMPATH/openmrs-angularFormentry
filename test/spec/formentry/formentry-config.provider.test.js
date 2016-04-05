/*jshint -W026, -W030, -W106, -W117 */
/*jscs: disable disallowMixedSpacesAndTabs, requireDotNotation, 
/*jscs: requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  
  var FormentryConfig;
  describe('OpenmrsFieldHandlerService Service unit tests', function() {
    beforeEach(function() {
    //   module('angularFormentry');
      module('openmrs.angularFormentry')
    });

    beforeEach(inject(function($injector) {
      FormentryConfig = $injector.get('FormentryConfig');
    }));

    describe('FormentryConfigProvider Unit Tests', function() {
      it('It should register a custom field handler during config phase',function() {
        var ret = false;
        FormentryConfig.registerFieldHandler('customHandler', function(){
            return true;
        });
        ret = FormentryConfig.getFieldHandler('customHandler');
        
        expect(ret).to.be.function;
        expect(ret()).to.be.true;
      });
      
      it('It should configure openmrs base url during config phase',function() {
        var baseUrl = 'https://www.unittesting.com';
        FormentryConfig.setOpenmrsBaseUrl(baseUrl);
        expect(FormentryConfig.getOpenmrsBaseUrl()).to.equal(baseUrl);
      });
    });
  });
})();

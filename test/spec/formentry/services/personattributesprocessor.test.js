/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('Person Attributes Processor Service unit tests', function() {
    beforeEach(function() {
        module('openmrs.angularFormentry');
        module('mock.data');
      });

    var mockData;
    var personAttributesService;
    var functionStub;
    var log;
    var filter;

    beforeEach(inject(function($injector) {
      log = $injector.get('$log');
      filter = $injector.get('$filter');
      personAttributesService = $injector.get('PersonAttributesProcessorService');
      mockData = $injector.get('mockData');
      /*
      Apperently underscore.string is not loading in thr headless browser during the tests
      this library has specific classes for handling string comparison.
      To solve this problem am adding simple hack to able to load following two functions
      when running the tests.
      NB: as pointed out in the comments ECMAScript 2015 (ES6) introduces startsWith,
      however, at the time of writing this update (2015) browser-support is
      far from complete.
      */
      if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function(str) {
          return this.slice(0, str.length) === str;
        };

        if (typeof String.prototype.endsWith !== 'function') {
          String.prototype.endsWith = function(str) {
            return this.slice(-str.length) === str;
          };
        }
      }
    }));

    describe('generatePersonAttributesPayload Method unit Tests', function() {
      var model = {};
      var personAttributesPayload;
      beforeEach(function() {
        functionStub = sinon.spy(personAttributesService, 'generatePersonAttributesPayload');
        model = mockData.getMockModel();
        personAttributesService.generatePersonAttributesPayload(model, function(payload) {
          // debugger;
          personAttributesPayload = payload;
        });
      });

      it('should be called with parameters', function() {
        expect(functionStub).to.have.been.calledOnce;
        expect(functionStub.firstCall.calledWithExactly(sinon.match.object,
        sinon.match.func)).to.be.true;
        expect(functionStub.firstCall.calledWithExactly(model,
        sinon.match.func)).to.be.true;
        
      });

      it('should create person attributes payload which should be an array', function() {
        expect(personAttributesPayload).to.be.an('array');
        expect(personAttributesPayload[0]).to.have.property('attributeType');
        expect(personAttributesPayload[0]).to.have.property('value');
      });

      it('should create person attributes payload for simple questions', function() {
        var sampleSection = model['section_Section_Name'];
        var sampleField1 = sampleSection['personAttribute_1233'];
        expect(personAttributesPayload[0].attributeType).to.equal(sampleField1.attributeType);
        expect(personAttributesPayload[0].value).to.equal(sampleField1.value);
       
      });      

    });

  });

})();

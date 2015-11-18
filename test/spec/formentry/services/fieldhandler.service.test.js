/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('fieldHandler Service unit tests', function() {
    beforeEach(function() {
        module('openmrs.angularFormentry');
        module('mock.data');
      });

    var mockData;
    var fhService;
    var functionStub;
    var spy;
    var log;

    beforeEach(inject(function($injector) {
      log = $injector.get('$log');
      fhService = $injector.get('fieldHandlerService');
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

    // afterEach(function() {
    //     httpBackend.verifyNoOutstandingExpectation();
    //     //httpBackend.verifyNoOutstandingRequest();
    //   });
    describe('getFieldHandler Method Unit Tests', function() {
      beforeEach(function() {
        functionStub = sinon.spy(fhService, 'getFieldHandler');
      });

      it('should return the fieldHandler Method when getFieldHandler is called',
      function() {
        var handlerName = 'obsDrugFieldHandler';
        var handlerMethod = fhService.getFieldHandler(handlerName);

        expect(functionStub).to.have.been.calledOnce;
        expect(functionStub.calledWith(handlerName)).to.be.true;
        expect(functionStub.returned(handlerMethod)).to.be.true;
        expect(handlerMethod).to.be.an('function');
      });

      it('should return defaultfieldHandler Method when wrong handler is passed',
      function() {
        var handlerName = 'obsxFieldHandler';
        var handlerMethod = fhService.getFieldHandler(handlerName);

        expect(functionStub).to.have.been.calledOnce;
        expect(functionStub.calledWith(handlerName)).to.be.true;
        expect(functionStub.returned(handlerMethod)).to.be.true;
        expect(handlerMethod).to.be.an('function');
      });
    });

    describe('obsFieldHandler Method unit Tests', function() {
      beforeEach(function() {
        functionStub = sinon.spy(fhService, 'getFieldHandler');
        var handlerName = 'obsFieldHandler';
        var handlerMethod = fhService.getFieldHandler(handlerName);
      });

      it('should be able to create a formly obs field', function() {
        var mockSchema = mockData.getMockSchema();
        var mockField = mockSchema.pages[1].sections.questions[0];
        var field = handlerMethod(mockField);
        expect(field).to.be.an('object');
        expect(field).to.have.ownProperty('key');
        expect(field).to.have.ownProperty('templateOptions');
        expect(field).to.have.ownProperty('type');
        expect(field.templateOptions).to.have.ownProperty('type');
        expect(field.templateOptions).to.have.ownProperty('label');
        expect(field).to.have.ownProperty('data');
      });
    });

  });

})();

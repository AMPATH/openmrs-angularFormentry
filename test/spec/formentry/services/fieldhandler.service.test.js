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
    var fieldHandler;
    var functionStub;
    var spy;
    var log;

    beforeEach(inject(function($injector) {
      log = $injector.get('$log');
      fieldHandler = $injector.get('fieldHandlerService');
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
        functionStub = sinon.stub(fieldHandler, 'getFieldHandler');
      });

      it('should return the fieldHandler Method when getFieldHandler is called',
      function() {
        var handlerName = 'obsDrugFieldHandler';
        var handlerMethod = fieldHandler.getFieldHandler(handlerName);
        console.log('testing', fieldHandler);

        expect(functionStub).to.have.been.calledOnce;
        expect(handlerMethod).to.be.an('function');
      });
    });

  });

})();

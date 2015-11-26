/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('CreateFormService Service unit tests', function() {
    beforeEach(function() {
        module('openmrs.angularFormentry');
        module('openmrs.RestServices');
        module('mock.data');
      });

    var mockData;
    var fhService;
    var functionStub;
    var spy;
    var log;
    var cfService;

    beforeEach(inject(function($injector) {
      log = $injector.get('$log');
      fhService = $injector.get('FieldHandlerService');
      mockData = $injector.get('mockData');
      cfService = $injector.get('CreateFormService');
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

    describe('createForm Method unit Tests', function() {
      var handlerMethod;
      var mockSchema;
      var mockForm;
      var model = {};
      beforeEach(function() {
        functionStub = sinon.spy(cfService, 'createForm');
        mockSchema = mockData.getMockSchema();
        cfService.createForm(mockSchema, model, function(formTabs) {
          // debugger;
          mockForm = formTabs;
          // console.log('mock Form', JSON.stringify(mockForm));
        });
      });

      it('should be called with parameters', function() {
        expect(functionStub).to.have.been.calledOnce;
        expect(functionStub.firstCall.calledWithExactly(sinon.match.object,
          sinon.match.object, sinon.match.func)).to.be.true;
        expect(functionStub.firstCall.calledWithExactly(mockSchema, model,
          sinon.match.func)).to.be.true;
        // expect(functionStub.firstCall.returned(sinon.match.object)).to.be.true;
      });

      it('should create formly form with required properties', function() {
        expect(mockForm.length).to.equal(3);
        expect(mockForm).to.be.an('array');
        expect(mockForm[0]).to.have.property('title');
        expect(mockForm[0]).to.have.property('form');
        expect(mockForm[0].form).to.have.property('model');
        expect(mockForm[0].form).to.have.property('fields');
        expect(mockForm[0].form).to.have.property('options');
      });

      it('should create formly form with equal number of pages/sections as schema',
      function() {
        expect(mockSchema.pages.length).to.equal(mockForm.length);
        expect(mockSchema.pages[0].sections.length).to.equal(mockForm[0].form.fields.length);
        expect(mockSchema.pages[0].label).to.equal(mockForm[0].title);
      });

    });

  });

})();

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
        expect(handlerMethod).to.be.a('function');
      });

      it('should return defaultfieldHandler Method when wrong handler is passed',
      function() {
        var handlerName = 'obsxFieldHandler';
        var handlerMethod = fhService.getFieldHandler(handlerName);

        expect(functionStub).to.have.been.calledOnce;
        expect(functionStub.calledWith(handlerName)).to.be.true;
        expect(functionStub.returned(handlerMethod)).to.be.true;
        expect(handlerMethod).to.be.a('function');
      });
    });

    describe('obsFieldHandler Method unit Tests', function() {
      var handlerMethod;
      var mockSchema;
      beforeEach(function() {
        functionStub = sinon.spy(fhService, 'getFieldHandler');
        var handlerName = 'obsFieldHandler';
        handlerMethod = fhService.getFieldHandler(handlerName);
        mockSchema = mockData.getMockSchema();
      });

      it('should be able to create a formly obs field with required properties',
      function() {
        var mockField = mockSchema.pages[1].sections[0].questions[0];
        var field = handlerMethod(mockField);
        // console.log('field', field);
        expect(field).to.be.an('object');
        expect(field).to.have.ownProperty('key');
        expect(field).to.have.ownProperty('templateOptions');
        expect(field).to.have.ownProperty('type');
        expect(field.templateOptions).to.have.ownProperty('type');
        expect(field.templateOptions).to.have.ownProperty('label');
        expect(field).to.have.ownProperty('data');
        expect(field).to.have.ownProperty('validators');
        expect(field).to.have.ownProperty('expressionProperties');
        expect(field).to.have.ownProperty('hideExpression');
      });

      it('should be able to create obs field based on schema definition',
      function() {
        var mockField = mockSchema.pages[1].sections[0].questions[0];
        var field = handlerMethod(mockField);
        expect(field.key).to.match(/^obs/);
        expect(field.key).to.have.string('a89ff9a6');
        expect(field.data.id).to.eql('q7a');
        expect(field.templateOptions).to.have.property('options');
        expect(field.type).to.eql('select');
        expect(field.templateOptions.label).to.eql('7a. Visit Type');
      });

      it('should be able to add an Expression Property to a field', function() {
        var mockField = mockSchema.pages[1].sections[0].questions[0];
        var field = handlerMethod(mockField);
        expect(field.expressionProperties).to.have.any.keys('templateOptions.required');
        expect(field.expressionProperties).to.have.contain
        .keys('templateOptions.required', 'templateOptions.disabled',
        'templateOptions.hasListeners');
      });

      it('should be set the right formly type for a field based on rendering options',
      function() {
        var mockField = mockSchema.pages[1].sections[0].questions[1];
        var field = handlerMethod(mockField);
        expect(field).to.have.deep.property('type', 'datepicker');
        expect(field).to.have.deep.property('templateOptions.label',
        '7b. If Unscheduled, actual scheduled date');
        expect(field).to.have.property('templateOptions').that.is.an('object');
      });

      it('should create a formly field of type number with min and max options',
      function() {
        var mockField = mockSchema.pages[1].sections[0].questions[2];
        var field = handlerMethod(mockField);
        expect(field).to.have.deep.property('templateOptions.min', 0);
        expect(field).to.have.deep.property('templateOptions.max', 30);
        expect(field).to.have.deep.property('templateOptions.type', 'number');
        expect(field).to.have.deep.property('templateOptions.label', 'tabs/day');
      });
    });

  });

})();

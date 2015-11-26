/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';
  describe('ObsProcessor Service unit tests', function() {
    beforeEach(function() {
        module('openmrs.angularFormentry');
        module('mock.data');
      });

    var mockData;
    var opService;
    var functionStub;
    var log;
    var filter;

    beforeEach(inject(function($injector) {
      log = $injector.get('$log');
      filter = $injector.get('$filter');
      opService = $injector.get('ObsProcessorService');
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

    describe('generateObsPayload Method unit Tests', function() {
      var model = {};
      var obsPayload;
      beforeEach(function() {
        functionStub = sinon.spy(opService, 'generateObsPayload');
        model = mockData.getMockModel();
        opService.generateObsPayload(model, function(payload) {
          // debugger;
          obsPayload = payload;
        });
      });

      it('should be called with parameters', function() {
        expect(functionStub).to.have.been.calledOnce;
        expect(functionStub.firstCall.calledWithExactly(sinon.match.object,
          sinon.match.func)).to.be.true;
        expect(functionStub.firstCall.calledWithExactly(model,
          sinon.match.func)).to.be.true;
        // expect(functionStub.firstCall.returned(sinon.match.object)).to.be.true;
      });

      it('should create obs payload which should be an array', function() {
        // console.log('mock Model', JSON.stringify(model));
        // console.log('mock payload', JSON.stringify(obsPayload));
        expect(obsPayload).to.be.an('array');
        expect(obsPayload[0]).to.have.property('concept');
        expect(obsPayload[0]).to.have.property('value');
      });

      it('should create obs payload for simple questions', function() {
        var sampleSection = model['section_Section Name'];
        var sampleField1 = sampleSection['obs1_1232'];
        var sampleField2 = sampleSection['obs1_1234'];
        expect(obsPayload[0].concept).to.equal(sampleField1.concept);
        expect(obsPayload[0].value).to.equal(sampleField1.value);
        expect(obsPayload[1].concept).to.equal(sampleField2.concept);
        expect(obsPayload[1].value).to.equal(sampleField2.value);
      });

      it('should create obs payload for obsGroup questions', function() {
        expect(obsPayload[3].concept).to.equal('a8a003a6-1350-11df-a1f1-0026b9348838');
        expect(obsPayload[3].groupMembers[0].concept).to.equal('a8a07a48-1350-11df-a1f1-0026b9348838');
        expect(obsPayload[3].groupMembers[0].value).to.equal('Group Malaria');
      });

      it('should create obs payload with the right data type as schemaQuestion',
      function() {
        var sampleSection = model['section_Section Name'];
        var sampleField1 = sampleSection['obs1_1232'];
        var sampleField2 = sampleSection['obs1_1234'];
        var sampleField3 = sampleSection['obs1_1233'];
        expect(obsPayload[0].value).to.equal(sampleField1.value).that.is.a('string');
        expect(new Date(obsPayload[1].value)).to.eql(new Date(sampleField2.value)).that.is.a('Date');
        expect(obsPayload[1].value).to.equal(sampleField2.value).that.is.a('string');
        expect(obsPayload[2].value).to.equal(sampleField3.value).that.is.a('number');
      });

    });

  });

})();

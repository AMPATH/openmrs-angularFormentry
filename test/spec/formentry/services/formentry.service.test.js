/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
'use strict';

describe('formentry service Tests: config.service', function () {
    beforeEach(function () {
        //debugger;
        module('openmrs.angularFormentry');
        var log;
        var configService;
        var rootScope;
        beforeEach(inject(function ($injector) {
            log = $injector.get('$log');
            configService = $injector.get('configService');
            rootScope = $injector.get('$rootScope');


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
                String.prototype.startsWith = function (str) {
                    return this.slice(0, str.length) === str;
                };

                if (typeof String.prototype.endsWith !== 'function') {
                    String.prototype.endsWith = function (str) {
                        return this.slice(-str.length) === str;
                    };
                }
            }
        }));

    });
    describe('addFieldHandler Method Unit Tests', function () {
        beforeEach(function () {
            functionStub = sinon.spy(configService, 'addFieldHandler');

            it('Should increase number of saved schema>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
                    function () {

                        functionStub.sinon.match.array(functionStub.withArgs([1, 2, 2]).calledOnce);
                        sinon.assert.calledWith(functionStub.withArgs([1, 2, 2]).calledOnce, sinon.match(undefined));
                    });

        });
    });

});

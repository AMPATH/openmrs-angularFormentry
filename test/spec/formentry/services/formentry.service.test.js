/*
 jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
/* global expect */

'use strict';

describe('Formentry service Tests:config.service', function () {
    beforeEach(function () {
        module('openmrs.angularFormentry');

    });

    var mockData;
    var fhService;
    var functionStub;
    var configService;
    var spy;
    var log;
    var proxy;
    var addSchemaStub;
    var addJsonSchemaSourceSpy;
    var getSchemaSpy;
    var clock;
    var req;
    var $q;

    beforeEach(inject(function ($injector) {
        log = $injector.get('$log');
        $q = $injector.get('$q');
        fhService = $injector.get('fieldHandlerService');
        configService = $injector.get('configService');



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


    describe('Adding  and  Retrieving Schema Unit Tests', function () {
        beforeEach(function () {
            addSchemaStub = sinon.spy(configService, 'addJsonSchema');
            functionStub = sinon.spy(configService, 'getSchema');

        });
        it('Should add a schema and attempt to retrieve it',
                function () {
                    //adding  a  schema  and  attemping  to  retrive it
                    addSchemaStub('john', {john: 1, mukii: 6});
                    var h = functionStub('john');
                    assert.isTrue(functionStub.called, "Get Schema  function was  not  called");
                    assert.deepEqual(h, {schema: {john: 1, mukii: 6}}, 'Wrong  schema  was  retured');
                    //attempting  to retrive  a  schema  that  has  not  been  added
                    var notadded = functionStub('unknown');
                    assert.isTrue(functionStub.calledTwice, "Get Schema function should  have  been called twice");
                    assert.deepEqual(notadded, {message: 'missing schema', schema: undefined}, 'No Schema  was  supposed  to  be returned');



                });
    });

    describe('Adding Schema Sources Unit Tests', function () {
        beforeEach(function () {
            req = $q.defer().promise;
            addJsonSchemaSourceSpy = sinon.stub(configService, 'addJsonSchemaSource').returns($q.when(req));
            getSchemaSpy = sinon.spy(configService, 'getSchema');
            clock = sinon.useFakeTimers();
        });
        it('Should provide url to source of schema and ',
                function () {

                    var expectedJson = {schema: {
                            "Upgrade-Insecure-Requests": "1",
                            "Accept-Language": "en-US,en;q=0.8",
                            "Host": "headers.jsontest.com",
                            "Referer": "http://www.jsontest.com/",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/45.0.2454.101 Chrome/45.0.2454.101 Safari/537.36",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
                        }};


                    //adding  a  schema  and  attemping  to  retrive it
                    req = addJsonSchemaSourceSpy('test_schema', 'http://headers.jsontest.com/', 'GET');

                    var h = getSchemaSpy('test_schema');
                    assert.isTrue(addJsonSchemaSourceSpy.called, "Get Schema From Source function was  not  called");
                    assert.deepEqual(h, expectedJson, 'Fetching schema from source url failed');



                });
    });

});

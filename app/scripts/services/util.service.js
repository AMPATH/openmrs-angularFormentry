/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('FormentryUtilService', FormentryUtilService);

    FormentryUtilService.$inject = ['$http', '$log', '$resource', '$filter'];

    function FormentryUtilService($http, $log, $resource, $filter) {
        var service = {
            formatDate: formatDate,
            getLocalTimezone: getLocalTimezone,
            getFormSchema: getFormSchema,
            getTestEncounterData: getTestEncounterData,
            getServerUrl: getServerUrl,
            getFormSchemaReferences: getFormSchemaReferences
        };

        return service;

        function getFormSchema(formName, onSuccess, onError) {
            var schema = {};
            // formName = createValidFormName(formName);
            // this should de dropped once we align all forms related issues
            if (formName !== undefined) {
                formName = formName + '.json';
            } else {
                formName = 'test.json';
            }

            var url = 'scripts/formentry/schema/' + formName;
            $http.get(url, { cache: true })
                .success(function(response) {
                    $log.info('getting schema', response);
                    onSuccess(response);
                })
                .error(function(data, status, headers, config) {
                    if (status === 404) { alert('Form Resource not Available. Form name: ' + formName); }
                    onError(data);
                });
        }


        function getFormSchemaReferences(arrayFormNames, onSuccess, onError) {
            var numberOfRequests = arrayFormNames.length;
            var formSchemas = [];
            var hasReturned = false;
            for (var i = 0; i < arrayFormNames.length; i++) {
                var formName = arrayFormNames[i];

                getFormSchema(formName,
                    function(formSchema) {
                        formSchemas.push(formSchema);
                        numberOfRequests--;
                        if (numberOfRequests === 0 && !hasReturned) {
                            hasReturned = true;
                            onSuccess(formSchemas);
                        }
                    }, function(error) {
                        if (!hasReturned) {
                            hasReturned = true;
                            onError(error);
                        }
                    });
            }
        }

        function _getResource() {
            var _server = 'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/';
            var _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                'patient:(uuid,uuid),form:(uuid,name),' +
                'location:ref,encounterType:ref,provider:ref,' +
                'obs:(uuid,obsDatetime,concept:(uuid,uuid),value:ref,groupMembers))';

            return $resource(_server + 'encounter/:uuid?v=' + _customDefaultRep,
                { uuid: '@uuid' },
                { query: { method: 'GET', isArray: false } });
        }

        function getTestEncounterData(uuid, successCallback, failedCallback) {
            var testUuid = '2b863113-1996-4562-b246-d23766175d73';
            var resource = _getResource();
            return resource.get({ uuid: testUuid }).$promise
                .then(function(response) {
                    successCallback(response);
                })
                .catch(function(error) {
                    failedCallback('Error processing request', error);
                    $log.error(error);
                });
        }

        function getServerUrl() {
            return 'http://localhost:8080/amrs/ws/rest/v1';
        }

        // Return local timezone in format +0300 for EAT
        function getLocalTimezone() {
            var offset = new Date().getTimezoneOffset();
            var sign;
            if (offset < 0) {
                sign = '+';
            } else {
                sign = '-';
            }

            offset = Math.abs(offset);
            var hours = Math.floor(offset / 60);
            var mins = offset % 60;
            var ret = '';

            if (hours < 10) {
                hours = '0' + hours;
            }

            if (mins < 10) {
                mins = '0' + mins;
            }

            return ret.concat(sign).concat(hours).concat(mins);
        }

        /**
         * Takes three parameters.
         * date: a valid javascript date or string representing a date
         * format: a valid angular date filter format
         * timezone: a timezone in form +0300
         * Return a formatted date.
         */
        function formatDate(date, format, timezone) {
            //console.log('date to be converted ', date);
            if (typeof date === 'string') {
                //Try to parse
                date = new Date(date);
                if (date === undefined) {
                    var message = 'Bad date ' + date + ' passed as parameter';
                    throw new Error(message);
                }
            }

            if (!(date instanceof Date)) {
                throw new ReferenceError('Invalid type passed as date!');
            }

            var format = format || 'YYYY-MM-DD HH:mm:ss';
            var timezone = timezone || getLocalTimezone();

            console.log('timezone', timezone);
            console.log('date', date);
            //console.log('utc date', moment(date).utc());
            var momented = moment(date).utcOffset(timezone);
            console.log('converted', momented);
            console.log('converted formatted', momented.format(format));
            return momented.format(format);
        }
    }
})();

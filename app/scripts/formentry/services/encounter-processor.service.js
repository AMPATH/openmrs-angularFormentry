/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation 
jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function(){
    'use strict';
    
    angular
        .module('openmrs.angularFormentry')
            .factory('EncounterProcessorService', EncounterProcessor);
    
    EncounterProcessor.$inject = [
        'FormEntryUtil',
        'ObsProcessorService',
        '$log'
    ];
    
    var UNKNOWN_ROLE_UUID = 'a0b03050-c99b-11e0-9572-0800200c9a66';
    function EncounterProcessor(utils, obsProcessor, $log) {
        var service = {
            generateEncounterPayload: generateEncounterPayload
        };
        
        return service;
        
        function generateEncounterPayload(model, callback) {
            var payload = {};
             
            // Find a section with encounter Details
            var encDatetime = null, encLocation = null, encProvider = null;
            for(var section in model) {
                if(_.has(model[section], 'encounterDate') || 
                        _.has(model[section], 'encounterDatetime')) {
                    encDatetime = model[section].encounterDatetime 
                                    || model[section].encounterDate;
                }
                if(_.has(model[section], 'encounterLocation')) {
                    encLocation = model[section].encounterLocation;
                }
                if(_.has(model[section], 'encounterProvider')) {
                    encProvider = model[section].encounterProvider;
                }
            }
            
            if(encLocation === null && encProvider === null 
                && encDatetime === null) {
                throw new Error('The passed model is not encounter based');
                $log.debug(model);    
            } else {
                if(encDatetime !== null) {            
                    payload.encounterDatetime = 
                        utils.formatDate(encDatetime.value, null, '+0300');
                }
                if(encLocation !== null) {
                    payload.location = encLocation.value;
                }
                
                // Create encounterProviders (Assume one for now)
                if(encProvider !== null) {
                    payload.encounterProviders = [{
                        provider: encProvider.value,
                        encounterRole: UNKNOWN_ROLE_UUID
                    }];
                }
                
                //Add obs if any
                var obsPayload = null;
                obsProcessor.generateObsPayload(model, function(payload) {
                    obsPayload = payload;
                });
                
                if(obsPayload !== null && !(_.isEmpty(obsPayload))){
                    payload.obs = obsPayload;
                }
                
                //Call the call back if provided
                if(callback && typeof callback === 'function') {
                    callback(payload);
                } else {
                    return payload;
                }
            }
        }
    }
})();

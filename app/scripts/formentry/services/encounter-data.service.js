/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation*/
/*jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('EncounterDataService', EncounterDataService);

    EncounterDataService.$inject = [
        'HistoricalDataService',
        '$log'
    ];

    function EncounterDataService(histData, $log) {
        var service = {
            registerPreviousEncounters: registerPreviousEncounters
        };

        return service;

        function registerPreviousEncounters(name, openmrsEncounters) {
            if (arguments.length < 2) {
                throw new Error('ArgumentsException', 'Two arguments required,' +
                    'name and openmrs rest representation of encounters or ' +
                    'array of encounters');
            }
            // Create the backing object with necessary methods to access Data
            var encStore = {
                data: [],

                getValue: function (key, index) {
                    var index = index || 0;

                    var pathArray = key.split('.');

                    if (pathArray.length > 0) {
                        return getFirstValue(pathArray, encStore.data[index]);
                    }
                    return encStore.data[index][key];
                },

                getAllObjects: function () {
                    return encStore.data;
                },



                getSingleObject: function (index) {
                    var index = index || 0;
                    return encStore.data[index];
                }
            };

            if (Array.isArray(openmrsEncounters)) {
                var group = [];
                _.each(openmrsEncounters, function (encounter) {
                    group.push(__transformEncounter(encounter));
                });
                
                // Sort them in reverse chronological order
                encStore.data = _.sortBy(group, 'encounterDatetime').reverse();
            } else {
                // Assume a single openmrs rest encounter object.
                encStore.data.push(__transformEncounter(openmrsEncounters));
            }

            histData.putObject(name, encStore);
        }
        
        //region: navigation helpers
        function getFirstValue(path, object) {
            var answers = [];

            getAllValues(path, object, answers);
            console.log('foundans', answers);
            if (answers.length > 0) {
                return answers[0];
            }

        }

        function getAllValues(path, object, answers) {

            if (object === undefined || object === null) {
                return;
            }

            if (path.length <= 1) {
                if (object[path[0]] !== undefined && object[path[0]] !== null) {
                    answers.push(object[path[0]]);
                }
                return;
            }

            var newpath = path.splice(1);
            var key = path[0];

            if (angular.isArray(object[key]) && object[key].length > 0) {
                _.each(object[key], function (childObject) {
                    getAllValues(newpath.slice(0), childObject, answers);
                });
            } else {
                getAllValues(newpath.slice(0), object[key], answers);
            }
        }


        function __transformEncounter(encounter) {
            // Transform encounter Level details to key value pairs.
            var prevEncounter = {
                encounterDatetime: encounter.encounterDatetime,
            };

            if (encounter.location && encounter.location.uuid) {
                prevEncounter.location = encounter.location.uuid;
            }

            if (encounter.patient && encounter.patient.uuid) {
                prevEncounter.patient = encounter.patient.uuid;
            }

            if (encounter.form && encounter.form.uuid) {
                prevEncounter.form = encounter.form.uuid;
            }

            if (encounter.encounterType && encounter.encounterType.uuid) {
                prevEncounter.encounterType = encounter.encounterType.uuid;
            }

            var provider = encounter.provider;
            var encProvider = encounter.encounterProviders;

            var providerValue =
                provider ? provider.uuid : encProvider[0].provider.uuid;

            prevEncounter.provider = providerValue; 
            
            // Deal with obs.
            if (encounter.obs) {
                var processedObs = __transformObs(encounter.obs);
                
                // add in individual processed obs to prevEncounter
                _.extend(prevEncounter, processedObs);
            }

            return prevEncounter;
        }

        function __transformObs(obs) {
            if (!obs) return null;

            var obsRep = {};
            if (Array.isArray(obs)) {
                _.each(obs, function (singleObs) {
                    ___augumentObs(obsRep, __transformObs(singleObs));
                });
                return obsRep;
            } else if (obs.groupMembers) {
                var group = {};
                _.each(obs.groupMembers, function (member) {
                    ___augumentObs(group, __transformObs(member));
                });
                
                //Handle already existing data
                if (obsRep[obs.concept.uuid] && Array.isArray(obsRep[obs.concept.uuid])) {
                    obsRep[obs.concept.uuid].push(group);
                } else {
                    obsRep[obs.concept.uuid] = [group];
                }
                return obsRep;
            } else {
                if (typeof obs.value === 'object') {
                    obsRep[obs.concept.uuid] = obs.value.uuid;
                } else {
                    obsRep[obs.concept.uuid] = obs.value;
                }
                return obsRep;
            }

            function ___augumentObs(existing, toAdd) {
                for (var key in toAdd) {
                    if (existing.hasOwnProperty(key)) {
                        //check if not an array yet
                        if (!Array.isArray(existing[key])) {
                            var temp = existing[key];
                            existing[key] = [temp];
                        }
                        
                        // Check whether the incoming is array (for group members)
                        if (Array.isArray(toAdd[key])) {
                            Array.prototype.push.apply(existing[key], toAdd[key]);
                        } else {
                            existing[key].push(toAdd[key]);
                        }
                    } else {
                        existing[key] = toAdd[key];
                    }
                }
                return existing;
            }
        }
    }
})();

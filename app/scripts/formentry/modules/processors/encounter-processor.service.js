/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('EncounterProcessorService', EncounterProcessor);

    EncounterProcessor.$inject = [
        'FormentryUtilService',
        'ObsProcessorService',
        'OrderProcessorService',
        '$log'
    ];

    var UNKNOWN_ROLE_UUID = 'a0b03050-c99b-11e0-9572-0800200c9a66';
    function EncounterProcessor(utils, obsProcessor, orderProcessor, $log) {
        var service = {
            generateEncounterPayload: generateEncounterPayload,
            populateModel: populateModel
        };

        return service;

        function generateEncounterPayload(model) {
            var payload = {};
            var encDetails = _findEncounterDetailsInModel(model);

            if (encDetails.encLocation === null && encDetails.encProvider === null
                && encDetails.encDatetime === null) {
                throw new Error('NoneEncounterForm', 'The passed model is not encounter based');
                $log.debug(model);
            } else {
                if (encDetails.encDatetime !== null) {
                    payload.encounterDatetime =
                        utils.formatDate(encDetails.encDatetime.value, null, '+0300');
                }
                if (encDetails.encLocation !== null) {
                    payload.location = encDetails.encLocation.value;
                }

                // Create encounterProviders (Assume one for now)
                var providerObject;
                if (encDetails.encProvider !== null) {
                    payload.provider = encDetails.encProvider.value;
                    providerObject = encDetails.encProvider.valueObject;
                }

                if (model.form_info) {
                    if (model.form_info.encounterType) {
                        payload.encounterType = model.form_info.encounterType;
                    }
                    if (model.form_info.form) {
                        payload.form = model.form_info.form;
                    }
                }
                //Add obs if any
                var obsPayload = obsProcessor.generateObsPayload(model);

                if (obsPayload !== null && !(_.isEmpty(obsPayload))) {
                    payload.obs = obsPayload;
                }

                //orderProcessor
                var ordersPayload = orderProcessor.generateOrderPayload(model);

                if (ordersPayload !== null && !_.isEmpty(ordersPayload) && ordersPayload.encounterAppendableOrderPayload.length > 0) {
                    payload.orders = ordersPayload.encounterAppendableOrderPayload;

                    _.each(payload.orders, function (order) {
                        if (order.orderer === undefined || order.orderer === null && !order.uuid) {
                            orderProcessor.populatePayloadProvider(order, providerObject.uuId());
                        }
                    });
                }
                //Call the call back if provided
                console.log('payload ;;;', payload);
                return payload;
            }
        }

        function populateModel(model, openmrsRestObj) {
            if (!model || !openmrsRestObj) return;

            var details = _findEncounterDetailsInModel(model);
            //Search for encounterDatetime in the OpenmrsRestObj
            if (_.has(openmrsRestObj, 'encounterDatetime') && details.encDatetime) {
                details.encDatetime.value = openmrsRestObj['encounterDatetime'];
            }

            if (_.has(openmrsRestObj, 'location') && details.encLocation) {
                details.encLocation.value = openmrsRestObj['location'].uuid;
            }

            if (_.has(openmrsRestObj, 'encounterProvider') && details.encProvider) {
                // Take the first provider in the array [Usually it is one anyway]
                details.encProvider.value = openmrsRestObj['encounterProvider'][0].uuid;
            } else if (_.has(openmrsRestObj, 'provider') && details.encProvider) {
                details.encProvider.value = openmrsRestObj['provider'].uuid;
            }

            // Populate obs if any
            obsProcessor.addExistingObsSetToForm(model, openmrsRestObj);

            // populate orders if any
            orderProcessor.populateModel(model, openmrsRestObj);
        }

        function _findEncounterDetailsInModel(model) {
            // Find encounter Details questions
            var details = {
                encDatetime: null,
                encLocation: null,
                encProvider: null
            };

            for (var section in model) {
                if (_.has(model[section], 'encounterDate') ||
                    _.has(model[section], 'encounterDatetime')) {
                    details.encDatetime = model[section].encounterDatetime
                        || model[section].encounterDate;
                }
                if (_.has(model[section], 'encounterLocation')) {
                    details.encLocation = model[section].encounterLocation;
                }
                if (_.has(model[section], 'encounterProvider')) {
                    details.encProvider = model[section].encounterProvider;
                }

                if (details.encDatetime && details.encLocation && details.encProvider) {
                    break;
                }
            }
            return details;
        }
    }
})();

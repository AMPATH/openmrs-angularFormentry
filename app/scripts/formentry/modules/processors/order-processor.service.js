/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('OrderProcessorService', OrderProcessorService);

    OrderProcessorService.$inject = [
        'FormentryUtilService',
        '$log'
    ];

    function OrderProcessorService(utils, $log) {
        var service = {
            //main functions
            generateOrderPayload: generateOrderPayload,
            populateModel: populateModel,

            //internal functions exposed for testing
            createOrderModel: createOrderModel,
            findVirtualGroupModelByConcept: findVirtualGroupModelByConcept,
            fillVirtualGroupsModelWithPayload: fillVirtualGroupsModelWithPayload,
            extractVirtualOrderGroupsFromModel: extractVirtualOrderGroupsFromModel,

            getOrderPayload: getOrderPayload,
            getVirtualGroupOrderPayload: getVirtualGroupOrderPayload,
            mergeVirtualGroupOrderPayLoads: mergeVirtualGroupOrderPayLoads
        };

        return service;

        function generateOrderPayload(model) {
            var orderGroups = extractVirtualOrderGroupsFromModel(model);
            var arrayOfOrderGroupPayload = [];
            
            _.each(orderGroups, function(orderGroup){
                arrayOfOrderGroupPayload.push(getVirtualGroupOrderPayload(orderGroup));
            });
            
            if(arrayOfOrderGroupPayload.length != 0){
                return mergeVirtualGroupOrderPayLoads(arrayOfOrderGroupPayload);
            }
        }

        function populateModel(model, payload) {
            var orderPayload = payload;
            if (!angular.isArray(payload)) {
                orderPayload = payload.orders;
            }
            var virtualGroups = extractVirtualOrderGroupsFromModel(model);

            fillVirtualGroupsModelWithPayload(orderPayload, virtualGroups);
        }

        function createOrderModel(orderPayload) {
            return {
                uuid: orderPayload.uuid,
                concept: orderPayload.concept.uuid,
                type: orderPayload.type,
                orderer: orderPayload.orderer.uuid,
                careSetting: orderPayload.careSetting.uuid,
                orderNumber: orderPayload.orderNumber
            };
        }

        function findVirtualGroupModelByConcept(concept, virtualGroupsArray) {
            for (var i = 0; i < virtualGroupsArray.length; i++) {
                if (virtualGroupsArray[i].orderConcepts.indexOf(concept) > -1) {
                    return virtualGroupsArray[i];
                }
            }
        }

        function fillVirtualGroupsModelWithPayload(orderPayloadArray, virtualGroupsArray) {
            _.each(orderPayloadArray, function (orderPayload) {
                var group =
                    findVirtualGroupModelByConcept(orderPayload.concept.uuid, virtualGroupsArray);

                var orderModel = createOrderModel(orderPayload);
                if (!angular.isArray(group.orders)) {
                    group.orders = [];
                }

                group.orders.push(orderModel);
            });
        }

        function extractVirtualOrderGroupsFromModel(model) {
            var arrayOfVirtualGroups = [];
            _fillArrayWithVirtualGroupsRecursively(arrayOfVirtualGroups, model);
            return arrayOfVirtualGroups;

        }

        function _fillArrayWithVirtualGroupsRecursively(array, subModel) {
            if (_.isEmpty(subModel)) {
                return;
            }

            if (angular.isArray(subModel)) {
                _.each(subModel, function (obj) {
                    _fillArrayWithVirtualGroupsRecursively(array, obj);
                });
                return;
            }

            if (angular.isArray(subModel.orderConcepts)) {
                array.push(subModel);
                return;
            }

            _.each(Object.keys(subModel), function (key) {
                if (angular.isArray(subModel[key]) || typeof subModel[key] === 'object') {
                    _fillArrayWithVirtualGroupsRecursively(array, subModel[key]);
                }
            });
        }

        function getOrderPayload(orderModel) {
            if (orderModel) {
                if (orderModel.uuid) {
                    //case existing order
                    return {
                        uuid: orderModel.uuid
                    };
                } else {
                    //case new order
                    return {
                        concept: orderModel.concept,
                        type: orderModel.type,
                        orderer: orderModel.orderer,
                        careSetting: orderModel.careSetting
                    };
                }
            }
        }

        function getVirtualGroupOrderPayload(groupOrderModel) {
            var payloadObject = {
                encounterAppendableOrderPayload: [],
                deletedOrdersUuid: []
            };

            _.each(groupOrderModel.orders, function (order) {
                payloadObject.encounterAppendableOrderPayload.push(getOrderPayload(order));
            });

            _.each(groupOrderModel.deletedOrders, function (order) {
                if (order.uuid) {
                    payloadObject.deletedOrdersUuid.push(order.uuid);
                }
            });
            return payloadObject;
        }
        
        function mergeVirtualGroupOrderPayLoads(arrayOfVirtualGroupOrderPayload) {
            var finalPayloadObject = {
                encounterAppendableOrderPayload: [],
                deletedOrdersUuid: []
            };
            
             _.each(arrayOfVirtualGroupOrderPayload, function (payload) {
                 finalPayloadObject.encounterAppendableOrderPayload =
                 finalPayloadObject.encounterAppendableOrderPayload.
                 concat(payload.encounterAppendableOrderPayload);
                 
                 finalPayloadObject.deletedOrdersUuid =
                 finalPayloadObject.deletedOrdersUuid.
                 concat(payload.deletedOrdersUuid);
            });
            
            return finalPayloadObject;
        }
        
    }
})();
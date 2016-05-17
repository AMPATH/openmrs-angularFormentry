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
            //main function
            generateOrderPayload: generateOrderPayload,
            populateModel: populateModel,

            //internal functions exposed for testing
            createOrderModel: createOrderModel,
            findVirtualGroupModelByConcept: findVirtualGroupModelByConcept,
            fillVirtualGroupsModelWithPayload: fillVirtualGroupsModelWithPayload,
            extractVirtualOrderGroupsFromModel: extractVirtualOrderGroupsFromModel
        };

        return service;

        function generateOrderPayload() {

        }

        function populateModel(model, payload) {
            var orderPayload = payload;
            if(!angular.isArray(payload)){
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
            for(var i = 0; i < virtualGroupsArray.length; i++) {
                if(virtualGroupsArray[i].orderConcepts.indexOf(concept) > -1){
                    return virtualGroupsArray[i];
                }
            }
        }
        
        function fillVirtualGroupsModelWithPayload(orderPayloadArray, virtualGroupsArray) {
            _.each(orderPayloadArray, function(orderPayload){
                var group = 
                findVirtualGroupModelByConcept(orderPayload.concept.uuid, virtualGroupsArray);
                
                var orderModel = createOrderModel(orderPayload);
                if(!angular.isArray(group.orders)){
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
            if(_.isEmpty(subModel)){
                return;
            }
            
            if(angular.isArray(subModel)){
                _.each(subModel, function(obj){
                    _fillArrayWithVirtualGroupsRecursively(array,obj);
                });
                return;
            }
            
            if(angular.isArray(subModel.orderConcepts)){
                array.push(subModel);
                return;
            }
            
            _.each(Object.keys(subModel), function(key){
                if(angular.isArray(subModel[key]) || typeof subModel[key] === 'object'){
                    _fillArrayWithVirtualGroupsRecursively(array, subModel[key]);
                }
            });
        }
    }
})();
/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('OrdersFieldHandler', OrdersFieldHandler);

    OrdersFieldHandler.$inject = [
        '$log'
    ];

    function OrdersFieldHandler($log) {

        var service = {
            createOrderField: createOrderField
        };

        return service;

        function createOrderField(question, orderModel, questionMap, repeatingId) {
            initializeOrderGroupModel(orderModel, question);
            var orderField = {
                type: 'orderSection',
                key: repeatingId,
                data: {
                    selectableOrders: question.questionOptions.selectableOrders
                },
                templateOptions: {
                    label: question.label,
                    fields: [{
                        className: 'row',
                        fieldGroup: [] //TODO: Has values if 
                    }],
                    createChildFieldModel: function(concept) {
                        return createChildFieldModel(concept, orderModel);
                    }
                }
            };
            _addToQuestionMap(question, orderField,  questionMap);
            return orderField;
        }

        function _addToQuestionMap(_question, _field, questionMap) {
            if ('id' in _question) {
                if (_question.id in questionMap) {
                    questionMap[_question.id].push(_field);
                } else {
                    questionMap[_question.id] = [_field];
                }
            }
        }

        function initializeOrderGroupModel(orderModel, question) {
            orderModel.orderType = question.questionOptions.orderType;//'testorder';
            orderModel.orderConcepts = extractConcepts(question);
            orderModel.orderSetting = question.questionOptions.orderSettingUuid;
            orderModel.orders = [];
            orderModel.deletedOrders = [];
        }
        
        function extractConcepts(question){
            var concepts = [];
            _.each(question.questionOptions.selectableOrders,
            function(choice){
               concepts.push(choice.concept); 
            });
            
            return concepts;
        }

        function createChildFieldModel(concept, virtualOrdersGroupModel) {
            var orderModel ={};
            orderModel.concept = concept;
            orderModel.type = virtualOrdersGroupModel.orderType;
            orderModel.orderer = undefined;
            orderModel.careSetting = virtualOrdersGroupModel.orderSetting;
            return orderModel;
        }
    }
})();
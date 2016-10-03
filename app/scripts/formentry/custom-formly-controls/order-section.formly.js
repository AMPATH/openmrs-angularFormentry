/*
jshint -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  var mod =
    angular
    .module('openmrs.angularFormentry');

  mod.run(function config(formlyConfig) {
    formlyConfig.setType({
      name: 'orderSection',
      template: '<div class="panel panel-default"> ' +
        '<div class="panel-heading"> ' +
        '{{to.label}}' +
        '</div> ' +
        '<div class="panel-body"> ' +
        // <!--loop through each element in model array-->
        '<div class="{{hideRepeat}}"> ' +
        '<div class="repeatsection" ng-repeat="element in model[options.key].orders" ' +
        'ng-init="fields = copyFields(to.fields)"> ' +
        '<span>{{$parent.getDisplayValue(element.concept)}}</span></br>' +
        '<span ng-if="element.orderNumber" class="text-success">{{"#: " + element.orderNumber}}</span>' +
        // '<formly-form fields="fields" ' +
        // 'model="element" bind-name="\'formly_ng_repeat\' + index + $parent.$index"> ' +
        // '</formly-form> ' +
        '<p ng-hide="element.orderNumber"> ' +
        '<button type="button" class="btn btn-sm btn-danger" ng-hide="element.orderNumber" ng-click="deleteField($index)"> ' +
        'Remove' +
        '</button> ' +
        '</p> ' +
        '<hr> ' +
        '</div> ' +
        '<p class="AddNewButton" ng-hide="addingNew"> ' +
        '<button type="button" class="btn btn-primary" ng-click="addingNew = true" >+ Order Test</button> ' +
        '</p> ' +
        '<div ng-show="addingNew">' +
        'Choose test to order from the drop-down:' +
        '<select kendo-drop-down-list k-select="onOrderSelected" k-data-value-field="selectOptions.dataValueField" ' +
        'k-value-primitive="selectOptions.valuePrimitive" k-auto-bind="autoBind" k-filter="contains" k-data-source="itemSource" k-data-text-field="selectOptions.dataTextField"' +
        'ng-model="$scope.selectedOrder" style="width: 100%;">' +
        '</select>' +
        // '<button style="margin-top:4px;" type="button" class="btn btn-success" ng-click="addNew($scope.selectedOrder)" >Ok</button> ' +
        '<button style="margin-top:4px;" type="button" class="btn btn-default" ng-click="addingNew = false" >Cancel</button> ' +
        '</div>' +
        '</div> ' +
        '</div>',
      controller: function($scope, $log, CurrentLoadedFormService) {
        //$scope.formOptions = { formState: $scope.formState };

        $scope.addingNew = false;

        $scope.addNew = addNew;
        $scope.deleteField = deleteField;
        $scope.autoBind = false;

        $scope.contains = 'contains';
        $scope.selectedOrder = undefined;

        $scope.itemSource = $scope.options.data.selectableOrders;

        $scope.selectOptions = {
          dataTextField: 'label',
          dataValueField: 'concept',
          valuePrimitive: true
        };

        $scope.onOrderSelected = function(e) {
          var val = this.dataItem(e.item);
          if (val)
            addNew(val.concept);
        };

        $scope.copyFields = copyFields;
        $scope.getDisplayValue = getDisplayValue;

        filterOutSelectedItems();

        function getDisplayValue(orderConcept) {
          var orders = $scope.options.data.selectableOrders;
          for (var i = 0; i < orders.length; i++) {
            if (orders[i].concept === orderConcept)
              return orders[i].label;
          }
        }

        function copyFields(fields) {
          var copy = angular.copy(fields);
          addFieldsToQuestionMap(copy);
          return copy;
        }

        function addFieldsToQuestionMap(groups) {

          _.each(groups, function(group) {
            _.each(group.fieldGroup, function(field) {
              var id = field.data.id;
              if (!_.isEmpty(id)) {
                if (id in CurrentLoadedFormService.questionMap) {
                  CurrentLoadedFormService.questionMap[id].push(field);
                } else {
                  CurrentLoadedFormService.questionMap[id] = [field];
                }
              }
            });
          });
        }

        function addNew(orderConcept) {
          //$scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          $log.log('order section');
          var orderSectionModel = $scope.model[$scope.options.key].orders;
          orderSectionModel.push($scope.to.createChildFieldModel(orderConcept));

          filterOutSelectedItems();
          $scope.addingNew = false;
        }

        function deleteField($index) {
          var deletedOrder = $scope.model[$scope.options.key].orders[$index];
          if (!$scope.model[$scope.options.key].orders.deletedOrders)
            $scope.model[$scope.options.key].orders.deletedOrders = [];
          $scope.model[$scope.options.key].orders.deletedOrders.push(deletedOrder);
          $scope.model[$scope.options.key].orders.splice($index, 1);
          filterOutSelectedItems();
        }

        function filterOutSelectedItems() {

          if (!Array.isArray($scope.model[$scope.options.key].orders) || $scope.model[$scope.options.key].orders.length === 0) {
            $scope.itemSource = $scope.options.data.selectableOrders;
            return;
          }

          var newItemSource = [];
          _.each($scope.options.data.selectableOrders, function(order) {
            var foundSelectedOrder;
            _.each($scope.model[$scope.options.key].orders, function(selectedOrder) {
              if (selectedOrder.concept === order.concept)
                foundSelectedOrder = selectedOrder;
            });

            if (foundSelectedOrder === undefined || foundSelectedOrder === null) {
              newItemSource.push(order);
            }
          });

          $scope.itemSource = newItemSource;
        }
      }
    });
  });
})();

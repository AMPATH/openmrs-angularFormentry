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

    mod.run(function(formlyConfig) {
        var attributes = [
            'date-disabled',
            'custom-class',
            'show-weeks',
            'starting-day',
            'init-date',
            'min-mode',
            'max-mode',
            'format-day',
            'format-month',
            'format-year',
            'format-day-header',
            'format-day-title',
            'format-month-title',
            'year-range',
            'shortcut-propagation',
            'datepicker-popup',
            'show-button-bar',
            'current-text',
            'clear-text',
            'close-text',
            'close-on-date-selection',
            'datepicker-append-to-body'
        ];

        var bindings = [
            'datepicker-mode',
            'min-date',
            'max-date'
        ];

        var ngModelAttrs = {};

        angular.forEach(attributes, function(attr) {
            ngModelAttrs[camelize(attr)] = { attribute: attr };
        });

        angular.forEach(bindings, function(binding) {
            ngModelAttrs[camelize(binding)] = { bound: binding };
        });

        formlyConfig.setType({
            name: 'datepicker',
            template: '<input class="form-control" ng-model="model[options.key]"  ' +
            'is-open="to.isOpen" ng-click="open($event)"  ' +
            'datepicker-options="to.datepickerOptions" />'+
            '<div ng-if="to.weeksList && to.weeksList.length > 0" class="input-group-btn">' +
            '<button type="button" ng-disabled="to.disabled" class="btn btn-default dropdown-toggle" data-toggle="dropdown" >'+
            'Weeks <span class="caret"></span></button>'+
            '<ul class="dropdown-menu dropdown-menu-right">' +
             '<li ng-repeat="week in to.weeksList"><a ng-click="setByWeeks(week)">{{week}} Weeks</a></li>'+
            '</ul>'+
            '</div>',

            wrapper: ['bootstrapLabel', 'bootstrapHasError'],

            controller: ['$scope', '$log', 'moment', function($scope, $log, moment) {
                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                };
                
                $scope.setByWeeks = function(week) {
                    var oneMonth = new moment().add(week, 'weeks');
                    $scope.options.value(oneMonth.toDate());
                };

            }],

            overwriteOk: true,

            defaultOptions: {
                ngModelAttrs: ngModelAttrs,
                templateOptions: {

                    addonLeft: {
                        class: 'glyphicon glyphicon-calendar',
                        onClick: function(options, scope) {
                            if (options.templateOptions.disabled !== true) {
                                options.templateOptions.isOpen = !options.templateOptions.isOpen;
                            }
                        }
                    },
                    onFocus: function($viewValue, $modelValue, scope) {
                        scope.to.isOpen = !scope.to.isOpen;
                    },

                    datepickerOptions: {}
                }
            }
        });

        function camelize(string) {
            string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
            // Ensure 1st char is always lowercase
            return string.replace(/^([A-Z])/, function(match, chr) {
                return chr ? chr.toLowerCase() : '';
            });
        }
    });

})();

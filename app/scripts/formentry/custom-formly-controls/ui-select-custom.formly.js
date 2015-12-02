/*
jshint -W106, -W098, -W109, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
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
    // Configure custom types
    // formlyConfig.setType({
    //   name: 'ui-select-single',
    //   extends: 'select',
    //   wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
    //   template: '<ui-select data-ng-model="model[options.key]" ' +
    //   'data-required="{{to.required}}" ' +
    //   'data-disabled="{{to.disabled}}" theme="bootstrap"> ' +
    //     '<ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true"> ' +
    //     '{{$select.selected[to.labelProp]}}</ui-select-match> ' +
    //     '<ui-select-choices data-repeat="{{to.ngOptions}}"> ' +
    //       '<div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div> ' +
    //     '</ui-select-choices> ' +
    //   '</ui-select>'
    // });

    formlyConfig.setType({
      name: 'ui-select-single-search',
      extends: 'select',
      wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
      templateUrl: 'test-select.html'
    });

    formlyConfig.setType({
      name: 'ui-select-multiple',
      extends: 'select',
      wrapper: ['bootstrapLabel', 'bootstrapHasError', 'validation'],
      template: '<ui-select multiple data-ng-model="model[options.key]" ' +
      'data-required="{{to.required}}" data-disabled="{{to.disabled}}" ' +
      'theme="bootstrap"> ' +
        '<ui-select-match placeholder="{{to.placeholder}}"> ' +
        '{{$item[to.labelProp]}}</ui-select-match> ' +
        '<ui-select-choices data-repeat="{{to.ngOptions}}"> ' +
          '<div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div> ' +
        '</ui-select-choices> ' +
      '</ui-select>'
    });
  });

})();

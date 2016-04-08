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

    /*
    Testing nested sections in formly way
    */
    // set templates here
    formlyConfig.setType({
      name: 'section',
      template: '<formly-form model="model[options.key]" ' +
                'fields="options.data.fields"></formly-form>'
    });

	   formlyConfig.setWrapper({
      name: 'panel',
      types: ['section'],
      template: '<div class="panel panel-primary"> ' +
        '<div class="panel-heading px-nested-panel-heading clearfix" ng-click="expanded = !expanded; loaded =true;" > ' +
          '<strong class="control-label" ng-if="to.label"> '  +
            '{{to.label}} ' +
            "{{to.required ? '*' : ''}}  "+
          '</strong>'  +
          '<button type="button" class="btn btn-sm btn-primary pull-right" ng-init="expanded = loaded = (to.expanded || false)" >' +
          '<span ng-show="!expanded">Show  <span class="caret"></span></span>' +
          '<span ng-show="expanded">Hide <span class="dropup"><span class="caret"></span></span></span>' +
          '</button>'+
        '</div> ' +
        '<div class="panel-body px-nested-panel-body" ng-show="expanded" ng-if="loaded || expanded"> ' +
          '<formly-transclude></formly-transclude> ' +
        '</div> ' +
      '</div>'
    });
  });
})();

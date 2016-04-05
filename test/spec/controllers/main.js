/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
'use strict';

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(function() {
      module('angularFormentry');
      module('openmrs.angularFormentry');
    });

  var MainCtrl;
  var scope;
  var formentry;
  var formentryUtilService;
  var log;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector) {
    scope = $rootScope.$new();
    formentry = $injector.get('FormEntry');
    formentryUtilService = $injector.get('FormentryUtilService');
    log = $injector.get('$log');

    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      UtilService:formentryUtilService,
      FormEntry:formentry,
      $log:log
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).equal(3);
  });
});

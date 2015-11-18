/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106
*/
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
'use strict';

describe('Controller: AboutCtrl', function() {

  // load the controller's module
  beforeEach(module('angularFormentry'));

  var AboutCtrl;
  var scope;
  var location;
  var filter;
  var timeout;
  var formentry;
  var stub;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $injector) {
    scope = $rootScope.$new();
    location = $injector.get('$location');
    filter = $injector.get('$filter');
    formentry = $injector.get('FormEntry');
    timeout = $injector.get('$timeout');

    AboutCtrl = $controller('AboutCtrl', {
      $location:location,
      $scope: scope,
      FormEntry:formentry,
      $timeout:timeout,
      $filter:filter
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).equal(3);
  });

  it('should have various scope variables defined', function() {
    expect(scope.vm).to.be.defined;
    expect(scope.vm.model).to.be.defined;
    expect(scope.vm.tabs).to.be.defined;
  });

});

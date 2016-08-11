(function(){
  'use strict';
  
  var AuthService, $http, $base64;
  describe('AuthService Unit Tests', function(){
    beforeEach(function() {
      module('angularFormentry');
    })
    
    beforeEach(inject(function($injector){
      AuthService = $injector.get('AuthService');
      $http = $injector.get('$http');
      $base64 = $injector.get('$base64');
    }));
    
    it('authenticated() should return correct value', function() {
       AuthService.authenticated(true);
       expect(AuthService.authenticated()).to.be.true;
       
       AuthService.authenticated(false);
       expect(AuthService.authenticated()).to.be.false;
    })
  })
})();

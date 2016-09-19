(function() {
  'use strict';
  
  angular
    .module('angularFormentry')
      .service('CacheService', CacheService);
      
    CacheService.$inject = [];
    
    function CacheService() {
      var _this = this;
      var cache = {};
      
      // will replace already existing value
      _this.put = function(name, value) {
        cache[name] = value;
      };
      
      _this.get = function(name) {
        if(cache.hasOwnProperty(name)) {
          return cache[name];
        }
        return undefined;
      }
      
    }
})();

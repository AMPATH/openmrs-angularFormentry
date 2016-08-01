(function(){
  'use strict';
  
  angular
    .module('app.openmrsFormManager')
      .factory('FormManagerUtil', FormManagerUtil);
    
    FormManagerUtil.$inject = [];
    
    function FormManagerUtil() {
      var service = {
        findResource: findResource
      };
      
      return service;
      
      /**
       * Takes an array of form resources and a needle which can be dataType
       * or name
       * 
       */
      function findResource(formResources, needle) {
        var needle = needle || 'AmpathJsonSchema';
        if(_.isUndefined(formResources) || !Array.isArray(formResources)) {
          throw new Error('Argument should be array of form resources');
        }
        
        needle = needle.toLowerCase();
        return _.find(formResources, function(resource) {
          if(resource.dataType) {
            resource.dataType = resource.dataType.toLowerCase();
          }
          if(resource.name) {
            resource.name = resource.name.toLowerCase();
          }
          return (resource.dataType === needle || resource.name === needle);
        });
      }
    }
})();

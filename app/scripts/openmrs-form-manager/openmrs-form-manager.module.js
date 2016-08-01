(function() {
  'use strict';

  angular
    .module('app.openmrsFormManager', [
      'openmrs.RestServices'
    ])
    .run(function(formlyConfig) {
      formlyConfig.setType({
        name:'aceJsonEditor',
        template: '<div ui-ace="{'
                      + 'mode: \'json\''
                    +'}" ng-model="model[options.key]"></div>'
      });
      
      formlyConfig.setType({
        name: 'fileUpload',
        template: '<input type="file" file-model="model[options.key]"/>'
      });
    });
})();

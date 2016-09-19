(function() {
    'use strict';
    /**
     * @ngdoc function
     * @name angularFormentryApp.controller:CreateFormCtrl
     * @description
     * # CreateFormCtrl
     * Controller for creating a new form/form component
     */
    angular
        .module('app.openmrsFormManager')
        .controller('CreateFormCtrl', CreateFormCtrl);

    CreateFormCtrl.$inject = [
      '$scope',
      '$rootScope',
      'FormResService',
      'AuthService',
      'EncounterResService',
      '$log',
      'dialogs'
    ];
    
    function CreateFormCtrl($scope, $rootScope, FormResService, AuthService,
      encService, $log, dialogs) {
      
      $scope.options = {
        resetModel: function() {
          $scope.model = {};
        }
      };
      
      $scope.model = {};
      
      // Fields 
      $scope.fields = [{
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Form Name',
          required: true
        }
      }, {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          label: 'Description'
        }
      }, {
        key: 'version',
        type: 'input',
        templateOptions: {
          label: 'Version',
          required: true
        }
      }, {
        key: 'published',
        type: 'checkbox',
        templateOptions: {
          label: 'Published'
        }
      }, {
        key: 'uploadFile',
        type: 'checkbox',
        templateOptions: {
          label: 'I want to upload schema file'
        }
      }, {
        key: 'jsonSchema',
        type: 'aceJsonEditor',
        hideExpression: 'model.uploadFile',
        templateOptions: {
          label: 'JSON Schema'
        }
      }, {
        key: 'fileSchema',
        type: 'fileUpload',
        hideExpression: '!model.uploadFile',
        templateOptions: {
          label: 'Schema file',
          required: true
        }
      }];
    
    $scope.busy = true;
    _addEncounterTypesOptionIfFound();
      
    $scope.create = function() {
      // check if schema is empty
      $scope.busySaving = true;
      if(($scope.model.uploadFile && !$scope.model.fileSchema) || 
              (!$scope.model.uploadFile && !$scope.model.jsonSchema)) {
        dialogs.notify('JSON Schema', 'You need either to choose a json '
         + 'schema file to upload or define the json schema in the editor '
         + 'provided');
         $scope.busySaving = false;
      } else {
        if($scope.model.uploadFile) {
          var schemaBlob = $scope.model.fileSchema;
        } else {
          //Entered as text
          var schemaBlob = new Blob($scope.model.jsonSchema, {type:'application/json'});
        }
        
        //Upload the schema file
        // TODO: Validate json schema
        $log.debug('Uploading schema: ', schemaBlob);
        FormResService.uploadFormResource(schemaBlob).then(function(response) {
          $log.debug('uuid of newly created json schema resource: ', response.data);
          var newForm = {
            name: $scope.model.name,
            version: $scope.model.version,
            published: $scope.model.published || false,
            description: $scope.model.description || ''
          };
          
          if($scope.model.encounterType) {
            newForm.encounterType = $scope.model.encounterType;
          }
          
          $log.debug('Now uploading the form details: ', newForm);
          FormResService.saveForm(newForm).then(function(createdForm) {
            $log.debug('Form created successfully', createdForm);
            
            var resource = {
              name: 'JSON schema',
              dataType: 'AmpathJsonSchema',
              valueReference: response.data
            }
            // Now saving the resource: This really sucks,
            $log.debug('Creating a resource for newly created form', resource);
            FormResService.saveFormResource(createdForm.uuid, resource)
            .then(function(resource) {
              $log.debug('clobdata, form and resource all created successfully');
              dialogs.notify('New Form', 'You got this! done successfully!');
              $scope.busySaving = false;
            })
            .catch(function(err) {
              $log.error('resource could not be created, this sucks because '
                        + 'the other two went through aaargh!');
              dialogs.error('Resource Creation Error',JSON.stringify(err,null,2));
              $scope.busySaving = false;
            });
          })
          .catch(function(err) {
            $log.error('Form details could not be posted, the resource has'
            + ' been posted though!', err);
            dialogs.error('Form Creation Error',JSON.stringify(err,null,2));
            $scope.busySaving = false;
          });
        })
        .catch(function(err) {
          $log.error('Error uploading file, form creation failed', err);
          dialogs.error('File Upload Error', JSON.stringify(err,null,2));
          $scope.busySaving = false;
        });
      }
    }
    
    function _addEncounterTypesOptionIfFound() {
      encService.getEncounterTypes().then(function(data) {
        $log.debug('Loaded types', data.results);
        var types = [{
          value:null,
          name: '--'
        }];
        _.each(data.results, function(type) {
          types.push({
            value: type.uuid,
            name: type.display
          });
        });
        
        var typesField = {
          key: 'encounterType',
          type: 'select',
          defaultValue: null,
          templateOptions: {
            label: 'Encounter Type',
            options: types
          }
        };
        $scope.fields.splice(3, 0, typesField);
        $scope.busy = false;
      })
      .catch(function(err) {
        $log.error('Error fetching encounter types ',err);
        $scope.busy = false;
      });
    }
      
  }
})();

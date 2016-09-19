(function(){
  'use strict';
  
  angular
    .module('app.openmrsFormManager')
      .controller('ViewEditFormCtrl', ViewEditFormCtrl);
  
  ViewEditFormCtrl.$inject = [
    '$scope',
    '$log',
    '$state',
    '$stateParams',
    '$q',
    'FormResService',
    'FormManagerUtil',
    'EncounterResService',
    'AuthService',
    'dialogs'
  ];
  
  function ViewEditFormCtrl($scope, $log, $state, $stateParams, $q, FormResService,
    FormManagerUtil, encService, AuthService, dialogs) {
    $log.debug('Loading form from openmrs for form uuid: ' + $stateParams.formUuid);
    
    $scope.busy = true;
    $scope.hasError = false;
    $scope.errors = [];
    // Edit variables
    $scope.editForm = {};
    $scope.editForm.encounterTypes = [];
    $scope.editForm.uploadFile = false;
    
    // Load the form to be edited
    _initializeErrorAndBusyVariables();
    _loadForm($stateParams.formUuid);
    
    $scope.busy = true;
    //Load encounter types [Leave error details intact]
    _loadEncounterTypes();
    
    $scope.aceLoadedView = function(_editor) {
      _editor.setReadOnly(true);
    };  
    
    $scope.publishedChanged = function() {
      if($scope.editForm.published) {
        var title = 'Publishing';
        var message = 'Publishing the form will prevent any modifications '
                      + 'except for name & description.'
                      + ' Do you want to proceed?';
        
      } else {
        var title = 'Unpublishing';
        var message = 'Unpublished a form/component may introduce changes '
                    + 'that may screw the data collected using it.'
                    + ' Do you want to proceed?';
      }
      
      dialogs.confirm('Confirm ' + title, message).result.then(null, function(btn) {
        $scope.editForm.published = !$scope.editForm.published;
      });
    };
    
    $scope.saveChanges = function() {
      _initializeErrorAndBusyVariables();
      if($scope.editForm.schema.file) {
        var reader = new FileReader();
        reader.onload = function(event) {
          var fileContent = event.target.result;
          $log.debug('Done reading file: ', angular.fromJson(fileContent));
          __handleUpdates(_createPayloads(fileContent));
        };
        reader.readAsText($scope.editForm.schema.file);
      } else if($scope.editForm.schema.json) {
        $log.debug('Updating using schema entered as text in editor');
        __handleUpdates(_createPayloads($scope.editForm.schema.json));
      } else {
        // No schema business
        __handleUpdates(_createPayloads(null));
      }
      
      function __handleUpdates(payload) {
        if(payload.hasChanges) {
          _updateForm(payload);
        } else {
          $scope.busy = false;
          dialogs.notify('Updates', 'Nothing to update');
        }
      }
    };  
    
    $scope.changeViewToEdit = function() {
      $state.go('form-edit', {formUuid: $stateParams.formUuid,relative: false});
    };
    
    function _createPayloads(newJsonSchema) {
      var ret = {
        hasChanges: false,
        someFormFieldChanged: false,
        formPayload: {},
        schema: {
          action: false
        }
      };
      
      if($scope.form.name !== $scope.editForm.name) {
        ret.formPayload.name = $scope.editForm.name;
        ret.hasChanges = ret.someFormFieldChanged = true;
        
      }
      
      if($scope.form.description !== $scope.editForm.description) {
        ret.formPayload.description = $scope.editForm.description;
        ret.hasChanges = ret.someFormFieldChanged = true;
      }
      
      if($scope.form.published !== $scope.editForm.published) {
        ret.formPayload.published = $scope.editForm.published;
        ret.hasChanges = ret.someFormFieldChanged = true;
      }
      
      if(!$scope.form.published) {
        if($scope.form.version !== $scope.editForm.version) {
          ret.formPayload.version = $scope.editForm.version;
          ret.hasChanges = ret.someFormFieldChanged = true;
        }
        
        if($scope.form.encounterTypeUuid !== $scope.editForm.encounterTypeUuid) {
          ret.formPayload.encounterType = $scope.editForm.encounterTypeUuid;
          ret.hasChanges = ret.someFormFieldChanged = true;
        }
        
        // Deal with resource if changed. (Make sure you compare apples to apples)
        var ___updateSchemaStuff = function() {
          ret.hasChanges = true;
          if($scope.editForm.schema.file) {
            ret.schema.file = $scope.editForm.schema.file;
          } else {
            // Text passed
            ret.schema.file = new Blob([newJsonSchema], {type: 'application/json'});
          }
        }
        if(newJsonSchema) {
          if($scope.form.hasJsonSchema) {
            var oldSchema = angular.fromJson($scope.form.schema.json);
            var newSchema = angular.fromJson(newJsonSchema);
            $log.debug('Old schema:', oldSchema);
            $log.debug('New schema:', newSchema);
            
            if(!_.isEqual(oldSchema, newSchema)) {
              ___updateSchemaStuff.call(this);
              ret.schema.action = 'update';
              ret.jsonSchemaResource = {
                name: $scope.form.jsonSchemaResource.name || 'JSON schema',
                dataType: $scope.form.jsonSchemaResource.dataType || 'AmpathJsonSchema'
              }
            }
          } else {
            if($scope.editForm.schema.file || $scope.editForm.schema.json) {
              ___updateSchemaStuff.call(this);
              ret.schema.action = 'create';
              ret.jsonSchemaResource = {
                name: 'JSON schema',
                dataType: 'AmpathJsonSchema',
              };
            }
          }
        }
      }  
      return ret;
    }
    
    function _updateForm(payLoadData) {
      if(!payLoadData.hasChanges) return;
      
      var __updateResourceAndForm = function() {
        FormResService.uploadFormResource(payLoadData.schema.file)
        .then(function(response) {
          $log.debug('New new schema uploaded, now creating resource '
              + 'and uploading the updated form');
          payLoadData.jsonSchemaResource.valueReference = response.data;
          var promises = {};
          if(payLoadData.someFormFieldChanged) {
            $log.info('Form has some of fields modified');
            promises.form = FormResService.updateForm($scope.form.uuid,
                                                payLoadData.formPayload);
          }
          promises.formResource = FormResService.saveFormResource($scope.form.uuid,
                payLoadData.jsonSchemaResource);
          $q.allSettled(promises).then(function(values) {
            $log.debug('Reloading form after editing');
            _loadForm($scope.form.uuid);
          });
        })
        .catch(function(err) {
          $log.error('Error while updating form', err);
          $scope.hasError = true;
          $scope.errors.push = 'Error updating form, check the logs for details';
          $scope.busy = false;
        });
      };
      
      if(payLoadData.schema.action === 'update') {
        // Note: Because AmpathJsonSchema is not recognized as a valid dataType
        // in openmrs we have to remove the existing resource and create a new one
        $log.debug('Sending a request to delete schema with uuid ',
                            $scope.form.jsonSchemaResource.valueReference);
        FormResService.deleteFormSchemaByUuid($scope.form.jsonSchemaResource.valueReference)
        .finally(function() {
          $log.debug('We don\'t care about the outcome, now deleting '
            + 'form resource with uuid', $scope.form.jsonSchemaResource.uuid);
          FormResService.deleteFormResource($scope.form.uuid, $scope.form.jsonSchemaResource.uuid)
          .then(function(response) {
            // Upload new file
            $log.debug('Resource deleted, now uploading new schema: ',
              payLoadData.schema.file);
            __updateResourceAndForm();
          });
        })
        .catch(function(err) {
          $log.error('Error while updating form', err);
          $scope.hasError = true;
          $scope.errors.push = 'Error updating form, check the logs for details';
          $scope.busy = false;
        });
      } else if(payLoadData.schema.action === 'create') {
        __updateResourceAndForm();
      } else {
        //no action for schema
        FormResService.updateForm($scope.form.uuid, payLoadData.formPayload)
        .then(function(updatedForm) {
          $log.debug('Reloading form after editing');
          _loadForm($scope.form.uuid).then(function() {
            _displayUpdateSuccessDialog();
          });
        })
        .catch(function(err) {
          $log.error('Error while updating form', err);
          $scope.hasError = true;
          $scope.errors.push = 'Error updating form, check the logs for details';
          $scope.busy = false;
        });
      }
    }
    
    function _initializeErrorAndBusyVariables() {
      $scope.busy = true;
      $scope.hasError = false;
      $scope.errors = [];
    }
    
    function _loadForm(formUuid) {
      var __noFormResource = function() {
        $scope.form.schema.json = '';
        //Create a deep copy first
        var formCopy = angular.copy($scope.form);
        $scope.editForm = _.extend($scope.editForm, formCopy);
        formCopy = null;
        $scope.busy = false;
      }
      return FormResService.getFormByUuid({
        uuid: formUuid,
        v: 'full',
        caching: false
      }).then(function(form) {
        $log.debug('Fetched form: ', form);
        $scope.form = form;
        $scope.form.schema = null;
        if(form.published) {
          form.publishedText = 'Yes';
          form.publishedCssClass = 'success';
        } else {
          form.publishedText = 'No';
          form.publishedCssClass = 'danger';
        }
        if(form.resources) {
          $scope.form.schema = {};
          $log.debug('Finding json schema for form ' + form.name);
          var resource = FormManagerUtil.findResource(form.resources);
          if(resource === undefined) {
            $log.debug('Resource not found using "AmpathJsonSchema" dataType,'
             + ' trying name "JSON Schema" ');
             resource = FormManagerUtil.findResource(form.resources, 'JSON schema');
          }
          
          if(resource !== undefined) {
            $log.debug('Fetching the associated json schema with valueReference'
                   + resource.valueReference);
            $scope.form.schema = {
              uuid: resource.valueReference
            };
            $scope.form.hasJsonSchema = true;
            $scope.form.jsonSchemaResource = resource;
            FormResService.getFormSchemaByUuid(resource.valueReference)
            .then(function(schema) {
              $log.debug('Loaded schema', schema);
              $scope.form.schema.json = JSON.stringify(schema, null, 2);
              
              // Trying to get a deep copy from angular without its limitations
              var formCopy = angular.copy($scope.form);
              $scope.editForm = _.extend($scope.editForm, formCopy);
              formCopy = null;
              $scope.busy = false;
              return true;
            })
            .catch(function(err) {
              $log.error('Error occured while fetching schema with uuid ' 
                        + resource.valueReference, err);
              $scope.errors.push('Error fetching schema with uuid ' 
              + resource.valueReference);
              $scope.busy = false;
              $scope.hasError = true;
              throw err;
            })       
          } else {
            __noFormResource();
            return true;
          }
        } else {
          // No resources anyway
          __noFormResource()
          return true;
        } 
      })
      .catch(function(err) {
        $log.error('Error occured while fetching form uuid ' + formUuid);
        $scope.errors.push('Could not load form with uuid ' + formUuid);
        $scope.busy = false;
        $scope.hasError = true;
        throw err;
      });
    }
    
    function _loadEncounterTypes() {
      encService.getEncounterTypes().then(function(data) {
        $log.debug('Loaded types', data.results);
        $scope.editForm.encounterTypes = data.results;
        $scope.busy = false;
      })
      .catch(function(err) {
        $log.error('Error fetching encounter types ',err);
        $scope.busy = false;
      });
    }
    
    function _displayUpdateSuccessDialog() {
      dialogs.notify('Form Edits', 'Hoorraa! Form successfully updated');
    }
  }
})();

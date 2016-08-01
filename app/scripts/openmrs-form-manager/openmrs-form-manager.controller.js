(function() {
    'use strict';
    /**
     * @ngdoc function
     * @name app.openmrsFormManager.controller:OpenmrsFormManagerCtrl
     * @description
     * # OpenmrsFormManagerCtrl
     * Controller of the app.openmrsFormManager
     */
    
    angular
      .module('app.openmrsFormManager')
        .controller('OpenmrsFormManagerCtrl', OpenmrsFormManagerCtrl);

    OpenmrsFormManagerCtrl.$inject = [
        '$log',
        '$scope',
        '$rootScope',
        '$q',
        'FormResService',
        'dialogs',
        '$state',
        'AuthService',
        'CacheService'
    ];

    function OpenmrsFormManagerCtrl($log,$scope, $rootScope, $q, FormResService,
      dialogs, $state, AuthService, CacheService) {
        
        $scope.vm = {};
        $scope.vm.query = '';
        $scope.vm.busy = true;
        
        $scope.vm.maxSize = 2;
        
        $scope.vm.errors = [];
        $scope.vm.existingForms = null;
        $scope.vm.errorFetchingForms = false;
        $scope.vm.authenticated = AuthService.authenticated();
        
        if(AuthService.authenticated()) {
          $scope.vm.existingForms = _formatForms(CacheService.get('forms'));
          if(!$scope.vm.existingForms) {
            $rootScope.$broadcast('authenticated');
          } else {
            $scope.vm.busy = false;
          }
        }
        
        $scope.findDesiredForms = function() {
          $scope.vm.busy = true;
          var desired = {
            pocForms: FormResService.findPocForms('POC'),
            components: FormResService.findPocForms('Component')
          };
          
          $q.allSettled(desired).then(function(values) {
            var forms = values.pocForms.value;
            Array.prototype.push.apply(forms, values.components.value);
            CacheService.put('forms', forms);
            $scope.vm.existingForms = _formatForms(forms);
            $scope.vm.busy = false;
          })
          .catch(function(err) {
            $scope.vm.errorFetchingForms = err;
            $scope.vm.busy = false;
          });
        };
        
        $scope.$on('deauthenticated', function() {
          $scope.existingForms = null;
          $scope.vm.authenticated = false;
        });
        
        $scope.$on('authenticated', function(event, args) {
          $scope.findDesiredForms();
          $scope.vm.authenticated = true;
        }); 
        
        $scope.updateSchema = function(form) {
          var dialog = dialogs.confirm('Schema Exists', 'Schema already exists for ' 
            + form.name + '. Are you sure you want to upload a new one?');
          
          dialog.result.then(function(btn) {
            // User said Yes
            $scope.uploadSchema(form);
          });
        }
        
        $scope.uploadSchema = function(form) {
          form.busy = true;
          $log.debug(form.schema);
          
          var __saveFormResource = function(newResource) {
            FormResService.saveFormResource(form.uuid, newResource)
            .then(function(resource) {
              $log.debug('Resource updated successfully');
              newResource.uuid = resource.uuid;
              form.resources.push(newResource);
                              
              // Call format
              _formatSingleForm(form);
              form.busy = false;
              dialogs.notify('Success', 'Hooorah, it worked!');
            })
            .catch(function(err) {
              form.busy = false;
              $log.error('An error has occured', err);
              dialogs.error('Error!', 'Ooops! Troubles ' + err.message);
            });
          };
          
          FormResService.uploadFormResource(form.schema).then(function(data) {
            $log.debug('Returned from server:', data.data);
            
            // Upload resource info
            var existing = _findResource(form.resources, 'AmpathJsonSchema');
            if(existing !== null) {
              // Delete the existing resource
              FormResService.deleteFormResource(form.uuid, existing.uuid)
              .then(function() {
                $log.debug('Resource deleted, deleting schema');
                
                __saveFormResource({
                  name: existing.name || 'JSON schema',
                  dataType: existing.dataType || 'AmpathJsonSchema',
                  valueReference: data.data
                });
                
                FormResService.deleteFormSchemaByUuid(existing.valueReference)
                .then(function() {
                  $log.debug('Schema deleted, updating the form now');
                })
                .catch(function(err) {
                  $log.error('Error deleting schema ', err);
                });
              })
              .catch(function(err) {
                $log.error('Error deleting form resource with '
                        + 'uuid ' + existing.uuid, err);
              });
            } else {
              __saveFormResource({
                name: 'JSON schema',
                dataType: 'AmpathJsonSchema',
                valueReference: data.data
              }); 
            }
          })
          .catch(function(err) {
            form.busy = false;
            $log.error('didn\'t go well', err);
            dialogs.error('Error!', 'Oops! Could not upload schema');
          });
        }
        
        $scope.createForm = function() {
          $state.go('form-create', {relative:false});
        };

        $scope.viewForm = function(form) {
          $state.go('form-view', {formUuid: form.uuid,relative:false});
        }
        
        $scope.editForm = function(form) {
          $state.go('form-edit', {formUuid: form.uuid,relative: false});
        }
        
        function _formatForms(forms) {
          _.each(forms, function(form) {
            _formatSingleForm(form);
          });
          return forms;
        }
        
        function _formatSingleForm(form) {
          form.publishedText = form.published ? 'Yes' : 'No';
          form.publishedCssClass = form.published ? 'success': 'danger';
          form.schema = null;
          // Check whether it has resources
          if(form.resources && _findResource(form.resources)) {
            form.hasSchema = true;
            if(!form.published) {
              form.schemaAction = 'Update';
            }
          } else {
            form.hasSchema = false;
            form.schemaAction = 'Upload';
          }
          return form;
        }
        
        /**
         * Find a resource of a particular type in an array of resources.
         */
        function _findResource(formResources, resourceType) {
          var resourceType = resourceType || 'AmpathJsonSchema';
          if(_.isUndefined(formResources) || !Array.isArray(formResources)) {
            throw new Error('Argument should be array of form resources');
          }
          
          var found = _.find(formResources, function(resource) {
            return resource.dataType === resourceType;
          });
          
          if(found === undefined) return null;
          return found;
        }
    }
})();

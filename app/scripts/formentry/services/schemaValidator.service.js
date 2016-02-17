/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026, -W083
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry')
        .factory('schemaValidatorService', schemaValidatorService);

    schemaValidatorService.$inject = ['$log'];

  function schemaValidatorService($log) {
    var errorLabel = "";
    var pass = true;
    var schemaErrors = [];
      var service = {
          validateSchema: validateSchema
      };

      return service;

      function _isJsonString(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }

      function _validateFields (questions) {
        for( var i in questions) {
          var question = questions[i];
          if (question.type === 'obsGroup') {
            pass = _validateField(question);
            _validateFields(question.questions);
          } else {
            pass = _validateField(question);
          }
        }
      }

      function validateSchema(schema) {
          pass = true;
          schemaErrors = [];
          //valid schema type, should be an {}
          if ((!_isJsonString(schema)) && (typeof schema !== 'object')) {
              pass = false;
              $log.error('Form Error: Ensure you schema is a valid json object. Enclose it in {}');
          }
          //validate schema properties
          if (!schema.name || !schema.processor || !schema.pages){
              pass = false;
              $log.error('Form Error: Ensure the schema has name, processor and pages properties. You have provided this ' +
                'schema which is not complete::-->', schema);
                schemaErrors.push({id:"schema",
                error:"schema mising either name, processor or pages properties",
                question:schema
                });
          } else {
              //Validate structure of each properties
              _.each(schema.pages, function (page) {
                  pass = _validatePage(page);
                  _.each(page.sections, function (section) {
                    pass = _validateSection(section);
                    _validateFields (section.questions);
                  });
              });
          }
          console.log('Errors:',schemaErrors);
          return {
            pass: pass,
            errors:schemaErrors
          };
      }

      function _validatePage(page) {
          if(typeof page !== 'object'){
            pass = false;
            errorLabel = "";
            if (page.label) errorLabel = page.label;
            $log.error('Form Error: Your schema page is not an object, You have provided this -->', page);
            $log.error('Form Error: instead it should be an object: {}');
            schemaErrors.push({id:errorLabel?errorLabel:'page',
              error:"schema mising either name, processor or pages properties",
              question:page
            });
          } else {
            if (page.label === undefined) {
              pass = false;
              $log.error('Form Error: Your schema page is missing the label property, You have provided this -->', page);
              $log.error('Form Error: Each page must have a label');
              schemaErrors.push({id:"page",error:"Page label is missing",
              question:page
              });
            }
          }

        if(pass === false) {$log.error('Form Error: Page Validation has Failed');}
        if(pass === true) {$log.info('Form Error: Page Validation has Passed');}
        return pass;
      }

      function _validateSection(section) {
         errorLabel = "";
         if(typeof section !== 'object') {
            pass = false;
            if (section.label) errorLabel = section.label;
            $log.error('Form Error: Your page section is not an object, You have provided this -->', section);
            $log.error('Form Error: instead it should be an object:{}');

            schemaErrors.push({id:errorLabel?errorLabel:'section',
            error:"Your page section is not an object",
            question:section
            });
         } else {
           if(section.questions === undefined) {
             errorLabel = "";
              pass = false;
              if (section.label) errorLabel = section.label;
              $log.error('Form Error: Your page section is not having the questions property, You have provided this -->', section);
              $log.error('Form Error: The Section must have questions property');
              schemaErrors.push({id:errorLabel?errorLabel:'section',
              error:"Missing questions property",
              question:section
              })
           } else {
             if (!_.isArray(section.questions)) {
               pass = false;
               errorLabel = "";
               if (section.label) errorLabel = section.label;
               $log.error('Form Error: Your page section is not having the questions property, You have provided this -->', section);
               $log.error('Form Error: The Section questions property must be an array');
               schemaErrors.push({id:errorLabel?errorLabel:'section',
               error:"Section questions property should be an array",
               question:section
             });
             }
           }

           if(section.label === undefined) {
              pass = false;
              $log.error('Form Error: Your page section is having the label property, You have provided this -->', section);
              $log.error('Form Error: Every Section must have a label property');
              schemaErrors.push({id:'section',
              error:"Section is Missing a label",
              question:section
            });
           }
         }

         if(pass === false) {$log.error('Form Error: Section Validation has Failed');}
         if(pass === true) {$log.info('Form Error: Section Validation has Passed');}
         return pass;
      }

      function _validateField(field) {
          if (typeof field === 'function') {
            $log.info('Skipping functions added by phantomJS during tests')
          }
          else if(typeof field !== 'object') {
            pass = false;
            errorLabel = "";
            if (field.label) errorLabel = field.label;
            $log.error('Form Error: Your section question is not an object, You have provided this -->', field);
            $log.error('Form Error: instead it should be an object:{}');
            schemaErrors.push({id:errorLabel?errorLabel:'field',
            error:"Field should be an Object",
            question:field
            });
          } else {
            if (field.type === undefined) {
              pass = false;
              if (field.label) errorLabel = field.label;
              $log.error('Form Error: Your section question is missing the type property, You have provided this -->', field);
              $log.error('Form Error: Every question must have the type property');
              schemaErrors.push({id:errorLabel?errorLabel:'field',
              error:"Field Missing Type property",
              question:field
              });
            }

            if (field.questionOptions === undefined) {
              pass = false;
              if (field.label) errorLabel = field.label;
              $log.error('Form Error: Your section question is missing the questionOptions property, You have provided this -->', field);
              $log.error('Form Error: Every question must have the questionOptions property property');
              schemaErrors.push({id:errorLabel?errorLabel:'field',
              error:"Field Missing questionOptions property",
              question:field
              });
            } else {
              if (field.questionOptions.rendering === undefined) {
                pass = false;
                if (field.label) errorLabel = field.label;
                $log.error('Form Error: Your section question is missing the questionOptions.rendering property, You have provided this -->', field);
                $log.error('Form Error: Every question must have the questionOptions.rendering property property');
                schemaErrors.push({id:errorLabel?errorLabel:'field',
                error:"Field Missing questionOptions.rendering property",
                question:field
              });
              }

              if (field.type === 'obs') {
                if (field.questionOptions.concept === undefined) {
                  pass = false;
                  if (field.label) errorLabel = field.label;
                  $log.error('Form Error: Your section question is missing the questionOptions.concept property, You have provided this -->', field);
                  $log.error('Form Error: Every question of type obs must have the questionOptions.concept property property');
                  schemaErrors.push({id:errorLabel?errorLabel:'field',
                  error:"Field Missing questionOptions.concept property",
                  question:field
                  });

                }
                if (field.questionOptions.rendering === 'select') {
                  if(field.questionOptions.answers === undefined) {
                    pass = false;
                    if (field.label) errorLabel = field.label;
                    $log.error('Form Error: Your section question is missing the questionOptions.answers property, You have provided this -->', field);
                    $log.error('Form Error: Every question of type obs with select rendering must have the questionOptions.answers property');
                    schemaErrors.push({id:errorLabel?errorLabel:'field',
                    error:"Field Missing questionOptions.answers property",
                    question:field
                    });
                  }
                  if( !_.isArray(field.questionOptions.answers)) {
                    pass = false;
                    if (field.label) errorLabel = field.label;
                    $log.error('Form Error: Answers property is not an array, You have provided this -->', field);
                    $log.error('Form Error: Every answer property for select rendering must be an array');
                    schemaErrors.push({id:errorLabel?errorLabel:'field',
                    error:"QuestionOptions.answers property must be an array",
                    question:field
                    });
                  }
                }
                if (field.label === undefined) {
                  pass = false;
                  if (field.label) errorLabel = field.label;
                  $log.error('Form Error: Your section question is missing the label property, You have provided this -->', field);
                  $log.error('Form Error: Every question of type obs must have the label property property');
                  schemaErrors.push({id:errorLabel?errorLabel:'field',
                  error:"Field Missing label property",
                  question:field
                });
                }
              }
            }
          }
        if(pass === false) {$log.error('Form Error: Field Validation has Failed');}
        if(pass === true) {$log.info('Form Error: Field Validation has Passed');}
        return pass;
      }
  }
})();

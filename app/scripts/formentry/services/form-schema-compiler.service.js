/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .factory('FormSchemaCompilerService', FormSchemaCompilerService);

    FormSchemaCompilerService.$inject = [];

    function FormSchemaCompilerService(ObsProcessorService, PersonAttributesProcessorService,
        EncounterProcessorService) {
        var service = {
            findSchemaByName: findSchemaByName,
            getReferencedForms: getReferencedForms,
            getPageInSchemaByLabel: getPageInSchemaByLabel,
            getSectionInSchemaByPageLabelBySectionLabel: getSectionInSchemaByPageLabelBySectionLabel,
            getQuestionByIdInSchema: getQuestionByIdInSchema,
            getQuestionsArrayByQuestionIdInSchema: getQuestionsArrayByQuestionIdInSchema,
            getAllPlaceholderObjects: getAllPlaceholderObjects,
            fillPlaceholderObject: fillPlaceholderObject,
            deleteReferenceMember: deleteReferenceMember,
            fillAllPlaceholderObjectsInForm: fillAllPlaceholderObjectsInForm,
            removeObjectFromArray: removeObjectFromArray,
            removeExcludedQuestionsFromPlaceholder: removeExcludedQuestionsFromPlaceholder
        };

        return service;

        function findSchemaByName(schemaArray, nameOfSchema) {
            if (_.isEmpty(schemaArray) || _.isEmpty(nameOfSchema)) {
                return;
            }

            var foundSchema;
            _.each(schemaArray, function (schema) {
                if (schema.name === nameOfSchema) {
                    foundSchema = schema;
                }
            });
            return foundSchema;
        }

        function getPageInSchemaByLabel(schema, pageLabel) {
            if (_.isEmpty(schema) || _.isEmpty(pageLabel)) {
                return;
            }

            var foundPage;
            _.each(schema.pages, function (page) {
                if (page.label === pageLabel) {
                    foundPage = page;
                }
            });
            return foundPage;
        }

        function getSectionInSchemaByPageLabelBySectionLabel(schema, pageLabel, sectionLabel) {
            if (_.isEmpty(schema) || _.isEmpty(pageLabel) || _.isEmpty(sectionLabel)) {
                return;
            }

            var foundPage = getPageInSchemaByLabel(schema, pageLabel);
            if (_.isEmpty(foundPage)) {
                return;
            }

            var foundSection;

            _.each(foundPage.sections, function (section) {
                if (section.label === sectionLabel) {
                    foundSection = section;
                }
            });
            return foundSection;
        }

        function getQuestionByIdInSchema(schema, questionId) {
            if (_.isEmpty(schema) || _.isEmpty(questionId)) {
                return;
            }
            return _getQuestionByIdInSchema(schema, questionId);
        }

        function getQuestionsArrayByQuestionIdInSchema(schema, questionId) {
            if (_.isEmpty(schema) || _.isEmpty(questionId)) {
                return;
            }
            return _getQuestionsArrayByQuestionIdInSchema(schema, schema, questionId);
        }

        function _getQuestionByIdInSchema(object, questionId) {
            if (Array.isArray(object)) {
                //console.debug('is array', object);
                var question;
                for (var i = 0; i < object.length; i++) {
                    if (!_.isEmpty(object[i])) {
                        question = _getQuestionByIdInSchema(object[i], questionId);
                    }
                    if (!_.isEmpty(question)) {
                        break;
                    }
                }
                return question;
            } else if (typeof object === 'object') {
                //console.debug('is object', object);
                if (_isQuestionObjectWithId(object, questionId)) {
                    return object;
                } else if (_isSchemaSubObjectExpandable(object)) {
                    var toExpand = (object.pages || object.sections || object.questions);
                    //console.log('toExpand', toExpand);
                    return _getQuestionByIdInSchema(toExpand, questionId);
                } else {
                    return;
                }
            } else {
                return;
            }
        }

        function _getQuestionsArrayByQuestionIdInSchema(parent, object, questionId) {
            if (Array.isArray(object)) {
                //console.debug('is array', object);
                var returnedValue;
                for (var i = 0; i < object.length; i++) {
                    if (!_.isEmpty(object[i])) {
                        returnedValue = _getQuestionsArrayByQuestionIdInSchema(object, object[i], questionId);
                    }
                    if (!_.isEmpty(returnedValue)) {
                        break;
                    }
                }

                return returnedValue;
            } else if (typeof object === 'object') {
                //console.debug('is object', object);
                if (_isQuestionObjectWithId(object, questionId)) {
                    return parent;
                } else if (_isSchemaSubObjectExpandable(object)) {
                    var toExpand = (object.pages || object.sections || object.questions);
                    //console.log('toExpand', toExpand);
                    return _getQuestionsArrayByQuestionIdInSchema(toExpand, toExpand, questionId);
                } else {
                    return;
                }
            } else {
                return;
            }
        }

        //object is page or section or question
        function _isSchemaSubObjectExpandable(object) {
            if (typeof object === 'object') {
                var objectKeys = Object.keys(object);
                if (_.contains(objectKeys, 'pages') ||
                    _.contains(objectKeys, 'sections') ||
                    _.contains(objectKeys, 'questions')) {
                    //console.log('isExpandable', object);
                    return true;
                }
            }
            return false;
        }

        function _isQuestionObjectWithId(object, id) {
            //console.log('is Question', object);
            if (object.id === id) {
                return true;
            }
            return false;
        }

        function getAllPlaceholderObjects(schema) {
            var referencedObjects = [];
            _getAllPlaceholderObjects(schema, referencedObjects);
            return referencedObjects;
        }

        function _getAllPlaceholderObjects(subSchema, objectsArray) {
            if (_.isEmpty(subSchema)) {
                return;
            }
            if (Array.isArray(subSchema)) {
                for (var i = 0; i < subSchema.length; i++) {
                    if (!_.isEmpty(subSchema[i])) {
                        _getAllPlaceholderObjects(subSchema[i], objectsArray);
                    }
                }
            } else if (typeof subSchema === 'object') {
                //console.log('Examining object', subSchema);
                if (!_.isEmpty(subSchema.reference)) {
                    objectsArray.push(subSchema);
                } else if (_isSchemaSubObjectExpandable(subSchema)) {
                    var toExpand = (subSchema.pages || subSchema.sections || subSchema.questions);
                    _getAllPlaceholderObjects(toExpand, objectsArray);
                }
            }
        }

        function fillPlaceholderObject(placeHolderObject, referenceObject) {

            for (var member in referenceObject) {
                //console.log('examining member', member);
                if (_.isEmpty(placeHolderObject[member])) {
                    //console.log('filling member', placeHolderObject[member]);
                    placeHolderObject[member] = referenceObject[member];
                }
            }
        }

        function deleteReferenceMember(placeHolderObject) {
            delete placeHolderObject['reference'];
        }

        function fillAllPlaceholderObjectsInForm(formSchema, referencedForms) {
            //get all referenced forms 
            var referencedForms = getReferencedForms(formSchema, referencedForms);
            if (_.isEmpty(referencedForms)) {
                return;
            }

            //get all place-holders from the form schema
            var placeHolders = getAllPlaceholderObjects(formSchema);
            if (_.isEmpty(placeHolders)) {
                return;
            }

            //replace all placeHolders
            _replaceAllPlaceholdersWithActualObjects(formSchema, referencedForms, placeHolders);

        }

        function _replaceAllPlaceholdersWithActualObjects(formSchema, keyValReferencedForms, placeHoldersArray) {
            _.each(placeHoldersArray, function (placeHolder) {
                var referencedObject = _getReferencedObject(formSchema, placeHolder.reference, keyValReferencedForms);

                if (_.isEmpty(referencedObject)) {
                    console.error('Form compile: Error finding referenced object', placeHolder.reference);
                } else {
                    //console.log('Form compile: filling placeholder object', placeHolder);
                    //console.log('Form compile: filling placeholder object with', referencedObject);
                    fillPlaceholderObject(placeHolder, referencedObject);
                    removeExcludedQuestionsFromPlaceholder(placeHolder);
                    deleteReferenceMember(placeHolder);
                }
            });
        }

        function removeObjectFromArray(array, object) {
            var indexOfObject = array.indexOf(object);
            if (indexOfObject === -1) return;

            array.splice(indexOfObject, 1);
        }

        function removeExcludedQuestionsFromPlaceholder(placeHolder) {
            if (angular.isArray(placeHolder.reference.excludeQuestions)) {
                _.each(placeHolder.reference.excludeQuestions, function (excludedQuestionId) {
                    var questionsArray = getQuestionsArrayByQuestionIdInSchema(
                        placeHolder, excludedQuestionId);

                    if (!angular.isArray(questionsArray)) return;
                    var question = getQuestionByIdInSchema(questionsArray, excludedQuestionId);

                    removeObjectFromArray(questionsArray, question);
                });
            }
        }

        function _getReferencedObject(formSchema, referenceData, keyValReferencedForms) {
            if (_.isEmpty(referenceData.form)) {
                console.error('Form compile: reference missing form attribute', referenceData);
                return;
            }
            if (_.isEmpty(keyValReferencedForms[referenceData.form])) {
                console.error('Form compile: referenced form alias not found', referenceData);
                return;
            }
            if (!_.isEmpty(referenceData.questionId)) {
                return getQuestionByIdInSchema(keyValReferencedForms[referenceData.form], referenceData.questionId);
            }

            if (!_.isEmpty(referenceData.page) && !_.isEmpty(referenceData.section)) {
                return getSectionInSchemaByPageLabelBySectionLabel(
                    keyValReferencedForms[referenceData.form],
                    referenceData.page,
                    referenceData.section
                );
            }
            if (!_.isEmpty(referenceData.page)) {
                return getPageInSchemaByLabel(
                    keyValReferencedForms[referenceData.form],
                    referenceData.page
                );
            }
            console.error('Form compile: Unsupported reference type', referenceData.reference);
        }

        function getReferencedForms(formSchema, formSchemaLookup) {
            var referencedForms = formSchema.referencedForms;

            if (_.isEmpty(referencedForms)) {
                return;
            }

            var keyValReferencedForms = {};
            if(Array.isArray(formSchemaLookup)) {
              _.each(referencedForms, function (reference) {
                  var referencedFormSchema =
                      findSchemaByName(formSchemaLookup, reference.formName);
                  keyValReferencedForms[reference.alias] = referencedFormSchema;
              });
            } else {
              // Assume it is a key value pair of uuid:schema //i.e this is from
              // openmrs backend
              _.each(referencedForms, function (reference) {
                keyValReferencedForms[reference.alias] = 
                                        formSchemaLookup[reference.ref.uuid];
              })
            }

            return keyValReferencedForms;
        }

    }
})();

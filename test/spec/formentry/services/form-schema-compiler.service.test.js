/* global sinon */
/* global expect */
/* global it */
/* global beforeEach */
/* global describe */
/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation
/*jscs:requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
    'use strict';
    describe('Form Schema Compiler Service Unit Tests', function () {
        beforeEach(function () {
            module('mock.formSchemas');
            module('openmrs.angularFormentry');
        });

        var formSchemasService;
        var formCompilerService;
        var adultReturnForm;
        var triageForm;
        var triageFormWithReferences
        var schemaArray;

        beforeEach(inject(function ($injector) {
            formSchemasService = $injector.get('TestFormSchemasService');
            formCompilerService = $injector.get('FormSchemaCompilerService');

            adultReturnForm = formSchemasService.getAdultReturnSchema();
            triageForm = formSchemasService.getTriageSchema();
            triageFormWithReferences = formSchemasService.getTriageSchemaWithReferences();
            schemaArray = [];
            schemaArray.push(adultReturnForm);
            schemaArray.push(triageForm);

        }));

        it('Should load form schema compiler service',
            function () {
                expect(formCompilerService).to.exist;
                expect(formCompilerService.findSchemaByName).to.be.defined;
            });

        it('Should load test form schemas service',
            function () {
                expect(formSchemasService).to.exist;
                expect(formSchemasService.getAdultReturnSchema).to.be.defined;
            });

        it('Should load all form schemas required for testing',
            function () {
                expect(adultReturnForm).to.exist;
                expect(adultReturnForm.name).to.equal('AMPATH Adult Return Encounter Form 6.09');

                expect(triageForm).to.exist;
                expect(triageForm.name).to.equal('AMPATH Triage Encounter Form 1.00');

                expect(triageFormWithReferences).to.exist;
                expect(triageFormWithReferences.name).to.equal('AMPATH Triage Encounter References');
            });

        it('Should return the correct schema when findSchemaByName is invoked',
            function () {
                var returnedSchema;
                var expectedSchema = adultReturnForm;
                returnedSchema = formCompilerService.findSchemaByName(schemaArray,
                    'AMPATH Adult Return Encounter Form 6.09');

                expect(returnedSchema).to.deep.equal(expectedSchema);

            });

        it('Should return the correct page when getPageInSchemaByLabel is invoked',
            function () {
                var returnedPage;
                returnedPage = formCompilerService.getPageInSchemaByLabel(adultReturnForm,
                    'Medical History');

                expect(returnedPage.label).to.equal('Medical History');
                expect(returnedPage.sections[0].label).to.equal('Social History');

            });

        it('Should return the correct section when getSectionInSchemaByPageLabelBySectionLabel is invoked',
            function () {
                var returnedSection;
                returnedSection = formCompilerService.
                    getSectionInSchemaByPageLabelBySectionLabel(adultReturnForm,
                    'Medical History', 'Social History');

                expect(returnedSection.label).to.equal('Social History');
                expect(returnedSection.questions[0].label).to.equal('Civil Status:');

            });

        it('Should return the correct question when getQuestionByIdInSchema is invoked',
            function () {
                var returnedQuestion;
                returnedQuestion = formCompilerService.
                    getQuestionByIdInSchema(adultReturnForm, 'scheduledVisit');

                expect(returnedQuestion.id).to.equal('scheduledVisit');
                expect(returnedQuestion.label).to.equal('Was this visit scheduled?');

                //deeper question
                returnedQuestion = undefined;
                returnedQuestion = formCompilerService.getQuestionByIdInSchema(adultReturnForm,
                    'pcpProphylaxisAdherence');

                expect(returnedQuestion.id).to.equal('pcpProphylaxisAdherence');
                expect(returnedQuestion.label).to.equal("Patient's adherence on PCP Prophylaxis:");

            });

        it('Should return the correct questions array when getQuestionsArrayByQuestionIdInSchema is invoked',
            function () {
                var returnedQuestionArray;
                returnedQuestionArray = formCompilerService.
                    getQuestionsArrayByQuestionIdInSchema(adultReturnForm, 'scheduledVisit');
                console.error('returned array', returnedQuestionArray);
                expect(Array.isArray(returnedQuestionArray)).to.equal(true);
                expect(returnedQuestionArray[0].id).to.equal('encDate');
                expect(returnedQuestionArray[0].label).to.equal('Visit Date');

                //deeper question
                returnedQuestionArray = undefined;
                returnedQuestionArray = formCompilerService.getQuestionsArrayByQuestionIdInSchema(adultReturnForm,
                    'pcpProphylaxisAdherence');

                expect(Array.isArray(returnedQuestionArray)).to.equal(true);
                expect(returnedQuestionArray[0].id).to.equal('pcpProphylaxisAdherence');
                expect(returnedQuestionArray[0].label).to.equal("Patient's adherence on PCP Prophylaxis:");

            });

        it('Should fill in missing object members when fillPlaceholderObject is invoked',
            function () {

                //case filling empty objects
                var placeHolderObject = {};
                var referenceObject = {
                    memberA: 'string',
                    memberB: ['array', 'of', 'string'],
                    memberC: new Date(),
                    member4: {
                        anotherObject: 'innerobject'
                    }
                };

                formCompilerService.
                    fillPlaceholderObject(placeHolderObject, referenceObject);
                expect(placeHolderObject).to.deep.equal(referenceObject);

                //case filling placeHolder with existing items. Should not delete or change existing members
                var placeHolderObject2 = {
                    memberA: 'string 2',
                    reference: {
                        page: '1',
                        section: '2',
                        question: '3'
                    }
                };

                formCompilerService.
                    fillPlaceholderObject(placeHolderObject2, referenceObject);

                expect(placeHolderObject2.memberA).to.equal('string 2');
                expect(placeHolderObject2.memberC).to.equal(referenceObject.memberC);
                expect(placeHolderObject2.reference).to.exist;
            });

        it('Should clear reference member from placeHolder object when deleteReferenceMember is invoked',
            function () {
                var placeHolderObject = {
                    memberA: 'string 2',
                    reference: {
                        page: '1',
                        section: '2',
                        question: '3'
                    }
                };

                formCompilerService.
                    deleteReferenceMember(placeHolderObject);

                expect(placeHolderObject.reference).to.be.undefined;
            });

        it('Should remove object from an array when removeObjectFromArray is invoked',
            function () {
                var myObject = {
                    a: 'b'
                };

                var myArray = [{
                    b: 'c'
                },
                    myObject,
                    {
                        e: 'f'
                    }];

                formCompilerService.
                    removeObjectFromArray(myArray, myObject);
                console.log('array after removing element', myArray, 'object', myObject);
                expect(myArray.length).to.equal(2);
                expect(myArray.indexOf(myObject)).to.equal(-1);
            });

        it('Should remove excluded questions from placeholder when removeObjectFromArray is invoked',
            function () {
                var placeHolderObject = {
                    memberA: 'string 2',
                    reference: {
                        page: '1',
                        section: '2',
                        excludeQuestions: ['3']
                    },
                    questions: [
                        {
                            id: '2'
                        },
                        {
                            id:'1'                            
                        },
                        {
                            id: '3'
                        }]
                };

                formCompilerService.
                    removeExcludedQuestionsFromPlaceholder(placeHolderObject);
                console.log('array after removing element', placeHolderObject.questions);
                expect(placeHolderObject.questions.length).to.equal(2);
                expect(placeHolderObject.questions.indexOf({id: '3'})).to.equal(-1);
            });

        it('Should return an array of all reference types when getAllPlaceholderObjects is invoked',
            function () {
                var referencedSections = formCompilerService.
                    getAllPlaceholderObjects(triageFormWithReferences);

                expect(referencedSections.length).to.equal(3);
            });

        it('Should return an object key value of formAlias-formSchema when getReferencedForms is invoked',
            function () {
                var referencedForms = formCompilerService.
                    getReferencedForms(triageFormWithReferences, schemaArray);

                expect(referencedForms.triage).to.exist;
                expect(referencedForms.adult).to.exist;
            });

        it('Should replace all place holder objects with actual objects in a form when fillAllPlaceholderObjectsInForm is invoked ',
            function () {
                formCompilerService.
                    fillAllPlaceholderObjectsInForm(triageFormWithReferences, schemaArray);

                //check all place holders have been filled in form
                var placeHolders = formCompilerService.
                    getAllPlaceholderObjects(triageFormWithReferences);

                expect(placeHolders.length).to.equal(0);
            });

    });
})(); 
(function () {
    'use strict';
    describe('Historical Field Helper Service Unit Tests', function () {
        beforeEach(function () {
            module('openmrs.angularFormentry');
        });

        var historicalHelperService;
        
        var regularSchemaQuestion;
        var groupSchemaQuestion;
        var mockFormlyField; 

        beforeEach(inject(function ($injector) {
            historicalHelperService = $injector.get('HistoricalFieldHelperService');
        }));
        
        beforeEach(function(){
            mockFormlyField = {
                value: function(newValue) {
                    
                },
                templateOptions: {
                    createModelBluePrint: function(parentModel, newValue) {
                        return {};
                    }
                }
            };
        });
        
        beforeEach(function() {
            regularSchemaQuestion = {
                type: 'obs',
                label: 'question5',
                id: 'q5',
                required: 'false',
                default: '',
                questionOptions: {
                    rendering: 'text',
                    concept: '123266'
                },
                validators: [
                    {
                        type: 'conditionalAnswered',
                        message: 'Only answer when q1 is answerQ5',
                        referenceQuestionId: 'q1',
                        referenceQuestionAnswers: [
                            'answerQ5'
                        ]
                    }
                ]
            };
            
             groupSchemaQuestion = {
              label: 'Family Planning Method',
              id: 'q12e',
              type: 'obsGroup',
              questionOptions: {
                rendering: 'group',
                 concept: 'a8a003a6-1350-11df-a1f1-0026b9348838'
              },
              questions: [ regularSchemaQuestion ] 
              };
        });

        it('should have historical field helper service defined', function () {
            expect(historicalHelperService).to.exist;
        });

        it('should create the right model for regular field' + 
        ' when createModelForRegularField is invoked', function () {
            
            var value = 'test';
            
            var expectedModel = {
               concept:  regularSchemaQuestion.questionOptions.concept,
               schemaQuestion: regularSchemaQuestion,
               value: value
            };
            
            var outputModel = historicalHelperService.
            createModelForRegularField(null, 'somekey', regularSchemaQuestion, 
            expectedModel.concept, value);
            
            expect(outputModel).to.deep.equal(expectedModel);
            
            //case parent model is passed with a non 'key.value' key
            var parentModel = {};
            
            var expectedParentModel = {
                somekey: expectedModel
            }
            
            outputModel = historicalHelperService.
            createModelForRegularField(parentModel, 'somekey', regularSchemaQuestion, 
            expectedModel.concept, value);
            
            expect(parentModel).to.deep.equal(expectedParentModel);
            
            //case parent model is passed with a 'key.value' key
            var parentModel = {};
            
            var expectedParentModel = {
                somekey: expectedModel
            }
            
            outputModel = historicalHelperService.
            createModelForRegularField(parentModel, 'somekey.value', regularSchemaQuestion, 
            expectedModel.concept, value);
            
            expect(parentModel).to.deep.equal(expectedParentModel);
        });
        
        it('should create the right model for group field' + 
        ' when createModelForGroupSection is invoked', function () {
            
            var expectedModel = {
               groupConcept:  groupSchemaQuestion.questionOptions.concept,
               schemaQuestion: groupSchemaQuestion
            };
            
            var outputModel = historicalHelperService.
            createModelForGroupSection(null, 'somekey', groupSchemaQuestion, 
            expectedModel.groupConcept);
            
            expect(outputModel).to.deep.equal(expectedModel);
            
            //case parent model is passed with a non 'key.value' key
            var parentModel = {};
            
            var expectedParentModel = {
                somekey: expectedModel
            }
            
            outputModel = historicalHelperService.
            createModelForGroupSection(parentModel, 'somekey', groupSchemaQuestion, 
            expectedModel.groupConcept);
            
            expect(parentModel).to.deep.equal(expectedParentModel);
            
        });
        
        it('should set regular field with a value ' + 
        ' when fillPrimitiveValue is invoked', function () {
            //integration test 
            var newValue = 'testValue';
            
            var fieldSpy = sinon.spy(mockFormlyField, 'value');
            
            historicalHelperService.fillPrimitiveValue(mockFormlyField, newValue);
            
            expect(fieldSpy).to.have.been.calledOnce;
            expect(fieldSpy.firstCall.calledWithExactly(newValue))
            .to.be.true;
            
        });
        
        it('should set regular field with a value ' + 
        ' when fillArrayOfPrimitives is invoked', function () {
            //integration test 
            var newValue = ['testValue', 'tesvalue2'];
            
            var fieldSpy = sinon.spy(mockFormlyField, 'value');
            
            historicalHelperService.fillArrayOfPrimitives(mockFormlyField, newValue);
            
            expect(fieldSpy).to.have.been.calledOnce;
            expect(fieldSpy.firstCall.calledWithExactly(newValue))
            .to.be.true;
            
        });
        
        it('should set group field with a value ' + 
        ' when fillGroups is invoked', function () {
            //integration test 
            var newValue = {
                testConcept: 'value',
                testConcept2: 20
             };
            
            var fieldValueFunctionSpy = sinon.spy(mockFormlyField, 'value');
            var fieldCreateModelBluePrintFunctionSpy = 
            sinon.spy(mockFormlyField.templateOptions, 'createModelBluePrint');
            
            historicalHelperService.fillGroups(mockFormlyField, newValue);
            
            expect(fieldValueFunctionSpy).to.have.been.calledOnce;
            expect(fieldCreateModelBluePrintFunctionSpy).to.have.been.calledOnce;
            
            expect(fieldValueFunctionSpy.firstCall.calledWithExactly({}))
            .to.be.true;
            
            expect(fieldCreateModelBluePrintFunctionSpy.firstCall
            .calledWithExactly(undefined, newValue))
            .to.be.true;
            
        });
        
        it('should return a valid display text ' + 
        ' when getDisplayText is invoked', function () {
             var fieldLabel = 'testLabel';
             var value = 'myValue';
             var expectedDisplayText = 'myValue';
             
             historicalHelperService.getDisplayText(value, function(display){
                expect(expectedDisplayText).to.equal(display); 
             }, fieldLabel);           
        });
        
        it('should return a valid display text ' + 
        ' when getDisplayTextFromOptions is invoked', function () {
             var fieldLabel = 'testLabel';
             var value = '4321';
             var value2 = ['4321', '5000'];
             var options = [
                 {
                     concept: '1234',
                     label: 'concept one'
                 },
                 {
                     concept: '4321',
                     label: 'concept two'
                 },
                 {
                     concept: '5000',
                     label: 'five thousand'
                 }
             ];
             var expectedDisplayText = 'concept two';
             var expectedDisplayText2 = 'concept two, five thousand';
             
             historicalHelperService.getDisplayTextFromOptions(value, options, 'concept', 
             'label', function(display){
                expect(expectedDisplayText).to.equal(display); 
             }, fieldLabel); 
             
             //case value is an array
             historicalHelperService.getDisplayTextFromOptions(value2, options, 'concept', 
             'label', function(display){
                expect(expectedDisplayText2).to.equal(display); 
             }, fieldLabel);          
        });
        
        it('should add historicalExpression property ' + 
        ' when handleHistoricalExpressionProperty is invoked', function () {
             var someFieldWithTemplateOptions = {
                 templateOptions: {
                     
                 }
             };
             
             var someSchemaQuestionWithHistoricalExpression = {
                 historicalExpression: 'some expression'
             };
             
             var someSchemaQuestionWithoutHistoricalExpression = {
                 
             };
             
             //case schema question without historical expression property
             historicalHelperService.
             handleHistoricalExpressionProperty(someFieldWithTemplateOptions,
             someSchemaQuestionWithoutHistoricalExpression);
             expect(someFieldWithTemplateOptions.templateOptions.historicalExpression)
             .to.equal(undefined);
             //case schema question historical expression property 
             historicalHelperService.
             handleHistoricalExpressionProperty(someFieldWithTemplateOptions,
             someSchemaQuestionWithHistoricalExpression);
             expect(someFieldWithTemplateOptions.templateOptions.historicalExpression)
             .to.equal('some expression');
                        
        });
        
        it('should add getDisplayValue property to a field ' + 
        ' when handleGetDisplayValueFunctionForGroupsProperty is invoked', function () {
             var someFieldWithTemplateOptions = {
                 templateOptions: {
                     
                 }
             };
             
             var someFieldWithfieldGroup = {
                 fieldGroup: 'not null',
                 templateOptions: {
                     
                 }
             };
             
             var someSchemaQuestion = {
                 historicalExpression: 'some expression'
             };
             
             //case field without field group
             historicalHelperService.
             handleGetDisplayValueFunctionForGroupsProperty(someFieldWithTemplateOptions,
             someSchemaQuestion);
             expect(typeof someFieldWithTemplateOptions.templateOptions.getDisplayValue)
             .to.equal('function');
             
             //case field without field group
             historicalHelperService.
             handleGetDisplayValueFunctionForGroupsProperty(someFieldWithfieldGroup,
             someSchemaQuestion);
             expect(typeof someFieldWithTemplateOptions.templateOptions.getDisplayValue)
             .to.equal('function');
                        
        });
        
        it('should add createModelBluePrint property to a field ' + 
        ' when handleModelBluePrintFunctionForGroupsProperty is invoked', function () {
             var someFieldWithTemplateOptions = {
                 templateOptions: {
                     
                 }
             };
             
             var someFieldWithfieldGroup = {
                 fieldGroup: 'not null',
                 templateOptions: {
                     
                 }
             };
             
             var someSchemaQuestion = {
                 historicalExpression: 'some expression'
             };
             
             //case field without field group
             historicalHelperService.
             handleModelBluePrintFunctionForGroupsProperty(someFieldWithTemplateOptions,
             someSchemaQuestion);
             expect(typeof someFieldWithTemplateOptions.templateOptions.createModelBluePrint)
             .to.equal('function');
             
             //case field without field group
             historicalHelperService.
             handleModelBluePrintFunctionForGroupsProperty(someFieldWithfieldGroup,
             someSchemaQuestion);
             expect(typeof someFieldWithTemplateOptions.templateOptions.createModelBluePrint)
             .to.equal('function');
                        
        });
        
        it('should create valid historical-text formly field object' + 
        ' when createHistoricalTextField is invoked', function () {
             var expectedHistoricalFieldObject = {
                 key: 'historical-text-val',
                type: 'historical-text',
                templateOptions: {
                    parentFieldKey: 'somekey',
                    parentFieldModel: {},
                    parentField: regularSchemaQuestion,
                    prepopulate: undefined
                }
             };
             
             var output = historicalHelperService.
                createHistoricalTextField(regularSchemaQuestion ,{}, 'somekey');
                
             expect(output).to.deep.equal(expectedHistoricalFieldObject);
        });

    });

})();
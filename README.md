[![Build Status](https://travis-ci.org/AMPATH/openmrs-angularFormentry.svg?branch=master)](https://travis-ci.org/AMPATH/openmrs-angularFormentry)
# angular-formentry

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

Introduction
Angular OpenMRS formentry is a module that aims at using angular framework to create a standalone module that can be used by the community and angular AMRS project to create forms.
This Module will require a schema in a given format. This schema will be passed to this module which will generate a form based on the schema specification.
Module Components
This module will have the following key components:
Field Handlers
Form Processors
Schema
Form Validators
Payload generators
Schema

FORM SCHEMA FORMAT
The form schema to be consumed with angular formentry module should be in this format
A form schema is a json document made up of the following main properties:
a) name - name of the form,
b) uuid - form uuid,
c) processor - form processor e.g. EncounterFormProcessor ObsFormProcessor etc,
d) referencedForms - Other forms that can be used to build the current form
e) pages - Holds the form contents organized into page. A page is made up of several sections and the section contains various field.

FIELDS
The fields are supposed to be used to represent the questions on form. The module supports a wide range of field types namely:
a) encounterProvider,
b) encounterLocation,
c) encounterDatetime,
d) obs,
e) obsGroup
f) personAttributes

Each of this fields can be rendered in various forms using the rendering property of the field: The rendering types allowable by the this module are:
a) text,
b) number
c) select/dropdown
d) checkbox
e) multi-checkbox
f) ui-select-extended
g) date
h) problem

Field Structure: A field should be of the following format:
{
label:"field label/title",
type: "as describe above e.g. obs/obsGroup/etc"
id:"optional uinque Id for a field",
questionOptions:{
concept:"question concept uuid or concept mapping",
rendering:"field rendering option as listed above",
answers :[used only for select and multi-checkbox- has an array of answer objects in this format {concept:uuuid, label:"answer label"}]
},
validators : [an array of validator objects used to validate the field],
disable:"expression to disable the field",
hide: "expression to hide the field"
}

Structure of a Page:
A page is a way of grouping related fields/questions on the a given page on the form. A page can have several sections. Page structure:
{
label : "page label",
sections: [
{
label:"section label",
questions: [
{
label:"field label/title",
type: "as describe above e.g. obs/obsGroup/etc"
id:"optional uinque Id for a field",
questionOptions:{
concept:"question concept uuid or concept mapping",
rendering:"field rendering option as listed above",
answers :[used only for select and multi-checkbox- has an array of answer objects in this format {concept:uuuid, label:"answer label"}]
},
validators : [an array of validator objects used to validate the field],
disable:"expression to disable the field",
hide: "expression to hide the field"
},
{
label:"field label/title",
type: "as describe above e.g. obs/obsGroup/etc"
id:"optional uinque Id for a field",
questionOptions:{
concept:"question concept uuid or concept mapping",
rendering:"field rendering option as listed above",
answers :[used only for select and multi-checkbox- has an array of answer objects in this format {concept:uuuid, label:"answer label"}]
},
validators : [an array of validator objects used to validate the field],
disable:"expression to disable the field",
hide: "expression to hide the field"
}
]
}
]
}

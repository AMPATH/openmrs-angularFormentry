/*
jshint -W106, -W052, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
(function () {
    'use strict';

    angular
        .module('openmrs.angularFormentry')
        .service('CurrentLoadedFormService', CurrentLoadedFormService);

    CurrentLoadedFormService.$inject = [];

    function CurrentLoadedFormService() {
        var lastFound;

        var service = {
            formModel: {},
            questionMap: {},
            listenersMetadata: {},
            clearQuestionValueByKey: clearQuestionValueByKey,
            getAnswerByQuestionKey: getAnswerByQuestionKey,
            getContainingObjectForQuestionKey: getContainingObjectForQuestionKey,
            getFieldKeyFromGlobalById: getFieldKeyById
        };

        return service;

        function getFieldKeyById(id) {
            var obj = service.questionMap[id];
            if (obj && !Array.isArray(obj)) {
                return service.questionMap[id].key.split('.')[0];
            } else if(obj && Array.isArray(obj)) {
                if(service.questionMap[id].key) {
                    return service.questionMap[id].key.split('.')[0];
                } else {
                    return service.questionMap[id][0].key.split('.')[0];
                }
            }
            return null;
        }

        function clearQuestionValueByKey(formlyModel, key) {
            var containingObject = getContainingObjectForQuestionKey(formlyModel, key);
            if (containingObject) {
                if (containingObject[key].value) {
                    if (Array.isArray(containingObject[key].value)) {
                        console.log('is array');
                        containingObject[key].value = [];
                    }
                    else if (typeof containingObject[key].value === 'number') {
                        containingObject[key].value = '';
                    }
                    else if (Object.prototype.toString.call(containingObject[key].value) === '[object Date]') {
                        containingObject[key].value = '';
                    }
                    else if (typeof containingObject[key].value === 'string') {
                        containingObject[key].value = '';
                    }
                    else if (typeof containingObject[key].value === 'object') {
                        console.log('object');
                        containingObject[key].value = {};
                    }
                    else {
                        containingObject[key].value = null;
                    }
                }
                else { //complex types such as repeating group
                    if (Array.isArray(containingObject[key])) {
                        console.log('is array: repeating group');
                        containingObject[key] = [];
                    }
                    else if (typeof containingObject[key] === 'object') {
                        console.log('object');
                        containingObject[key] = {};
                    }
                    else {
                        containingObject[key] = null;
                    }
                }
            }
        }

        function getAnswerByQuestionKey(formlyModel, key) {
            lastFound = null;
            traverse(formlyModel, key);

            if (lastFound) {
                if (typeof lastFound[key] === 'object' &&
                 hasOwnProperty(lastFound[key], 'value') && 
                hasOwnProperty(lastFound[key], 'schemaQuestion')) {
                    return lastFound[key].value;
                }
                return lastFound[key];
            }
            return undefined;
        }

        function getContainingObjectForQuestionKey(formlyModel, key) {
            lastFound = null;
            traverse(formlyModel, key);
            return lastFound;
        }

        function traverse(o, key) {
            for (var i in o) {
                if (typeof (o[i]) === 'object') {
                    if (i === key) {
                        lastFound = o;
                    }
                    traverse(o[i], key);
                }
                else {
                    if (i === key) {
                        lastFound = o;
                    }
                }
            }
        }

        function hasOwnProperty(obj, prop) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (prop in obj) &&
                (!(prop in proto) || proto[prop] !== obj[prop]);
        }
    }

})();
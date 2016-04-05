/*jshint -W026, -W030, -W106 */
/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation*/
/*jscs:disable requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';
    
    angular
        .module('openmrs.angularFormentry')
            .service('HistoricalDataService', HistoricalDataService);
            
    HistoricalDataService.$inject = [
        '$log'
    ];
    
    function HistoricalDataService($log) {
        var store = {};
        this.putObject = function(name, object) {
            store[name] = object;
        };
        
        this.getObject = function(name) {
            if(!_.has(store, name)) {
                $log.debug('No object stored under name ' + name);
                return null;
            }
            return store[name];
        };
        
        this.hasKey = function(name){
            return _.has(store, name)? true: false;
        };
    }
})();

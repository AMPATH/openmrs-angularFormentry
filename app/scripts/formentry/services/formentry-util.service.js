/*
jshint -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W069, -W106, -W026
*/
/*
jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
        .module('openmrs.angularFormentry')
        .factory('FormEntryUtil', FormEntryUtil);

  FormEntryUtil.$inject = ['$http', '$log', '$filter'];

  function FormEntryUtil($http, $log, $filter) {
    var service = {
      formatDate: formatDate,
      getLocalTimezone: getLocalTimezone
    };

    return service;

    // Return local timezone in format +0300 for EAT
    function getLocalTimezone() {
      var offset = new Date().getTimezoneOffset();
      var sign;
      if (offset < 0) {
        sign = '+';
      } else {
        sign = '-';
      }

      offset = Math.abs(offset);
      var hours = Math.floor(offset / 60);
      var mins = offset % 60;
      var ret = '';

      if (hours < 10) {
        hours = '0' + hours;
      }

      if (mins < 10) {
        mins = '0' + mins;
      }

      return ret.concat(sign).concat(hours).concat(mins);
    }

    /**
     * Takes three parameters.
     * date: a valid javascript date or string representing a date
     * format: a valid angular date filter format
     * timezone: a timezone in form +0300
     * Return a formatted date.
     */
    function formatDate(date, format, timezone) {
      if (typeof date === 'string') {
        //Try to parse
        date = new Date(date);
        if (date === undefined) {
          var message = 'Bad date ' + date + ' passed as parameter';
          throw new Error(message);
        }
      }

      if (!(date instanceof Date)) {
        throw new ReferenceError('Invalid type passed as date!');
      }

      var format = format || 'yyyy-MM-dd HH:mm:ss';
      var timezone = timezone || getLocalTimezone();

      return $filter('date')(date, format, timezone);
    }
  }
})();

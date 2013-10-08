define(function(require) {

    var Common = require('./common');

    var startDate = new Date(2006, 0, 1)
      , endDate = new Date()
      , months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
      ;

    var leadingZero = function(number) {
        return number < 10 ? '0' + number : number;
    };

    var timestamp = function (date) {
        return typeof date === "number" ? date : date.getTime();
    };

    return {
        getRandomDate: function(start, end) {
            start || (start = startDate);
            end || (end = endDate);

            return Common.getRandomArbitrary(timestamp(start), timestamp(end));
        },

        formatDate: function(timestamp) {
            var date = new Date(timestamp);
            var formattedDate = 
                    date.getDate() + ' ' +
                    months[date.getMonth()] + ' ' +
                    date.getFullYear() + ' в ' +
                    leadingZero(date.getHours()) + ':' +
                    leadingZero(date.getMinutes());

            return formattedDate;
        }
    };

});
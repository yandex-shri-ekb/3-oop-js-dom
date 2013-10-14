/*jslint browser:true*/
(function () {
    'use strict';

    window.getRandomIntegerInRange = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // DOUBLECHECK
    /**
     * obj example: { a: 0.5, b: 0.3, c = 0.2 }
     * sum of object values should be equal to 1
     */
    window.getRandomElementByProbability = function(obj) {
        var number = Math.random(),
            total = 0,
            i;

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                total += obj[i];

                if (total > number) {
                    return i;
                }
            }
        }
    };

    window.getRandomElement = function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    window.ucfirst = function(str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    };

    window.unique = function(arr) {
        var newArray = [],
            i;

        for (i = 0; i < arr.length; i += 1) {
            if (newArray.indexOf(arr[i]) === -1) {
                newArray.push(arr[i]);
            }
        }

        return newArray;
    };

    window.timestampTostring = function(ts) {
        var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
            d = new Date(ts);

        return d.getDay() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()
            + ' в ' + d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2);
    };
}());
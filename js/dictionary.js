/*jslint browser:true*/
/*globals getRandomElementByProbability*/
(function (window) {
    'use strict';

    window.Dictionary = function () {
        var dictionary = {},
            delimiter = '+',
            predecessors = [],
            maxPredecessorsLength = 2;

        this.add = function (word, predecessors) {
            var key = (predecessors || []).join(delimiter);

            if (dictionary[key] === undefined) {
                dictionary[key] = {};
            }
            if (dictionary[key][word] === undefined) {
                dictionary[key][word] = 0;
            }

            dictionary[key][word] += 1;
        };

        this.first = function () {
            if (!dictionary.hasOwnProperty('')) {
                throw new Error('No openings found in dictionary');
            }

            predecessors = [];

            return this.next();
        };

        this.next = function () {
            var key, word;

            key = predecessors.join(delimiter);
            word = getRandomElementByProbability(dictionary[key]);

            if (word === undefined) {
                return this.first();
            }

            predecessors.push(word);

            if (predecessors.length > maxPredecessorsLength) {
                predecessors.shift();
            }

            return word;
        };
    };
}(this));
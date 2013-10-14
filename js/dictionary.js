/*jslint browser:true*/
/*globals getRandomElementByProbability*/
(function () {
    'use strict';

    window.Dictionary = function () {
        var dictionary = {},
            isReady = true,
            delimiter = '+',
            predecessors = [],
            maxPredecessorsLength = 2;

        function normalizeWeights() {
            var i, j, k, words, total;

            for (i in dictionary) {
                if (dictionary.hasOwnProperty(i)) {
                    words = dictionary[i];
                    total = 0;

                    for (j in words) {
                        if (words.hasOwnProperty(j)) {
                            total += words[j];
                        }
                    }

                    for (k in words) {
                        if (words.hasOwnProperty(k)) {
                            words[k] /= total;
                        }
                    }
                }
            }
        }

        this.add = function (word, predecessors) {
            var key = (predecessors || []).join(delimiter);

            if (dictionary[key] === undefined) {
                dictionary[key] = {};
            }
            if (dictionary[key][word] === undefined) {
                dictionary[key][word] = 0;
            }

            dictionary[key][word] += 1;

            isReady = false;
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

            if (!isReady) {
                normalizeWeights();
            }

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
}());
define(function(require) {
    var Term = require('./term'),
        Common = require('../common/common');
    
    var Dictionary = function (corpus) {
        this.generateDictionary(corpus);
    };

    Dictionary.prototype = {
        generateDictionary: function (corpus) {
            this.data = {};
            this.prefixes = [];

            for (var i = 0, len = corpus.length - 2; i < len; i++) {
                var link = corpus[i + 1],
                    suffix = corpus[i + 2],
                    key = corpus[i] + link,
                    prefix = this.data[key];

                if (prefix) {
                    prefix.suffixes.push(suffix);
                } else {
                    this.data[key] = new Term(link, suffix);
                    this.prefixes.push(key);
                }
            }

            this.prefixesCount = this.prefixes.length;
        },

        getRandomprefix: function() {
            return Common.getRandomElement(this.prefixes, this.prefixesCount);
        }
    };

    return Dictionary;
});
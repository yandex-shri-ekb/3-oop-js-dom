define(function(require) {

    var Regexp = require('../common/regexp')
      , Term = require('./term')
      ;
    
    var Dictionary = function (corpus) {
        this.processCorpus(corpus);
        this.generateDictionary();
    };

    Dictionary.prototype = {
        processCorpus: function (corpus) {
            return this.processedCorpus = (corpus || this.corpus)
                .replace(Regexp.unnecessaryСhars, ' ')
                .replace(Regexp.repetitiveChars, '$1')
                .toLowerCase()
                .match(Regexp.terms)
                ;
        },

        generateDictionary: function () {
            var corpus = this.processedCorpus || this.processCorpus();
            this.data = {};
            this.prefixes = [];

            for (var i = 0, len = corpus.length - 2; i < len; i++) {
                var link = corpus[i + 1]
                  , suffix = corpus[i + 2]
                  , key = corpus[i] + link
                  , prefix = this.data[key]
                  ;

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
            return this.prefixes[this.prefixesCount * Math.random() | 0];
        }
    }

    return Dictionary;

});
define(function(require) {

    var Regexp = require('../common/regexp')
      , Common = require('../common/common')
      , Dictionary = require('./dictionary')
      ;

    var Generator = function(corpus) {
        this.dictionary = new Dictionary(corpus);
        this.result = '';
        this.wordsCount = 0;
    };

    Generator.prototype = {
        initSentence: function() {
            var prefix = this.dictionary.getRandomprefix();

            while(prefix.search(Regexp.punctuation) !== -1) {   
                prefix = this.dictionary.getRandomprefix();
            }

            this.wordsCount = 2;
            this.result += prefix.substr(0, 2).toUpperCase() + prefix.substr(2);

            return prefix;
        },

        generateText: function(sentenceCount, maxWords, minWords) {
            sentenceCount = sentenceCount || 1;
            minWords = minWords || Common.config.minWords;
            maxWords = maxWords || Common.config.maxWords;

            this.result = '';

            var currentSentenceCount = 0
              , prefix = ''
              ;

            while(currentSentenceCount < sentenceCount) {
                prefix || (prefix = this.initSentence());

                var term = this.dictionary.data[prefix]
                  , suffix = term.getRandomSuffix()
                  ;

                if(this.wordsCount < minWords && term.suffixes.join(' ').search(Regexp.word) !== -1) {
                    while(suffix.search(Regexp.endSentenceChar) !== -1) {
                        suffix = term.getRandomSuffix();
                    }
                }

                this.result += suffix;
                this.wordsCount++;

                prefix = term.link + suffix;

                if(this.wordsCount === maxWords) {
                    this.result = this.result.trimRight().replace(/[.?!,:;]$/, '');
                    this.result += suffix = '.';
                }

                if(suffix.search(Regexp.endSentenceChar) !== -1) {
                    currentSentenceCount++;
                    prefix = '';
                }
            }

            return this.result;
        }
    };

    return Generator;

});
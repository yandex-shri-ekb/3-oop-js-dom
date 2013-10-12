define(function(require) {
    var Regexp = require('../common/regexp'),
        Config = require('../common/config'),
        Dictionary = require('./dictionary');

    var Generator = function(corpus) {
        this.dictionary = new Dictionary(corpus);
        this.result = '';
        this.wordsCount = 0;
    };

    Generator.prototype = {
        initSentence: function(capital) {
            capital === undefined && (capital = true);
            var prefix = this.dictionary.getRandomprefix();

            while(prefix.search(Regexp.punctuation) !== -1) {
                prefix = this.dictionary.getRandomprefix();
            }

            this.wordsCount = 2;
            this.result += capital ? prefix.substr(0, 2).toUpperCase() + prefix.substr(2) : prefix;

            return prefix;
        },

        getNode: function(prefix) {
            var term = this.dictionary.data[prefix];
            return {
                link: term.link,
                suffix: term.getRandomSuffix()
            };
        },

        generateText: function(sentenceCount, capital, words) {
            sentenceCount = sentenceCount || 1;
            words = words || Config.words;
            capital = capital || true;

            this.result = '';

            var currentSentenceCount = 0,
                prefix = '';

            while(currentSentenceCount < sentenceCount) {
                prefix || (prefix = this.initSentence());

                var node = this.getNode(prefix);

                if(this.wordsCount < words.min && node.suffix.search(Regexp.endSentenceChar) !== -1) {
                    prefix = this.initSentence(false);
                    node = this.getNode(prefix);
                }

                this.result += node.suffix;
                this.wordsCount++;

                prefix = node.link + node.suffix;

                if(this.wordsCount >= words.max) {
                    this.result = this.result.trimRight().replace(/[.?!,:;]$/, '');
                    this.result += node.suffix = '.';
                }

                if(node.suffix.search(Regexp.endSentenceChar) !== -1) {
                    currentSentenceCount++;
                    prefix = '';
                }
            }

            return this.result;
        }
    };

    return Generator;
});
(function (window) {
    'use strict';

    window.Garry = function (options) {
        var dict = window.dict = new Dictionary,
            punctuation = ',.!?;:',
            // defaults = {
            //     paragraphs: true,
            //     length: 100
            // },
            stats = {
                texts: {
                    total: 0,
                },
                paragraphs: {
                    total: 0,
                    perArticle: {
                        min: 10, //Infinity,
                        max: 20, //-Infinity,
                        avg: 0
                    }
                },
                sentences: {
                    total: 0,
                    perParagraph: {
                        min: 1, //Infinity,
                        max: 5, //-Infinity,
                        avg: 0
                    }
                },
                words: {
                    total: 0,
                    perSentence: {
                        min: 5, //Infinity,
                        max: 10, //-Infinity,
                        avg: 0
                    }
                }
            },
            self = {
                eat: function (text) {
                    if (text instanceof Array) {
                        text.forEach(function (text) {
                            self.eat(text);
                        });
                    } else {
                        // getStats(text);
                        buildDictionary(text);
                    }

                    return self;
                },

                getText: function (options) {
                    var length = getRandomIntegerInRange(
                        options.paragraphs.perArticle.min,
                        options.paragraphs.perArticle.max
                    );

                    var i = 0;

                    var text = [];

                    while (i++ < length) {
                        text.push(self.getParagraph(options));
                    }

                    return text;
                },

                getParagraph: function (options) {
                    var length = getRandomIntegerInRange(
                        options.sentences.perParagraph.min,
                        options.sentences.perParagraph.max
                    );

                    var i = 0;

                    var paragraph = '';

                    while (i++ < length) {
                        paragraph += ' ' + self.getSentence(options);
                    }

                    return paragraph.trim();
                },

                getSentence: function (options) {
                    var length = getRandomIntegerInRange(
                            options.words.perSentence.min,
                            options.words.perSentence.max
                        ),
                        sentence = '',
                        endChars = '.!?'.split(''),
                        punctChars = ',:;'.split('').concat(endChars);


                    while (length--) {
                        var word = dict.next();

                        if (sentence && punctChars.indexOf(word) === -1) {
                            sentence += ' ';
                        }

                        sentence += word;

                        if (endChars.indexOf(word) !== -1) {
                            return ucfirst(sentence);
                        }
                    }

                    dict.reset();

                    if (punctChars.indexOf(sentence.slice(-1)[0]) !== -1) {
                        sentence = sentence.slice(0, -1);
                    }

                    return ucfirst(sentence) + '.';
                }
            };

        if (options instanceof Object) {
            for (var i in options) {
                defaults[i] = options[i];
            }            
        }

        function buildDictionary(text) {
            var tokens = text.match(new RegExp('([а-я]+|[' + punctuation + '])', 'ig')),
                stack = [];

            if (tokens === null) {
                return;
            }

            tokens.forEach(function (token) {
                token = token.toLowerCase();

                if (!shouldSkipToken(token, stack)) {
                    dict.add(token, stack);
                }

                stack.push(token);
                if (stack.length > 2) {
                    stack.shift();
                }
            });
        }

        function shouldSkipToken(token, stack) {
            if (stack.length === 0 && punctuation.indexOf(token) !== -1) {
                return true;
            }

            if (stack.length === 1 && punctuation.indexOf(stack[0]) !== -1) {
                return true;
            }

            if (punctuation.indexOf(stack[1]) !== -1 && punctuation.indexOf(token) !== -1) {
                return true;
            }

            if (punctuation.indexOf(stack[0]) !== -1 && punctuation.indexOf(stack[1]) !== -1) {
                return true;
            }

            return false;
        }

        return self;
    };
}(this));
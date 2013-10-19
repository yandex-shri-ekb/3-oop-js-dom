(function (window) {
    'use strict';

    window.Garry = function (options) {
        var dict = window.dict = new Dictionary,
            blacklist = {
                '.': ['.', '-'],
                '-': ['-', '.', ','],
                ':': ['.'],
                ',': [',']
            },
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
                        punctChars = ',:'.split('').concat(endChars);


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

                    while (endChars.indexOf(dict.next()) !== -1);

                    return ucfirst(sentence) + '.';
                }
            };

        if (options instanceof Object) {
            for (var i in options) {
                defaults[i] = options[i];
            }            
        }

        // function getStats(text) {
        //     start = +new Date;
        //     var paragraphs = text.split('<br>')
        //                          .map(function (paragraph) { return paragraph.trim(); })
        //                          .filter(function (paragraph) { return paragraph !== ''; }),
        //         length = paragraphs.length;

        //     stats.texts.total += 1;

        //     stats.paragraphs.total += length;
        //     stats.paragraphs.perArticle.avg = Math.round(stats.paragraphs.total / stats.texts.total);
        //     if (length < stats.paragraphs.perArticle.min) stats.paragraphs.perArticle.min = length;
        //     if (length > stats.paragraphs.perArticle.max) stats.paragraphs.perArticle.max = length;

        //     paragraphs.map(function (paragraph) {
        //         var sentences = paragraph.split('.')
        //                                  .map(function (sentence) { return sentence.trim(); })
        //                                  .filter(function (sentence) { return sentence !== ''; }),
        //             length = sentences.length;

        //         stats.sentences.total += length;
        //         stats.sentences.perParagraph.avg = Math.round(stats.sentences.total / stats.paragraphs.total);
        //         if (length < stats.sentences.perParagraph.min) stats.sentences.perParagraph.min = length;
        //         if (length > stats.sentences.perParagraph.max) stats.sentences.perParagraph.max = length;

        //         sentences.map(function (sentence) {
        //             var words = (sentence.match(/([а-я-]+|[,.!?;:])/ig) || [])
        //                                 .map(function (sentence) { return sentence.trim(); })
        //                                 .filter(function (sentence) { return sentence !== ''; }),
        //                 length = words.length;

        //             stats.words.total += length;
        //             stats.words.perSentence.avg = Math.round(stats.words.total / stats.paragraphs.total);
        //             if (length < stats.words.perSentence.min) stats.words.perSentence.min = length;
        //             if (length > stats.words.perSentence.max) stats.words.perSentence.max = length;
        //         });
        //     });
        //     console.log(new Date - start);
        // }

        function buildDictionary(text) {
            /* todo: relocate to getStats */
            var tokens = text.match(/([а-я]+|[,.!?;:])/ig),
                stack = [];

            // stopwatch.tap();

            if (tokens === null) {
                return;
            }

            // console.log(tokens.length);

            tokens.forEach(function (token) {
                token = token.toLowerCase();
                dict.add(token, stack);

                stack.push(token);
                if (stack.length > 2) {
                    stack.shift();
                }
            });

            // console.log('Added tokens: ' + stopwatch.tap());

            window.dict = dict;
        }

        return self;
    };
}(this));
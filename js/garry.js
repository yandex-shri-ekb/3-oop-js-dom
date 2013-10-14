window.Garry = function (options) {
    var dict = {},
        intros = [],
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
                perText: {
                    min: Infinity,
                    max: -Infinity,
                    avg: 0
                }
            },
            sentences: {
                total: 0,
                perParagraph: {
                    min: Infinity,
                    max: -Infinity,
                    avg: 0
                }
            },
            words: {
                total: 0,
                perSentence: {
                    min: Infinity,
                    max: -Infinity,
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
                    getStats(text);
                    buildDictionary(text);
                }

                return self;
            },

            dict: function () { return dict; },
            stats: function () { return stats; },

            getText: function () {
                var length = getRandomIntegerInRange(
                    stats.paragraphs.perText.min,
                    stats.paragraphs.perText.max
                );

                var i = 0;

                var text = [];

                while (i++ < length) {
                    text.push(self.getParagraph());
                }

                return text;
            },

            getParagraph: function () {
                var length = getRandomIntegerInRange(
                    stats.sentences.perParagraph.min,
                    stats.sentences.perParagraph.max
                );

                var i = 0;

                var paragraph = '';

                while (i++ < length) {
                    paragraph += ' ' + self.getSentence();
                }

                return paragraph.trim();
            },

            getSentence: function () {
                var intro = getRandomIntro(),
                    length = getRandomIntegerInRange(
                        stats.words.perSentence.min,
                        stats.words.perSentence.max
                    ),
                    word1 = intro.split('+')[0],
                    word2 = intro.split('+')[1],
                    sentence = ucfirst(word1) + ' ' + word2,
                    temp;

                var i = 0;

                while (i++ < length) {
                    temp = word2;
                    word2 = getNextToken(word1, word2);
                    word1 = temp;

                    if (word2 === undefined) {
                        intro = getRandomIntro();
                        word1 = intro.split('+')[0];
                        word2 = intro.split('+')[1];

                        sentence = sentence.replace(/[.,]$/, '') + '.';
                        sentence += '. ' + ucfirst(word1);
                    }

                    sentence += ' ' + word2;
                }

                sentence = sentence.replace(/[.,]$/, '') + '.';

                sentence = sentence.replace(/ ([.,:;!?])/g, '$1');

                return sentence;
            }
        };

    if (options instanceof Object) {
        for (var i in options) {
            defaults[i] = options[i];
        }            
    }

    function getStats(text) {
        var paragraphs = text.split('<br>')
                             .map(function (paragraph) { return paragraph.trim(); })
                             .filter(function (paragraph) { return paragraph !== ''; }),
            length = paragraphs.length;

        stats.texts.total += 1;

        stats.paragraphs.total += length;
        stats.paragraphs.perText.avg = Math.round(stats.paragraphs.total / stats.texts.total);
        if (length < stats.paragraphs.perText.min) stats.paragraphs.perText.min = length;
        if (length > stats.paragraphs.perText.max) stats.paragraphs.perText.max = length;

        paragraphs.map(function (paragraph) {
            var sentences = paragraph.split('.')
                                     .map(function (sentence) { return sentence.trim(); })
                                     .filter(function (sentence) { return sentence !== ''; }),
                length = sentences.length;

            stats.sentences.total += length;
            stats.sentences.perParagraph.avg = Math.round(stats.sentences.total / stats.paragraphs.total);
            if (length < stats.sentences.perParagraph.min) stats.sentences.perParagraph.min = length;
            if (length > stats.sentences.perParagraph.max) stats.sentences.perParagraph.max = length;

            sentences.map(function (sentence) {
                var words = (sentence.match(/([а-я-]+|[,.!?;:])/ig) || [])
                                    .map(function (sentence) { return sentence.trim(); })
                                    .filter(function (sentence) { return sentence !== ''; }),
                    length = words.length;

                stats.words.total += length;
                stats.words.perSentence.avg = Math.round(stats.words.total / stats.paragraphs.total);
                if (length < stats.words.perSentence.min) stats.words.perSentence.min = length;
                if (length > stats.words.perSentence.max) stats.words.perSentence.max = length;
            });
        });
    }

    function buildDictionary(text) {
        /* todo: relocate to getStats */
        var tokens = $('<div>').html(text).text().match(/([а-я-]+|[,.!?;:])/ig);

        if (tokens === null) {
            return;
        }
        
        for (var i = 0; i < tokens.length - 2; i += 1) {
            var firstLetter = tokens[i][0], 
                key = (tokens[i] + '+' + tokens[i + 1]).toLowerCase(),
                word = tokens[i + 2].toLowerCase();

            if (tokens[i] in blacklist && blacklist[tokens[i]].indexOf(tokens[i + 1]) !== -1) {
                continue;
            }

            if (tokens[i + 1] in blacklist && blacklist[tokens[i + 1]].indexOf(tokens[i + 2]) !== -1) {
                continue;
            }

            if (firstLetter.match(/^[A-ZА-Я]$/) && intros.indexOf(key) === -1) {
                intros.push(key);
            }
            
            if (dict[key] === undefined) dict[key] = {}; 
            if (dict[key][word] === undefined) dict[key][word] = 0;

            dict[key][word] += 1;
        }

        for (var i in dict) {
            if (dict.hasOwnProperty(i)) {
                var words = dict[i];
                var total = 0;

                for (var j in words) {
                    if (words.hasOwnProperty(j)) {
                        total += words[j];
                    }
                }

                if (total === 1) continue;

                for (var j in words) {
                    if (words.hasOwnProperty(j)) {
                        words[j] /= total;
                    }
                }
            }
        }
    }

    function getRandomToken(words) {
        var number = Math.random();
        var total = 0;

        for (var j in words) {
            if (words.hasOwnProperty(j)) {
                total += words[j];

                if (total > number) {
                    return j;
                }
            }
        }
    }

    function getNextToken(word1, word2) {
        return getRandomToken(dict[word1 + '+' + word2]);
    }

    function getRandomIntro() {
        return intros[Math.round(Math.random() * (intros.length - 1))];
    }

    return self;
};
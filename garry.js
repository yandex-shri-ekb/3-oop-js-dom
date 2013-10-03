(function () {
    var Garry = window.Garry = function (options) {
        var dict = {},
            intros = [],
            defaults = {
                paragraphs: true,
                length: 100
            },
            self = {
                eat: function (text) {
                    console.log(dict);
                    buildDictionary(text);
                    return self;
                },

                poo: function () {
                    return getText();
                },

                flush: function () {
                    dict = {};
                    intros = [];
                    return self;
                }
            };

        if (options instanceof Object) {
            for (var i in options) {
                defaults[i] = options[i];
            }            
        }

        function buildDictionary(sample) {
            var tokens = sample.match(/([a-zа-я-]+|[,.!?;:])/ig);
            
            for (var i = 0; i < tokens.length - 2; i += 1) {
                var key = tokens[i] + '+' + tokens[i + 1];
                var word = tokens[i + 2];

                if (key.match(/^[A-ZА-Я]/) && intros.indexOf(key) === -1) {
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
            console.log(dict);
            return getRandomToken(dict[word1 + '+' + word2]);
        }

        function getRandomIntro() {
            return intros[Math.round(Math.random() * (intros.length - 1))];
        }

        function getText() {
            var intro = getRandomIntro(),
                text = intro.replace('+', ' '),
                word1 = intro.split('+')[0],
                word2 = intro.split('+')[1],
                i = 0,
                temp;

            while (++i) {
                temp = word2;
                word2 = getNextToken(word1, word2);
                word1 = temp;

                if (word2 === undefined) {
                    text += '...';
                    return text.replace(/ ([.,:;!?])/g, '$1');
                }

                if (i >= defaults.length) {
                    if (['!', '?', '.'].indexOf(word2) !== -1) {
                        text += ' ' + word2;
                        return text.replace(/ ([.,:;!?])/g, '$1');
                    }

                    if ([',', ':', ';'].indexOf(word2) !== -1) {
                        text += ' ' + '.';
                        return text.replace(/ ([.,:;!?])/g, '$1');
                    }
                }

                text += ' ' + word2;
            }

            return text.replace(/ ([.,:;!?])/g, '$1');
        }

        return self;
    };
}());

"use strict";

var UltimateTextGenerator = function() {

    /*
    * Мы будем хранить suffix и для него все prefix с количеством вхождений,
    * на основе которых можно расчитать вероятность, с которой будет выбран тот или иной suffix
    * {
    *   prefix1: {suffix1:P1, ..., suffixN:PN},
    *   ...
    *   prefixK: {suffix1:P1, ..., suffixN:PN}
    * }
    */
    var _dictionary = {};
    this.d = _dictionary;

    /**
     * Добавить кусок текста в словарь
     * @param {string} text
     */
    this.add = function(text) {
        // Убираем всякую пежню
        //text = text.replace(/(\.\.\.|[;\(\)—«»/\\#])/g, '');

        // Возможно проще оставить только нужные символы
        text = text.replace(/[^A-zА-я0-9ёЁ !?.,:-]/g, ' ');

        //                       к е п о ч к а
        text = text.replace(/т\.(к|е|п|о|ч|д)\./g, function(result) {
            switch (result) {
                case 'т.е.':
                    return 'то есть';
                case 'т.к.':
                    return 'так как';
                case 'т.п.':
                    return 'тому подобное';
                case 'т.ч.':
                    return 'так что';
                case 'т.д.':
                    return 'так далее';
                case 'т.о.':
                    return 'таким образом';
            }

            return '';
        });

        // Для простоты разбора, знаки пунктуации тоже слова. Для этого поставим перед ними пробел.
        // Точка, запятая, двоеточие, вопросительный и восклицательный знаки считаются словами.
        // Все остальные знаки препинания отбрасываются.
        text = text
            .replace(/([^ ])([\.,:!\?][^A-zА-яёЁ0-9]?)/g, '$1 $2')
            // пробелы
            .replace(/[ ]{2,}/g, ' ');

        var words = text.split(' '), l = words.length;

        if(l < 2) {
            return;
        }

        // последнее слово пропускаем
        for(var i = 0; i < l - 1; i++) {
            /*if(words[i] == 'вашим') {
               i++;i--;
            }*/

            addPair(words[i], words[i+1]);
        }
    };

    /**
     * Добавить пару в словарь
     *
     * @param {string} w1
     * @param {string} w2
     */
    function addPair(w1, w2) {
        var pair = _dictionary.hasOwnProperty(w1) ? _dictionary[w1] : {};
        if(pair.hasOwnProperty(w2)) {
            pair[w2] += 1;
        }
        else {
            pair[w2] = 1;
        }

        _dictionary[w1] = pair;
    }

    /**
     * Генерация предложения из словаря на основе параметров
     *
     * @param nWords Количество слов
     * @param endWith Знак в конце
     * @param startWithRandom начать с рандомного слова или со слова после точки
     * @param stopOnDot Останавливать генерацию в случае встречи знака препинания
     * @param dontStopIfLessThen Минимальная длина последнего слова(и, мы, для, по, к и тд)
     */
    this.generateSentence = function(nWords, endWith, startWithRandom, stopOnDot, dontStopIfLessThen) {
        var i = 0, textArr = [], suffix = '', text = '';

        var prefix = startWithRandom ? pickRandomPrefix() : this.getSuffix('.');

        textArr.push(capitaliseFirstLetter(prefix));

        while(++i < nWords || suffix.length <= dontStopIfLessThen) {
            suffix = this.getSuffix(prefix);
            textArr.push(suffix);
            if(stopOnDot && ['.', '!', '?'].indexOf(suffix) !== -1) {
                break;
            }

            prefix = suffix;

        }

        if(['.', '!', '?'].indexOf(textArr[textArr.length - 1]) === -1) {
            textArr.push(endWith);
        }

        // возможно это заменить на пост-обработку текста
        textArr.forEach(function(word) {
            if(['.', ',', '!', '?', ':', ';'].indexOf(word) !== -1) {
                text += word;
            }
            else {
                text += ' ' + word;
            }
        });

        return text;
    };

    /**
     * @return string
     */
    function pickRandomPrefix() {
        var keys = Object.keys(_dictionary), pref = '';
        do {
            pref = keys[ keys.length * Math.random() << 0];
        }
        while(['.', ',', '!', '?', ':', ';', '-'].indexOf(pref) !== -1);

        return pref;
    }

    /**
     * @param {string} prefix
     * @return string
     */
    this.getSuffix = function(prefix) {
        if(!_dictionary.hasOwnProperty(prefix)) {
            //throw new Error('Префикс ' + prefix + ' не найден.');
            return '.';
        }

        var suffixs = _dictionary[prefix];
        var totalN = 0, suf;

        for (suf in suffixs) {
            totalN += suffixs[suf];
        }

        var rand = Math.random() * totalN;

        var currentN = 0, suffix;
        for (suf in suffixs) {
            currentN += suffixs[suf];
            if(rand <= currentN) {
                suffix = suf;
                break;
            }
        }

        return suffix;
    }

    /**
     * @param {string} string
     * @return string
     */
    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

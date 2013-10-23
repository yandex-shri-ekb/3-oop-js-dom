"use strict";

var UltimateTextGenerator = function() {

    /*
    * Мы будем хранить suffix и для него все prefix с количеством вхождений,
    * на основе которых можно расчитать вероятность, с которой будет выбран тот или иной suffix
    * {
    *     prefix1: [suffix11, ..., suffix1N],
    *     ...,
    *     prefixK: [suffixK1, ..., suffixKN]
    * }
    */
    var _dictionary = {};

    /**
     * Добавить кусок текста в словарь
     * @param {string} text
     */
    this.add = function(text) {

        text = prepare(text);
        var words = text.split(' '), l = words.length;

        if(l < 2) {
            return;
        }

        // последнее слово пропускаем
        for(var i = 0; i < l - 1; i++) {
            addPair(words[i], words[i + 1]);
        }
    };

    /**
     * @param {string} text
     */
    function prepare(text) {
        // Убираем всякую пежню
        //text = text.replace(/([;\(\)—«»/\\#])/g, '');

        // &nbsp
        text = text.replace(/&\w+;|&#\d+;/g, ' ');

        // Оставим только буквы и цифры()
        text = text.replace(/[^A-zА-я0-9ёЁ !?.,:-]/g, ' ');

        // Повторения знаков пунктуации
        text = text.replace(/([!?.,:-])[!?.,:-]+/g, '$1');

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

        return text.trim();
    }

    /**
     * Добавить пару в словарь
     *
     * @param {string} w1
     * @param {string} w2
     */
    function addPair(w1, w2) {
        var pair = _dictionary[w1];

        // зарезервированные слова типа watch у объекта
        if(pair !== undefined && Object.prototype.toString.call( pair ) === '[object Array]') {
            pair.push(w2);
        }
        else {
            pair = [w2];
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
            if(suffix.length < 3) {
                i--;
            }
        }

        if(['.', '!', '?'].indexOf(textArr[textArr.length - 1]) === -1) {
            textArr.push(endWith);
        }

        // возможно это заменить на пост-обработку текста
        textArr.forEach(function(word) {
            if(['.', ',', '!', '?', ':', ';', ' '].indexOf(word) !== -1) {
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
        while(['.', ',', '!', '?', ':', ';', '-', ' '].indexOf(pref) !== -1);

        return pref;
    }

    /**
     * @param {string} prefix
     * @return string
     */
    this.getSuffix = function(prefix) {
        var suffixs = _dictionary[prefix];
        if(typeof suffixs === 'undefined') {
            //throw new Error('Префикс ' + prefix + ' не найден.');
            return '.';
        }

        return suffixs[ suffixs.length * Math.random() << 0 ];
    };

    /**
     * @param {string} string
     * @return string
     */
    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

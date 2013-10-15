$(function () {

    /*
     * Спрячем все данные нам тексты
     */

    $('article').each(function () {
        $(this).hide();
    });

    // ===================================================== Функции ==================================================

    /*
     * Функция нахождения префикса внутри whereFrom, т.е. она возвращает
     * последние lengthOfPrefix слов для подстановки нового суффикса
     */

    function findPrefInText(whereFrom, lengthOfPrefix) {
        var wordsInText = new Array(),
            wordsInText = $(whereFrom).text().match(/\S+/g),
            prefFirstWord = wordsInText[wordsInText.length - lengthOfPrefix],
            prefIndex = $(whereFrom).text().lastIndexOf(' ' + prefFirstWord + ' '),
            prefString = $(whereFrom).text().slice(prefIndex + 1);

        return prefString;
    }

    /*
     * Функция подстановки соответствующего суффикса
     */

    function findSufInLexicon(getPref, nameOfLexicon) {
        var clearPref = getPref.substring(0, getPref.length - 1);

        while (clearPref.match(/\s$/)) clearPref = clearPref.slice(0, -1);
        while (clearPref.match(/\s\s/)) {
            clearPref = clearPref.slice(0, clearPref.search(/\s\s/)) + clearPref.slice(clearPref.search(/\s\s/) + 1);
        };

        /*
         * Пока что есть косяк в том, что если, префикс состоит из двух повторяющихся слов или символов, то он
         * как префикс определяет только одно это слово, позже подправлю, а пока, если не находит из-за этого
         * косяка в словаре префикс из одного слова, то вставляем "нейтральный" суффикс "потому, что" :)
         */

        if (!nameOfLexicon[clearPref]) {
            finalSuf = 'потому, что';
        }
        else {
            var findSuf = nameOfLexicon[clearPref].slice(nameOfLexicon[clearPref].search(/\s/) + 1);

            if (findSuf.match(/\S+/g).length > 1) {
                var variantsOfSuf = findSuf.match(/\S+/g),
                    randomSufIndex = Math.floor(Math.random() * variantsOfSuf.length),
                    finalSuf = variantsOfSuf[randomSufIndex];
            }
            else {
                var finalSuf = findSuf;
            };
        };

        return finalSuf;
    };

    /*
     * Функция, добавляющая новый суффикс
     */

    function addSuf(where, addStr) {
        $(where).text(
            function () {
                return ($(where).text() + addStr + ' ');
            }
        );
    };
    
    // ===================================================== Генерируем комментарии ===================================
    
    /*
     *  Определим переменные
     */

    var newMessageSizeMax = 100,
        newMessageSizeMin = 2,
        NEWMESSAGESIZE = Math.floor(Math.random() * (newMessageSizeMax - newMessageSizeMin + 1)) + newMessageSizeMin,
        MESSAGEPREFIXLENGTH = 2,
        allMessageTexts = '',
        messageLexicon = {};

    console.log('В статье будет ' + NEWMESSAGESIZE + ' слов');

    /*
     * Собираем все тексты статей в один текст
     */

    $('.message').each(function () {
        allMessageTexts += $(this).text() + ' ';
    });

    /*
     * Запишем каждое встречающееся в статьях слово по отдельности.
     * Если слово уже встречалось - оно все равно записывается в
     * новую ячейку, таким образом сохраняем последовательность
     * слов в тексте
     */

    allMessageWords = allMessageTexts.match(/\S+/g);

    /*
     * Составляем соответствия суффиксов к префиксам.
     * При этом добавим каждому префиксу порядковый номер,
     * благодаря чему сможем вызывть случайный префикс.
     * Таким образом таблица соответствий выглядит так:
     *
     * 'префикс':'номер префикса'_'суффикс#1'_'суффикс#2'_.._'суффикс#N'
     *
     */

    var kM = -1;

    for (var i = 0; i < allMessageWords.length - MESSAGEPREFIXLENGTH; i++) {
        var prefiksStr = '';

        for (j = 0; j < MESSAGEPREFIXLENGTH; j++) {
            prefiksStr += allMessageWords[i + j];
            if (j != MESSAGEPREFIXLENGTH - 1) prefiksStr += ' ';
        };

        if (messageLexicon[prefiksStr]) {
            messageLexicon[prefiksStr] += allMessageWords[i + MESSAGEPREFIXLENGTH] + ' ';
        }
        else {
            kM++;
            messageLexicon[prefiksStr] = kM + ' ' + allMessageWords[i + MESSAGEPREFIXLENGTH] + ' ';
        };

        maxMessageNumber = kM;
    };
    
    console.log('Словарь комментариев создан! Префиксов в словаре: ' + kM);
    
    /*
     * Удаляем комменты, чтоб не мешали при построении словаря статьи
     */

    $('article .comments').remove();

    /*
     * Добавляем заготовку для нового текста и секцию комментариев
     */

    $('.container').append('<article class="new_text"></article>');






    // ===================================================== Генерируем статью ===================================

    /*
     *  Определим переменные
     */

    var newArticleSizeMax = 2000,
        newArticleSizeMin = 1000,
        NEWARTICLESIZE = Math.floor(Math.random() * (newArticleSizeMax - newArticleSizeMin + 1)) + newArticleSizeMin,
        PREFIXLENGTH = 2,
        allTexts = '',
        lexicon = {};

    console.log('В статье будет ' + NEWARTICLESIZE + ' слов');

    /*
     * Собираем все тексты статей в один текст
     */

    $('article').each(function () {
        allTexts += $(this).text() + ' ';
    });

    /*
     * Запишем каждое встречающееся в статьях слово по отдельности.
     * Если слово уже встречалось - оно все равно записывается в
     * новую ячейку, таким образом сохраняем последовательность
     * слов в тексте
     */

    allWords = allTexts.match(/\S+/g);

    /*
     * Составляем соответствия суффиксов к префиксам.
     * При этом добавим каждому префиксу порядковый номер,
     * благодаря чему сможем вызывть случайный префикс.
     * Таким образом таблица соответствий выглядит так:
     *
     * 'префикс':'номер префикса'_'суффикс#1'_'суффикс#2'_.._'суффикс#N'
     *
     */

    var k = -1;

    for (var i = 0; i < allWords.length - PREFIXLENGTH; i++) {
        var prefiksStr = '';

        for (j = 0; j < PREFIXLENGTH; j++) {
            prefiksStr += allWords[i + j];
            if (j != PREFIXLENGTH - 1) prefiksStr += ' ';
        };

        if (lexicon[prefiksStr]) {
            lexicon[prefiksStr] += allWords[i + PREFIXLENGTH] + ' ';
        }
        else {
            k++;
            lexicon[prefiksStr] = k + ' ' + allWords[i + PREFIXLENGTH] + ' ';
        };

        maxNumber = k;
    };
    
    console.log('Словарь статей создан! Префиксов в словаре: ' + k);
    
    /*
     * Удаляем начальные статьи, чтоб не мешались
     */

    $('article:not(.new_text)').remove();
    
    /*
     * Выбираем случайный префикс, который будет у нас вставляться первым
     */

    firstPrefIndex = Math.floor(Math.random() * maxNumber + 1);

    for (pref in lexicon) {
        var numberLength = lexicon[pref].search(/\s/),
            number = parseInt(lexicon[pref].slice(0,numberLength));

        if (number == firstPrefIndex) addSuf('.new_text', pref);
    };

    /*
     * Пока длина текста не будет равной случайно выбранному числу из
     * заданного диапазона добавляем по одному суффиксу исходя из
     * найденного в тексте префикса
     */
    
    while ($('.new_text').text().match(/\S+/g).length < NEWARTICLESIZE) {
        addSuf('.new_text', findSufInLexicon(findPrefInText('.new_text', PREFIXLENGTH), lexicon));
    }

    /*
     * Выбираем случайный префикс, который будет у нас вставляться первым
     */

    $('.new_text').append('<section class="comments"><div class="comment">'
        + '<div class="username">USERNAME</div><div class="message"></div></div></section>');

    firstPrefIndex = Math.floor(Math.random() * maxMessageNumber + 1);

    for (pref in messageLexicon) {
        var numberLength = messageLexicon[pref].search(/\s/),
            number = parseInt(messageLexicon[pref].slice(0,numberLength));

        if (number == firstPrefIndex) {
            addSuf('.message', pref);
        }
    };

    /*
     *  Пока что вставим один комментарий, позже сделаем функцию, вставляющую случайное количсетво комментариев
     */

        /*
         * Пока длина комментария не будет равной случайно выбранному числу из
         * заданного диапазона добавляем по одному суффиксу исходя из найденного
         * в комментарии префикса
         */
        
    while ($('.new_text .message').text().match(/\S+/g).length < NEWMESSAGESIZE) {
        addSuf('.new_text .message', findSufInLexicon(findPrefInText('.new_text .message', MESSAGEPREFIXLENGTH), messageLexicon));
    }

    // ========================================= Oppa, habra-style

    $('.container').prepend('<div class="sidebar_right"><div class="block">'
        + '<div class="title">Похожие посты</div><ul><li><a href="#">Знаком'
        + 'ьтесь, Steam Machines — новые игровые приставки от Valve 25.09.2'
        + '013</a></li><li><a href="#">Steam OS: Linux с игровым привкусом '
        + '23.09.2013</a></li><li><a href="#">Steam официально анонсировала'
        + ' появления функции «расшаривания» игр 11.09.2013</a></li><li><a '
        + 'href="#">«Steam Box» от Valve — будущее за ПК в мире консолей? ('
        + 'большое чудо в маленькой коробке) 11.01.2013</a></li><li><a href'
        + '="#">Steam под Linux: началось закрытое бета-тестирование 07.11.'
        + '2012</a></li><li><a href="#">Steam на экранах ваших TV 10.09.201'
        + '2</a></li><li><a href="#">Запущен Steam Greenlight! 31.08.2012</'
        + 'a></li><li><a href="#">Civilization 2: десять лет без перезапуск'
        + 'а 13.06.2012</a></li><li><a href="#">Steam для Linux. Скоро 05.0'
        + '6.2012</a></li><li><a href="#">Steam взломан 11.11.2011</a></li>'
        + '</ul></div></div>');

    $('.sidebar_right a').click(function () {
        location.reload();
    });

    $('.username').before('<a href="#" class="avatar"><img src="http://habrahabr.ru/i/avatars/stub-user-small.gif" alt=""></a>');

    $('article').each(function ()
        {
            var toImage = /\<br\/\>\s+\<br\/\>\s+\<br\/\>/;
            if ($(this).text().search(toImage)) {
                // здесь будем заменять три <br / > на рандомную картинку
            }
        }
    );

});
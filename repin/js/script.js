
    $('.container').before('<div class="settings"><div class="fifth"><label><input id="paranumbermin" type="number" value="5" min="1" max="9" step="1" />Минимум параграфов</label><br />' +
        '<label><input id="paranumbermax" type="number" value="15" min="10" max="20" step="1" />Максимум параграфов</label><br /></div>' +
        '<div class="fifth"><label><input id="sentnumbermin" type="number" value="3" min="1" max="5" step="1" />Мин. предлож-й в параграфе</label><br />' +
        '<label><input id="sentnumbermax" type="number" value="13" min="11" max="15" step="1" />Макс. предлож-й в параграфе</label><br /></div>' +
        '<div class="fifth"><label><input id="wordnumbermin" type="number" value="6" min="3" max="9" step="1" />Минимум слов в предл-и</label><br />' +
        '<label><input id="wordnumbermax" type="number" value="20" min="10" max="30" step="1" />Максимум слов в предл-и</label><br /></div>' +
        '<div class="fifth"><label><input id="commentsmin"   type="number" value="1" min="1" max="9" step="1" />Минимум комментариев</label><br />' +
        '<label><input id="commentsmax"   type="number" value="20" min="10" max="99" step="1" />Максимум комментариев</label><br /></div>' +
        '<div class="fifth"><label><input id="prefix" type="number" value="2" min="2" max="4" step="1" />Длина префикса</label><br />' +
        '<input type="button" value="Выполнить" onclick="onClick()"></div></div>');

function onClick () {

    $('input').each(function() {
        $(this).attr('disabled','disabled');
    });
    $('.settings').css({'opacity' : '0.3'});

    /*
     * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     */

    /*
     * Функция подстановки случайного целого числа из диапазона
     */

    function randomFloor (a, b) {
        result = Math.floor(Math.random() * (b - a + 1)) + a;
        return result;
    }

    /*
     * Удаление лишних символов
     */

    function clearString(str) {
        if (str.search(/\</) == -1) {
            while (str.search(/\.$/) != -1) {
                if (str.lastIndexOf('.') == str.length - 1) {
                    str = str.slice(0,-1);
                } else {
                    if (str.indexOf('.') == 0) {
                        str = str.slice(1);
                    }
                    else {
                        str = str.slice(0,str.indexOf('.')) + str.slice(str.indexOf('.') + 1);
                    }
                }
            }
            while (str.search(/\?$/) != -1) {
                if (str.lastIndexOf('?') == str.length - 1) {
                    str = str.slice(0,-1);
                } else {
                    if (str.indexOf('?') == 0) {
                        str = str.slice(1);
                    }
                    else {
                        str = str.slice(0,str.indexOf('?')) + str.slice(str.indexOf('?') + 1);
                    }
                }
            }
            while (str.search(/\!$/) != -1) {
                if (str.lastIndexOf('!') == str.length - 1) {
                    str = str.slice(0,-1);
                } else {
                    if (str.indexOf('!') == 0) {
                        str = str.slice(1);
                    }
                    else {
                        str = str.slice(0,str.indexOf('!')) + str.slice(str.indexOf('!') + 1);
                    }
                }
            }
            while (str.search(/\,$/) != -1) {
                if (str.lastIndexOf(',') == str.length - 1) {
                    str = str.slice(0,-1);
                } else {
                    if (str.indexOf(',') == 0) {
                        str = str.slice(1);
                    }
                    else {
                        str = str.slice(0,str.indexOf(',')) + str.slice(str.indexOf(',') + 1);
                    }
                }
            }
        }
        else {
            if ((str.lastIndexOf('.') == str.length - 1) ||
                (str.lastIndexOf('?') == str.length - 1) ||
                (str.lastIndexOf('!') == str.length - 1) ||
                (str.lastIndexOf(',') == str.length - 1)) {
                str = str.slice(0, -1);
            }
        }
        
        return str;
    }

    /*
     * ПЕРЕМЕННЫЕ
     */

    var PREFIXLENGTH = parseInt($('#prefix').val()),

        PARANUMBERMIN = parseInt($('#paranumbermin').val()),
        PARANUMBERMAX = parseInt($('#paranumbermax').val()),

        SENTNUMBERMIN = parseInt($('#sentnumbermin').val()),
        SENTNUMBERMAX = parseInt($('#sentnumbermax').val()),

        WORDNUMBERMIN = parseInt($('#wordnumbermin').val()),
        WORDNUMBERMAX = parseInt($('#wordnumbermax').val()),

        COMMENTSMIN = parseInt($('#commentsmin').val()),
        COMMENTSMAX = parseInt($('#commentsmax').val()),
        commentsLength = randomFloor(COMMENTSMIN, COMMENTSMAX),

        dateFrom = new Date(2006, 6, 1),
        dateTo = new Date();

    cDates = [];

    /*
     * ФУНКЦИИ
     */

    /*
     * СЛОВАРИ
     */

    /*
     * Функция написания словаря юзернеймов
     */

    function createUsernamesLexicon () {
        usernamesLexicon = [];
        $('.username').each(function() {
            var nameDoesNotExistYet = true;
            if (usernamesLexicon.length > 0) {
                for (var i = 0; i < usernamesLexicon.length; i++) {
                    if (usernamesLexicon[i] == $(this).text()) var nameDoesNotExistYet = false;
                }
            }
            if (($(this).text() != '') && (nameDoesNotExistYet)) {
                usernamesLexicon.push($(this).text());
            }
        });
        $('.username').remove();
    }

    /*
     * Функция создающая случайные последовательные даты написания комментариев
     */

    function createCommentsDates (commentsNumber) {

        for (var i = 0; i < commentsNumber + 1; i++) {
            if (i == 0) {
                var a = randomFloor(parseInt(dateFrom.getTime()), parseInt(dateTo.getTime()));
                var randomDate = new Date(a);
            }
            else {
                var a = randomFloor(parseInt(cDates[cDates.length-1].getTime()), parseInt(dateTo.getTime()));
                var randomDate = new Date(a);
            }
            
            cDates.push(randomDate);
        }

        for (var i = 0; i < commentsNumber + 1; i++) {
            switch (cDates[i].getMonth()) {
                case 0:
                    var month = ' января ';
                    break
                case 1:
                    var month = ' февраля ';
                    break
                case 2:
                    var month = ' марта ';
                    break
                case 3:
                    var month = ' апреля ';
                    break
                case 4:
                    var month = ' мая ';
                    break
                case 5:
                    var month = ' июня ';
                    break
                case 6:
                    var month = ' июля ';
                    break
                case 7:
                    var month = ' августа ';
                    break
                case 8:
                    var month = ' сентября ';
                    break
                case 9:
                    var month = ' октября ';
                    break
                case 10:
                    var month = ' ноября ';
                    break
                default:
                    var month = ' декабря ';
            }
            if (cDates[i].getMinutes() < 10) {
                var minutes = '0' + cDates[i].getMinutes();
            }
            else {
                var minutes = '' + cDates[i].getMinutes();
            }
            cDates[i] = cDates[i].getDate() + month + cDates[i].getFullYear() + ' в ' + cDates[i].getHours() + ':' + minutes;
        }
    }

    /*
     * Функция написания словаря (используется для словаря статей и комментариев)
     */

    function createLexicon(lexiconName, source) {
        maxNumber = -1;

        var articleNum = 0,
            wordsClean = [];

        $(source).each(function() {
            var currentContent = $(this).html().toLowerCase(),
                words = currentContent.match(/(\S+|(\<pre\>(.+|\n+)+\<\/pre\>|\<code\>(.+|\n+)+\<\/code\>))/g);
            /* 
             * Изначально здесь было простое выражение /S+/g но оно не подходило для того, чтобы сохранить переносы строк
             * внутри тегов <pre></pre> и <code></code>. Собственно, немного усложнили выражение, чтобы сохранить все что
             * было написано внутри тегов
             */

            if (words) {
                
                for (var i = 0; i < words.length; i++) {
                    while (words[i].match(/\<br\>/)) {
                        words[i] = words[i].slice(0, words[i].indexOf('<br>')) + '<br />'+ words[i].slice(words[i].indexOf('<br>') + 4);
                    }
                }

                for (var i = 0; i < words.length; i++) {
                    words[i].replace(/\<{2,}/g, '&lt;').replace(/\>{2,}/g, '&rt;');
                }
                
                var checkBrTagFrom = wordsClean.length;

                for (var i = 0; i < words.length; i++) {
                    if (words[i].search(/\</) == -1) {
                        wordsClean[wordsClean.length] = words[i];
                    }
                    else {
                        if (words[i].match(/\<[^\/]/g)) {
                            var openTagsNum = words[i].match(/\<[^\/]/g).length;
                        }
                        else {
                            var openTagsNum = 0;
                        }
                        if (words[i].match(/\/\>/g)) {
                            var closeTagsType1Num = words[i].match(/\/\>/g).length;
                        }
                        else {
                            var closeTagsType1Num = 0;
                        }
                        if (words[i].match(/\<\//g)) {
                            var closeTagsType2Num = words[i].match(/\<\//g).length;
                        }
                        else {
                            var closeTagsType2Num = 0;
                        }
                        if (openTagsNum == closeTagsType1Num + closeTagsType2Num) {
                            wordsClean[wordsClean.length] = words[i];
                        }
                        else {
                            
                            var funcStr = words[i];
                            
                            while (openTagsNum != closeTagsType1Num + closeTagsType2Num && i < words.length) {
                                
                                i++;

                                funcStr = funcStr + ' ' + words[i];

                                if (funcStr.match(/\<[^\/]/g)) {
                                    var openTagsNum = funcStr.match(/\<[^\/]/g).length;
                                }
                                else {
                                    var openTagsNum = 0;
                                }
                                if (funcStr.match(/\/\>/g)) {
                                    var closeTagsType1Num = funcStr.match(/\/\>/g).length;
                                }
                                else {
                                    var closeTagsType1Num = 0;
                                }
                                if (funcStr.match(/\<\//g)) {
                                    var closeTagsType2Num = funcStr.match(/\<\//g).length;
                                }
                                else {
                                    var closeTagsType2Num = 0;
                                }

                            }
                            wordsClean[wordsClean.length] = funcStr;
                        }
                        if (wordsClean[wordsClean.length - 1].search(/\<code/) != -1) {
                            if ((wordsClean[wordsClean.length - 1].search(/\<br/) != -1) && (wordsClean[wordsClean.length - 1].search(/\<pre/) == -1)) {
                                wordsClean[wordsClean.length - 1] = '<pre>' + wordsClean[wordsClean.length - 1] + '</pre>';
                            }
                        }
                    }
                }

                for (var i = checkBrTagFrom; i < wordsClean.length; i++) {
                    if ((wordsClean[i].lastIndexOf('<br />') == (wordsClean[i].length - 6)) ||
                        (wordsClean[i].lastIndexOf('<br/>')  == (wordsClean[i].length - 5)) ||
                        (wordsClean[i].lastIndexOf('<br>')   == (wordsClean[i].length - 4)) ) {
                        
                        if ((wordsClean[i] == '<br />') ||
                            (wordsClean[i] == '<br/>')  ||
                            (wordsClean[i] == '<br>')   ) {
                            wordsClean.splice(i,1);
                            i--;
                        }
                        else {
                            if (wordsClean[i].lastIndexOf('<br />') != -1) {
                                wordsClean[i] = wordsClean[i].slice(0,wordsClean[i].lastIndexOf('<br />'));
                            }
                        }
                    }
                }

                for (var i = 0; i < wordsClean.length - PREFIXLENGTH; i++) {
                    var prefixStr = '';

                    for (var j = 0; j < PREFIXLENGTH; j++) {
                        prefixStr += wordsClean[i + j];
                        if (j != PREFIXLENGTH - 1) prefixStr += ' ';
                    }

                    prefixStr = clearString(prefixStr);

                    if (wordsClean[i + PREFIXLENGTH].indexOf('.') != -1 || wordsClean[i + PREFIXLENGTH].indexOf('?') != -1 || wordsClean[i + PREFIXLENGTH].indexOf('!') != -1 ) {
                        var sufHasDot = true;
                    }
                    else {
                        var sufHasDot = false;
                    }

                    if (lexiconName[prefixStr]) {
                        if (sufHasDot) {
                            lexiconName[prefixStr].push(clearString(wordsClean[i + PREFIXLENGTH]));
                            i = i + PREFIXLENGTH - 1;
                        }
                        else {
                            lexiconName[prefixStr].push(wordsClean[i + PREFIXLENGTH]);
                        }
                    }
                    else {
                        if (sufHasDot) {
                            lexiconName[prefixStr] = [maxNumber++, clearString(wordsClean[i + PREFIXLENGTH])];
                            i = i + PREFIXLENGTH - 1;
                        }
                        else {
                            lexiconName[prefixStr] = [maxNumber++, clearString(wordsClean[i + PREFIXLENGTH])];
                        }
                    }
                }

                words.length = 0;
                wordsClean.length = 0;
            
            }
            
            articleNum++;

        });

        $(source).remove();
        
        console.log('Словарь из ' + articleNum + ' статей/комментариев создан! Префиксов в словаре: ' + maxNumber);

    }

    /*
     * ФУНКЦИИ, ИСПОЛЬЗУЕМЫЕ ДЛЯ ВЫВОДА СТАТЬИ И КОММЕНТАРИЕВ
     */

    /*
     * Вытаскиваем случайный юзернейм
     */

    function randomUsername () {
        var usernamesLexiconLength = usernamesLexicon.length,
            randomNameIndex = randomFloor(0, usernamesLexiconLength - 1);
        return usernamesLexicon[randomNameIndex];
    }

    /*
     * Функция нахождения префикса в тексте
     */

    function findPrefix(whereFrom, lengthOfPrefix) {
        var wordsInText = $(whereFrom).html().match(/\S+/g),
            prefFirstWordIndex = wordsInText.length - lengthOfPrefix,
            prefString = '';

        for (var i = prefFirstWordIndex; i < wordsInText.length; i++) {
            prefString += wordsInText[i];
            if (i < wordsInText.length - 1) prefString += ' ';
        }
        
        if (prefString.search(/\</) != -1) {
            
            for (var i = prefFirstWordIndex - 1; i > -1; i--) {
                
                if (prefString.match(/\<[^\/]/g)) {
                    var openTags = prefString.match(/\<[^\/]/g).length;
                }
                else {
                    var openTags = 0;
                }
                if (prefString.match(/\/\>/g)) {
                    var closeTagsType1 = prefString.match(/\<[^\/]/g).length;
                }
                else {
                    var closeTagsType1 = 0;
                }
                if (prefString.match(/\<\//g)) {
                    var closeTagsType2 = prefString.match(/\<\//g).length;
                }
                else {
                    var closeTagsType2 = 0;
                }
                if (openTags != closeTagsType1 + closeTagsType2) {
                    prefString = wordsInText[i] + ' ' + prefString;
                }
                else break;
            }
        }

        return prefString;
    }

    /*
     * Функция подстановки соответствующего суффикса из словаря 'nameOfLexicon'
     */

    function findSufInLexicon (getPref, nameOfLexicon) {

        if (!nameOfLexicon[getPref]) {
            var finalSuf = false;
        }
        else {
            var randomSufNumber = randomFloor(1, nameOfLexicon[getPref].length - 1),
                finalSuf = nameOfLexicon[getPref][randomSufNumber];
        }
        return finalSuf;
    }

    /*
     * Функция, добавляющая новый суффикс в текст
     */

    function addSuffix (where, addStr) {
        if (addStr) {
            if (addStr.search(/\<h\d/) != -1) {
                where.html(where.html()
                    + addStr.slice(0, addStr.search(/\>/) + 1)
                    + addStr.slice(addStr.search(/\>/) + 1, addStr.search(/\>/) + 2).toUpperCase()
                    + addStr.slice(addStr.search(/\>/) + 2));
            }
            else {
                where.html(where.html() + addStr);
            }
        }
    }

    /*
     * Функция пишущая первое слово в предложении с большой буквы
     */

    function firstWord (str) {
        if (str.search(/\</) == 0) {
            return str.slice(0,str.search(/\>/) + 1) + str.slice(str.search(/\>/) + 1, str.search(/\>/) + 2).toUpperCase() + str.slice(str.search(/\>/) + 2);
        }
        else {
            return str.slice(0,1).toUpperCase() + str.slice(1);
        }
        
    }

    /*
     * Случайный знак препинания в конце предложения
     */

    function randomEnd () {

        var randChar = randomFloor(0, 1);
        
        if (randChar < 0.70) {
            return '.';
        }
        else {
            if (randChar < 0.85) {
                return '?';
            }
            else {
                return '!';
            }
        }
    }

    /*
     * Функция выбирающая случайный префикс из словаря
     */

    function randomPrefix (sourse) {
        getStr = '';
        while (getStr == '') {
            randomPrefIndex = Math.floor(Math.random() * maxNumber + 1);
            var rand = -1;
            for (pref in sourse) {
                rand++;
                if (rand == randomPrefIndex) getStr = pref;
            };
        }
        return getStr;
    }

    /*
     * Функция написания предложения, используется дальше для написания заголовка и внутри функции написания текста
     */

    function writeSentence(whereTo, lexiconName, paraMin, paraMax, sentMin, sentMax) {

        var sentence = [];
                
        sentence.push(randomPrefix(lexiconName));
                
        var wordsNumber = randomFloor(WORDNUMBERMIN, WORDNUMBERMAX),
            sufixesNumber = wordsNumber - PREFIXLENGTH;
                    
        if (wordsNumber > PREFIXLENGTH) {

            sentence[1] = findSufInLexicon(sentence[0], lexiconName);
                    
            getWords:

            for (var word_k = PREFIXLENGTH + 2; word_k < wordsNumber + 1; word_k++) {
                var checkString = '';

                if (word_k > PREFIXLENGTH * 2) {
                            
                    for (var l = 0; l < PREFIXLENGTH; l++) {
                        if (l == 0) {
                            checkString = sentence[sentence.length - 1 - l];
                        }
                        else {
                            checkString = sentence[sentence.length - 1 - l] + ' ' + checkString;
                        }
                    }

                    if (lexiconName[checkString]) {
                        sentence.push(findSufInLexicon(checkString, lexiconName));
                    }
                    else {
                        break getWords;
                    }

                }
                else {
                    checkString = sentence.join(' ');
                    while (!lexiconName[checkString] && (checkString.length > 0)) {
                        checkString = checkString.slice(1);
                    }

                    if (checkString.length > 0) {
                        sentence.push(findSufInLexicon(checkString, lexiconName));
                    }
                    else {
                        break getWords;
                    }
                }

            }

            /*
             * Теперь переписываем все слова из sentence на страницу
             */

            for (var word_k = 0; word_k < sentence.length; word_k++) {
                        
                if ((word_k == sentence.length - 1) && (
                    (sentence[word_k].lastIndexOf('.') == sentence[word_k].length - 1) ||
                    (sentence[word_k].lastIndexOf('?') == sentence[word_k].length - 1) ||
                    (sentence[word_k].lastIndexOf('!') == sentence[word_k].length - 1) ||
                    (sentence[word_k].lastIndexOf(',') == sentence[word_k].length - 1) ||
                    (sentence[word_k].lastIndexOf(';') == sentence[word_k].length - 1) ||
                    (sentence[word_k].lastIndexOf(':') == sentence[word_k].length - 1))) {
                    sentence[word_k] = sentence[word_k].slice(0,-1);
                }

                if (word_k == 0) {
                    addSuffix($(whereTo), firstWord(sentence[word_k]));
                }
                else {
                    addSuffix($(whereTo), sentence[word_k]);
                }
                if (word_k < sentence.length - 1) addSuffix($(whereTo), ' ');

            }

        }

        else addSuffix($(whereTo), sentence[0]);

        // ставим точку в конце предложения? если последнее "слово" не содержит следующие теги
        if (   (sentence[sentence.length - 1].search(/\<code/) == -1)
            && (sentence[sentence.length - 1].search(/\<pre/) == -1)
            && (sentence[sentence.length - 1].search(/\<h\d/) == -1)
            && (sentence[sentence.length - 1].search(/\<ol/) == -1)
            && (sentence[sentence.length - 1].search(/\<ul/) == -1)
            && (sentence[sentence.length - 1].search(/\<blockquote/) == -1)
            ) {
            addSuffix($(whereTo), randomEnd());
        }
        //обнуляем слова в "текущем" предложении для следующего цикла
        sentence.length = 0;
    }

    /*
     * Итоговая функция написания текста
     */

    function writeText (whereTo, lexiconName, paraMin, paraMax, sentMin, sentMax) {
        
        var paraNumber = randomFloor(paraMin, paraMax);
        console.log('Абзацев будет ' + paraNumber);
        
        for (var para_i = 0; para_i < paraNumber; para_i++) {

            $(whereTo).append('<p></p>');

            var sentNumber = randomFloor(sentMin, sentMax);
            console.log('Предложений в ' + para_i + ' абзаце будет ' + sentNumber);

            for (var sent_j = 0; sent_j < sentNumber; sent_j++) {

                writeSentence(whereTo + ' p:last', lexiconName, paraMin, paraMax, sentMin, sentMax);

                //если в этом абзаце есть еще предложения, добавляем пробел
                if (sent_j < sentNumber - 1) addSuffix($(whereTo + ' p:last'), ' ');

            }
            //с вероятностью 0.1 вставляем рандомную картинку после каждого абзаца
            if (Math.random() > 0.90) {
                $(whereTo).append('<img src="http://lorempixel.com/' + randomFloor(100,500) + '/' + randomFloor(100,500) + '" />');
            }
        
        }

    }

    /*
     * Функция написания комментариев
     */

    function writeComments () {

        $('.new_text').append('<section class="comments"></section>');

        for (var i = 0; i < commentsLength; i++ ) {

            var imgSize = randomFloor(24,48);

            $('.comments').append('<div class="comment"><a href="#" class="avatar"><img src="http://lorempixel.com/' + imgSize + '/' + imgSize + '" width="24" height="24" /></a><div class="username">' + randomUsername() + '</div><span class="comma">,</span><time>' + cDates[i + 1] + '</time><a href="#" class="link_to_comment">#</a><div class="message"><p></p></div></div>');

            writeText('.message:last', commentLexicon, 1, 3, 1, 7);

        }
    }

    /*
     * Функция вывода даты написания статьи
     */

    function writePublished() {
        $('.new_text').prepend('<div class="published">' + cDates[0] + '</div>');
    }

    /*
     * Функция написания заголовка статьи
     */

    function writeTitle() {
        $('.published').after('<h1></h1>');
        writeSentence('h1', articleLexicon, PARANUMBERMIN, PARANUMBERMAX, SENTNUMBERMIN, SENTNUMBERMAX);
    }

    /*
     * Функция вывода случайных хабов статьи
     */

    function writeHubs() {
        $('h1').after('<div class="hubs"></div>');

        var hubsNumber = randomFloor(1, 5);
        hubs = ['Веб-разработка', 'Программирование', 'Управление проектами', 'Dura Lex', 'Будущее здесь', 'Game Development', 'Linux', 'DIY или Сделай Сам', 'Алгоритмы', 'Математика', 'Копирайт', 'Android', 'Космонавтика', 'Open source', 'C++', 'Разработка', 'Системное администрирование', 'PHP', 'Google', 'Железо', 'Microsoft', 'Браузеры', 'Переводы', 'Операционные системы', 'Краудфандинг', 'Учебный процесс в IT', 'Гаджеты','Устройства для гиков', 'Интерфейсы', 'Обработка изображений', 'История ИТ', 'Python', 'Смартфоны и коммуникаторы', 'Старое железо', 'Электроника для начинающих', 'CSS', 'Электронная коммерция', 'Телекомы', 'Mobile Development'];

        for (var i = 0; i < hubsNumber; i++) {
            selected = randomFloor(0, hubs.length - 1);
            $('.hubs').append('<a href="#" class="hub" title="Вы не подписаны на этот хаб" >' + hubs.splice(selected, 1) + '</a>');
            if (i < hubsNumber - 1) {
                $('.hubs').append(', ');
            }
        }
    }

    /*
     * РАЗДЕЛ СОСТАВЛЕНИЯ СЛОВАРЕЙ
     */

    createUsernamesLexicon();
    createCommentsDates(commentsLength);
     
    commentLexicon = {};
    createLexicon(commentLexicon, '.message');

    articleLexicon = {};
    createLexicon(articleLexicon, 'article:not(.new_text)');

    /*
     * РАЗДЕЛ НАПИСАНИЯ
     */

    $('.container').append('<article class="new_text"></article>');
    writeText('.new_text', articleLexicon, PARANUMBERMIN, PARANUMBERMAX, SENTNUMBERMIN, SENTNUMBERMAX);
    writePublished();
    writeTitle();
    writeHubs();
    writeComments();

    /*
     * Функция добавления тегов к статье
     */

    function writeTags() {
        tags = [];
        var tagsNumber = randomFloor(1, 5);

        for (var i = 0; i < tagsNumber; i++) {

            randomTagNumber = randomFloor(0, articleLexicon.length);
            var tag = '';

            while (tag === '' || tag.search(/\</) != -1) {
                var pref = randomPrefix(articleLexicon);
                var tag = articleLexicon[pref][randomFloor(1, articleLexicon[pref].length - 1)];
                // исключим возможность попадания в теги коротких и простых слов, например суффиксов
                if (tag.length < 6) tag = '';
            }


            tags[i] = '<li><a href="#">' + tag + '</a>';
            if (i < tagsNumber - 1) {
                tags[i] += ', </li>';
            } else {
                tags[i] += '</li>';
            }
        }

        $('.comments').before('<ul class="tags">' + tags.join(' ') + '</ul>');

    }

    writeTags();



    // ========================================= Oppa, habra-style


    $('.container').prepend('<div id="header"><div class="userpanel silver">'
        + '<a href="https://auth.habrahabr.ru/login/" class="login">войти ч'
        + 'ерез TM ID</a></div><a class="logo " href="http://habrahabr.ru/"'
        + ' title="На главную страницу"></a><div class="search"><form id="s'
        + 'earch_form" name="search" method="get" action="//habrahabr.ru/se'
        + 'arch/"><input type="submit" value=""><input type="text" name="q"'
        + ' x-webkit-speech="" speech="" tabindex="1" autocomplete="off" da'
        + 'ta-ovi-hasaddedvoiceinputfunction="true" lang="ru-RU"></form></d'
        + 'iv><div class="main_menu"><a href="http://habrahabr.ru/posts/top'
        + '/" class="active">посты</a><a href="http://habrahabr.ru/qa/">q&a'
        + 'mp;a</a><a href="http://habrahabr.ru/events/coming/">события</a>'
        + '<a href="http://habrahabr.ru/hubs/">хабы</a><a href="http://habr'
        + 'ahabr.ru/companies/">компании</a></div></div>');

    $('#header').after('<div class="sidebar_right"><div class="block">'
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
}
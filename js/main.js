/* Массивы */
var usernameArr      = []; // массив со всеми никами пользователей
var codeArr          = []; // массив с кодом
var linksArr         = []; // массив ссылок
var commentsArr      = []; // массив комментариев
var articlesArr      = []; // массив статей
var indexCommentsArr = []; // индексовый массив комментариев для ускорения работы
var indexArticlesArr = []; // индексовый массив статей для ускорения работы


/* Переменные */
var npref             = ''; // количество слоов в префиксе по умолчанию
var minWordsCount     = ''; // минимальное количество слоов в предложении по умолчанию
var maxWordsCount     = ''; // максимальное количество слоов в предложении по умолчанию
var minProfferCount   = ''; // минимальное количество предложений в в абзаце по умолчанию
var maxProfferCount   = ''; // максимальное количество предложений в абзаце по умолчанию
var minParagraphCount = ''; // минимальное количество абзацей в статье по умолчанию
var maxParagraphCount = ''; // максимальное количество абзацей в статье по умолчанию
var articlesSize      = ''; // длина массива со статьями
var commentsSize      = ''; // длина массива с комментариями
var linksArrSize      = ''; // длина массива со ссылками


/* Функции */
function randomizer(min, max) { // генератор случайных целых чисел
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function indexDictionary(dictionary) { // составляем вспомогательный индексовый масси
    var indexArray = [];
    
    for (key in dictionary) {
        indexArray.push(key);
    }
    return indexArray;
};

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function collocation(indexDictionary, dictionarySize) { // получение случайного словосочетания
    var newCollocation = '';
    do {
        newCollocation = indexDictionary[randomizer(0, dictionarySize)];
    } while((newCollocation.search(/[.,;:!\?]+/g)+1));
                    
    return newCollocation.split(' '); 
}

function textClear(string) { // очищаем текст от лишнего

    // заменяем тире ( - ) и слэн (/) между словами на пробел
    string = string.replace(/\s\B[-—\/]\s\B/g, ' ');

    // даляем лишние знаки
    string = string.replace(/[\(\)\[\]\{\}"«»]/g, '');

    // заменяем несколько знаков на один
    string = string.replace(/([.,;:!?])+/g, '$1');

    // удаляем очевидные ссылки
    string = string.replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, '');

    // заменяем сокращенные проблемные словосочетания на полные слова
    string = string.replace(/(т\.д\.|т\.е\.|т\.к\.|т\.п\.|т\.о\.)/g, function(value) {
        switch (value) {
            case 'т\.д\.':
                return 'так далее';
            case 'т\.е\.':
                return 'то есть';
            case 'т\.к\.':
                return 'так как';
            case 'т\.п\.':
                return 'тому подобное';
            case 'т\.о\.':
                return 'таким образом';
            default:
                return ' ';
        }
    });

    // отделяем . , : ? ! пробелами, чтобы считать их отдельными словами
    string = string.replace(/(\s*[.,:?!])/g, ' $1 ');

    // преобразуем повторяющиеся пробелы в один пробел
    string = string.replace(/\s+/g, ' ');

    // убираем пробел из начала строкиh
    string = string.replace(/^\s*/, '');

    // переводим буrвы в начале предложений в нижний регистре
    string = string.replace(/(?:^|!?.;) [A-ZА-ЯЁ]/g, function(value) {
        return value.toLowerCase();
    });

    // переводим все пропущенные большие русские буквы в нижний регистр
    string = string.replace(/\s[А-ЯЁ]/g, function(value) {
        return value.toLowerCase();
    });

    // учим компьютер правильно писать сокращения
    string = string.replace(/(сЧ гСУ|гУВД|моск|росси|сБ|тСО|джобс|сССР|нАИРИ)/g, function(value) {
        switch (value) {
            case 'сЧ гСУ':
                return 'СЧ ГСУ';
            case 'гУВД':
                return 'ГУВД';
            case 'моск':
                return 'Моск';
            case 'росси':
                return 'Росси';
            case 'сБ':
                return 'СБ';
            case 'тСО':
                return 'ТСО';
            case 'джобс':
                return 'Джобс';
            case 'сССР':
                return 'СССР';
            case 'нАИРИ':
                return 'НАИРИ';
            default:
                return ' ';
        }
    });

    return string;
}

function parser() { // парсим статьи, комменты, логины...
    // Собираем логины пользователей
    $('#habr .username').each(function(){
        var $username = $(this).html();
        usernameArr.push($username);
    });
    $('#habr .username').remove();

    // Собираем код
    $('#habr pre code').each(function(){
        var $codeLanguage = $(this).attr('class');
        var $codeText     = $(this).clone().wrap('<p>').parent().html();
        if (codeArr[$codeLanguage]) {
            codeArr[$codeLanguage].push($codeText);
        } else {
            codeArr[$codeLanguage] = [];
            codeArr[$codeLanguage].push($codeText);
        }
    });
    $('#habr pre code').remove();

    // Собираем ссылки
    $('#habr a').each(function(){
        var $linkHref = $(this).attr('href');
        var $link     = $(this).clone().wrap('<p>').parent().html();
        if ($linkHref) {
            linksArr.push($link);
        }  
    });
    linksArrSize = linksArr.length - 1;

    // Собираем комментарии
    var comments = '';// тут будут храниться все комментарии
    $('#habr .message').each(function(){
        var $message = $(this).text();
        comments    += $message;
    });
    $('#habr .comments').remove();
    comments    = textClear(comments);
    commentsArr = comments.split(' ');

    // Собираем статьи
    var articles = ''; // тут будут храниться все статьи
    $('#habr article').each(function(){
        var $article = $(this).text();
        articles    += $article;
    });
    $('#habr').remove();
    articles    = textClear(articles);
    articlesArr = articles.split(' ');
    //console.log(linksArr);

}

function dictionarys(array, npref) { // собираем словарь из переданного массива и заданнного количества слов в префиксе
    var dictionary  = []; // словарь
    var arrayLength = array.length; // длина входного массива

    for (var i = 0; i < arrayLength - npref; i++) {
        var prefix = array[i]; // добавляем первое слова в перфикс
        for (var j = 1; j < npref; j++) {
            prefix += ' ' + array[i + j]; // добавляем еще слова в префикс
        }

        var suffix = array[i + j]; // находим суффикс для данного префикса

        // добавляем префикс и суфикс в словарь
        if (dictionary[prefix] === undefined) {
            dictionary[prefix] = [suffix];
        } else {
            dictionary[prefix].push(suffix);
        }
    }

    return (dictionary);
}

function bredogenerator(dictionary, indexDictionary, dictionarySize) { // бредогенератор текста
    var text       = []; // массив для хранения итогового текста
    var startWords = collocation(indexDictionary, dictionarySize);
    startWords[0]   = capitaliseFirstLetter(startWords[0]);
    text = text.concat(startWords);

    var textSize       = text.length-1; // длина массива, с текстом на выход
    var doubleWords    = text[textSize-1] + ' ' + text[textSize];
    var randomWords    = randomizer(minWordsCount, maxWordsCount); // случайное количество слов в абзатце
    var randomProffer  = randomizer(minProfferCount, maxProfferCount); // случайное количество предложений в абзатце
    var countWords     = 2; // счечик слов
    var countProffer   = 0; // счечик предложений
    var newCollocation = '';
    var generate       = true;

    while(generate) {
        if (dictionary[doubleWords]) {
            var suffixN = 0; // порядковый номер суффикса в массиве по умолчанию
            var suffixSize = dictionary[doubleWords].length - 1;

            if (suffixSize > 0) {
                suffixN = randomizer(0, suffixSize);
            };

            text.push(dictionary[doubleWords][suffixN]);
            textSize++;
            countWords++;

            if (countWords >= randomWords) {
                if ((text[textSize].search(/[.,:;!\?]/)+1) || (text[textSize-1].search(/[.,:;!\?]/)+1)) {
                    text.pop();text.pop();
                    newCollocation = collocation(indexDictionary, dictionarySize);
                    text = text.concat(newCollocation);
                }

                randomWords = randomizer(minWordsCount, maxWordsCount);
                text.push('.');
                textSize++;
                countProffer++;

                if (countProffer >= randomProffer) {
                    generate = false;
                } else {             
                    newCollocation = collocation(indexDictionary, dictionarySize);
                    newCollocation[0]   = capitaliseFirstLetter(newCollocation[0]);
                    text = text.concat(newCollocation);
                    textSize += 2;
                    countWords = 2;
                }
            }
        } else {
            newCollocation = collocation(indexDictionary, dictionarySize);
            if(text[textSize].search(/[.,!\?]/)+1) {
                newCollocation[0]   = capitaliseFirstLetter(newCollocation[0]);
            }
            text = text.concat(newCollocation);
            textSize += 2;
        }
        doubleWords = text[textSize-1] + ' ' + text[textSize];
    }
    

    var addLink = randomizer(1, 10);
    if (addLink < 3) { // с вероятностью 19% в абзаце будет ссылка
        var textSize   = text.length - 1; // длина полученного абзаца
        var randomLink = randomizer(0, linksArrSize); // случайная ссылка
        var addPlace   = randomizer(0, textSize); // куда добавить ссылку
        text.splice(addPlace, 0, linksArr[randomLink]);
    }

    return text.join(' ');
}

function comb(string) { // приводим текст в порядок

    // убираем лишние пробелы
    string = string.replace(/\s([.,:?!])\s/g, '$1 ');

    // заменяем все e-mail адреса на ссылки
    string = string.replace(/(\w+[\w\.]*@[\w\.]+\w.\w+)/g, '<a href="mailto:$1">$1</a>');

    /*
    string = string.replace(/(сЧ гСУ|гУВД|моск|росси)/g, function(value) {
        switch (value) {
            case 'сЧ гСУ':
                return 'СЧ ГСУ';
            case 'гУВД':
                return 'ГУВД';
            case 'моск':
                return 'Моск';
            case 'росси':
                return 'Росси';
            case 'сБ':
                return 'СБ';
            case 'тСО':
                return 'ТСО';
            default:
                return ' ';
        }
    });
    */
    string = '<p>' + string + '</p>';

    return string;
}

function paragraphGenerator(dictionary, indexDictionary, dictionarySize) { // генератор статьи
    var countParagraph = randomizer(minParagraphCount, maxParagraphCount); // получаем количество параграфов в статье
    var text           = ''; 
    
    for (var i = 0; i < countParagraph; i++) {
        text += comb(bredogenerator(dictionary, indexDictionary, dictionarySize));
    }
    
    return text;
}

function $ajaxHabr() { 
    $('header').after("<div id='habr' style='display: none;'></div>");
    $.ajax({
        url: 'habr.html',
        dataType: 'text',
        beforeSend: function () {
            $('#loading').css('display', 'block');
        },
        success: function (answer) {
            $('#habr').append(answer);
        },
        complete: function () {
            parser();
            articlesArr      = dictionarys(articlesArr, npref);
            indexArticlesArr = indexDictionary(articlesArr);
            articlesSize     = indexArticlesArr.length - 1;
            commentsArr      = dictionarys(commentsArr, npref);
            indexCommentsArr = indexDictionary(commentsArr);
            commentsSize     = indexCommentsArr.length - 1;
            $('#loading').css('display', 'none');
        }
    });
}

function $getSettings() {
    var prefixCount = $('#prefixCount option:selected').text();
    if ((prefixCount > 1) && (prefixCount < 6)) {
        npref = prefixCount;
    } else {
        npref = 2;
    }

    var minWords = $('#minWordsCount').val();
    if ((minWords > 0) && (minWords < 50)) {
        minWordsCount = minWords;
    } else {
        minWordsCount = 3;
    }

    var maxWords = $('#maxWordsCount').val();
    if ((maxWords > minWordsCount) && (maxWords < 101)) {
        maxWordsCount = maxWords;
    } else {
        maxWordsCount = 20;
    }

    var minProffer = $('#minProfferCount').val();
    if ((minProffer > 0) && (minProffer < 30)) {
        minProfferCount = minProffer;
    } else {
        minProfferCount = 3;
    }

    var maxProffer = $('#maxProfferCount').val();
    if ((maxProffer > minProfferCount) && (maxProffer < 90)) {
        maxProfferCount = maxProffer;
    } else {
        maxProfferCount = 20;
    }

    var minParagraph = $('#minParagraphCount').val();
    if ((minParagraph > 3) && (minParagraph < 30)) {
        minParagraphCount = minParagraph;
    } else {
        minParagraphCount = 3;
    }

    var maxParagraph = $('#maxParagraphCount').val();
    if ((maxParagraph > minParagraphCount) && (maxParagraph < 90)) {
        maxParagraphCount = maxParagraph;
    } else {
        maxParagraphCount = 15;
    }
}

// обрабатываем нажатие на кнопку "Собрать словари"
$('body').on('click', '#dictionary', function() {
    $getSettings();
    $ajaxHabr();
    $('#generate').removeAttr('disabled');
    $('#prefixCount').attr('disabled', true);
    $(this).attr('disabled', true);
});

// обрабатываем нажатие на кнопку "Сгенерировать новый текст"
$('body').on('click', '#generate', function() {
    $getSettings();
    $('article .content').html(paragraphGenerator(articlesArr, indexArticlesArr, articlesSize));
});
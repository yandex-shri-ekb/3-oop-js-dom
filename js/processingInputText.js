/**
 * Бредогенератор. Обработка входного текста
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [parser парсим статьи, комменты, логины, код, ссылки]
 */
function parser() {
    // Собираем логины пользователей
    $('#habr .username').each(function(){
        var $username = $(this).html();
        usernameArr.push($username);
    });

    $('#habr .username').remove();
    usernameArrSize = usernameArr.length - 1; // считаем, сколько получили логинов

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

    $('#habr a').remove();
    linksArrSize = linksArr.length - 1; // считаем, сколько получилось ссылок

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
}

/**
 * [textClear очищаем текст от лишнего перед сборкой словаря]
 * @param  {[string]} text [текст, который нужно обработать]
 * @return {[string]}      [обработаный текст]
 */
function textClear(text) {
    // заменяем некоторые символы на пробел
    text = text.replace(/\s\B[\_\-\—\=\*]\s\B/g, ' ');

    // удаляем лишние символы
    text = text.replace(/[\(\)\{\}\"\«\»\+\↔\→\♫\►\•\/\>\<]/g, '');

    // заменяем несколько знаков на один
    text = text.replace(/([.,;:!?])+/g, '$1');

    // удаляем очевидные ссылки
    text = text.replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, '');

    // заменяем сокращенные проблемные словосочетания на полные слова
    text = text.replace(/(т\.д\.|т\.е\.|т\.к\.|т\.п\.|т\.о\.|vs\.)/g, function(value) {
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
            case 'vs\.':
                return 'versus';
            default:
                return ' ';
        }
    });

    // избавляемся от тэгов
    text = text.replace( /<.*?>/gi, '');

    // отделяем . , : ? ! пробелами, чтобы считать их отдельными словами
    text = text.replace(/(\s*[.,:?!])/g, ' $1 ');

    // преобразуем повторяющиеся пробелы в один пробел
    text = text.replace(/\s+/g, ' ');

    // убираем пробел из начала строки
    text = text.replace(/^\s*/, '');

    // переводим буrвы в начале предложений в нижний регистре
    text = text.replace(/(?:^|!?.;) [A-ZА-ЯЁ]/g, function(value) {
        return value.toLowerCase();
    });

    // переводим все пропущенные большие русские буквы в нижний регистр
    text = text.replace(/\s[А-ЯЁ]/g, function(value) {
        return value.toLowerCase();
    });

    // учим компьютер правильно писать сокращения
    text = text.replace(/(сЧ гСУ|гУВД|моск|росси|сБ|тСО|джобс|сССР|нАИРИ|пВО|аНБ|0_0|мТС|гСУ|мВД)/g, function(value) {
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
            case 'пВО':
                return 'ПВО';
            case 'аНБ':
                return 'АНБ';
            case 'мТС':
                return 'МТС';
            case 'гСУ':
                return 'ГСУ';
            case 'мВД':
                return 'МВД';
            default:
                return ' ';
        }
    });

    return text;
}
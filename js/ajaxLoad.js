/**
 * Бредогенератор. Подгрузка средствами ajax
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [ajaxHabr подгружаем файл, парсим его и собираем из него словари]
 * @param  {[string]} link [файл, который подгружаем]
 * @return                 [содержимое подгружаемой ссылки]
 */
function ajaxHabr(link) {
    $('header').after("<div id='habr' style='display: none;'></div>");
    $.ajax({
        url: link,
        dataType: 'text',
        beforeSend: function () {
            $('#loading').css('display', 'block');
            $('#loading .textload').text('Подгружаем файл...');
        },
        success: function (answer) {
            $('#habr').append(answer);
        },
        complete: function () {
            $('#loading .textload').text('Парсим...');
            parser();
            $('#loading .textload').text('Собираем словари...');
            articlesArr      = dictionarys(articlesArr, npref);
            indexArticlesArr = indexDictionary(articlesArr);
            articlesSize     = indexArticlesArr.length - 1;
            commentsArr      = dictionarys(commentsArr, npref);
            indexCommentsArr = indexDictionary(commentsArr);
            commentsSize     = indexCommentsArr.length - 1;
            $('#loading .textload').text('');
            $('#loading').css('display', 'none');
        }
    });
}

/**
 * [ajaxImage подгружаем картинку по заголовку]
 * @param  {[string]} query [запрос, по которому искать изображениее в google]
 * @return {[string]}       [изображение для статьи]
 */
function ajaxImage(query) {
    $.ajax({
        url: 'https://ajax.googleapis.com/ajax/services/search/images',
        type: 'GET',
        data : {
            v : '1.0',
            q : query,
            rsz : 1 // возвращаем только 1 результат
        },
        dataType : 'jsonp',
        success : function (answer) {
            if (answer.responseData.results[0]) {
                answer = answer.responseData.results[0]
                if (answer.width > 880) answer.width = '880';

                var img = $('<img>', {
                    src : answer.url,
                    width : answer.width,
                    alt : answer.titleNoFormatting
                });
                $('article .content').prepend(img);
            }
        }
    });
}
/**
 * Бредогенератор. Обработка кнопок
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [generateArticleComments генерация статьи и комментариев]
 * @return [сгенрированная сатья с комментариями]
 */
function generateArticleComments() {
    $('#loading').css('display', 'block');
    $('#loading .textload').text('Генерируем статью с комментариями...');
    completeArticle();
    commentsCollector(commentsArr, indexCommentsArr, commentsSize);
    $('#loading .textload').text('');
    $('#loading').css('display', 'none');
    $('article').show();
}

/**
 * обрабатываем нажатие на кнопку "Сгенерировать новый текст"
 */
$('body').on('click', '#generate', function() {
    getSettings();
    if ((flagNpref != npref)) {
        ajaxHabr("habr.html");
        setTimeout(generateArticleComments, 10000);
    } else {
        generateArticleComments();
    }
});
/**
 * Бредогенератор. Собираем данные, генерируем статью с комментариями
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [getSettings собираем и обрабатываем данные о размере текста]
 */
function getSettings() {
    var prefixCount = Number($('#prefixCount option:selected').text());
    if ((prefixCount > 1) && (prefixCount < 6)) {
        npref = prefixCount;
    } else {
        npref = 2;
    }

    var minWords = Number($('#minWordsCount').val());
    if ((minWords > 0) && (minWords < 50)) {
        minWordsCount = minWords;
    } else {
        minWordsCount = 3;
    }

    var maxWords = Number($('#maxWordsCount').val());
    if ((maxWords >= minWordsCount) && (maxWords < 101)) {
        maxWordsCount = maxWords;
    } else {
        maxWordsCount = minWordsCount + 5;
    }

    var minProffer = Number($('#minProfferCount').val());
    if ((minProffer > 0) && (minProffer < 30)) {
        minProfferCount = minProffer;
    } else {
        minProfferCount = 3;
    }

    var maxProffer = Number($('#maxProfferCount').val());
    if ((maxProffer >= minProfferCount) && (maxProffer < 90)) {
        maxProfferCount = maxProffer;
    } else {
        maxProfferCount = minProffer + 5;
    }

    var minParagraph = Number($('#minParagraphCount').val());
    if ((minParagraph > 0) && (minParagraph < 30)) {
        minParagraphCount = minParagraph;
    } else {
        minParagraphCount = 3;
    }

    var maxParagraph = Number($('#maxParagraphCount').val());
    if ((maxParagraph >= minParagraphCount) && (maxParagraph < 90)) {
        maxParagraphCount = maxParagraph;
    } else {
        maxParagraphCount = minParagraphCount + 5;
    }
}
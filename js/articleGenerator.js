/**
 * Бредогенератор. Генератор статьи
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [titleGenerator генератор бредозаголовока]
 * @param  {[array]}  dictionary      [словарь, на основании которого будет генерироваться бред]
 * @param  {[array]}  indexDictionary [вспомогательная индексированная версия этого же словаря]
 * @param  {[number]} dictionarySize  [размер словаря]
 * @return {[string]}                 [бредозаголовок]
 */
function titleGenerator(dictionary, indexDictionary, dictionarySize) {
    var title           = '';
    var minWordsTitle   = 3; // минимальное количество слов в заголовке
    var maxWordsTitle   = 5; // максимальное количество слов в заголовке
    var minProfferTitle = 1; // минимальное количество предложений в заголовке
    var maxProfferTitle = 3; // максимальное количество предложений в заголовке
    
    title = bredogenerator(dictionary, indexDictionary, dictionarySize, minWordsTitle, maxWordsTitle, minProfferTitle, maxProfferTitle);
    
    title = title.join(' ');

    // убираем лишние пробелы
    title = title.replace(/\s([.,:?!])\s?/g, '$1 ');

    return title;
}

/**
 * [paragraphGenerator генератор бредостатьи]
 * @param  {[array]}  dictionary      [словарь, на основании которого будет генерироваться бред]
 * @param  {[array]}  indexDictionary [вспомогательная индексированная версия этого же словаря]
 * @param  {[number]} dictionarySize  [размер словаря]
 * @return {[string]}                 [бредостатья]
 */
function paragraphGenerator(dictionary, indexDictionary, dictionarySize) {
    var countParagraph = randomizer(minParagraphCount, maxParagraphCount); // получаем количество параграфов в статье
    var text           = '';
    
    for (var i = 1; i <= countParagraph; i++) {
        text += combArticles(bredogenerator(dictionary, indexDictionary, dictionarySize, minWordsCount, maxWordsCount, minProfferCount, maxProfferCount));
    }
    
    return text;
}

/**
 * [combArticles приводим полученный бред в порядок]
 * @param  {[array]}   text [бредотекст]
 * @return {[string]}       [бредотекст, с сылками, кодом]
 */
function combArticles(text) {
    // добавляем ссылки в параграф
    var addLink = randomizer(1, 10);
    if (addLink < 3) { // с вероятностью 29% в абзаце будет ссылка
        var textSize   = text.length - 1; // длина полученного абзаца
        var randomLink = randomizer(0, linksArrSize); // случайная ссылка
        var addPlace   = randomizer(0, textSize); // куда добавить ссылку
        text.splice(addPlace, 0, linksArr[randomLink]);
    }

    text = text.join(' ');

    // убираем лишние пробелы
    text = text.replace(/\s([.,:?!])\s?/g, '$1 ');

    // делаем из полученного текста полноценный html-абзац
    text = '<p>' + text + '</p>';

    // добавлям код после параграфа
    if (codeArr.length >= 0) {
        var addCode = randomizer(1, 10);
        if (addLink < 6) { // с вероятностью 59% проверим стоит ли вставить код после абзаца
            if (text.search(/(bash)/gi )+1) {
                text += randomCode('bash');
            } else if (text.search(/(cpp)/gi )+1) {
                text += randomCode('cpp');
            } else if (text.search(/(css)/gi )+1) {
                text += randomCode('css');
            } else if (text.search(/(diff)/gi )+1) {
                text += randomCode('diff');
            } else if (text.search(/(html)/gi )+1) {
                text += randomCode('html');
            } else if (text.search(/(javascript|js)/gi )+1) {
                text += randomCode('javascript');
            } else if (text.search(/(php)/gi )+1) {
                text += randomCode('php');
            } else if (text.search(/(python)/gi )+1) {
                text += randomCode('python');
            } else if (text.search(/(ruby)/gi )+1) {
                text += randomCode('ruby');
            } else {
                text += '';
            }
        }
    }
    
    return text;
}

/**
 * [completeArticle генератор конечной статьи]
 * @return [статья, с текстом, ссылками, кодом, картинкой, названием, датой написания, автором]
 */
function completeArticle() {
    dateCreateArticle = randomDate(new Date(2008, 0, 1), new Date());
    $('article .published').text(getHabraDate(dateCreateArticle));
    $('article h1').text(titleGenerator(articlesArr, indexArticlesArr, articlesSize));
    ajaxImage($('article h1').text());
    $('article .content').html(paragraphGenerator(articlesArr, indexArticlesArr, articlesSize));
    $('article .infopanel .author a').text(randomUser());
}
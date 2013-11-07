/**
 * Бредогенератор. Генератор комментариев
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [commentGenerator гененратор одного комментария]
 * @param  {[array]}  dictionary      [словарь, на основании которого будет генерироваться бред]
 * @param  {[array]}  indexDictionary [вспомогательная индексированная версия этого же словаря]
 * @param  {[number]} dictionarySize  [размер словаря]
 * @return {[string]}                 [комментарий]
 */
function commentGenerator(dictionary, indexDictionary, dictionarySize) { // генерируем текст комментария
    var comment           = '';
    var minWordsComment   = 3; // минимальное количество слов в комментарии
    var maxWordsComment   = 20; // максимальное количество слов в комментарии
    var minProfferComment = 1; // минимальное количество предложений в комментарии
    var maxProfferComment = 7; // максимальное количество предложений в комментарии

    comment = bredogenerator(dictionary, indexDictionary, dictionarySize, minWordsComment, maxWordsComment, minProfferComment, maxProfferComment); // гененрируем комментарии в виде массива

    comment = comment.join(' '); // преобразуем массив в строку

    // убираем лишние пробелы
    comment = comment.replace(/\s([.,:?!])\s?/g, '$1 ');

    return comment;
}

/**
 * [commentsCollector собираем комментарии в дрквовидную структуру]
 * @param  {[array]}  dictionary      [словарь, на основании которого будет генерироваться бред]
 * @param  {[array]}  indexDictionary [вспомогательная индексированная версия этого же словаря]
 * @param  {[number]} dictionarySize  [размер словаря]
 * @return {[string]}                 [древовидная структура комментариев]
 */
function commentsCollector(dictionary, indexDictionary, dictionarySize) {
	var minCommentsCount = 25; // минимальное количество комментариев первого уровня
	var maxCommentsCount = 70; // максимальное количество комментариев первого уровня
	var countComments    = randomizer(minCommentsCount, maxCommentsCount); // получаем случайное количество комментариев первого уровня
    var countCommentsEnd = 0; // общее количество комментариев

    if (dateCreateArticle != '') { // проверяем есть ли у нас дата создания статьи
        lastDate = dateCreateArticle;
    } else { // если нет, гененрируем новую дату
        lastDate = randomDate(new Date(2008, 0, 1), new Date());
    }
    	
	for (var i = 1; i <= countComments; i++) {
        countCommentsEnd++;
        // обертка для комментраия
        var commentWrap = "<div class='comment_item'><div class='comment_body'><div class='info'><div class='folding-dot-holder'><div class='folding-dot'></div></div><div class='voting'><span class='minus' title='Голосовать могут только зарегистрированные пользователи'></span><span class='plus' title='Голосовать могут только зарегистрированные пользователи'></span><div class='mark'><span class='score' title='Всего 8: ↑8 и ↓0'>0</span></div></div><a class='avatar' href='#'><img src='images/stub-user-small.gif'></a><a class='username' href='#'></a><span class='comma'>,</span><time></time><a class='link_to_comment' href='#''>#</a><span class='to_chidren'></span><div class='clear'></div></div><div class='message html_format'></div></div><div class='reply_comments'></div></div>";
        var commentDate = randomDate(lastDate, getNewDateComment(lastDate)); // случайная дата написания комментария, приближенная к дате написания статьи
        lastDate        = commentDate; // обновляем дату последнего комментария

        $('article #comments h2').after(commentWrap); // добавляем комментарий
        $('article #comments .comment_item:first .username').text(randomUser()); // добавляем логин автора комментария     
        $('article #comments .comment_item:first time').text(getHabraDate(commentDate)); // добавляем дату написания комментария
        $('article #comments .comment_item:first .message').text(commentGenerator(dictionary, indexDictionary, dictionarySize)); // гененрируем текст комментария

        // определяем бедет ли ответ(ы) на текущий комментарий
        var secondLevel = randomizer(1, 10);
        if (secondLevel < 5) { // с вероятностью 49% будет ответ на текущий комментарий
            var minCommentsSecondLevelCount = 1; // минимальное количество комментариев второго уровня
            var maxCommentsSecondLevelCount = 5; // максимальное количество комментариев второго уровня
            var countSecondLevelComments    = randomizer(minCommentsSecondLevelCount, maxCommentsSecondLevelCount); // получаем случайное количество комментариев второго уровня

            for (var j = 1; j <= countSecondLevelComments; j++) {
                countCommentsEnd++;
                commentDate = randomDate(lastDate, getNewDateComment(lastDate));
                lastDate = commentDate;

                $('article #comments .comment_item:first .reply_comments:first').append(commentWrap);
                $('article #comments .comment_item:first .reply_comments:first .comment_item:last .username').text(randomUser());
                $('article #comments .comment_item:first .reply_comments:first .comment_item:last time').text(getHabraDate(commentDate));
                $('article #comments .comment_item:first .reply_comments:first .comment_item:last .message').text(commentGenerator(dictionary, indexDictionary, dictionarySize));

                // определяем бедет ли ответ(ы) на текущий комментарий
                var thirdLevel = randomizer(1, 10);
                if (thirdLevel < 4) { // с вероятностью 39% будет ответ на текущий комментарий
                    var minCommentsThirdLevelCount = 1; // минимальное количество комментариев трертьего уровня
                    var maxCommentsThirdLevelCount = 3; // максимальное количество комментариев трертьего уровня
                    var countSecondLevelComments   = randomizer(minCommentsThirdLevelCount, maxCommentsThirdLevelCount); // получаем случайное количество комментариев третьего уровня

                    for (var j = 1; j <= countSecondLevelComments; j++) {
                        countCommentsEnd++;
                        commentDate = randomDate(lastDate, getNewDateComment(lastDate));
                        lastDate = commentDate;

                        $('article #comments .comment_item:first .reply_comments:first .comment_item:first .reply_comments:first').append(commentWrap);
                        $('article #comments .comment_item:first .reply_comments:first .comment_item:first .reply_comments:first .comment_item:last .username').text(randomUser());          
                        $('article #comments .comment_item:first .reply_comments:first .comment_item:first .reply_comments:first .comment_item:last time').text(getHabraDate(commentDate));
                        $('article #comments .comment_item:first .reply_comments:first .comment_item:first .reply_comments:first .comment_item:last .message').text(commentGenerator(dictionary, indexDictionary, dictionarySize));
                    }   
                }
            }   
        }
    }
    $('article #comments_count').text(countCommentsEnd);
}
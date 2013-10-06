'use strict';

var Bred = function(data) {

    // Количество слов в префиксе
    this.npref = +data.npref > 0 ? +data.npref : 2;

    // Переданный на вход текст
    this.text = data.text;

    // HTML-элементы, куда записывать результаты
    this.output = {
        article  : $(data.output.article),
        title    : $(data.output.title),
        comments : $(data.output.comments),
        author   : $(data.output.author),
        pubdate  : $(data.output.pubdate),
        commentsCount : $(data.output.commentsCount)
    };

    // Настройки
    this.settings = {
        words : {
            min : +data.wordsMin,
            max : +data.wordsMax
        },
        sentenses : {
            min : +data.sentencesMin,
            max : +data.sentencesMax
        },
        paragraphs : {
            min : +data.parsMin,
            max : +data.parsMax
        }
    };

    // Словари
    this.dic = {
        comments : new Dic, // для текста статьи
        articles : new Dic  // для комментариев
    };

    // Используемые никнеймы и примеры кода
    this.data = {
        nicknames : [],
        pre : {}
    };

    // Дата создания поста
    this.pubDate = randomInt(1100000000000, (new Date()).getTime());

    // Количества слов в комментариях
    // количество слов : количество комментариев с таким количеством
    this.wordsInComments = {};

    this.init();
}

Bred.prototype.init = function() {

    // массив статей
    var articles = this.text.match(/<article>[\s\S]*?<\/article>/g);

    for (var i = 0, l = articles.length; i < l; i++) {
        var $article = $(articles[i]);

        // комментарии к статье
        var $comments = $article.find('.comment');

        for (var j = 0, len = $comments.length; j < len; j++) {
            // передаём комментарий на обработку
            this.parseComment($comments[j]);
        }

        // удаляем из статьи комментарии и передаём её текст на обработку
        this.parseArticleText($article.find('section').remove().end());
    }

    // вычисляем среднее количество слов в комментариях
    // this.wordsInComments = this.analizeResults(this.wordsInComments);

    this.writeArticleTitle();                   // придумываем заголовок
    this.writeArticleText();                    // текст статьи
    this.writeArticleAuthor();                  // автора статьи
    this.insertCode();                          // добавляем код
    this.writeComments(randomInt(10, 20));      // и комментарии
    this.insertImage(this.output.title.text()); // вставляем КДПВ
}

// Возвращает случайный ник
Bred.prototype.getRandomNickname = function() {
    return this.data.nicknames[randomInt(0, this.data.nicknames.length - 1)];
}

// Обрабатывает комментарий
Bred.prototype.parseComment = function(comment) {
    var $comment = $(comment);

    // извлекаем ник
    var nick = $comment.children('.username').text();
    this.data.nicknames.push(nick);

    // элемент с текстом сообщения
    var $message = $comment.children('.message');
    // удаляем из него программный код
    this.removePreTags($message);
    // очищаем
    $message = this.cleanText($message.text());
    // разбиваем по словам
    var words = $message.split(' ');

    // Ведём статистику
    this.wordsInComments[words.length] =
        (this.wordsInComments[words.length] === undefined ? 1 : ++this.wordsInComments[words.length]);

    // добавляем эти слова в словарь
    this.dic.comments.add(words, this.npref);
}

// Обрабатывает текст статьи
Bred.prototype.parseArticleText = function(text) {
    var $text = $(text);

    this.removePreTags($text);

    text = this.cleanText($text[0].innerHTML);

    // делим на слова
    var words = text.split(' ');

    // добавляем эти слова в словарь
    this.dic.articles.add(words, this.npref);
}

// Пишет текст, основываясь на словаре dic
// длинной от minWords до maxWords слов
Bred.prototype.writeText = function(minWords, maxWords, dic) {
    var text = [];

    out:
    do {
        for (dic.reset(); dic.valid(); dic.next()) {
            var word = dic.current();
            text.push(word);

            // Вероятность закончить предложение
            // тем она больше, чем ближе text.length приближается к maxWords
            var p = (text.length - minWords) / (maxWords - minWords);
            if (p > Math.random() && text[text.length - 1].match(/[^:,]/)) {
                // если предложение ещё не было закончено, ставим точку
                if (text[text.length - 1].match(/[^!?.]/))
                    text.push('.');
                break out;
            }
        }
    } while (true)

    return text.join(' ');
}

// Придумывает комментарии
Bred.prototype.writeComments = function(count) {
    // сюда складываем комментарии при их создании
    var comments = [];
    var lastActivityTime = this.pubDate;

    for (var i = 0; i < count; i++) {
        var author = this.getRandomNickname();
        lastActivityTime += randomInt(0, 110000000);
        var time = this.formatDate(new Date(lastActivityTime));
        var text = this.writeText(this.settings.words.min, this.settings.words.max * 8, this.dic.comments);
        text = this.cleanTextAfter(text);
        comments.push(this.writeComment(author, time, text));
    }

    // вставляем сами комментарии и их число в страницу
    this.output.comments.html(comments);
    this.output.commentsCount.text(comments.length);
}

// Возвращает HTML-элемент комментария
Bred.prototype.writeComment = function(author, time, text) {
    var $comment = $('#bred-comment').clone().removeAttr('id')
        .find('.username').text(author).end()
        .find('time').text(time).end()
        .find('.message').text(text).end();
    return $comment;
}

// Придумывает заголовок к статье
Bred.prototype.writeArticleTitle = function() {
    var text = this.writeText(this.settings.words.min, this.settings.words.max, this.dic.articles);
    this.output.title.html(this.cleanTextAfter(text));
}

// Придумывает текст статьи
Bred.prototype.writeArticleText = function() {
    this.output.pubdate.html(this.formatDate(new Date(this.pubDate)));
    // Выбираем количество абзацев в статье
    var len = randomInt(this.settings.paragraphs.min, this.settings.paragraphs.max);
    for (var i = 0; i < len; i++) {
        // в данном абзаце будет столько-то предложений
        var sentenses = randomInt(this.settings.sentenses.min, this.settings.sentenses.max);
        var text = this.writeText(this.settings.words.min * sentenses, this.settings.words.max * sentenses, this.dic.articles);
        this.output.article.append(this.cleanTextAfter(text) + (i === len - 1 ? '' : '<br><br>'));
    }
}

// Придумывает автора статьи
Bred.prototype.writeArticleAuthor = function() {
    var author = this.getRandomNickname();
    this.output.author.html(author);
}

// Ищет и вставляет первое найденное по заросу изображение
Bred.prototype.insertImage = function(query) {

    $.ajax('//ajax.googleapis.com/ajax/services/search/images', {
        crossDomain : true,
        data : {
            v : '1.0',
            rsz : 1, // сколько результатов возвращать
            q : query
        },
        context : this,
        dataType : 'jsonp',
        success : function(data) {
            if (data = data.responseData.results[0]) {
                // слишком крупные изображения уменьшаем
                if (data.width > 650) data.width = '650';

                var img = $('<img>', {
                    src : data.url,
                    width : data.width,
                    alt : data.titleNoFormatting
                });

                this.output.article.prepend(img, '<br><br>');
            }
        }
    });
}

// Вставляет случайный кусок кода
Bred.prototype.insertCode = function() {
    // увы, но C в пролёте
    var text = this.output.article.html().replace(/(?: (css|bash|ruby|html|javascript|php|python))\b([\s\S]*?<br><br>)/i, function(all, lang, tail) {
        var langLC = lang.toLowerCase();
        // если для такого языка есть примеры кода
        if (this.data.pre[langLC] !== undefined) {
            var l = this.data.pre[langLC].length;
            var random = randomInt(0, l - 1);
            return ' <b>' + lang + '</b>' + tail + '<pre>' + this.data.pre[langLC][random] + '</pre><br><br>';
        }
        return ' ' + all;
    }.bind(this));
    this.output.article.html(text);
}

// Обработка обычного текста,
// именно обычного, код на языках программирования ей передавать не стоит
// ПО ЗАДАНИЮ: Точка, запятая, двоеточие, вопросительный и восклицательный знаки считаются словами.
// Все остальные знаки препинания отбрасываются.
Bred.prototype.cleanText = function(text) {

    // Удаляем всякие адреса в интернете
    text = text.replace(/(?:(?:https?|ftp):\/\/)*(?:www.|ftp.)*[А-я\w.-]+\.[A-z]{2,4}/gi, '');

    // Заменяем несколько знаков препинания на один
    text = text.replace(/([!?.,:-])[!?.,:-]+/gm, '$1');

    // Удаляем html-сущности
    text = text.replace(/&\w+;|&#\d+;/g, ' ');

    // Дефис может быть в составе слова, а может использоваться вместо тире
    // удаляем дефисы, если они используются вместо тире
    text = text.replace(/\s+-+\s+/gm, ' ');

    // Так как по заданию . , : ? ! считаются за слова, отделим их пробелами
    text = text.replace(/(\s*[!?.,:])/gm, ' $1 ');

    // Удаляем все теги
    text = text.replace(/<\/?[^>]+>/gi, '');

    // Если перед переводом строки \n не стоят точка, вопросительный или восклицательный знаки, значит надо поставить
    // Например, часто знаки не стоят в подзаголовках
    text = text.replace(/([A-zА-яёЁ0-9][^!?.])\n/gm, '$1 .\n')

    // Удаляем все символы, кроме букв, цифр и некоторых знаков препинания
    text = text.replace(/[^A-zА-яёЁ0-9 !?.,:-]/gm, ' ');

    // Все повторяющиеся пробельные символы, преобразуем в один пробел
    text = text.replace(/\s+/gm, ' ');

    // Заглавные буквы, с которых начинаются предложения, переводим в строчные.
    // С точки зрения производительности, наверное, лучше было бы использовать toLowerCase(),
    // но хочется оставить в тексте побольше имён собственных
    text = text.replace(/(?:^|[!?.]) [A-ZА-ЯЁ]/gm, function(result) {
        return result.toLowerCase();
    });

    // Раскрываем сокращения
    text = text.replace(/(т . е .|т . к .|т . п .|т . д .|т . о .)/g, function(result) {
        switch (result) {
            case 'т . е .':
                return 'то есть';
            case 'т . к .':
                return 'так как';
            case 'т . п .':
                return 'тому подобное';
            case 'т . д .':
                return 'так далее';
            case 'т . о .':
                return 'таким образом';
        }
    });

    return text;
}

// Улучшает вид сгенерированного скриптом текста
Bred.prototype.cleanTextAfter = function(text) {

    // Удаляем пробелы перед точками
    text = text.replace(/ ([!?.:,])/g, '$1');

    // Расставляем заглавные буквы в началах предложений
    text = text.replace(/(?:^ *|[!?.] )[a-zа-яё]/g, function(result) {
        // return '<mark>' + result.toUpperCase() + '</mark>';
        return result.toUpperCase();
    });

    return text;
}

// Ищет в переданном элементе вставки кода в тегах PRE,
// и добавляет его в хранилище примеров кода, затем удаляет теги PRE из элемента
Bred.prototype.removePreTags = function($element) {
    var pres = $element.find('pre').remove();
    $element.find('code').remove();
    if (pres.length > 0) {
        for (var i = 0, l = pres.length; i < l; i++) {
            var lang = $(pres[i]).children('code').attr('class');
            // если указан язык кода, добавляем его в наш список для возможной будущей вставки
            if (lang) {
                if (this.data.pre[lang] === undefined)
                    this.data.pre[lang] = [pres[i].innerHTML];
                else
                    this.data.pre[lang].push(pres[i].innerHTML);
            }
        }
    }
}

// Форматирует дату, принимает на вход Date-объект
Bred.prototype.formatDate = function(date) {
    return date.getDate() + ' ' +
        ('января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',')[date.getMonth()]) + ' ' +
            date.getFullYear() + ' в ' + leadZero(date.getHours()) + ':' + leadZero(date.getMinutes())
}












/*
// Обрабатывает статистику
Bred.prototype.analizeResults = function(results) {
    // Производим нормировку
    var sum = 0;
    for (var key in results) {
        sum += results[key];
    }
    for (var key in results) {
        results[key] = results[key] / sum;
    }

    // Вычисляем математическое ожидание
    var mx = this.calcExpectedValue(results);
    // Вычисляем среднеквадратическое отклонение
    var sigma = this.calcStandardDeviation(results, mx);

    return {
        min : mx - sigma,
        max : mx + sigma,
        val : mx,
        valueOf : function() {
            return this.val;
        }
    };
}

// Вычисляет мат. ожидание
Bred.prototype.calcExpectedValue = function(results) {
    var mx = 0;

    for (var key in results) {
        mx += key * results[key];
    }

    return mx;
}

// Вычисляет с.к.о.
Bred.prototype.calcStandardDeviation = function(results, mx) {
    var dx = 0;
    var mx = mx || this.calcExpectedValue(results);

    for (var key in results) {
        dx += key * key * results[key];
    }

    return Math.sqrt(dx - mx * mx);
}
*/
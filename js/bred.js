'use strict';

var Bred = function(data) {

    // необходимые для работы HTML-элементы
    this.elements = {
        modal         : data.elements.modal,
        wrapper       : data.elements.wrapper,
        loader        : data.elements.loader,
        article       : data.elements.article,
        title         : data.elements.title,
        comments      : data.elements.comments,
        author        : data.elements.author,
        pubdate       : data.elements.pubdate,
        commentsCount : data.elements.commentsCount,
        dTimes        : data.elements.dTimes
    };

    this.elements.loader.text('Составление словаря...').show();

    // Количество слов в префиксе
    this.npref = +data.npref > 0 ? +data.npref : 2;

    // Переданный на вход текст
    this.text = data.text;

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
        comments : new Dic,  // для комментариев
        articles : new Dic , // для текста статьи
        nicknames : [],      // используемые ники
        pre : {}             // примеры кода
    };

    // Используемые никнеймы и примеры кода
    this.data = {

    };

    // Дата создания поста
    this.pubDate = randomInt(1100000000000, (new Date()).getTime());

    var self = this;
    setTimeout(function() {
        self.init();
    }, 100);
}

Bred.prototype.init = function() {
    var $articles = $(this.text.match(/<article>([\s\S]*?)<\/article>/g).join(''));

    // комментарии
    var $comments = $articles.find('section .comment');
    // здесь хранится портянка из текстов комментариев
    var commentsHtml = '';

    var self = this;

    $comments.each(function(index, element) {
        var $comment = $(element);

        // извлекаем ник
        var nick = $comment.children('.username').text();
        self.dic.nicknames.push(nick);

        // добавляем в портянку
        commentsHtml += $comment.children('.message').html() + '\n';
    });

    // статьи без комментариев
    var $articles = $articles.find('section').remove().end();
    var articlesHtml = '';
    $articles.each(function(index, element) {
        // добавляем программный код в портянку
        articlesHtml += element.innerHTML + '\n';
    });

    // заводим работника, который будет составлять из слов словарь
    var worker = new Worker('js/worker.js');

    worker.postMessage({
        articles : this.removePreTags(articlesHtml),
        comments : this.removePreTags(commentsHtml),
        npref    : this.npref
    });

    // как закончит составлять словарь
    worker.onmessage = function(e) {
        self.elements.loader.text('Генерация статьи...');

        setTimeout(function() {
            // сохраняем готовые словари
            self.dic.comments.dic = e.data.comments;
            self.dic.articles.dic = e.data.articles;

            self.writeArticleTitle();                     // придумываем заголовок
            self.writeArticleText();                      // текст статьи
            self.writeArticleAuthor();                    // автора статьи
            self.insertCode();                            // добавляем код
            self.writeComments(randomInt(10, 20));        // и комментарии
            self.insertImage(self.elements.title.text()); // вставляем КДПВ

            self.elements.wrapper.show();
            self.elements.modal.closeModal();
            self.elements.loader.hide();
            self.elements.dTimes.html('Сгенерирована за <b>' + ((new Date).getTime() - window.startTime) / 1000 + '</b> с');
        }, 100)
    };
}

// Возвращает случайный ник
Bred.prototype.getRandomNickname = function() {
    return this.dic.nicknames[randomInt(0, this.dic.nicknames.length - 1)];
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
        lastActivityTime += randomInt(0, 110000000);
        var time = this.formatDate(new Date(lastActivityTime));
        var author = this.getRandomNickname();
        var text = this.writeText(this.settings.words.min, this.settings.words.max * 8, this.dic.comments);
        text = this.cleanTextAfter(text);
        comments.push(this.writeComment(author, time, text));
    }

    // вставляем сами комментарии и их число в страницу
    this.elements.comments.html(comments);
    this.elements.commentsCount.text(comments.length);
}

// Возвращает HTML-элемент комментария
Bred.prototype.writeComment = function(author, time, text) {
    return $('#bred-comment').clone().removeAttr('id')
        .find('.username').text(author).end()
        .find('time').text(time).end()
        .find('.message').text(text).end();
}

// Придумывает заголовок к статье
Bred.prototype.writeArticleTitle = function() {
    var text = this.writeText(this.settings.words.min, this.settings.words.max, this.dic.articles);
    this.elements.title.html(this.cleanTextAfter(text));
}

// Придумывает текст статьи
Bred.prototype.writeArticleText = function() {
    this.elements.pubdate.html(this.formatDate(new Date(this.pubDate)));
    // Выбираем количество абзацев в статье
    var len = randomInt(this.settings.paragraphs.min, this.settings.paragraphs.max);
    for (var i = 0; i < len; i++) {
        // в данном абзаце будет столько-то предложений
        var sentenses = randomInt(this.settings.sentenses.min, this.settings.sentenses.max);
        var text = this.writeText(this.settings.words.min * sentenses, this.settings.words.max * sentenses, this.dic.articles);
        this.elements.article.append(this.cleanTextAfter(text) + (i === len - 1 ? '' : '<br><br>'));
    }
}

// Придумывает автора статьи
Bred.prototype.writeArticleAuthor = function() {
    var author = this.getRandomNickname();
    this.elements.author.html(author);
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

                this.elements.article.prepend(img, '<br><br>');
            }
        }
    });
}

// Вставляет случайный кусок кода
Bred.prototype.insertCode = function() {
    // увы, но C в пролёте
    var text = this.elements.article.html().replace(/(?: (css|bash|ruby|html|javascript|php|python))\b([\s\S]*?<br><br>)/i, function(all, lang, tail) {
        var langLC = lang.toLowerCase();
        // если для такого языка есть примеры кода
        if (this.dic.pre[langLC] !== undefined) {
            var l = this.dic.pre[langLC].length;
            var random = randomInt(0, l - 1);
            return ' <b>' + lang + '</b>' + tail + this.dic.pre[langLC][random];
        }
        return ' ' + all;
    }.bind(this));
    this.elements.article.html(text);
}

// Улучшает вид сгенерированного скриптом текста
Bred.prototype.cleanTextAfter = function(text) {

    // Удаляем пробелы перед точками
    text = text.replace(/ ([!?.:,])/g, '$1');

    // Расставляем заглавные буквы в началах предложений
    text = text.replace(/(?:^ *|[!?.] )[a-zа-яё]/g, function(result) {
        return result.toUpperCase();
    });

    return text;
}

// Ищет в переданном HTML-тексте примеры кода,
// добавляет их в хранилище примеров кода, затем удаляет эти примеры из HTML-текста
Bred.prototype.removePreTags = function(html) {
    var $html = $('<div>' + html + '</div>');
    var $codes = $html.find('pre,code').remove();

    if ($codes.length > 0) {
        $codes = $codes.filter('code[class]');

        for (var i = 0, l = $codes.length; i < l; i++) {
            var $el = $($codes.get(i));
            var lang = $el.attr('class');
            var code = '<pre><code>' + $el.html() + '</code></pre><br>'
            // добавляем его в наш список для возможной будущей вставки
            if (this.dic.pre[lang] === undefined)
                this.dic.pre[lang] = [code];
            else
                this.dic.pre[lang].push(code);
        }
    }
    return $html.html();
}

// Форматирует дату, принимает на вход Date-объект
Bred.prototype.formatDate = function(date) {
    return date.getDate() + ' ' +
        ('января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',')[date.getMonth()]) + ' ' +
            date.getFullYear() + ' в ' + leadZero(date.getHours()) + ':' + leadZero(date.getMinutes())
}


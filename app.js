"use strict";

var commentTextGen = new UltimateTextGenerator(),
    isParsed = false,
    nicknames = [];

/*
 * Схема работы:
 *     Собираем текст -> Обрабатываем текст -> Профит
 */
(function($) {

    var $body = $('body'),
        $progress = $('#progress'),
        $status = $('#status'),
        $go = $('#go'),
        $settings = $('#settings'),
        $modal = $('#modal'),
        $modalSave = $('#modal-save'),
        $modalCancel = $('#modal-cancel'),
        $habrTitle = $('#habr-title'),
        $habrContent = $('#habr-content'),
        $habrComments = $('#habr-comments'),
        $habrCommentsCount = $('#habr-comments-count'),
        $habrCommentsTemplate = $('#habr-comment-template'),
        $settingsPn1 = $('#settings-pn1'),
        $settingsPn2 = $('#settings-pn2'),
        $settingsSn1 = $('#settings-sn1'),
        $settingsSn2 = $('#settings-sn2'),
        $settingsWn1 = $('#settings-wn1'),
        $settingsWn2 = $('#settings-wn2'),
        _settings = {};

    var articleWorker = new SimpleWorker("worker.js");

    $settings.on('click', function() {
        $('<div class="modal__backdrop"></div>').appendTo($body);
        $modal.show();

        return false;
    });

    $modalSave.on('click', function() {
        $('.modal__backdrop', $body).remove();
        $modal.hide();

        return false;
    });

    $modalCancel.on('click', function() {
        $('.modal__backdrop', $body).remove();
        $modal.hide();

        return false;
    });

    $go.on('click', function() {
        progressTo(0, 'Download habr.html...');

        if(!isParsed) {
            $.ajax({url : 'habr.html'}).done(function(response) {
                processHabrHtml(response);
                generate();
            });
        }
        else {
            generate();
        }

        return false;
    });

    function progressTo(val, comment) {
        console.log(val + ' ' + comment);
        $progress.attr('value', val);
        if(comment) {
            $status.text(comment);
        }
    }

    function generate() {
        progressTo(75, 'Generating text...');

        _settings = {
            p: [+$settingsPn1.val(), +$settingsPn2.val()],
            s: [+$settingsSn1.val(), +$settingsSn2.val()],
            w: [+$settingsWn1.val(), +$settingsWn2.val()]
        };

        var
            nComments = getRandomInt(10, 30),
            publishDate = randomDate(new Date(2012, 0, 1), new Date());

        articleWorker
            .send({cmd:'generateSentence', args:[getRandomInt(2, 5), '.', true, true, 0]})
            .then(function(data) {
                $habrTitle.text(data);
            });

        articleWorker
            .send({cmd:'generatePost', args:[_settings.p[0], _settings.p[1], _settings.s[0], _settings.s[1], _settings.w[0], _settings.w[1]]})
            .then(function(data) {
                $habrContent.html(data);
            });

        $habrComments.html('');
        $habrCommentsCount.text(nComments);
        progressTo(90, 'Generating comments...');
        for(var i = 0; i < nComments; i++) {
            $habrComments.append(generateComment(publishDate, 1));
        }

        progressTo(100, 'Done!');
    }

    function generateComment(minDate, lvl) {
        var text = generateCommentText(getRandomInt(_settings.s[0], _settings.s[1]));
        var date = new Date(minDate.getTime() + getRandomInt(0, 60) * 60000);
        var $comment = createNewComment(getRandomNickname(), date.toLocaleString(), text);

        if(Math.random() < (1 - lvl * 0.2)) {
            var $child, i;
            var n = (3 - lvl) < 1 ? 1 : getRandomInt(1, 3 - lvl);
            for(i = 0; i < n; i++) {
                $child = generateComment(date, lvl + 1);
                $child.appendTo($comment.children('.reply_comments'));
            }
        }

        return $comment;
    }

    function generateCommentText(nSentence) {
        var nWords, text = '';
        nSentence = getRandomInt(1, _settings.s[1]);
        for(var s = 0; s < nSentence; s++) {
            nWords = getRandomInt(_settings.w[0], _settings.w[1]);
            text += ' ' + commentTextGen.generateSentence(nWords, '.', false, true, 3);
        }

        return text;
    }

    function createNewComment(author, time, text) {
        return $($habrCommentsTemplate.html())
            .find('.username').text(author).end()
            .find('time').text(time).end()
            .find('.message').text(text).end();
    }

    function getRandomNickname() {
        return nicknames[getRandomInt(0, nicknames.length - 1)];
    }

    function processHabrHtml(data) {
        var progress = 10;
        progressTo(progress, 'Parse habr.html...');

        var $articles = $(data.match(/<article>([\s\S]*?)<\/article>/g).join(''));
        var $comments = $articles.find('.comments .comment');

        progressTo(progress += 5, 'Parse comments...');

        $comments.each(function(index, element) {
            var $comment = $(element);

            var nick = $comment.find('.username').text();
            nicknames.push(nick);

            commentTextGen.add($comment.find('.message').text().trim());
        });

        $articles.each(function(index, article) {
            if(index % 4 === 0 && index > 0) {
                progressTo(++progress, 'Parse articles; ' + index + ' out of 100...');

                var text = parseArticle($(article), false);
                articleWorker.send({cmd:'add', args:[text]});
            }
        });

        isParsed = true;
    }

    /**
     * @param {int} min
     * @param {int} max
     * @return int
     */
    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    /**
     * @param {jQuery} $elem
     * @param {boolean} cloneElem
     * @return string
     */
    function parseArticle($elem, cloneElem) {
        var $article = cloneElem ? $elem.clone() : $elem;

        var html = $article
            .find('code,pre,table,a,.comments')
            .remove()
            .end()
            .html();

        return html.toLowerCase()
            // табы
            .replace(/\t+/g, ' ')
            // переносы строк
            .replace(/\r?\n|\r/g, ' ')
            // теги
            .replace(/<\/?[^<]*?>/g, '')
            .trim();
    }
})(jQuery);
"use strict";

/*
 * Схема работы:
 *     Собираем текст -> Обрабатываем текст -> Профит
 */
(function($) {

    var $body = $('body'),
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
        _settings = {},
        _startTime,
        _isParsed = false;

    var articleWorker = new SimpleWorker("worker.js"),
        commentWorker = new SimpleWorker("worker.js");

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
        _startTime = new Date().getTime();

        timeLog('Download habr.html...');

        if(!_isParsed) {
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

    function timeLog(comment) {
        var elapsed = new Date().getTime() - _startTime;
        console.log(comment +'; ' + elapsed.toFixed(2));
    }

    function generate() {
        // refresh settings
        _settings = {
            p: [+$settingsPn1.val(), +$settingsPn2.val()],
            s: [+$settingsSn1.val(), +$settingsSn2.val()],
            w: [+$settingsWn1.val(), +$settingsWn2.val()]
        };

        var
            nComments = randomInt(10, 30),
            publishDate = randomDate(new Date(2012, 0, 1), new Date());

        articleWorker
            .send({cmd:'generateSentence', args:[randomInt(2, 5), '.', true, true, 0]})
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

        commentWorker
            .send({cmd:'generateComments', args:[nComments, publishDate.getTime(), _settings.s[0], _settings.s[1], _settings.w[0], _settings.w[1]]})
            .then(function(comments) {
                console.log(comments);
                var $comments = createComments(comments);
                $habrComments.html($comments);
            });
    }

    function processHabrHtml(data) {
        timeLog('Parse habr.html...');

        var body = data.match(/<article>([\s\S]*?)<\/article>/g).join('');

        timeLog('Create dom...');

        var $articles = $(body);

        timeLog('Parse comments...');

        var $comments = $articles.find('.comments'), nicknames = [];

        commentWorker.send({cmd:'add', args:[$comments.find('.message').text()]});
        $comments.find('.username').text(function(index, text) {
            nicknames.push(text);
        });
        commentWorker.send({cmd:'addNicknames', args:[nicknames]});

        timeLog('Parse articles...');

        $articles.each(function(index, article) {
            var html = getArticleHtml($(article), false);
            articleWorker.send({cmd:'addHtml', args:[html]});
        });

        timeLog('Done!');

        _isParsed = true;
    }

    /**
     * @param {int} min
     * @param {int} max
     * @return int
     */
    function randomInt(min, max) {
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
    function getArticleHtml($elem, cloneElem) {
        var $article = cloneElem ? $elem.clone() : $elem;

        return $article
            .find('code,pre,table,a,.comments')
            .remove()
            .end()
            .html();
    }

    function createComments(comments, $parent) {
        var $comments = [];

        comments.forEach(function(item) {
            var $comment = createComment(item.nickname, item.date, item.text);

            if(item.comments.length > 0) {
                var $childs = createComments(item.comments, $comment);

                if($parent) {
                    $parent.find('.reply_comments').append($childs);
                }
            }

            $comments.push($comment);
        });

        return $comments;
    }

    function createComment(author, time, text) {
        return $($habrCommentsTemplate.html())
            .find('.username').text(author).end()
            .find('time').text(time).end()
            .find('.message').text(text).end();
    }

})(jQuery);
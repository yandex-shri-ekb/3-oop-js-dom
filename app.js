"use strict";

var articleTextGen = new UltimateTextGenerator(),
    commentTextGen = new UltimateTextGenerator(),
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
        $settingsWn2 = $('#settings-wn2');

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
            $.ajax({
                url : 'habr.html',
                success : function(response) {
                    processHabrHtml(response);
                    generate();
                }
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

        var p = 0,
            s = 0,
            newText = '',
            newComment = '',
            nParagraph = getRandomInt(+$settingsPn1.val(), +$settingsPn2.val()),
            nComments = getRandomInt(10, 30),
            publishDate = randomDate(new Date(2012, 0, 1), new Date()),
            commentDate;

        while(p++ < nParagraph) {
            newText += generatePost(getRandomInt(+$settingsSn1.val(), +$settingsSn2.val()));

            if(p !== nParagraph) {
                newText += '<br><br>';
            }
        }

        $habrContent.html(newText);

        $habrComments.html('');
        $habrCommentsCount.text(nComments);
        progressTo(90, 'Generating comments...');
        for(var i = 0; i < nComments; i++) {
            commentDate = new Date(publishDate.getTime() + getRandomInt(0, 60) * 60000);
            newComment = generateComment(getRandomInt(+$settingsSn1.val(), +$settingsSn2.val()));

            $habrComments.append(createNewComment(getRandomNickname(), commentDate.toLocaleString(), newComment));
        }

        var newTitle = articleTextGen.generateSentence(getRandomInt(2, 5), '.', true, true, 0);
        $habrTitle.html(newTitle);

        progressTo(100, 'Done!');
    }

    function generatePost(nSentence) {
        var nWords, text = '';
        nSentence = getRandomInt(+$settingsSn1.val(), +$settingsSn2.val());
        for(var s = 0; s < nSentence; s++) {
            nWords = getRandomInt(+$settingsWn1.val(), +$settingsWn2.val());
            text += ' ' + commentTextGen.generateSentence(nWords, '.', false, true, 3);
        }

        return text;
    }

    function generateComment(nSentence) {
        var nWords, text = '';
        nSentence = getRandomInt(+$settingsSn1.val(), +$settingsSn2.val());
        for(var s = 0; s < nSentence; s++) {
            nWords = getRandomInt(+$settingsWn1.val(), +$settingsWn2.val());
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

                var articleData = parseArticle($(article), false);
                articleTextGen.add(articleData);
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

        // $(':header')

        var $article = cloneElem ? $elem.clone() : $elem;

        var html = $article
            .find('code,pre,table,a,.comments')
            .remove()
            .end()
            .html();

        var text = html.toLowerCase()
            // табы
            .replace(/\t+/g, ' ')
            // переносы строк
            .replace(/\r?\n|\r/g, ' ')
            // теги
            .replace(/<\/?[^<]*?>/g, '')
            .trim();

        /*var text = $elem.clone()
         .children()
         .remove()
         .end()
         .text();*/

        return text;
    }
})(jQuery);
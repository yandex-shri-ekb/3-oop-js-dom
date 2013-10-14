"use strict";

var articleTextGen = new UltimateTextGenerator(),
    commentTextGen = new UltimateTextGenerator(),
    isParsed = false;

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
        $habrContent = $('#habr-content');

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
        $progress.attr('value', val);
        if(comment) {
            $status.text(comment);
        }
    }

    function generate() {
        progressTo(90, 'Generating text...');

        var newText = articleTextGen.generateText(20);
        $habrContent.text(newText);

        var newTitle = articleTextGen.generateSentence(getRandomInt(2, 5), '.', true, true, 0);
        $habrTitle.text(newTitle);

        progressTo(100, 'Done!');
    }

    function processHabrHtml(data) {
        var progress = 10;
        progressTo(progress, 'Parse habr.html...');

        var $articles = $(data.match(/<article>([\s\S]*?)<\/article>/g).join(''));
        var $comments = $articles.find('.comments');

        $articles.each(function(index, article) {
            if(index % 4 === 0 && index > 0) {
                progress++;
                progressTo(progress, 'Parse habr.html; ' + index + ' out of 100...');

                var articleData = parseArticle($(article));
                articleTextGen.add(articleData);
            }
        });

        isParsed = true;
    }

    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /**
     * @param {jQuery} $elem
     * @return string
     */
    function parseArticle($elem) {

        // $(':header')

        var $article = $elem.clone();

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
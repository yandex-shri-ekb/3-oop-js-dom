(function () {
    'use strict';

    var textUrl = 'habr.html',
        isDictionaryPrepared = false,
        isArticleRequested = false,
        worker,
        writer,
        useAsyncLoad = typeof Worker !== 'undefined';

    if (useAsyncLoad) {
        worker = new Worker("js/worker.js");

        worker.onmessage = function (e) {
            switch (e.data.action) {
                case 'dictionaryPrepared':
                    isDictionaryPrepared = true;

                    if (isArticleRequested) {
                        generateArticleAsync(getUserSettings());
                    }
                    break;
                case 'articleGenerated':
                    buildArticle(
                        e.data.header,
                        e.data.text,
                        e.data.comments
                    );

                    $('.processing').hide();
                break;
            }
        };

        prepareDictionaryAsync();
    }

    function prepareDictionaryAsync() {
        $.get(textUrl, function (data) {
            var parser = new Parser($(data));
            
            worker.postMessage({
                action: 'prepareDictionary',
                articles: parser.articles(),
                comments: parser.comments(),
                usernames: parser.usernames()
            });
        });
    }

    function generateArticleAsync(settings) {
        worker.postMessage({
            action: 'generateArticle',
            settings: settings
        });
    }

    $('#generate_article').on('click', function () {
        if (useAsyncLoad) {
            isArticleRequested = true;

            if (isDictionaryPrepared) {
                generateArticleAsync(getUserSettings());
            }
        } else {
            generateArticleSync(getUserSettings());
        }

        return false;
    });

    function generateArticleSync(settings) {
        if (writer !== undefined) {
            buildArticleWithWriter(writer, settings);

            return;
        }

        $('.processing-fallback').show();

        $.get(textUrl, function (data) {
            var parser = new Parser($(data)),
                gArticles = new Garry().eat(parser.articles()),
                gComments = new Garry().eat(parser.comments());

            writer = new Writer(parser.usernames(), gComments, gArticles);

            buildArticleWithWriter(writer, settings);

            $('.processing-fallback').hide();
        });
    }

    function buildCommentSection(comments) {
        var getNumber = function (o) {
            return o.length + o.reduce(function (length, comment) {
                return length + getNumber(comment.replies)  ;
            }, 0);
        };

        return $('.comments')
                   .append('<h1>Комментарии (' + getNumber(comments) + ')</h1>')
                   .append(buildCommentTree(comments, +new Date()));
    }

    function buildCommentTree(comments, initial_date) {
        return $('<ul>').append(comments.map(function(comment) {
            initial_date += getRandomIntegerInRange(1, 60) * 60 * 1000;
            comment.date = timestampTostring(initial_date);
            var $comment = $('[data-template="comment"]').render(comment),
                $replies = buildCommentTree(comment.replies, initial_date);

            return $comment.append($replies);
        }));
    }

    function getUserSettings() {
        var $form = $('.settings > form'),
            intVal = function (name) {
                return parseInt($form.find('[name="' + name + '"]').val());
            };

        return {
            paragraphs: { perArticle: {
                min: intVal('paragraphs_per_article_min'),
                max: intVal('paragraphs_per_article_max')
            }},
            sentences: { perParagraph: {
                min: intVal('sentences_per_paragraph_min'),
                max: intVal('sentences_per_paragraph_max')
            }},
            words: { perSentence: {
                min: intVal('words_per_sentence_min'),
                max: intVal('words_per_sentence_max')
            }}
        };
    }

    function buildArticle(header, text, comments) {
        $('article')
            .find('header > h1').text(header).end()
            .find('.content').html(text).end()
            .append(buildCommentSection(comments))
            .show();
    }

    function buildArticleWithWriter(writer, settings) {
        buildArticle(
            writer.getArticleHeader({
                words: { perSentence: { min: 3, max: 10 }}
            }),
            writer.getArticleText(settings),
            writer.getCommentTree({
                paragraphs: {perArticle: {min: 1, max: 3}},
                sentences: {perParagraph: {min: 1, max: 5}},
                words: {perSentence: {min: 3, max: 15}}
            })
        );
    }
}());
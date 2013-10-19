(function () {
    'use strict';

    var kittenwidth = 600,
        forceAsync = false;

    $('#generate_article').on('click', function (e) {
        e.preventDefault();
        var $settings = $('.settings'),
            settings = getUserSettings($settings.find('form'));

        $settings.hide();

        if (typeof(Worker) === 'undefined' || forceAsync) {
            generateArticleSync(settings);
        } else {
            generateArticleAsync(settings);
        }

        return false;
    });

    $('#moar_kittens').on('click', function () {
        $('.kitten').attr('src', 'http://placekitten.com/g/' + kittenwidth + '/300');

        kittenwidth -= 10;

        return false;
    });

    function generateArticleSync(settings) {
        $('.processing-fallback').show();

        window.stopwatch = new Stopwatch();

        $.get('habr.html', function (data) {
            console.log('Loaded: ' + stopwatch.tap());
            window.parser = new Parser($(data));
            var a = parser.articles();
            console.log('Articles parsed: ' + stopwatch.tap());
            window.gArticles = new Garry().eat(a);
            console.log('Articles added to dict: ' + stopwatch.tap());
            var p = parser.comments();
            console.log('Comments parsed: ' + stopwatch.tap());
            window.gComments = new Garry().eat(p),
            console.log('Comments added to dict: ' + stopwatch.tap());
            window.writer = new Writer(parser.usernames(), gComments, gArticles);
            console.log('Username parsed: ' + stopwatch.tap());

            /* TODO get rid of ugly brackets */
            $('.content').html(writer.getArticleText(settings));    /* especially here ↓ */
            console.log('Article written: ' + stopwatch.tap());
            $('article').append(buildCommentSection(writer.getCommentTree({
                paragraphs: {perArticle: {min: 1, max: 3}},
                sentences: {perParagraph: {min: 1, max: 5}},
                words: {perSentence: {min: 3, max: 6}}
            })));
            console.log('Comments written: ' + stopwatch.tap());

            $('.processing-fallback').hide();
            $('article').show();

            $('article > header > h1').text(writer.getArticleHeader());
            console.log('Done: ' + stopwatch.tap());
        });

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
    }

    function generateArticleAsync(settings) {
        var myWorker = new Worker("js/worker.js");

        myWorker.onmessage = function (e) {
            $('#read_article').on('click', function () {
                $('.content').html(e.data.text);
                $('article').append(buildCommentSection(e.data.comments));

                $('.processing').hide();
                $('article').show();

                $('article > header > h1').text(e.data.header);

                return false;
            }).show();

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
        };

        $.get('habr.html', function (data) {
            window.parser = new Parser($(data)),
            
            myWorker.postMessage({
                settings: settings,
                articles: parser.articles(),
                comments: parser.comments(),
                usernames: parser.usernames()
            });
        });

        $('#moar_kittens').click();
        $('.processing').show();
    }

    function getUserSettings($form) {
        return {
            paragraphs: { perArticle: {
                min: parseInt($form.find('[name="paragraphs_per_article_min"]').val()),
                max: parseInt($form.find('[name="paragraphs_per_article_max"]').val())
            }},
            sentences: { perParagraph: {
                min: parseInt($form.find('[name="sentences_per_paragraph_min"]').val()),
                max: parseInt($form.find('[name="sentences_per_paragraph_max"]').val())
            }},
            words: { perSentence: {
                min: parseInt($form.find('[name="words_per_sentence_min"]').val()),
                max: parseInt($form.find('[name="words_per_sentence_max"]').val())
            }}
        };
    }
}());
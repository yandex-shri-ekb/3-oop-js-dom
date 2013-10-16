(function () {
    'use strict';

    var kittenwidth  = 600;

    $('#generate_article').on('click', function () {
        var $settings = $('.settings'),
            settings = $settings.find('form').serializeObject();

        $settings.hide();

        if (typeof(Worker) === 'undefined') {
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

        $.get('habr.1500.html', function (data) {
            window.parser = new Parser($(data)),
            window.gArticles = new Garry().eat(parser.articles()),
            window.gComments = new Garry().eat(parser.comments()),
            window.writer = new Writer(parser.usernames(), gComments, gArticles);

            /* TODO get rid of ugly brackets */
            $('.content').html(writer.getArticleText({
                paragraphs: {perText: {min: 5, max: 10}},
                sentences: {perParagraph: {min: 1, max: 5}},
                words: {perSentence: {min: 3, max: 15}}
            }));    /* especially here ↓ */
            $('article').append(buildCommentSection(writer.getCommentTree({
                paragraphs: {perText: {min: 1, max: 3}},
                sentences: {perParagraph: {min: 1, max: 5}},
                words: {perSentence: {min: 3, max: 6}}
            })));

            $('.processing-fallback').hide();
            $('article').show();

            $('article > header > h1').text(writer.getArticleHeader());
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
                console.log(e.data);

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
}());
'use strict';

var Benchmark = function() {
    this.startTime;
    this.endTime;
}

Benchmark.prototype.start = function() {
    this.startTime = (new Date()).getTime();
    return this.startTime;
}

Benchmark.prototype.stop = function() {
    this.endTime = (new Date()).getTime();
    return (this.endTime - this.startTime) / 1000;
}

// случайное целое число от min до max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// приделывает ведущий ноль
function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

$(function() {

    window.benchmark = new Benchmark;

    window.bred = new Bred({
        elements : {
            startButton   : $('.bred-settings button'),
            content       : $('.content_left'),
            loader        : $('.loader'),
            loaderText    : $('.loader .text'),
            article       : $('#bred-article'),
            title         : $('#bred-title'),
            comments      : $('#bred-comments'),
            author        : $('#bred-author'),
            pubdate       : $('#bred-pubdate'),
            commentsCount : $('#comments_count'),
            benchmark     : $('#bred-time')
        },
        npref        : $('[name=npref]').val(),
        wordsMin     : $('[name=words_min]').val(),
        wordsMax     : $('[name=words_max]').val(),
        sentencesMin : $('[name=sentences_min]').val(),
        sentencesMax : $('[name=sentences_max]').val(),
        parsMin      : $('[name=pars_min]').val(),
        parsMax      : $('[name=pars_max]').val()
    });

    $('.bred-settings form').on('submit', function() {
        $(this).find('button').attr('disabled', true);
        window.benchmark.start();

        if (window.bred.initialized) {
            window.bred.start();
        } else {
            $.ajax({
                url : 'habr.html',
                context : $(this),
                success : function(data) {
                    window.bred.init(data);
                }
            }, 'text');
        }
        return false;
    });

    $('a').on('click', function() {
        return false;
    });

});

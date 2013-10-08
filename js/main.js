'use strict';

// случайное целое число от min до max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// приделывает ведущий ноль
function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

$(function() {

    $('a').on('click', function() {
        return false;
    });

    $('#modal-settings').on('submit', function() {
        window.startTime = new Date();
        $.ajax({
            url : 'habr.html',
            context : $(this),
            success : function(data) {
                var articles = new Bred({
                    text : data,
                    elements : {
                        wrapper       : $('.global-wrapper'),
                        modal         : $('#modal-settings'),
                        loader        : $('#modal-settings .modal__loader'),
                        article       : $('#bred-article'),
                        title         : $('#bred-title'),
                        comments      : $('#bred-comments'),
                        author        : $('#bred-author'),
                        pubdate       : $('#bred-pubdate'),
                        commentsCount : $('#comments_count'),
                        dTimes        : $('#bred-time')
                    },
                    npref        : this.find('[name=npref]').val(),
                    wordsMin     : this.find('[name=words_min]').val(),
                    wordsMax     : this.find('[name=words_max]').val(),
                    sentencesMin : this.find('[name=sentences_min]').val(),
                    sentencesMax : this.find('[name=sentences_max]').val(),
                    parsMin      : this.find('[name=pars_min]').val(),
                    parsMax      : this.find('[name=pars_max]').val()
                });

                //this.closeModal();
            }
        });
        return false;
    });

    $('#modal-settings').openModal();

});

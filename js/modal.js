'use strict';

$(function() {

    $(document.body).append($('#modal-tpl').html());

    $.fn.openModal = function() {
        $('#overlay').css('opacity', 0).show().fadeTo(200, .5);
        $(this).css('marginTop', -$(this).outerHeight() / 2).show();
    };

    $.fn.closeModal = function() {
        $('#overlay').fadeOut(200);
        $(this).hide();
    };

});
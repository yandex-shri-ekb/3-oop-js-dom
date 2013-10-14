/*jslint browser:true*/
/*global jQuery, unique*/
(function ($) {
    'use strict';

    window.Parser = function (text) {
        this.usernames = function () {
            return unique(text.find('.username').map(function () {
                return $(this).text();
            }));
        };

        this.comments = function () {
            return text.find('.message').map(function () {
                return $(this).html().trim();
            }).get();
        };

        this.articles = function () {
            var sanitazedText = text.clone().find('.comments').remove().end();

            return sanitazedText.find('article').map(function () {
                return $(this).html().trim();
            }).get();
        };
    };
}(jQuery));
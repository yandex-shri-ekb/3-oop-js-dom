define(function(require) {
    var $ = require('jquery'),
        Dates = require('./dates'),
        Handlebars = require('handlebars');

    var $elements = {
        body: $(document.body),
        articleContainer: $('#article'),
        commentsContainer: $('#comments'),
        settingsContainer: $('#settings'),
        generateButton: $('#generate_button'),
        loading: $('#loading')
    };

    var templates = {
        comment: Handlebars.compile($('#comment-template').html()),
        comments: Handlebars.compile($('#comments-template').html()),
        article: Handlebars.compile($('#article-template').html())
    };

    Handlebars.registerHelper('recursion', function(comments) {
        return templates.comment(comments);
    });

    Handlebars.registerHelper('prettifyDate', function(date) {
        return Dates.formatDate(date);
    });

    return {
        $el: $elements,
        renderContent: function(article, comments) {
            $elements.articleContainer.html(templates.article(article));
            $elements.commentsContainer.html(templates.comments(comments));
            $elements.settingsContainer.removeClass('settings-focus');
            $elements.loading.hide();
            $('.content').show();
        },
        renderImage: function($image) {
            $image.appendTo('#image');
        }
    };
});
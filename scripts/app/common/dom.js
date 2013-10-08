define(function(require) {
    
    var Dates = require('./dates')
      , Handlebars = require('handlebars')
      ;

    var habr = document.getElementById('habr');

    var $elements = {
        body: $(document.body),
        comments: $('.comments', habr).remove(),
        articles: $('article', habr),
        articleContainer: $('#article'),
        commentsContainer: $('#comments'),
        generateButton: $('#generate_button')
    };

    var templates = {
        comment: Handlebars.compile($('#comment-template').html()),
        comments: Handlebars.compile($("#comments-template").html()),
        article: Handlebars.compile($("#article-template").html())
    };

    Handlebars.registerHelper('recursion', function(comments) { 
        return templates.comment(comments);
    });

    Handlebars.registerHelper('prettifyDate', function(date) {
        return Dates.formatDate(date);
    });

    return {
        $el: $elements,
        templates: templates,
        renderContent: function(article, comments) {
            $elements.articleContainer.html(templates.article(article));
            $elements.commentsContainer.html(templates.comments(comments));
        }
    };

});
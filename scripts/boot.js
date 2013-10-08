require.config({
    paths: {
        'jquery': './vendor/jquery',
        'handlebars': './vendor/handlebars'
    },
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        }
    }
});

require(['jquery', 'app/common/dom', 'app/generation/articles', 'app/generation/comments'], 
    function ($, DOM, Articles, Comments) {
        var $ = require('jquery')
          , DOM = require('app/common/dom')
          , Articles = require('app/generation/articles')
          , Comments = require('app/generation/comments')
          ;

        var comments = new Comments(DOM.$el.comments)
          , articles = new Articles(DOM.$el.articles)
          ;

        var generateData = function() {
            var article = articles.generateArticle()
              , commentsTree = comments.generateTree(article.date)
              ;

            DOM.renderContent(article, commentsTree);

            return false;
        };

        generateData();

        DOM.$el.generateButton.show().on('click', generateData);
    }
);
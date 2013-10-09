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

require(['jquery', 'app/common/dom', 'app/generation/articles', 'app/generation/comments', 'app/generation/image'], 
    function ($, DOM, Articles, Comments, Image) {
        var comments = new Comments(DOM.$el.comments)
          , articles = new Articles(DOM.$el.articles)
          ;

        var generateData = function() {
            var article = articles.generateArticle()
              , commentsTree = comments.generateTree(article.date)
              ;

            Image.getImage(article.header).then(function(data){
                DOM.renderImage(data)
            });
            DOM.renderContent(article, commentsTree);

            return false;
        };
        
        generateData();

        DOM.$el.generateButton.show().on('click', generateData);
    }
);
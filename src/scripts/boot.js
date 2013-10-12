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

require(
    [
        'app/common/lazy',
        'app/common/dom',
        'app/generation/articles',
        'app/generation/comments',
        'app/generation/image',
        'app/common/config'
    ],
    function (Lazy, DOM, Articles, Comments, Image, Config) {
        var lazy = new Lazy('app/data'),
            articles,
            comments;

        var initGenerators = function(corpus) {
            var d = $.Deferred();
            articles = new Articles(corpus.article, corpus.stat);
            comments = new Comments(corpus.comment, corpus.usernames);
            d.resolve(articles, comments);
            return d.promise();
        };

        var loadData = function() {
            DOM.$el.loading.show();
            lazy.get('corpus').then(function(corpus) {
                initGenerators(corpus).then(generateData);
            });
        };

        var generateData = function() {
            if(articles && comments) {
                Config.set();
                var article = articles.generateArticle(),
                    commentsTree = comments.generateTree(article.date);

                Image.getImage(article.header).then(function(data){
                    DOM.renderImage(data);
                });
                DOM.renderContent(article, commentsTree);
            } else {
                loadData();
            }
            return false;
        };

        DOM.$el.generateButton.on('click', generateData);
    }
);
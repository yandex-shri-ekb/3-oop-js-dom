define(function(require) {

    var Regexp = require('../common/regexp');

    var Statistics = function($articles) {
        this.init($articles);
    };

    Statistics.prototype = {
        getLength: function(arr) {
            return arr ? arr.length : 1;
        },

        init: function($articles) {
            var articles = $articles.map(function(i, el) {
                return $(el).text().replace(/\n\s*\n/g, '\n');
            });

            this.paragraphsCounts = [];
            this.termsCounts = [];
            this.articles = [];

            for(var i = 0, len = articles.length; i < len; i++) {
                var article = articles[i]
                  , paragraphs = this.getLength(article.match(Regexp.paragraphs))
                  , sentences = this.getLength(article.match(Regexp.endSentenceChar))
                  , terms = this.getLength(article.match(Regexp.terms))
                  ;

                this.articles.push({
                    p: paragraphs,
                    s: Math.ceil(sentences / paragraphs),
                    t: Math.ceil(terms / sentences)
                });
            }

            this.articlesLength = this.articles.length;
        },

        getArticle: function() {
            return this.articles[this.articlesLength * Math.random() | 0];
        }
    };

    return Statistics;

});
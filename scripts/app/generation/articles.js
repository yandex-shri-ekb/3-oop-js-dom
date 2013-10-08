define(function(require) {

    var Generator = require('./generator')
      , Statistics = require('./statistics')
      , Dates = require('../common/dates')
      ;

    var Articles = function($articles) {
        this.stat = new Statistics($articles);
        this.generator = new Generator($articles.text());
    };

    Articles.prototype = {
        generateArticle: function() {
            var articleStat = this.stat.getArticle();
            var article = {
                header: this.generator.generateText(1, 7),
                hubs: ['Веб-разработка', 'JavaScript'],
                paragraphs: [],
                date: Dates.getRandomDate()
            };

            for(var i = 0; i < articleStat.p; i++) {
                article.paragraphs.push(this.generator.generateText(articleStat.s));
            }

            return article;
        }
    };

    return Articles;

});
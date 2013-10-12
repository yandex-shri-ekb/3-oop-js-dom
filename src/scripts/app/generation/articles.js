define(function(require) {
    var Generator = require('./generator'),
        Dates = require('../common/dates'),
        Config = require('../common/config'),
        Common = require('../common/common');

    var Articles = function(corpus, stat) {
        this.stat = stat;
        this.generator = new Generator(corpus);
    };

    Articles.prototype = {
        generateArticle: function() {
            var articleStat = Common.getRandomElement(this.stat);
            var article = {
                header: this.generator.generateText(1, true, {
                    min: 3,
                    max: 10
                }),
                hubs: ['Веб-разработка', 'JavaScript'],
                paragraphs: [],
                date: Dates.getRandomDate()
            };

            var paragraphsCount = Config.useStatistics ? articleStat.p : Config.get('paragraphs');

            for(var i = 0; i < paragraphsCount; i++) {
                var sentencesCount = Config.useStatistics ? articleStat.s : Config.get('sentences');
                article.paragraphs.push(this.generator.generateText(sentencesCount));
            }

            return article;
        }
    };

    return Articles;
});
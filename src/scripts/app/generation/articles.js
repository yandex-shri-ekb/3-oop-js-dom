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
            var headersWords = { min: 3, max: 8 },
                articleStat = Common.getRandomElement(this.stat);

            var article = {
                header: this.generator.generateText(1, true, headersWords),
                hubs: ['Веб-разработка', 'JavaScript'],
                paragraphs: [],
                date: Dates.getRandomDate()
            };

            var paragraphsCount = Config.useStatistics ? articleStat.p : Config.get('paragraphs');

            for(var i = 0; i < paragraphsCount; i++) {
                var sentencesCount = Config.useStatistics ? articleStat.s : Config.get('sentences');
                var paragraph = {
                    header: i % 2 !== 0 && Config.useHeaders ? this.generator.generateText(1, true, headersWords) : '',
                    text: this.generator.generateText(sentencesCount)
                };
                article.paragraphs.push(paragraph);
            }

            return article;
        }
    };

    return Articles;
});
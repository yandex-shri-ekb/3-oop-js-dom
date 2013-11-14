define(function(require) {
    var Common = require('../common/common'),
        Config = require('../common/config'),
        Generator = require('./generator'),
        Dates = require('../common/dates');

    var Comments = function(corpus, usernames, date) {
        this.date = date || new Date();
        this.usernames = usernames;
        this.userCount = usernames.length;
        this.generator = new Generator(corpus);
    };

    Comments.prototype = {
        generateComment: function() {
            return {
                username: Common.getRandomElement(this.usernames, this.userCount),
                text: this.generator.generateText(),
                date: Dates.getRandomDate(this.date),
                comments: []
            };
        },

        generateTree: function(date) {
            date && (this.date = date);

            var comments = [],
                nodes = [comments],
                count = Config.get('comments');

            for (var i = 0; i < count; i++) {
                var comment = this.generateComment();
                Common.getRandomElement(nodes).push(comment);
                nodes.push(comment.comments);
                this.date = comment.date;
            }

            return {
                count: count,
                comments: comments
            };
        }
    };

    return Comments;
});
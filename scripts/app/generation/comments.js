define(function(require) {

    var Common = require('../common/common')
      , Generator = require('./generator')
      , Dates = require('../common/dates')
      ;

    var Comments = function($comments, date) {
        this.date = date || new Date();
        this.init($comments);
    };

    Comments.prototype = {
        init: function($comments) {
            var self = this;
            this.usernames = [];
            
            $('.username', $comments).each(function(i, el) {
                self.usernames.push(el.textContent);
            });

            /* Выдает слишком большие значения */

            // this.commentsCounts = [];
            // $comments.each(function(i, el) {
            //     var commentsCount = $('.comment', el).length; 
            //     commentsCount > 0 && self.commentsCounts.push(commentsCount);
            // });

            this.generator = new Generator($('.comment', $comments).text());
            this.usernamesCount = this.usernames.length;
        },

        generateComment: function() {
            return {
                username: this.usernames[this.usernamesCount * Math.random() | 0],
                text: this.generator.generateText(),
                date: Dates.getRandomDate(this.date),
                comments: []
            }
        },

        generateTree: function(date) {
            date && (this.date = date);

            var comments = []
              , nodes = [comments]
              , count = Common.getRandomArbitrary(20, 40) | 0;
              ;

            for (var i = 0; i < count; i++) {
                var comment = this.generateComment();
                nodes[nodes.length * Math.random() | 0].push(comment);
                nodes.push(comment.comments);
                this.date = comment.date;
            };

            return {
                count: count,
                comments: comments
            };
        }
    };

    return Comments;

});
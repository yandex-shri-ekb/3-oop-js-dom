/*jslint browser:true*/
/*global getRandomElement, getRandomElementByProbability, getRandomIntegerInRange*/
(function (window) {
    'use strict';

    var Comment = function (author, date, message) {
        this.author = author;
        this.date = date;
        this.message = message;
        this.replies = [];
    };

    Comment.prototype.addReply = function (comment) {
        this.replies.push(comment);
    };

    window.Writer = function (usernames, gComments, gArticles) {
        var config = {
            maxCommentLevel: 3,
            minFirstLevelCommentNumber: 10,
            maxFirstLevelCommentNumber: 20,
            replyProbability: {
                0: 0.5,
                1: 0.3,
                2: 0.1,
                3: 0.05,
                4: 0.05
            }
        };

        function getComment(options) {
            var comment = new Comment(
                    getRandomElement(usernames),
                    'an hour ago',
                    gComments.getText(options).map(function (article) {
                        return '<p>' + article + '</p>';
                    }).join('')
                ),
                repliesNumber = getRandomElementByProbability(
                    config.replyProbability
                ),
                i;

            for (i = 0; i < repliesNumber; i += 1) {
                comment.addReply(getComment(options));
            }

            return comment;
        }

        this.getCommentTree = function (options) {
            var commentNumber = getRandomIntegerInRange(
                    config.minFirstLevelCommentNumber,
                    config.maxFirstLevelCommentNumber
                ),
                comments = [],
                i;

            for (i = 0; i < commentNumber; i += 1) {
                comments.push(getComment(options));
            }

            return comments;
        };

        this.getArticleText = function (options) {
            return gArticles.getText(options).map(function (article) {
                return '<p>' + article + '</p>';
            });
        };

        this.getArticleHeader = function (options) {
            return gArticles.getSentence(options);
        };
    };
}(this));
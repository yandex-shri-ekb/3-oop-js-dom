/*jslint browser:true*/
/*global getRandomElement, getRandomElementByProbability, getRandomIntegerInRange*/
(function () {
    'use strict';

    var Comment, Comments;

    Comment = function (author, date, message) {
        this.author = author;
        this.date = date;
        this.message = message;
        this.replies = new Comments();
    };

    Comment.prototype.addReply = function (comment) {
        this.replies.push(comment);
    };

    Comments = function () {
        return undefined;
    };

    Comments.prototype = [];

    Comments.prototype.getNumber = function () {
        return this.length + this.reduce(function (length, comment) {
            return length + comment.replies.getNumber();
        }, 0);
    };

    window.Writer = function (usernames, gComments, gArticles) {
        var config = {
            maxCommentLevel: 3,
            minFirstLevelCommentNumber: 5,
            maxFirstLevelCommentNumber: 23,
            replyProbability: {
                0: 0.5,
                1: 0.3,
                2: 0.1,
                3: 0.05,
                4: 0.05
            }
        };

        function getComment() {
            var comment = new Comment(
                    getRandomElement(usernames),
                    'an hour ago',
                    gComments.getText().map(function (article) {
                        return '<p>' + article + '</p>';
                    }).join('')
                ),
                repliesNumber = getRandomElementByProbability(
                    config.replyProbability
                ),
                i;

            for (i = 0; i < repliesNumber; i += 1) {
                comment.addReply(getComment());
            }

            return comment;
        }

        this.getCommentTree = function () {
            var commentNumber = getRandomIntegerInRange(
                    config.minFirstLevelCommentNumber,
                    config.maxFirstLevelCommentNumber
                ),
                comments = new Comments(),
                i;

            for (i = 0; i < commentNumber; i += 1) {
                comments.push(getComment());
            }

            return comments;
        };

        this.getArticleText = function () {
            return gArticles.getText().map(function (article) {
                return '<p>' + article + '</p>';
            });
        };

        this.getArticleHeader = function () {
            return gArticles.getSentence();
        };
    };
}());
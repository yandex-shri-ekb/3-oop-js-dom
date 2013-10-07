window.HabraParser = function (text) {
    var cache = {};

    this.usernames = function () {
        if (!('usernames' in cache)) {
            cache.usernames = [];

            text.find('.username').each(function () {
                var username = $(this).text();

                if (cache.usernames.indexOf(username) === -1) {
                    cache.usernames.push(username);
                }
            });
        }

        return cache.usernames;
    };

    this.comments = function () {
        if (!('comments' in cache)) {
            cache.comments = text.find('.message').map(function () {
                return $(this).html().trim();
            }).get();
        }

        return cache.comments;
    };

    this.articles = function () {
        if (!('articles' in cache)) {
            cache.articles = text.find('article').map(function () {
                return $(this)
                           .clone()
                           .find('.comments')
                           .remove()
                           .end()
                           .html()
                           .trim();
            }).get();
        }

        return cache.articles;
    };
};

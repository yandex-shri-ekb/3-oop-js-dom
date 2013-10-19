importScripts(
    'utils.js',
    'dictionary.js',
    'writer.js',
    'garry.js'
);

self.onmessage = function(e) {
    var settings = e.data.settings,
        gArticles = new Garry().eat(e.data.articles),
        gComments = new Garry().eat(e.data.comments),
        writer = new Writer(e.data.usernames, gComments, gArticles);

    self.postMessage({
        header: writer.getArticleHeader(),
        text: writer.getArticleText(settings),
        comments: writer.getCommentTree({
            paragraphs: {perArticle: {min: 1, max: 3}},
            sentences: {perParagraph: {min: 1, max: 5}},
            words: {perSentence: {min: 3, max: 6}}
        })
    });
};
importScripts(
    'utils.js',
    'dictionary.js',
    'writer.js',
    'garry.js'
);

var gArticles,
    gComments,
    writer;

self.onmessage = function(e) {
    switch (e.data.action) {
        case 'prepareDictionary':
            gArticles = new Garry().eat(e.data.articles);
            gComments = new Garry().eat(e.data.comments);
            writer = new Writer(e.data.usernames, gComments, gArticles);

            self.postMessage({ action: 'dictionaryPrepared' });
            break;
        case 'generateArticle':
            self.postMessage({
                action: 'articleGenerated',
                header: writer.getArticleHeader(),
                text: writer.getArticleText(e.data.settings),
                comments: writer.getCommentTree({
                    paragraphs: {perArticle: {min: 1, max: 3}},
                    sentences: {perParagraph: {min: 1, max: 5}},
                    words: {perSentence: {min: 3, max: 6}}
                })
            });
    }
};
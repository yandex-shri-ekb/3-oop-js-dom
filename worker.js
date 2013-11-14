"use strict";

importScripts('UltimateTextGenerator.js');

var _generator = new UltimateTextGenerator();

var _nicknames = [];

self.onmessage = function(event) {

    var o = JSON.parse(event.data),
        text;

    switch (o.cmd) {
        case 'addHtml':
            text = parseHtml(o.args[0]);
            _generator.add(text);
            break;
        case 'add':
            _generator.add(o.args[0]);
            break;
        case 'generatePost':
            text = generatePost.apply(null, o.args);
            sendData(text, o.id);
            break;
        case 'generateSentence':
            text = _generator.generateSentence.apply(_generator, o.args);
            sendData(text, o.id);
            break;
        case 'addNicknames':
            _nicknames = o.args[0];
            break;
        case 'generateComments':
            var _creator = new CommentCreator(o.args[2], o.args[3], o.args[4], o.args[5]);
            var comments = _creator.generateComments(o.args[0], o.args[1]);
            sendData(comments, o.id);
            break;
        default:
            sendError('Unknown command: ' + o.cmd, o.id);
    }
};

function send(o) {
    self.postMessage(JSON.stringify(o));
}

function sendData(data, id) {
    send({data: data, id: id});
}

function sendMessage(message, id) {
    send({message: message, id: id});
}

function sendError(error, id) {
    send({error: error, id: id});
}


/**
 * @param {int} min
 * @param {int} max
 * @return int
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePost(p1, p2, s1, s2, w1, w2) {
    var p = 0,
        newText = '',
        nParagraph = randomInt(p1, p2);

    while(p++ < nParagraph) {
        newText += generatePostText(randomInt(s1, s2), w1, w2);

        if(p !== nParagraph) {
            newText += '<br><br>';
        }
    }

    return newText;
}

function generatePostText(nSentence, w1, w2) {
    var nWords, text = '';
    for(var s = 0; s < nSentence; s++) {
        nWords = randomInt(w1, w2);
        text += ' ' + _generator.generateSentence(nWords, '.', false, true, 3);
    }

    return text;
}

function parseHtml(html) {
    return html
        .toLowerCase()
        // табы
        .replace(/\t+/g, ' ')
        // переносы строк
        .replace(/\r?\n|\r/g, ' ')
        // теги
        .replace(/<\/?[^<]*?>/g, '')
        .trim();
}

function getRandomNickname() {
    return _nicknames[randomInt(0, _nicknames.length - 1)];
}

var CommentCreator = function(_s1, _s2, _w1, _w2) {

    this.generateComments = function(nComments, publishDateInt) {
        var comments = [], date = new Date(publishDateInt), comment, commentData;
        for(var i = 0; i < nComments; i++) {
            commentData = generateComment(date, 1);
            date = commentData[0];
            comment = commentData[1];
            comments.push(comment);
        }

        return comments;
    };

    function generateComment(minDate, lvl) {
        var text = generateCommentText(randomInt(1, 4));
        var date = new Date(minDate.getTime() + randomInt(0, 60) * 60000);
        var nickname = getRandomNickname();

        var comment = new Comment(text, date, nickname);

        if(Math.random() < (1 - lvl * 0.2)) {
            var childData, i;
            var n = (3 - lvl) < 1 ? 1 : randomInt(1, 3 - lvl);
            for(i = 0; i < n; i++) {
                childData = generateComment(date, lvl + 1);
                comment.comments.push(childData[1]);
            }
        }

        return [date, comment];
    }

    function generateCommentText(nSentence) {
        var nWords, text = '';
        nSentence = randomInt(1, _s2);
        for(var s = 0; s < nSentence; s++) {
            nWords = randomInt(_w1, _w2);
            text += ' ' + _generator.generateSentence(nWords, '.', false, true, 3);
        }

        return text;
    }

};

var Comment = function(text, date, nickname) {
    this.text = text;
    this.date = date;
    this.nickname = nickname;
    this.comments = [];
};

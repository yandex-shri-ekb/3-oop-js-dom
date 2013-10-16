"use strict";

importScripts('UltimateTextGenerator.js');

var _generator = new UltimateTextGenerator();

self.onmessage = function(event) {

    var o = JSON.parse(event.data),
        text;

    switch (o.cmd) {
        case 'add':
            _generator.add.apply(_generator, o.args);
            break;
        case 'generatePost':
            text = generatePost.apply(null, o.args);
            sendData(text, o.id);
            break;
        case 'generateSentence':
            text = _generator.generateSentence.apply(_generator, o.args);
            sendData(text, o.id);
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
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePost(p1, p2, s1, s2, w1, w2) {
    var p = 0,
        newText = '',
        nParagraph = getRandomInt(p1, p2);

    while(p++ < nParagraph) {
        newText += generatePostText(getRandomInt(s1, s2), w1, w2);

        if(p !== nParagraph) {
            newText += '<br><br>';
        }
    }

    return newText;
}

function generatePostText(nSentence, w1, w2) {
    var nWords, text = '';
    for(var s = 0; s < nSentence; s++) {
        nWords = getRandomInt(w1, w2);
        text += ' ' + _generator.generateSentence(nWords, '.', false, true, 3);
    }

    return text;
}
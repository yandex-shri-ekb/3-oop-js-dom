define(function() {
    return {
        unnecessaryСhars: /[\n\[\]\(\)]/g,
        terms: /(\s(([\wа-я])|(\b[.:'-]\b))+)|[.,:!;?]/g,
        repetitiveChars: /([!?.,:-])[!?.,:-]+/g,
        endSentenceChar: /[.!?]/g,
        word: /\s[\wа-я]+\s/,
        paragraphs: /(\n|^).*?(?=\n|$)/g,
        punctuation: /[!?.,:;]/g,
    };
});
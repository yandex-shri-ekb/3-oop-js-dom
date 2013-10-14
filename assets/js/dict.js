/* Хотел все переписать на чистый JS, но не успел */
var Helper = (function() {

    function Helper() {}
        Helper.getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
    return Helper;

})();

var Dict = function() {

    this.dict = {};

    this.keys = [];
    this.currentPrefix = [];
    this.isValid = true;
};

// return last word of current prefix
Dict.prototype.current = function() {
    return this.currentPrefix[this.currentPrefix.length - 1];
};

// updates the current prefix to next
Dict.prototype.next = function() {
    if (!this.isValid) return;

    var prefix   = this.currentPrefix.join(' ');
    var suffixes = this.dict[prefix];

    if (suffixes === undefined) {
       this.isValid = false;
    } else {
        var suffix = suffixes[Helper.getRandomInt(0, suffixes.length-1)];
        this.currentPrefix.shift();
        this.currentPrefix.push(suffix);

        if (this.isValid === false)
            this.isValid = true;
    }

};

// adds words and prefixs
Dict.prototype.add = function(words, npref) {
    for (var i = 0; i < words.length - npref; i++) {

        var prefix = words[i];
        for (var j = 1; j < npref; j++) {
            prefix += ' ' + words[i + j];
        }
        var suffix = words[i + j];

        if (this.dict[prefix] === undefined)
            this.dict[prefix] = [suffix];
        else
            this.dict[prefix].push(suffix);
    }
};

// updates current prefix
Dict.prototype.shuffle = function() {
    var keys = this.getKeys(this.dict);
    do {
        var prefix = keys[Helper.getRandomInt(0, keys.length - 1)];
    } while (prefix.match(/.,:[!?]/));
    this.currentPrefix = prefix.split(' ');
    this.isValid = true;
};

// returns keys of object
Dict.prototype.getKeys = function(obj) {
    if (Object.keys)
        return Object.keys(obj);
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            keys.push(key);
    }
    return keys;
};
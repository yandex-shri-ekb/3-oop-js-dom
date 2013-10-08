define(function() {

    var Term = function(link, suffix) {
        this.link = link;
        this.suffixes = [suffix];
    };

    Term.prototype.getRandomSuffix = function() {
        return this.suffixes[this.suffixes.length * Math.random() | 0];
    };

    return Term;

});
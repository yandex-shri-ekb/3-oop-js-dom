define(function(require) {
    var Common = require('../common/common');
    
    var Term = function(link, suffix) {
        this.link = link;
        this.suffixes = [suffix];
    };

    Term.prototype.getRandomSuffix = function() {
        return Common.getRandomElement(this.suffixes);
    };

    return Term;
});
define(function() {
    var Lazy = function(type) {
        this.path = type + '/';
    };

    Lazy.prototype.get = function() {
        var d = $.Deferred(),
            self = this,
            modules = Array.prototype.slice.call(arguments);

        modules = modules.map(function(module) {
            return self.path + module;
        });

        require(modules, function() {
            d.resolve.apply(d, arguments);
        });

        return d.promise();
    };

    return Lazy;
});
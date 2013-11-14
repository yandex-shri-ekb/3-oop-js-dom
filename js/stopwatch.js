(function (window) {
    'use strict';

    window.Stopwatch = function () {
        var initTime = +new Date(),
            tapTime = initTime;

        this.tap = function () {
            var currentTime = +new Date(),
                sinceLastTap = currentTime - tapTime;

            tapTime = currentTime;

            return sinceLastTap;
        };
    };
}(this));
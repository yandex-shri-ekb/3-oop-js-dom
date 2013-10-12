define(function() {
    return {
        getRandomArbitrary: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        getRange: function(value, amplitude) {
            return {
                min: +value - (+amplitude),
                max: +value + (+amplitude)
            };
        },

        getRandomElement: function(array, arrayLength) {
            arrayLength || (arrayLength = array.length);
            return array[arrayLength * Math.random() | 0];
        }
    };
});
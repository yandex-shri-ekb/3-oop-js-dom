define(function() {

    return {
        config: {
            minWords: 8,
            maxWords: 50
        },

        getRandomArbitrary: function(min, max) {
            return Math.random() * (max - min) + min;
        }
    }
    
});
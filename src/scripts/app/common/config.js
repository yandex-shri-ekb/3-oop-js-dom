define(function(require) {
    var $ = require('jquery'),
        Common = require('./common'),
        DOM = require('./dom');

    var $elements = {
        useStatistics: $('#settings_use-statistics'),
        paragraphs: $('#settings_paragraphs'),
        sentences: $('#settings_sentences'),
        words: $('#settings_words'),
        comments: $('#settings_comments'),
    };

    var toggleRangesState = function(ranges) {
        var $ranges = $(ranges);
        $ranges.toggleClass('settings_range-disabled');
        $ranges.children('.settings_range_control').prop('disabled', function(i, v) {
            return !v;
        });
    };

    var ranges = ['paragraphs', 'sentences', 'words', 'comments'];

    DOM.$el.body.on('change', '.settings_range_control', function() {
        var $this = $(this),
            range = Common.getRange($this.val(), $this.data('amplitude'));

        $this.next().text(range.min + ' - ' + range.max);
    });

    $elements.useStatistics.on('change', function() {
        toggleRangesState('#paragraphs_range, #sentences_range');
    });

    return {
        get: function(param) {
            return Common.getRandomArbitrary(this[param].min, this[param].max) | 0;
        },
        set: function() {
            var self = this;

            self.useStatistics = $elements.useStatistics.prop('checked');
            ranges.forEach(function(v) {
                self[v] = Common.getRange($elements[v].val(), $elements[v].data('amplitude'));
            });
            return self;
        }
     };
});
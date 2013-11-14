(function ($) {

    // @see http://stackoverflow.com/a/1186309
    $.fn.serializeObject = function () {
        var o = {},
            a = this.serializeArray();

        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });

        return o;
    };

    $.fn.render = function (data) {
        var tpl = $(this).html(),
            i;

        for (i in data)  {
            if (data.hasOwnProperty(i)) {
                tpl = tpl.replace(new RegExp('{' + i + '}', 'g'), data[i]);
            }
        }

        return $(tpl);
    };
}(jQuery));
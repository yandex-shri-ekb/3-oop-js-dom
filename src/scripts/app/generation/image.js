define(function() {
    return {
        getImage: function(query) {
            return $.ajax('https://ajax.googleapis.com/ajax/services/search/images', {
                crossDomain : true,
                data: {
                    v: '1.0',
                    rsz: 1,
                    q: query
                },
                dataType: 'jsonp'
            }).then(function(data) {
                var response = data.responseData ? data.responseData.results[0] : {};
                return $('<img>', {
                    src: response.url,
                    width: response.width < 600 ? response.width : 600,
                    alt: response.titleNoFormatting,
                });
            });
        }
    } 
});
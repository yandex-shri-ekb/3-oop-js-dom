// Обработка обычного текста,
// именно обычного, код на языках программирования ей передавать не стоит
// ПО ЗАДАНИЮ: Точка, запятая, двоеточие, вопросительный и восклицательный знаки считаются словами.
//             Все остальные знаки препинания отбрасываются.
var cleanText = function(text) {

    // Удаляем всякие адреса в интернете
    text = text.replace(/(?:(?:https?|ftp):\/\/)*(?:www.|ftp.)*[А-я\w.-]+\.[A-z]{2,4}/gi, '');

    // Заменяем несколько знаков препинания на один
    text = text.replace(/([!?.,:-])[!?.,:-]+/g, '$1');

    // Удаляем html-сущности
    text = text.replace(/&\w+;|&#\d+;/g, ' ');

    // Дефис может быть в составе слова, а может использоваться вместо тире
    // удаляем дефисы, если они используются вместо тире
    text = text.replace(/\s+-+\s+/g, ' ');

    // Так как по заданию . , : ? ! считаются за слова, отделим их пробелами
    text = text.replace(/(\s*[!?.,:])/g, ' $1 ');

    // Удаляем все теги
    text = text.replace(/<\/?[^>]+>/g, '');

    // Если перед переводом строки \n не стоят точка, вопросительный или восклицательный знаки, значит надо поставить
    // Например, часто знаки не стоят в подзаголовках
    text = text.replace(/([A-zА-яёЁ0-9][^!?.])\n/g, '$1 .\n')

    // Удаляем все символы, кроме букв, цифр и некоторых знаков препинания
    text = text.replace(/[^A-zА-яёЁ0-9 !?.,:-]/g, ' ');

    // Все повторяющиеся пробельные символы, преобразуем в один пробел
    text = text.replace(/\s+/g, ' ');

    // Заглавные буквы, с которых начинаются предложения, переводим в строчные.
    // С точки зрения производительности, наверное, лучше было бы использовать toLowerCase(),
    // но хочется оставить в тексте побольше имён собственных
    text = text.replace(/(?:^|[!?.]) [A-ZА-ЯЁ]/g, function(result) {
        return result.toLowerCase();
    });

    // Раскрываем сокращения
    text = text.replace(/(т . е .|т . к .|т . п .|т . д .|т . о .)/g, function(result) {
        switch (result) {
            case 'т . е .':
                return 'то есть';
            case 'т . к .':
                return 'так как';
            case 'т . п .':
                return 'тому подобное';
            case 'т . д .':
                return 'так далее';
            case 'т . о .':
                return 'таким образом';
        }
    });

    return text;
}

var add = function(words, npref) {
    var output = {};

    for (var i = 0; i < words.length - npref; i++) {

        // собираем префикс из npref слов
        var prefix = words[i];
        for (var j = 1; j < npref; j++) {
            prefix += ' ' + words[i + j];
        }
        // находим ему суффикс
        var suffix = words[i + j]; // j == npref

        // добавляем в словарь
        if (output[prefix] === undefined)
            output[prefix] = [suffix];
        else
            output[prefix].push(suffix);
    }

    return output;
}

var onmessage = function(e) {
    postMessage({
        articles : add(cleanText(e.data.articles).split(' '), e.data.npref),
        comments : add(cleanText(e.data.comments).split(' '), e.data.npref)
    });
}

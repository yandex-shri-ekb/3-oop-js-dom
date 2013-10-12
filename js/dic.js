'use strict';

var Dic = function() {
    // Здесь хранится словарь
    this.dic = {
        // 'префикс из npref слов' : ['суффикс1', 'суффикс2', etc...]
    };

    // Текущий префикс
    // (массив слов, склеивается пробелом при надобности)
    this.currentPrefix = [];
}


// Возвращает последнее слово в текущем префиксе
Dic.prototype.current = function() {
    // return this.currentPrefix.join(' ');
    return this.currentPrefix[this.currentPrefix.length - 1];
}

// Возвращает состояние словаря
Dic.prototype.valid = function() {
    return !! this.currentPrefix;
}

// Переход к следующему префиксу, при этом метод возвращает текущий
Dic.prototype.next = function () {
    if ( ! this.valid()) return;

    // получаем текущий префикс и массив его суффиксов
    var prefix = this.currentPrefix.join(' ');
    var suffixes = this.dic[prefix];

    if (suffixes === undefined) {
        this.currentPrefix = false;
    } else {
        // выбираем случайный суффикс
        var suffix = suffixes[randomInt(0, suffixes.length - 1)];
        // собираем новый префикс
        this.currentPrefix.shift();
        this.currentPrefix.push(suffix);
    }
}

// Добавляем пары префис-суффикс в словарь
Dic.prototype.add = function(words, npref) {
    for (var i = 0; i < words.length - npref; i++) {

        // собираем префикс из npref слов
        var prefix = words[i];
        for (var j = 1; j < npref; j++) {
            prefix += ' ' + words[i + j];
        }
        // находим ему суффикс
        var suffix = words[i + j]; // j == npref

        // добавляем в словарь
        if (this.dic[prefix] === undefined)
            this.dic[prefix] = [suffix];
        else
            this.dic[prefix].push(suffix);
    }
}

// Устанавливает текущий префикс на случайный из словаря и возвращает его
Dic.prototype.reset = function() {
    // массив из имён свойств объекта
    var tmp = this._keys(this.dic);

    // выбираем случайное свойство, где содержится префикс
    // нам нужен префикс без знаков препинания
    do {
        var prefix = tmp[randomInt(0, tmp.length - 1)];
    } while (prefix.match(/[!?.,:]/))
    // делаем найденный префикс текущим
    this.currentPrefix = prefix.split(' ');
}

// Возвращает массив из имён свойств объекта
Dic.prototype._keys = function(obj) {
    if (Object.keys)
        return Object.keys(obj);
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
}

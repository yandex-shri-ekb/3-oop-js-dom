/* Хотел все переписать на чистый JS, но не успел */

/*
 * @Helper
 *
 * Реализует отсутствующие функции JS
 */
var Helper = (function() {

    function Helper() {}
        // Возвращает случайное число
        // Аналог @public static функции
        Helper.getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
    return Helper;

})();

/*
* @Dict
*
* Класс-итератор
* Используется для реализации алгоритма "Цепи Маркова"
*/
var Dict = function() {

    this.dict = {};

    this.keys = [];
    this.currentPrefix = [];
    this.isValid = true;
};

// Возвращает текущее слово-префикс
Dict.prototype.current = function() {
    return this.currentPrefix[this.currentPrefix.length - 1];
};

// Переходит к следующему префиксу
Dict.prototype.next = function() {
    if (!this.isValid) return;

    var prefix   = this.currentPrefix.join(' ');
    var suffixes = this.dict[prefix];

    if (suffixes === undefined) {
       this.isValid = false;
    } else {
        var suffix = suffixes[Helper.getRandomInt(0, suffixes.length-1)];
        this.currentPrefix.shift();
        this.currentPrefix.push(suffix);

        if (this.isValid === false)
            this.isValid = true;
    }
};

// Добавляет слова, с разделением по префиксу, равному npref
Dict.prototype.add = function(words, npref) {
    for (var i = 0; i < words.length - npref; i++) {

        var prefix = words[i];
        for (var j = 1; j < npref; j++) {
            prefix += ' ' + words[i + j];
        }
        var suffix = words[i + j];

        if (this.dict[prefix] === undefined)
            this.dict[prefix] = [suffix];
        else
            this.dict[prefix].push(suffix);
    }
};

// Обновляет текущий префикс на случайный
Dict.prototype.shuffle = function() {
    var keys = this.getKeys(this.dict);
    do {
        var prefix = keys[Helper.getRandomInt(0, keys.length - 1)];
    } while (prefix.match(/.,:[!?]/));
    this.currentPrefix = prefix.split(' ');
    this.isValid = true;
};

// Возвращает keys объекта
Dict.prototype.getKeys = function(obj) {
    if (Object.keys)
        return Object.keys(obj);
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            keys.push(key);
    }
    return keys;
};
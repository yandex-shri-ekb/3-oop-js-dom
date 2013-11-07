/**
 * Бредогенератор. Сборка словаря
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [dictionarys собираем словарь, опираясь на цепи маркова]
 * @param  {[array]}  array [массив из которого нужно собрать словарь]
 * @param  {[number]} npref [число слов в префиксе]
 * @return {[array]}        [словарь]
 */
function dictionarys(array, npref) {
    var dictionary  = []; // словарь
    var arrayLength = array.length; // длина входного массива

    for (var i = 0; i < arrayLength - npref; i++) {
        var prefix = array[i]; // добавляем первое слова в перфикс
        for (var j = 1; j < npref; j++) {
            prefix += ' ' + array[i + j]; // добавляем еще слова в префикс
        }

        var suffix = array[i + j]; // находим суффикс для данного префикса

        // добавляем префикс и суфикс в словарь
        if (dictionary[prefix] === undefined) {
            dictionary[prefix] = [suffix];
        } else {
            dictionary[prefix].push(suffix);
        }
    }
    flagNpref = npref;

    return (dictionary);
}
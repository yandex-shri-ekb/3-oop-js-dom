/**
 * Бредогенератор. Дополнительные функции
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

/**
 * [randomizer генератор случайных целых чисел]
 * @param  {[number]} min [минимальное значение]
 * @param  {[number]} max [максимальное значение]
 * @return {[number]}     [случайное число между min и max]
 */
function randomizer(min, max) {
    return ((Math.floor(Math.random() * (Number(max) - Number(min) + 1))) + Number(min));
}

/**
 * [indexDictionary генератор вспомогательного индексового массива для словаря]
 * @param  {[array]} dictionary [словарь]
 * @return {[array]}            [проидексированный массив, где value = dictionary[key]]
 */
function indexDictionary(dictionary) {
    var indexArray = [];
    
    for (key in dictionary) {
        indexArray.push(key);
    }
    return indexArray;
};

/**
 * [capitaliseFirstLetter делаем первую букву в слове с большой буквы]
 * @param  {[string]} text [словосочетание, где все буквы написаны в нижнем регистре]
 * @return {[string]}      [словосочетание, где первая уква в верхнем регистре]
 */
function capitaliseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * [collocation получение случайного словосочетания]
 * @param  {[array]} indexDictionary [индексированный массив словаря]
 * @param  {[number]} dictionarySize [размер словаря]
 * @return {[string]}                [случайное словосочетание из массива = случайное value в indexDictionary]
 */
function collocation(indexDictionary, dictionarySize) {
    var newCollocation = '';

    do {
        newCollocation = indexDictionary[randomizer(0, dictionarySize)];
    } while((newCollocation.search(/[.,;:!\?]+/g)+1));
                    
    return newCollocation.split(' '); 
}

/**
 * [randomCode получение случайного отрывок кода]
 * @param  {[string]} language [язык программирования для которого нужно подобрать случайный отрывок кода]
 * @return {[string]}          [случайный отрывок кода на указанном языке]
 */
function randomCode(language) {
    var language       = codeArr[language];
    var languageLength = language.length - 1;
    
    return language[randomizer(0, languageLength)]
}

/**
 * [randomUser получение логина случайного пользователя]
 * @return {[string]} [логин пользователя]
 */
function randomUser() {
    var randomUserId = randomizer(0, usernameArrSize); // генерируем случайный id пользователя из массива

    return usernameArr[randomUserId]
}

/**
 * [randomDate получение случайной даты]
 * @param  {[object]} start [начальная дата]
 * @param  {[object]} end   [конечная дата]
 * @return {[object]}       [случайная дата между начальной и конечной датами]
 */
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * [getHabraDate приведение даты в читаемый хабра-вид]
 * @param  {[object]} date [дата, которую надо преобразовать]
 * @return {[string]}      [преобразованная, читаемая дата хаьра-вида]
 */
function getHabraDate(date) {
    var months  = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    var hourse  = date.getHours();
    var minutes = date.getMinutes();
    
    if ((hourse/10) < 1) {
        hourse = '0' + hourse;
    }
    if ((minutes/10) < 1) {
        minutes = '0' + minutes;
    }

    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' в ' + hourse + ':' + minutes;
}

/**
 * [getNewDateComment получение новой даты для гененрации комментариев]
 * @param  {[object]} date [дата, которую надо преобразовать]
 * @return {[object]}      [преобразованная дата]
 */
function getNewDateComment(date) {
    var newDate = new Date(); 
    newDate.setTime(date.getTime() + 700000);
    return newDate;
}
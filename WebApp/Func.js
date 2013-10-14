/**
 * Created by egortrubnikov on 14.10.13.
 */
/**
 * Озаглавливание первой буквы в строке
 * @return {string}
 */
String.prototype.UpperCaseOne = function ()
{
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};

/**
 * Выбирает случайный элемент из массива и возвращает его
 * @param {Array}
 */
var select = function (a)
{
  try {
    return a[Math.floor(a.length * Math.random())];
  } catch (e) {
    return false;
  }
};

/**
 * Удаление пустых строк из массива предложений
 * используется как-то так: Array.filter(removeVoid)
 * @return {boolean}
 */
function removeVoid(a)
{
  return a != "";
}

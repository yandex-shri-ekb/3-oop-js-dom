/**
 * Created by egortrubnikov on 13.10.13.
 */

/**
 * Функция построения слваря
 * @param {Array}
 * @return {Object}
 **/
var Dictonary = function (Arr)
{
  var Obj = {}, par;
  Arr.reduce(function (a, b, c)
  {
    1 != c && (Obj.hasOwnProperty(par) ? Obj[par].push(b) : Obj[par] = [b]);
    par = [a, b].join(" ");
    return b
  });
  return Obj
};

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
  var i = Math.floor(a.length * Math.random());
  return a[i];
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

var $text = $("#kant").text(), $bred = $("#bred"), // Наши контейнеры с текстом
  text = $text.toLowerCase().split("\n").join(" ").split(",").join(" , ").split("!").join(" ! ").split("?").join(" ? ").split(":").join(" : ").split(". ").join(" . ").split(" ").filter(removeVoid); // быстрее регулярок

/**
 * Генерирует предложение по словарю.
 * @param {Array, number}
 * @return {string}
 */
var make_text = function (text, min_length)
{
  var Title = [], Dic = Dictonary(text), List = Object.keys(Dic), // ослики < 9 в пролёте
    Start = (function find()
    {
      var s = select(List);
      //    if () {
      return s;
      //    } else {
      //      return find();
      //    }
    }());
  var st = Start;
  Title.push(st);
  Title = Title[0].split(" ");
  for (var i = 0; i < min_length; i++) {
    //    console.log(Dic[st]);
    st = select(Dic[st]);
    Title.push(st);
    if (st == ".") {
      break
    }
    st = [Title[Title.length - 2], Title[Title.length - 1]].join(" ");
  }

  console.log(Title.join(" ").UpperCaseOne());
};

$('#generate').on('click', function ()
{
  var kol = 20; // сколько текста
  var title = make_text(text, kol + Math.floor(kol * Math.random()));
  //  $bred.html(title.UpperCaseOne());
});
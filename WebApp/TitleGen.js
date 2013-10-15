/**
 * Created by egortrubnikov on 15.10.13.
 */
/**
 * Генерирует предложение по словарю.
 * @return {string}
 * @param text
 * @param min_length
 * @param Dic
 * @param List
 */
var make_text = function (text, min_length, Dic, List)
{
  var temp = function b() // выбираем первые слова без знаков
  {
    var a = select(List);
    return /[\.,;:?!—]/g.test(a) ? b() : a
  }(), Title = temp.split(" ");

  for (var i = 0; i < min_length; i++) {
    temp = select(Dic[temp]);
    Title.push(temp);
    if (/[\.?!]/g.test(temp)) {
      break;
    }
    i == min_length - 1 && Title.push("."); // мега конструкция работает как условие но короче и быстрее
    temp = [Title[Title.length - 2], Title[Title.length - 1]].join(" ")
  }
  return Title.join(" ").replace(/\s(?=[\.,;:?!])/g, "").UpperCaseOne();
};
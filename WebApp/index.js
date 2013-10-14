/**
 * Created by egortrubnikov on 13.10.13.
 */

var
  Dic = Dictonary(text), // Словарь
  List = Object.keys(Dic); // Ключи к словарю (ослики < 9 в пролёте)

$('#generate').on('click', function ()
{
  console.time("Время генерации предложения");
  var kol = 50; // сколько текста
  console.log(make_text(text, (kol + Math.floor(kol * Math.random())), Dic, List))
  console.timeEnd("Время генерации предложения");
});

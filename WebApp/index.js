/**
 * Created by egortrubnikov on 13.10.13.
 */
console.time("Общее время");
var SEt = {
  s_title: 8,
  s_text: 50,
  s_mess: 20,
  abzac: 5,
  kol_a: 10
}

$bred.find(".username").map(function ()
{
  return $(this).text(select($user))
});
$bred.find(".user_name").map(function ()
{
  return $(this).text(select($user))
});
var D_title = Dictonary(title), K_title = Object.keys(D_title);
$bred.find(".post_name").map(function ()
{
  return $(this).text(make_text(text, Math.floor(SEt.s_title * Math.random()), D_title, K_title))
});
$bred.find(".grey").map(function ()
{
  return $(this).text(make_text(text, Math.floor(SEt.s_title * Math.random()), D_title, K_title))
});
$bred.find(".post_title").text(make_text(text, Math.floor(SEt.s_title * Math.random()), D_title, K_title));
var D_mess = Dictonary(masseges), K_mess = Object.keys(D_mess);
$bred.find(".message").map(function ()
{
  return $(this).text(make_text(text, Math.floor(SEt.s_mess * Math.random()), D_mess, K_mess))
});

var Dic = Dictonary(text), // Словарь
  List = Object.keys(Dic); // Ключи к словарю (ослики < 9 в пролёте)

console.time("Время генерации самой статьи");

var HTML = [];

for (var i = 0; i < SEt.kol_a; i++) {
  for (var е = 0, j = 3 + Math.floor(SEt.abzac * Math.random()); е < j; е++) {
    HTML.push(make_text(text, (Math.floor(SEt.s_text * Math.random())), Dic, List))
  }
  HTML.push(" <br><br> ");
}
$bred.find(".content").prepend(HTML.join(" "));

console.timeEnd("Время генерации самой статьи");

$("body").html($bred.children().show());

console.timeEnd("Общее время");
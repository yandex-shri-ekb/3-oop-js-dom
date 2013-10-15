/**
 * Created by egortrubnikov on 15.10.13.
 */
console.time("Время сбора ресурсов");

var $habr = $("<div>").append($("#habr").remove());
$habr.find("a").remove();
$habr.find("br").remove();
$habr.find("ul").remove();
$habr.find("table").remove();
var $h1 = $.makeArray($habr.find("h1").remove()).map(GetText).filter(removeVoid);
var $h2 = $.makeArray($habr.find("h2").remove()).map(GetText).filter(removeVoid);
var $h3 = $.makeArray($habr.find("h3").remove()).map(GetText).filter(removeVoid);
var $h4 = $.makeArray($habr.find("h4").remove()).map(GetText).filter(removeVoid);
var $h5 = $.makeArray($habr.find("h5").remove()).map(GetText).filter(removeVoid);
var $h6 = $.makeArray($habr.find("h6").remove()).map(GetText).filter(removeVoid);
var title = texto($h1.concat($h2, $h3, $h4, $h5, $h6).join(" "));
var $user = $.makeArray($habr.find(".username").remove()).map(GetText).filter(removeVoid);
var $message = $.makeArray($habr.find(".message").remove()).map(GetText).filter(removeVoid);
var $pre = $.makeArray($habr.find("pre").remove());
$habr.find(".comments").remove();

var masseges = $message.join(" ").split("\n").filter(removeVoid).filter(function (a)
{
  return 50 < a.length
}).join(" ").toLowerCase().replace(/[\.,;:?!](?=\s)/g, " $& ").replace(/[\(\)\[\]]/g, "").split(" ").filter(removeVoid);

var text = $habr.text().split("\n").filter(removeVoid).filter(function (a)
{
  return 50 < a.length
}).join(" ").toLowerCase().replace(/[\.,;:?!](?=\s)/g, " $& ").replace(/[\(\)\[\]]/g, "").split(" ").filter(removeVoid);

var $bred = $("<div>").append($("#bred").remove());

console.timeEnd("Время сбора ресурсов");

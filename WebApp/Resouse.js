/**
 * Created by egortrubnikov on 15.10.13.
 */
console.time("Время сбора ресурсов");
var
  $text = $("#kant").text(),
  $bred = $("#bred"),
  text = $text
    .toLowerCase()
    .split("\n")
    .join(" ")
    .replace(/[\.,;:?!](?=\s)/g, " $& ")
    .split(" ")
    .filter(removeVoid);
console.timeEnd("Время сбора ресурсов");

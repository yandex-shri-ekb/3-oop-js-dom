/*
* При загрузке страницы получаем исходный текст для генерирования статей
* и создаем Генератор
*/
"use strict";
$().ready(function() {
    window.gen = new Generator({
      minWords:     $("[name='minWords']").val(),  
      maxWords:     $("[name='maxWords']").val(),
      minProposals: $("[name='minProposals']").val(),
      maxProposals: $("[name='maxProposals']").val(),
      minParagraph: $("[name='minParagraph']").val(),
      maxParagraph: $("[name='maxParagraphs']").val()
});

$('.blah-preference').on("submit", function() {
    $(this).find(".generateBlah-button").attr("disabled", true);
    var $sourceText = $(".source-page").html();
    gen.init($sourceText);

      });

/*так как это локально не работает, для тестов используем вариант выше
$.get("habr.html", function(data){
    $(this).find(".generateBlah-button").attr("disabled", true);
      gen.init(data);  
});
*/
}) 

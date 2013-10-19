/* "Рабочий" предназначен для обработки текста, преобразования его в массив слов,
* составление словаря в виде массива: [пара слов: слово 1, слово 2, слово 1]
*/

// очитстка полученного на входе текста
var getText = function(text) {
    var text = text;

    text = text.replace(/<\/?[^>]*>/gi, '');           //убираем все теги и ссылки в тексте
    text = text.replace(/[^\w\sА-яёЁ!.?,:]/g, ' ');    // убираем скобочки и символы
    text = text.replace(/(\s*[!.?,:])/g, ' $1');       //перед знаками ставим пробелы
    text = text.replace(/\s+/g, ' ');                  //заменяем множество полученных пробелов одним
    
    return text;
};

var fillDictionary = function(words) {
    var wordSForDictionary = [],
        tempArray,
        lengthMassiv,
        text = {};

    tempArray = words.split(' ');
    lengthMassiv = words.length;

    for (var i=0; i<lengthMassiv; i+=1){
        wordSForDictionary.push( words[i].toLowerCase() );
      }
     // return Dictionary;
    

    var lengthDictionary = wordSForDictionary.length;

/* заполняем словарь: берем каждое слово из массива слов осмысленнойи статьи,
** берем следующее за ним и складываем все в объект по ключу: пара слов - набор следующих слов
*       
*/
      outer:
      for(var i=0; i<lengthDictionary; i+=1) {
        if(wordSForDictionary[i+2]==undefined){
          if(wordSForDictionary[i]+' '+wordSForDictionary[i+1] in text) {
            text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push('#');
          break outer;
          }
          text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]] =[];
          text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push('#');
          break outer;
        }
        if(wordSForDictionary[i]+' '+wordSForDictionary[i+1] in text) {
          text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push(wordSForDictionary[i+2])
          continue;
        }
        text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]] =[];
        text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push(wordSForDictionary[i+2]);
      }
    return text;
};

onmessage = function(element) {
  postMessage({
    articleArray: fillDictionary( getText(element.data.articles) ),
    commentArray: fillDictionary( getText(element.data.comments) )
  })
}




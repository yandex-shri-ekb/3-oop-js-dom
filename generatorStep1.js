/* Основной функционал генератора
* генерируем предложения и структуру
*
*/
"use strict";
function Generator(config) {

//Для проверки: запущен ли генератор

    this.existence = false;

//Настройки для написания бреда, получаемы с формы на странице

    this.config = {
      minWords: config.minWords,               // минимальное количество слов
      maxWords: config.maxWords,               // максимальное количество слов
      minProposals: config.minProposals,       // минимальное количество предложений
      maxProposals: config.maxProposals,       // максимальное количество предложений
      minParagraph: config.minParagraph,       // минимальное количество абзацев
      maxParagraph: config.maxParagraph,       // максимальное количество абзацев 

//Среднее кол-во слов, предложений, абзацев в списке habra-статьей

      countWords: 0,
      countProposals: 0,
      countParagraph: 0,
      countArticles: 0,
      countComment: 0
    };

   // this.text;

//Создаем словарную основу: словарь статей, словарь комментариев и авторов комментариев, строки-содержащие все статьи и все комментарии
    this.Dictionaries ={
      articleDict: new Dictionary,
      commentDict: new Dictionary,
      wordSForDictionary: '',
      commentForDictionary: '',
      authorComment: []
    };

    var currentPair,
        self = this;
    
/*    this.getText = function(text){
    var text = text;
      text = text.replace(/<\/?[^>]*>/gi, '');  //убираем все теги и ссылки в тексте
      text = text.replace(/[^\w\sА-яёЁ!.?,:]/g, ' '); // убираем скобочки и символы
      text = text.replace(/(\s*[!.?,:])/g, ' $1'); //перед знаками ставим пробелы
      text = text.replace(/\s+/g, ' '); //заменяем множество полученных пробелов одним

return text;
    }
*/
//Извлекаем слова из списка и добаляем в словарь
    
    this.extractWords = function(Dictionary) {
      var words = this.text.split(' '),
          lengthMassiv = words.length;

      for (var i=0; i<lengthMassiv; i+=1){
        Dictionary.push( words[i].toLowerCase() );
      }
     // return Dictionary;
    }
}

//Инициализируем генератор и делаем тексты для словарей статей, комментариев, авторов комментария, считаем средние показатели
    
Generator.prototype.init = function(sourceText) {
    var textComment = '',
        textArticle = '',
        self = this;
    this.text = sourceText;
    
//ищем и считаем количество статей 

    var $articles = self.text.match(/<article>([\s\S]*?)<\/article>/g).join('');
    this.config.countArticles = self.text.match(/<article>([\s\S]*?)<\/article>/g).length;

//считаем комментарии и добавляем их текст в словарный запас словаря для комментариев

    var comment = self.text.match(/(class="message")/g);
    this.config.countComment = comment.length / this.config.countArticles;
 
//заполняем массив авторов комментариев и тексты комментариев 
    $articles = $( $articles ); //чтобы дальше использовать jquery 

    var $comments = $articles.find('.comment').each(function() {
      var $textComment = $( this ).children('.message').text();
      var $authorComment = $( this ).children('.username').text();
      
      textComment += $textComment;

      self.Dictionaries.authorComment.push($authorComment);
    })

//считаем количество абзацев 
    $articles = $articles.find('section')
                     .remove()
                     .end()
                     .html();
    $articles = $articles.replace(/(<br>\n+|\r+<br>)+/g, '\n');
console.log($articles);

    var valueParagraph = $articles.match(/\n/g).length;
alert(valueParagraph);
    self.config.countParagraph = valueParagraph / this.config.countArticles;

// заполняем исходники для словарей комментариев и статей    
/*    self.Dictionaries.wordSForDictionary = $articles;
    self.Dictionaries.commentForDictionary = textComment;
*/
    textArticle = $articles;

//отдаем работы по составлению словаря работнику

    var langWorker = new Worker('worker.js');
    
    langWorker.postMessage ({
      articles: textArticle,
      comments: textComment
    });
    langWorker.onMessage = function (event) {
      self.Dictionaries.articleDict.text = event.data.articleArray;
      self.Dictionaries.commentDict.text = event.data.commentArray;
console.log(self.Dictionaries.articleDict);
console.log(self.Dictionaries.authorComment);
console.log(self.Dictionaries.commentDict);
    };





}




Generator.prototype.createProposal = function(Dictionary, a, b) {
    var tempMas = [],
        proposal = [],
        words = [],
        lengthProposal,
        findingLength,
        firstPair;

    for (var i=a; i<=b; i+=1) {
      tempMas.push(i);
    }
    
var iterator = new Iterator(tempMas);

    findingLength = iterator.randomItem();
    tempMas.length = 0;
  
    for(var key in Dictionary.text) {
      tempMas.push(key);
    }

    firstPair = iterator.randomItem();
    words = firstPair.split(' ');
    
    while( words[0].match( /[.!?#]/ ) || words[1].match( /[.!?#]/ ) ) {
      firstPair = iterator.randomItem();
      words = firstPair.split(' ');
    }

    tempMas.length = 0;
    
    proposal.push(words[0], words[1]);
    words = null;
    lengthProposal = proposal.length;
    while ( findingLength !== lengthProposal) {
     
     
      var word = gen.getNextWord(proposal);
      if(word.match( /[.!?#]/ )){
        proposal.push(word);
        return proposal;
      }
      proposal.push(word);
      lengthProposal = proposal.length;
      console.log(proposal);
    }
    return proposal;
}

Generator.prototype.getNextWord = function(proposal) {
    var lengthProposal = proposal.length,
        lastWord = proposal[lengthProposal-1],
        beforeLastWord = proposal[lengthProposal - 2],
        currentPair = beforeLastWord + ' '+lastWord,
        masWords = [],
        rndKey,
        count = 0,
        maxCount = 50,
        word;


    masWords = this.articleDict.text[currentPair];
    var iterator = new Iterator(masWords);
    word = iterator.randomItem();
    while (word.match( /[.!?#]/ ) && (count < maxCount)) {
      word = iterator.randomItem();
      count++;
    }
    if (count === maxCount || word === 'undefined') {
      return word = '.';
    }
    return word;
}

function Dictionary() {
 //   this.wordSForDictionary = wordSForDictionary;
    this.text = {};
   // this.authorComment = [];
}

/* Итератор, который итерирует все
*
*/


var Iterator = function(items) {
    this.index = 0;
    this.items = items;
};

Iterator.prototype = {
    first: function () {
      this.reset();
      return this.next();
    },
    randomItem: function() {
      if(this.items.length ===1) {
        return this.items[0]
      }
      var rndKey = Math.floor(this.items.length * Math.random());
      return this.items[rndKey];
    },
    next: function() {
      return this.items[this.index++];
    },
    hasNext: function() {
      return this.index <= this.items.length;
    },
    reset: function() {
      this.index = 0;
    },
    each: function(callback) {
      for (var item = this.first(); this.hasNext(); item = this.next() ){
        callback(item);
      }
    }
}

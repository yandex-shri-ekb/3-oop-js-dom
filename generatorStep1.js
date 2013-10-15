/* Основной функциоал генератора
* генерируем предложения и структуру
*
*/
"use strict";
function Generator(config) {

//Для проверки: запущен ли генератор    

    this.existence = false;

//Настройки для написания бреда, получаемы с формы на странице    

    this.config = {
      minWords: config.minWords,
      maxWords: config.maxWords,
      minProposals: config.minProposals,
      maxProposals: config.maxProposals,
      minParagraph: config.minParagraph,
      maxParagraph: config.maxParagraph,

//Среднее кол-во слов, предложений, абзацев в списке habra-статьей

      countWords: 0,
      countProposals: 0,
      countParagraph: 0,
      countArticles: 0,
      countComment: 0
    };

    this.text;

//Создаем словарную основу: словарь статей, словарь комментариев и авторов комментариев
    this.Dictionaries ={
      articleDict: new Dictionary,
      commentDict: new Dictionary,
      wordSForDictionary: [],
      commentForDictionary: [],
      authorComment: []
    };

    var currentPair,
        self = this;
    
    this.getText = function(text){
      self.text = self.text.replace(/<\/?[^>]*>/gi, 'ТЭГ'); //убираем все теги и ссылки в тексте 
      self.text = self.text.replace(/[^\w\sА-яёЁ!.?,:]/g, ' '); // убираем скобочки и символы
      self.text = self.text.replace(/(\s*[!.?,:])/g, ' $1'); //перед знаками ставим пробелы
      self.text = self.text.replace(/\s+/g, ' '); //заменяем множество полученных пробелов одним

    }
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
    this.text = sourceText;
    
//ищем и считаем количество статей статьи article    
    var $articles = $( this.text.match(/<article>([\s\S]*?)<\/article>/g).join('') );
    this.config.countArticles = this.text.match(/<article>([\s\S]*?)<\/article>/g).length;
    

//считаем комментарии и добавляем их текст в словарный запас словаря для комментариев
    var comment = this.text.match(/(class="message")/g);
    this.config.countComment = comment.length / this.config.countArticles;
    
    var $comments = $articles.find('sectoin .comment');
    var comment ='';
    $comments.each(function(index, element) {
        //console.log(this)
        var $somment = $(element);
var nick = $comment.children('.username').text();
this.Dictionaries.commentForDictionary.push($textComment);
        //var $textComment = $( this ).text();
        this.Dictionaries.authorComment.push(nick);

    });

    
    console.log('stop');
    /*$comment.each(function( item ) {
      var $textComment = item.text();
      this.Dictionaries.commentForDictionary.push($textComment);

    });*/


//выбираем авторов комментариев и добавляем их в "массив авторов""
   
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
    
    while( words[0].match( /[.!?#]/ ) && words[1].match( /[.!?#]/ ) ) {
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
        beforeLastWord =  proposal[lengthProposal - 2],
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

/*jslint plusplus: true, vars: true, browser: true, devel: true */
function Generator (text) {
    var wordSForDictionary = [],
    currentPair;
    //function rndNumber
            "use strict";
    this.extractWords = function(text) {
      var words = a.split(' '),
          lengthMassiv = words.length;

      for (var i=0; i<lengthMassiv; i+=1){
        wordSForDictionary.push( words[i].toLowerCase() );
      }
      return wordSForDictionary;
    },
    
    this.createText = function(Dictionary) {
      
    },
}





Generate.prototype.getRndWord = function (wordsMassiv) {
    var rndKey = Math.floor(wordsMassiv.length * Math.random() )
    return rndKey;
  }



Generate.prototype.createProposal = function (Dictionary, a, b) {
    "use strict";
    var tempMas = [],
        proposal = [],
        words = [],
        lengthProposal,
        findingLength,
        firstPair;

    for (var i=a; i<=b; i+=1) {
      tempMas.push(a);
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
    findingLength = proposal.length;
    while ( findingLength !== lengthProposal) {
      word = getNextWord(proposal);
      proposal.push(word);
    }
    return proposal;
}

function getNextWord(proposal) {
    var lengthProposal = proposal.length,
        lastWord = proposal[lengthProposal],
        beforeLastWord =  proposal[lengthProposal - 1],
        currentPair = beforeLastWord + lastWord,
        masWords = [],
        rndKey,
        count = 0;
        maxCount = 50;
        word;

    masWords = Dictionary.text[currentPair];
    var iterator = new Iterator(masWords);
    word = iterator.randomItem;
    while (word.match( /[.!?#]/ ) && count < maxCount) {
      word = iterator.randomItem;
      count++;
    }
    if (count === maxCount) {
      return word = '.';
    }
    return word;
}    


var Iterator = function(items) {
    this.index = 0;
    this.items = items;
}

Iterator.prototype = {
    first: function() {
      this.reset();
      return this.next();
    },
    randomItem: function() {
      var rndKey = Math.floor(this.items.length * Math.random() )
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
      for(var item = this.first(); this.hasNext(); item = this.next() ){
        callback(item);
      }
    }
}

function Dictionary(wordSForDictionary) {
    this.text = {};
    this.authorComment = [];
}
Dictionary.prototype.fillDictionary = function(wordSForDictionary) {
      var lengthDictionary = wordSForDictionary.length;
      
      outer:
      for(var i=0; i<lengthDictionary; i+=1) {
        if(wordSForDictionary[i+2]==undefined){
          this.text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push('#');
          break outer;
        }
        if(wordSForDictionary[i]+' '+wordSForDictionary[i+1] in this.text) {
          this.text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push(wordSForDictionary[i+2])
          continue;
        }
        this.text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]] =[];
        this.text[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push(wordSForDictionary[i+2]);
      }
    },


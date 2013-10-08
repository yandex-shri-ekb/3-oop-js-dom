/*jslint plusplus: true, vars: true, browser: true, devel: true */
var Genarator = function (text) {
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
    this.fillDictionary = function(Dictionary) {
      var lengthDictionary = wordSForDictionary.length;
      
      outer:
      for(var i=0; i<lengthDictionary; i+=1) {
        if(wordSForDictionary[i+2]==undefined){
          Dictionary[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push('#');
          break outer;
        }
        if(wordSForDictionary[i]+' '+wordSForDictionary[i+1] in Dictionary) {
          Dictionary[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push(wordSForDictionary[i+2])
          continue;
        }
        Dictionary[wordSForDictionary[i]+' '+wordSForDictionary[i+1]] =[];
        Dictionary[wordSForDictionary[i]+' '+wordSForDictionary[i+1]].push(wordSForDictionary[i+2]);
      }
    },
    this.createText = function(Dictionary) {
      
    },
}





Generate.prototyep.getRndWord = function (wordsMassiv) {
    //if(wordsMassiv.length === 0) {
//      var word = ' .';

  //    return word;
  //  }
    var rndKey = Math.floor(wordsMassiv.length * Math.random() )
   // var word = wordsMassiv[rndKey];

    return rndKey;
}



function createProposal(Dictionary, a, b) {
    "use strict";
    var tempMas = [],
        proposal = [],
        words = [],
        word,
        lengthProposal,
        findingLength,
        rndKey,
        firstPair;

    for (var i=a; i<=b; i+=1) {
      tempMas.push(a);
    }
    
    rndKey = getRndWord(tempMas);
    findingLength = tempMas[rndKey];
    tempMas = null;
  
    for(var key in Dictionary) {
      tempMas.push(key);
    }
    firstPair = getRndWord(tempMas);
    words = firstPair.split(' ');
    
    while( words[0].match( /[.!?#]/ ) && words[1].match( /[.!?#]/ ) ) {
      firstPair = getRndWord(tempMas);
      words = firstPair.split(' ');
    }

    tempMas = null;
    
    proposal.push(words[0], words[1]);
    words = null;
    findingLength = proposal.length;
    while ( findingLength !== lengthProposal) {
      word = getNextWord(proposal);
      //checkWords(proposal);
      proposal.push(word);
    }
    return proposal;
}

function getNextWord(proposal) {
  //  var check = checkWidthProposal(proposal);
  //  if(check) {
  //    
  //    return;
  //  }
    var lengthProposal = proposal.length,
        lastWord = proposal[lengthProposal],
        beforeLastWord =  proposal[lengthProposal - 1],
        currentPair = beforeLastWord + lastWord,
        masWords = [],
        rndKey,
        count = 0;
        maxCount = 50;
        word;

    masWords = Dictionary[currentPair];
    rndKey = getRndWord(masWords);
    word = masWords[rndKey];
    while (word.match( /[.!?#]/ ) && count < maxCount) {
      rndKey = getRndWord(masWords);
      word = masWords[rndKey];
      count++;
    }
    if (count === maxCount) {
      return word = '.';
    }
    return word;
}    

function Dictionary() {
    this.getFirst
}

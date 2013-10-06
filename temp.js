function Genarator(a) {
    var wordSForDictionary=[],
        currentPair;
        

    //function rndNumber
    
    this.extractWords = function(a) {
      var words = a.split(' ');
      var lengthMassiv = words.length;

      for(var i=0; lengthMassiv; i+=1){
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





function getRndWord(wordsMassiv) {
    if(wordsMassiv.length === 0) {
      var word = ' .';

      return word;
    }
    var rndKey = Math.floor(keysMassiv.length * Math.random() )
    var word = keysMassiv[rndKey];

    return word;
}

function getFirstPair(Dictionary) {
    var startWords = [],
        firstWord;

    for(var key in Dictionary) {
      startWords.push(key);
    }
    var firstCouple = getRndElement(startWords);

    return firstCouple;
}

function createProposal(Dictionary) {
    var proposal =[];
    
    getFirstPair(Dictionary);


    if(words instanceof Array) {
      proposal.push( words.join(' ') );
      return proposal;
    }

    //if(words //содержит .?!:) {
   //   proposal.push(words);
   //   return proposal;
   // }

   proposal.push(words);
   return proposal;

}


function checkWidthProposal(proposal) {
    var lengthProposal = proposal.length;

    if(lengthProposal >= lengthMaxProposal) {
      endingProposal(proposal);
      return true;
    }

    return false;
}

function endingProposal(proposal) {
      proposal.push(' .');
      text.push(proposal);
      proposal.length=0;
      countProposal++;
      return;
}


function getNextWord(proposal) {
    var check = checkWidthProposal(proposal);
    if(check) {
      
      return;
    }
    var lengthProposal = proposal.length,
        lastWord = proposal[lengthProposal],
        beforeLastWord =  proposal[lengthProposal-1];
        currentPair = beforeLastWord+lastWord;

    var masWords = Dictionary[currentPair];
    getRndWord(masWords);

}


function Dictionary() {
    this.getFirst
}

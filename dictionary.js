/*function Dictionary(wordSForDictionary) {
    this.wordSForDictionary = wordSForDictionary;
    this.text = {};
    this.authorComment = [];
}
Dictionary.prototype.fillDictionary = function() {
      var lengthDictionary = this.wordSForDictionary.length;
      
      outer:
      for(var i=0; i<lengthDictionary; i+=1) {
        if(this.wordSForDictionary[i+2]==undefined){
          if(this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1] in this.text) {
            this.text[this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1]].push('#');
          break outer;
          }
          this.text[this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1]] =[];
          this.text[this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1]].push('#');
          break outer;
        }
        if(this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1] in this.text) {
          this.text[this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1]].push(this.wordSForDictionary[i+2])
          continue;
        }
        this.text[this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1]] =[];
        this.text[this.wordSForDictionary[i]+' '+this.wordSForDictionary[i+1]].push(this.wordSForDictionary[i+2]);
      }
};
*/

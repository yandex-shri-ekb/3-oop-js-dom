function random(min,max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function buttonClick() {
	var reader = new TextReader("kant.txt", doJob);
	reader.read();
}

function doJob(data) {
	var tokens = tokenize(data);
	var d = new Dictionary();

	console.log(tokens.length + " tokens");

	var prev1 = "";
	var prev2 = "";
	for (var i=0; i<tokens.length; i++) {
		var word = tokens[i];
		d.add(prev1, prev2, word);
		if (word.match(/^[\.!?]$/)) {	// Если word - это "." или "!" или "?" (конец предложения)
			prev1 = "";
			prev2 = "";
		} 
		else {
			prev1 = prev2;
			prev2 = word;
		}
	}
	console.log("Done");

	var word1 = "";
	var word2 = "";
	var result = "";
	for (var i=0; i<50; i++) {
		var word3 = d.get(word1, word2);
		result += word3 + " ";
		if (word3.match(/^[\.!?]$/)) {	// Если word - это "." или "!" или "?" (конец предложения)
			word1 = "";
			word2 = "";
		} 
		else {
			word1 = word2;
			word2 = word3;
		}
	}
	$("#output").text(result);
}

function tokenize(str) {
	str = str.toLowerCase();
	str = str.replace(/т\.е\./g, " ");
	str = str.replace(/т\.д\./g, " ");
	str = str.replace(/[^a-zа-я0-9\.,:?!-]/gi, " ");	// Удалим плохие, лишние символы
	str = str.replace(/ - /g, " ");						// Удалим тире между словами (дефисы останутся)
	str = str.replace(/([\.,:?!])/g, " $1 ");			// Для последующего разбиения на токены
	return str.split(/ +/);								// Разбиваем строку на токены
}

//////////////////////////////////////////////////////////

function Dictionary() {
	this.data = {};
}

Dictionary.prototype.add = function(key1,key2,value) {
	if (!this.data[key1])
		this.data[key1] = {};
	if (!this.data[key1][key2])
		this.data[key1][key2] = new WordDistribution();
	this.data[key1][key2].add(value);
}

Dictionary.prototype.get = function(key1,key2) {
	if (!this.data[key1]) 
		throw new Error("Dictionary.get: key1 not found: " + key1);
	if (!this.data[key1][key2]) 
		throw new Error("Dictionary.get: key2 not found: " + key2);
	return this.data[key1][key2].getRandomWord();
}

Dictionary.prototype.print = function() {
	for (var key1 in this.data)
		for (var key2 in this.data[key1]) 
			console.log("(" + key1 + "|" + key2 + ") -> " + this.data[key1][key2].toString());
}

//////////////////////////////////////////////////////////

function WordDistribution() {
	this.count = {};		// Для каждого слвоа - сколько раз оно встретилось
	this.total = 0;			// Общее количество добавленных слов
}

WordDistribution.prototype.add = function(word) {
	this.total++;
	if (!this.count[word])
		this.count[word] = 1;
	else
		this.count[word]++;
}

WordDistribution.prototype.getRandomWord = function() {
	var i = random(0, this.total);
	for (var word in this.count) {
		if (i < this.count[word])
			return word;
		i -= this.count[word];
	}
	throw new Error("WordDistribution.getRandomWord: unexpected end of words");
}

WordDistribution.prototype.toString = function() {
	var result = "";
	for (var word in this.count)
		result += word + ":" + this.count[word] + " ";
	return result;
}

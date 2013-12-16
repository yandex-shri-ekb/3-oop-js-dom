var generator = new Generator();
var page;

$(document).ready(function() {
	page = new Page();

	page.onCreate(function() {
		page.startLoading();
		setTimeout(function(){
			var options, result;
			generator.initialize();

			options = page.getOptions();
			result = generator.create(options);

			page.endLoading();
			page.show(result);
		},10);

	});

	page.onReset(function() {
		page.reset();
	});

});

function Page() {
	this._options = $('#options');
	this._loading = $('#loading');

	this._createButton = $('#createButton');
	this._resetButton = $('#resetButton');

	this._title = $('#title');
	this._article = $('#article');
	this._comments = $('#comments');
	this._commentsCount = $('#commentsCount');

	this._originalTitle = this._title.text();
}

Page.prototype.getOptions = function() {
	return {
		minS: $('#minSentence').val(),
		maxS: $('#maxSentence').val(),
		minP: $('#minParagrapher').val(),
		maxP: $('#maxParagrapher').val(),
		minA: $('#minArticle').val(),
		maxA: $('#maxArticle').val(),
		minH: $('#minHead').val(),
		maxH: $('#maxHead').val(),
		minC: $('#minComment').val(),
		maxC: $('#maxComment').val()
	};
}

Page.prototype.startLoading = function() {
	this._loading.show();
	this._options.hide();
	this._createButton.hide();
}

Page.prototype.endLoading = function() {
	this._loading.hide();
}

Page.prototype.onCreate = function(func) {
	this._createButton.click(func);
}

Page.prototype.onReset = function(func) {
	this._resetButton.click(func);
}

Page.prototype.reset = function() {
	this._title.text(this._originalTitle);

	clearAndHide(this._article);
	clearAndHide(this._comments);
	clearAndHide(this._commentsCount);

	this._resetButton.hide();
	this._createButton.show();
	this._options.show();
}

Page.prototype.show = function(result) {
	this._title.text(result.title);
	this._title.show();

	this._article.append(result.article);
	this._article.show();

	this._comments.append(result.comments);
	this._comments.show();

	this._commentsCount.text('(' + result.comments.length + ')');
	this._commentsCount.show();

	this._resetButton.show();
	this._createButton.hide();
	this._options.hide();
}

//////////////////////////////////////////////////////////////////////////////////////////////

function Generator() {
	this.articleManager = new TokenManager('article');
	this.commentManager = new TokenManager('div.message');
	this.usersManager = new UsersManager('div.username');
	this.initialized = false;
}

Generator.prototype.initialize = function() {
	if (!this.initialized) {
		this.articleManager.initialize();
		this.commentManager.initialize();
		this.usersManager.initialize();
		this.initialized = true;
	}
}

Generator.prototype.create = function(options) {
	var commentsOptions = {
		minC: options.minC,
		maxC: options.maxC,
		minP: 1,
		maxP: 5,
		minS: 5,
		maxS: 20
	};
	return { 
		title: this.makeTitle(options),
		article: this.makeArticle(options),
		comments: this.makeComments(commentsOptions)
	};
}

Generator.prototype.tryMakeSentence = function(minWords, maxWords, manager) {
	var word1 = '',
		word2 = '',
		word3 = '',
		string = '';

	for (var i = 0; i < maxWords; i++) {
		word3 = manager.dictionary.get(word1, word2);

		if (word3.match(/^[\.,:?!]$/))
			string += word3;
		else 
			string += ' ' + word3;

		if (word3.match(/^[\.!?]$/)) {	// Если word - это '.' или '!' или '?' (конец предложения)
			return i < minWords ? '' : string;
		} 
		else {
			word1 = word2;
			word2 = word3;
		}
	}
	return string;
}

Generator.prototype.makeSentence = function(minWords, maxWords, manager) {
	var tryCount = 10,
		result;
	while (!result && tryCount--) {
		result = this.tryMakeSentence(minWords, maxWords, manager);
	}
	if (!result) {
		throw new Error("Failed to create sentence with words count from " + minWords + " to " + maxWords);
	}
	return result;
}

Generator.prototype.makeTitle = function(o) {
	var title = this.makeSentence(o.minH, o.maxH, this.articleManager);
	return upFirst(title);
}

Generator.prototype.makeArticle = function(o) {
	var result = [],
		count = random(o.minA, o.maxA);

	while (count--) {
		var text = this.makeParagrapher(o);
		var element = $('<p/>').text(text);
		result.push(element);
	}
	return result;
}

Generator.prototype.makeParagrapher = function(o) {
	var result = '',
		count = random(o.minP, o.maxP);

	while (count--) {
		var s = this.makeSentence(o.minS, o.maxS, this.articleManager);
		s = appendDots( upFirst(s) );
		result += s;
	}
	return result;
}

Generator.prototype.makeComments = function(o, manager) {
	var result = [],
		count = random(o.minC, o.maxC);

	while (count--) {
		var username = this.usersManager.getUser();

		var a = $('<a/>', {href: '#'}).text(username);
		var div = $('<div/>', {class: 'username'}).append(a);
		result.push(div);

		var text = this.makeParagrapher(o);
		div = $('<div/>', {class: 'message'}).text(text);
		result.push(div);
	}
	return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////

function clearAndHide(element) {
	element.html('');
	element.hide();
}

function random(min,max) {
	min = parseInt(min, 10);
	max = parseInt(max, 10);
	return Math.floor(Math.random() * (max - min)) + min;
}

function upFirst(string) {
	var firstLetter = string.charAt(1).toUpperCase();
	var secondPart = string.substring(2);
	return ' ' + firstLetter + secondPart;
}

function appendDots(string) {
	if (string.charAt(string.length-1).match(/[,:-]/)) {
		string = string.slice(0,string.length-1);
		string += '.';
		return string;
	}
	else if (!string.charAt(string.length-1).match(/[\.?!]/)) {
		string += '.';
		return string;
	}
	return string;
}

//////////////////////////////////////////////////////////////////////////////////////////////

function UsersManager(element) {
	this.dataSource = element;
	this.users = [];
}

UsersManager.prototype.initialize = function() {
	var self = this;
	$(this.dataSource).each(function() {
		var e = $(this);
		self.users.push(e.text());
	});
}

UsersManager.prototype.getUser = function() {
	var i = random(0, this.users.length);
	return this.users[i];
}

//////////////////////////////////////////////////////////////////////////////////////////////

function TokenManager(data) {
	this.dataSource = data;
	this.dictionary = new Dictionary();
}

TokenManager.prototype.initialize = function() {
	var text = $(this.dataSource)
		.clone()										// clone the element
		.children()										// select all the children
		.remove()										// remove all the children
		.end()  										// again go back to selected element
		.text();   	 									// get the text of element
	var tokens = this.tokenize(text);
	this.populateDictionary(tokens);					// Занимает много времени ...
}

TokenManager.prototype.tokenize = function(text) {
	return text
			.toLowerCase()
			.replace(/т\.е\./g, ' ')
			.replace(/т\.д\./g, ' ')
			.replace(/[^a-zа-яё0-9\.,:?!-]/gi, ' ')		// Удалим плохие, лишние символы
			.replace(/ - /g, ' ')						// Удалим тире между словами (дефисы останутся)
			.replace(/([\.,:?!])/g, ' $1 ')				// Для последующего разбиения на токены
			.split(/ +/);								// Разбиваем строку на токены
}

TokenManager.prototype.populateDictionary = function(tokens) {
	var prev1 = '',
		prev2 = '';
	for (var i = 0, max = tokens.length; i < max; i+=1) {
		var word = tokens[i];
		this.dictionary.add(prev1, prev2, word);
		if (word.match(/^[\.!?]$/)) {					// Если word - это '.' или '!' или '?' (конец предложения)
			prev1 = prev2 = '';
		} 
		else {
			prev1 = prev2;
			prev2 = word;
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////

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
		throw new Error('Dictionary.get: key1 not found: ' + key1);
	if (!this.data[key1][key2]) 
		throw new Error('Dictionary.get: key2 not found: ' + key2);
	return this.data[key1][key2].getRandomWord();
}

Dictionary.prototype.print = function() {
	for (var key1 in this.data)
		for (var key2 in this.data[key1]) 
			console.log('(' + key1 + '|' + key2 + ') -> ' + this.data[key1][key2].toString());
}

//////////////////////////////////////////////////////////////////////////////////////////////

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
	throw new Error('WordDistribution.getRandomWord: unexpected end of words');
}

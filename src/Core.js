

/*
Собственное пространство имен для нашего бредогенератора
*/
var Core = {};

//==========================================================
/*
    Вспомогательные функции
    Генерирует случайное число в промежутке
*/
Core.RandomInRange = function(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


Core.IsWord = function(str)
{
    return str.search(/[A-Za-zА-Яа-я0-9]/) != -1;
};


Core.IsPunctuation = function(str)
{
    return str == "." || str == "," || str == "!" || str == "?";
};

/*
    Данная функция возвращает true если строка является html тегом
    или хотя-бы содержит символы '<' or '>'.
    Используется для выкидивания "ненужных" символов из текста.
*/
Core.IsHtml = function(str)
{
    return str.search(/[></]/) != -1;
}

//==========================================================


//=====================================================================================
/*
    Словарь хранящий префиксы слов и их соответствущие суффиксы
*/
Core.Dictionary = function ()
{
    //сама хэш-таблица
    this.hash = {};
    //храним префиксы, с которых начинаются предложения.
    this.sentencePrefixes = [];
};

Core.Dictionary.prototype.GetHashTable = function ()
{
    return this.hash;
};

Core.Dictionary.prototype.GetSentencePrefixes = function ()
{
    return this.sentencePrefixes;
};

Core.Dictionary.prototype.SaveSentencePrefix = function(prefix)
{
    this.sentencePrefixes.push(prefix);
};

Core.Dictionary.prototype.Add = function (prefix, suffix)
{
    if(this.hash[prefix])
    {
        this.hash[prefix].push(suffix);
    }
    else
    {
        this.hash[prefix] = [];
        this.hash[prefix].push(suffix);
    }
};


//======================================================================================


//======================================================================================
/*
    Лексический анализатор разбивающий одну непрерывную строку(текст) на отдельные слова
    генерирующий при этом словарь Dictionary.
*/
Core.TextParser = function()
{
    this.dictionary = new Core.Dictionary();
};

Core.TextParser.prototype.GetDictionary = function () {
    return this.dictionary;
};

Core.TextParser.prototype.Parse = function (text)
{
    /*
        сначала разделяем строку на предложения.
        а далее на слова
        Т.к. префиксы и суффиксы не могут идти сквозь предложения
        (иначе это дает худший резульатат)
     */
    var proposals = text.toLowerCase().split(new RegExp("[.?!]"));
    for(var i = 0, end = proposals.length; i < end; ++i)
    {
        var str = proposals[i].split(" ");
        //удаляем все ненужные символы(строки)
        str = this.RemoveMeaninglessSymbols(str);
        this.UpdateDictionary(str);
    }
};

Core.TextParser.prototype.RemoveMeaninglessSymbols = function (strings)
{
    return strings.filter(function(s) {
            return !Core.IsHtml(s) && (Core.IsWord(s) || Core.IsPunctuation(s));
     });
};

Core.TextParser.prototype.UpdateDictionary = function (strings)
{
    if (strings.length < 3)
        return;
    var prefix1 = strings[0];
    var prefix2 = strings[1];
    this.dictionary.SaveSentencePrefix(prefix1 + " " + prefix2);
    for (var i = 2; i < strings.length; ++i)
    {
        var suffix = strings[i];
        this.dictionary.Add(prefix1 + " " + prefix2, suffix);
        prefix1 = prefix2;
        prefix2 = suffix;
    }
};

//===================================================================================



//======================================================================================

/*
    Данный класс производит построение предложений из специально сгенерированного словаря.
*/
Core.TextBuilder = function (dictionary, maxWordsCount)
{
    this.maxWordsCount = maxWordsCount;
    this.dictionary = dictionary;
};

//Данный метод генерирует случайное предложение из словаря.
Core.TextBuilder.prototype.Build = function ()
{
    var proposal = [];
    var prefix = this.GetRandomPrefix();
    var suffix = this.GetRandomSuffix(prefix);
    var wordsCount = 2;

    proposal[0] = prefix;
    while (suffix && wordsCount < this.maxWordsCount) {
        proposal.push(suffix);
        //строим новый префикс
        prefix = prefix.substr(prefix.search(" ") + 1) + " " + suffix;
        suffix = this.GetRandomSuffix(prefix);
        ++wordsCount;
    }
    //первую букву первой строки делаем заглавной
    proposal[0] = this.CapitalFirstLetter(proposal[0]);
    return proposal.join(" ") + ".";
};

Core.TextBuilder.prototype.CapitalFirstLetter = function(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/*
    Данный метод генерирует абзац (см. несколько предложений).
*/
Core.TextBuilder.prototype.BuildParagraph = function(minProposalsCount, maxProposalsCount)
{
   var proposals = Core.RandomInRange(minProposalsCount, maxProposalsCount);
   var strings = [];
   for(var i = 0; i < proposals; ++i)
   {
        strings.push(this.Build());
   }
   return strings.join(" ");
};

/*
Достаем начало рандомного предложеия.
*/
Core.TextBuilder.prototype.GetRandomPrefix = function ()
{
    var sentences = this.dictionary.GetSentencePrefixes();
    return sentences[Core.RandomInRange(0, sentences.length - 1)];
};

Core.TextBuilder.prototype.GetRandomSuffix = function (prefix)
{
    var state = this.dictionary.GetHashTable()[prefix];
    if(!state)
        return null;
    var index = Core.RandomInRange(0, state.length - 1);
    return state[index];
};

//=============================================================================================

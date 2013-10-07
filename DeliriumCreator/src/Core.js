

/*
Собственное пространство имен для нашего бредогенератора
*/
var Core = {};

//==========================================================
/*
    Вспомогательные функции
*/
Core.RandomInRange = function(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Core.IsWord = function(str)
{
    return str.search(/[^A-Za-z\s]/) == -1;
}

Core.IsPunctuation = function(str)
{
    return str == "." || str == "," || str == "!" || str == "?";
}

//==========================================================



 //====================================================================================
/*
     Состояние бредогенератора. Для некоторого префикса данная структура данных хранит
     все возможные суффиксы.
*/
Core.State = function(prefix)
{
    this.Prefix = prefix;
    this.Suffixes = [];
}

Core.State.prototype.AddSuffix = function(suffix)
{
    this.Suffixes[this.Suffixes.length] = suffix;
}
//=====================================================================================


//=====================================================================================
/*
    Словарь хранящий префиксы слов и их соответствущие суффиксы
*/
Core.Dictionary = function(prefixSize, hashSize)
{
    //размер префикса (2,3,4 слова и т.д.)
    this.PrefixSize = prefixSize;
    //размер хэш-таблицы
    this.HashSize = hashSize;
    //сама хэш-таблица
    this.hash = new Array(this.HashSize + 1);
    //поскольку мы работаем с хэш-таблицой, она может быть очень разреженной(вставка идет по модулю HashSize)
     //что может добавлять неудобства при первоначальном доступе к ней
     //поэтому храним список "живых" индексов для нашей хэш-таблицы
    this.liveIndexes = [];
}

Core.Dictionary.prototype.GetHashTable = function()
{
    return this.hash;
}

Core.Dictionary.prototype.GetLiveIndexes = function()
{
    return this.liveIndexes;
}

Core.Dictionary.prototype.GetHashCode = function(prefix)
{
    var prime = 11;
    var hashCode = 0;
    for(var p = 0; p < this.PrefixSize; ++p)
    {
        for(var i = 0; i < prefix[p].length; ++i)
        {
            hashCode += (prefix[p][i].charCodeAt()) * prime;
        }
    }
    return hashCode;
}

Core.Dictionary.prototype.Add = function(prefix, suffix)
{
    var hashCode = this.GetHashCode(prefix) % this.HashSize;
    this.liveIndexes[this.liveIndexes] = hashCode;
    var state = this.FindState(prefix, hashCode);
    if(state)
    {
        this.AddToExist(state, suffix);
    }
    else
    {
        this.AddNew(hashCode, prefix, suffix);
    }
    return hashCode;
}

Core.Dictionary.prototype.AddNew = function(hashCode, prefix, suffix)
{
    var state = new Core.State(prefix);
    state.AddSuffix(suffix);
    this.hash[hashCode] = [ state ];
}

Core.Dictionary.prototype.AddToExist = function(state, suffix)
{
    state.AddSuffix(suffix);
}

Core.Dictionary.prototype.FindState = function(prefix, /*optional*/ hashCode)
{
     if(!hashCode)
        hashCode = this.GetHashCode(prefix);
    var states = this.hash[hashCode];
    if(!states)
        return null;
    for(var s = 0; s < states.length; ++s)
    {
        var state = states[s];
        var equals = true;
        for(var i = 0; i < state.Prefix.length; ++i)
        {
            if(prefix[i] != state.Prefix[i])
            {
                equals = false;
                break;
            }
        }
        if(equals)
        {
            return state;
        }
    }
    return null;
}

//======================================================================================


//======================================================================================
/*
    Лексический анализатор разбивающий одну непрерывную строку(текст) на отдельные слова
    генерирующий при этом словарь Dictionary.
*/
Core.TextParser = function()
{
    //TODO hardcoded values live here.
    this.dictionary = new Core.Dictionary(2, 4096);
}

Core.TextParser.prototype.GetDictionary = function()
{
    return this.dictionary;
}

Core.TextParser.prototype.Parse = function(text)
{
    var strings = text.toLowerCase().split(" ");
    //удаляем все ненужные символы (символы которые не являеются словами и пунктауцией).
    this.RemoveMeaninglessSymbols(strings);
    this.UpdateDictionary(strings);
}

Core.TextParser.prototype.RemoveMeaninglessSymbols = function(strings)
{
    for(var i = 0; i < strings.length; ++i)
    {
        var str = strings[i];
        if(!Core.IsWord(str) && !Core.IsPunctuation(str))
        {
           strings.splice(i, 1);
        }
    }
}



Core.TextParser.prototype.UpdateDictionary = function(strings)
{
    if(strings.length < 3)
        return;
    var prefix1 = strings[0];
    var prefix2 = strings[1];
    for(var i = 2; i < strings.length; ++i)
    {
       var suffix = strings[i];
       this.dictionary.Add( [ prefix1, prefix2 ], suffix );
       prefix1 = prefix2;
       prefix2 = suffix;
    }
}

//===================================================================================



    var CommentParser // ?
    {

    };

//======================================================================================

/*
    Данный класс производит построение предложений из специально сгенерированного словаря.
*/
Core.TextBuilder = function(minWordsCount, maxWordsCount, dictionary)
{
    this.minWordsCount = minWordsCount;
    this.maxWordsCount = maxWordsCount;
    this.dictionary = dictionary;
}

//Данный метод генерирует случайное предложение из словаря.
Core.TextBuilder.prototype.Build = function()
{
    var proposal = [];
    var state = this.GetRandomState();
    var prefix = state.Prefix;
    var suffix = this.GetRandomSuffix(state);
    var wordsCount = 2;

    proposal[0] = prefix[0];
    proposal[1] = prefix[1];
    while(suffix && (!Core.IsPunctuation(suffix) || wordsCount < this.minWordsCount))
    {
        proposal[proposal.length] = suffix;
        //строим новый префикс
        prefix = [ prefix[1], suffix ];
        suffix = this.GetRandomSuffix(this.dictionary.FindState(prefix));
        ++wordsCount;
    }
    return proposal.join(" ");
}

/*
Т.к. предложение начинается с любого слова, просто достаем рандомное состояние
с которого может начинаться предложение.
*/
Core.TextBuilder.prototype.GetRandomState = function()
{
    var hash = this.dictionary.GetHashTable();
    var liveIndexes = this.dictionary.GetLiveIndexes();
    var hashIndex = liveIndexes[Core.RandomInRange(0, liveIndexes.length - 1)];
    var prefixIndex = Core.RandomInRange(0, hash[hashIndex].length - 1);
    return hash[hashIndex][prefixIndex];
}

Core.TextBuilder.prototype.GetRandomSuffix = function(state)
{
    var index = Core.RandomInRange(0, state.Suffixes.length - 1);
    return state.Suffixes[index];
}

//=============================================================================================

    var CommentBuilder
    {

    };
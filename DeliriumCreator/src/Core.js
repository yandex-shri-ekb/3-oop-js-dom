

/*
Собственное пространство имен для нашего бредогенератора
*/
var Core = {};


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
    return (this.hash[hashCode])
        ? this.AddToExist(hashCode, prefix, suffix)
        : this.AddNew(hashCode, prefix, suffix);
}

Core.Dictionary.prototype.AddNew = function(hashCode, prefix, suffix)
{
    var state = new Core.State(prefix);
    state.AddSuffix(suffix);
    this.hash[hashCode] = [ state ];
    return hashCode;
}

Core.Dictionary.prototype.AddToExist = function(hashCode, prefix, suffix)
{

    var states = this.hash[hashCode];
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
            state.Suffixes[state.Suffixes.length] = suffix;
        }
    }
    return hashCode;
}

//======================================================================================


//======================================================================================
/*
    Лексический анализатор разбивающий одну непрерывную строку(текст) на отдельные слова
    генерирующий при этом словарь Dictionary.
*/
Core.TextParser = function()
{
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
        if(!this.IsWord(str) && !this.IsPunctuation(str))
        {
           strings.splice(i, 1);
        }
    }
}

Core.TextParser.prototype.IsWord = function(str)
{
    return str.search(/[^A-Za-z\s]/) == -1;
}

Core.TextParser.prototype.IsPunctuation = function(str)
{
    return str == "." || str == "," || str == "!" || str == "?";
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


    var TextBuilder
    {

    };

    var CommentBuilder
    {

    };
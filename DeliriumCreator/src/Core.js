

/*
Собственное пространство имен для нашего бредогенератора
*/
var Core = {};

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
    var state = new Core.State(prefix);
    state.AddSuffix(suffix);
    var hashCode = this.GetHashCode(prefix) % this.HashSize;
    //элемента c таким кодом еще не было добавляем его в таблицу
    if(!this.hash[hashCode])
    {
        this.hash[hashCode] = [ state ];
        return hashCode;
    }
    var states = this.hash[hashCode];
    for(var s = 0; s < states.length; ++s)
    {
        var equals = true;
        for(var i = 0; i < states[s].Prefix.length; ++i)
        {
            if(prefix[i] != states[s].Prefix[i])
            {
                equals = false;
                break;
            }
        }
        if(equals)
        {
            states[s].Suffixes[states[s].Suffixes.length] = suffix;
        }
    }
    return hashCode;
}
    /*
        Лексический анализатор разбивающий одну непрерывную строку(текст) на отдельные слова
        генерирующий при этом словарь Dictionary.
    */
    var TextParser
    {

    };


    var CommentParser // ?
    {

    };


    var TextBuilder
    {

    };

    var CommentBuilder
    {

    };
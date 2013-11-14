
var Visual = {};


//=============================================================================================
/*
    Задача данного класса генерировать случайную дату, которая больше предыдущей
    сгенерированной даты.
*/
Visual.DateGenerator = function()
{
    //начальная дата.
    //TODO hardcoded value
    this.date = new Date(2005, 0, 1);
}

Visual.DateGenerator.prototype.Generate = function()
{
    var start = this.date;
    var end = new Date();
    this.date =
        (new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
    return this.date.toLocaleString();
}
//==================================================================================================

//================================================================================================
/*
    Данный класс разбирает исходный документ и строит необходимые словари
    для построения статьи
*/
Visual.DOMParser = function()
{
    this.titles = [];
    this.userNames = [];
    this.articleParser = new Core.TextParser();
    this.commentParser = new Core.TextParser();
}

Visual.DOMParser.prototype.GetTitles = function()
{
    return this.titles;
}

Visual.DOMParser.prototype.GetUserNames = function()
{
    return this.userNames;
}

Visual.DOMParser.prototype.GetArticlesDictionary = function()
{
    return this.articleParser.GetDictionary();
}

Visual.DOMParser.prototype.GetCommentsDictionary = function()
{
    return this.commentParser.GetDictionary();
}

Visual.DOMParser.prototype.Parse = function()
{
   this.ParseTitles();
   this.ParseArticles();
   this.ParseUserNames();
   this.ParseComments();
}

Visual.DOMParser.prototype.ParseTitles = function()
{
    this.titles = $("b").contents().filter(function() {
        var txt =  $(this).text();
        //выбираем заголовк не слишком маленький, не слишком большой
        return txt.length > 10 && txt.length < 50;
    });
}

Visual.DOMParser.prototype.ParseArticles = function()
{
    var text = $("article").clone().children().remove().end().text();
    this.articleParser.Parse(text);
}

Visual.DOMParser.prototype.ParseUserNames = function()
{
    this.userNames = $(".username").contents();
}

Visual.DOMParser.prototype.ParseComments = function()
{
    var comments = $(".message").text();
    this.commentParser.Parse(comments);
}


//==============================================
/*
    Построение статьи.
*/

Visual.DOMBuilder = function(domParser)
{
    this.domParser = domParser;
    this.dateGenerator = new Visual.DateGenerator();
}

Visual.DOMBuilder.prototype.Build = function()
{
    $("#main").css("visibility", "visible");
    //сбрасываем тексты(содержимое) в исходное состояние, т.к. новая статья
    //не должна содержать остатки старой
    this.Reset();
    $("#titleDate").text(this.BuildDate());
    this.BuildTitle();
    this.BuildArticle();
    this.BuildComments();
}

Visual.DOMBuilder.prototype.Reset = function()
{
    //reset text from previous articles.
    $("#articleContent").text(" ");
    $("#userComments").children().filter(function() {
        return this.tagName == "DIV";
    }).remove();
}


Visual.DOMBuilder.prototype.BuildTitle = function()
{
    var titles = this.domParser.GetTitles();
    var index = Core.RandomInRange(0, titles.length - 1);
    $("#title").text($(titles[index]).text());
}

Visual.DOMBuilder.prototype.BuildDate = function()
{
    return this.dateGenerator.Generate();
}

//построение основной статьи.
Visual.DOMBuilder.prototype.BuildArticle = function()
{
    var maxWordsCount = GetInputValue("#maxWords");
    var paragraphsCount = GetInputValue("#maxParagraphs") - GetInputValue("#minParagraphs") + 1;
    var minProposals = GetInputValue("#minProposals");
    var maxProposals = GetInputValue("#maxProposals");

    var builder = new Core.TextBuilder(this.domParser.GetArticlesDictionary(), maxWordsCount);
    for(var i = 0; i <  paragraphsCount; ++i)
    {
        var p = builder.BuildParagraph(minProposals, maxProposals);
        $("#articleContent").append("<p>" + p + "</p>");
    }
}

Visual.DOMBuilder.prototype.BuildComments = function()
{
    var commentsCount = Core.RandomInRange(0, GetInputValue("#maxComments"));
    $("#commentsTitle").text("комментарии " + "(" + commentsCount + ")");
    var prevComment;
    for(var i = 0; i < commentsCount; ++i)
    {
        var comment = this.BuildComment(prevComment);
        prevComment = comment;
        $("#userComments").append(comment);
    }
}

Visual.DOMBuilder.prototype.BuildComment = function(prevComment)
{
     var comment = $("<div></div>");
     comment.addClass("comment");
     //если есть предыдущий комментарий то данный комментарий
     //можно сделать вложенным
     if(prevComment && this.IsInnerComment())
     {
        comment.css("margin-left", parseInt(prevComment.css("margin-left")) + 20 + "px");
     }
     comment.append(this.BuildCommentTitle());
     comment.append(this.BuildCommentBody());
     return comment;
}

Visual.DOMBuilder.prototype.IsInnerComment = function()
{
    //just random :)
    return Core.RandomInRange(0, 100) < 30;
}

Visual.DOMBuilder.prototype.BuildCommentTitle = function()
{
    var title = $("<div></div>");
    title.addClass("commentTitle");
    title.append(this.BuildAvatar());
    title.append(this.BuildNickName());
    title.append(this.BuildCommentDate());

    return title;
}

Visual.DOMBuilder.prototype.BuildAvatar = function()
{
    var ava = $("<img/>");
    ava.attr("src", "resources/user.gif");
    ava.addClass("avatar");
    return ava;
}

Visual.DOMBuilder.prototype.BuildNickName = function()
{
    var userNames = this.domParser.GetUserNames();
    var nick = $("<span></span>");
    nick.addClass("nickname");
    nick.append(userNames[Core.RandomInRange(0, userNames.length - 1)]);
    return nick;
}

Visual.DOMBuilder.prototype.BuildCommentDate = function()
{
    var date = $("<span></span>");
    date.addClass("date");
    date.append(this.BuildDate());
    return date;
}

Visual.DOMBuilder.prototype.BuildCommentBody = function()
{
    var comment = $("<div></div>");
    comment.addClass("commentContent");
    //TODO another hardcoded value 20
    var builder = new Core.TextBuilder(this.domParser.GetCommentsDictionary(), 20);
    comment.append(builder.Build());
    return comment;
}



//====================================================================


function OnLoad()
{
    $("#generateButton").removeAttr("disabled");
}

function Generate()
{
    var domParser = new Visual.DOMParser();
    domParser.Parse();
    var domBuilder = new Visual.DOMBuilder(domParser);
    domBuilder.Build();
}

function GetInputValue(input)
{
    var defaultValue = $(input).attr("value");
    var value = parseInt($(input).val());
    return value ? value : defaultValue;
}

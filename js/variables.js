/**
 * Бредогенератор. Переменные
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 1.0
 * @copyright Artem Kuzvesov 2013
 * 
 */

var usernameArr       = []; // массив со всеми никами пользователей
var codeArr           = []; // массив с кодом
var linksArr          = []; // массив ссылок
var commentsArr       = []; // массив комментариев
var articlesArr       = []; // массив статей
var indexCommentsArr  = []; // индексовый массив комментариев для ускорения работы
var indexArticlesArr  = []; // индексовый массив статей для ускорения работы

var npref             = ''; // количество слоов в префиксе по умолчанию
var flagNpref		  = ''; // флаг значения npref
var minWordsCount     = ''; // минимальное количество слоов в предложении по умолчанию
var maxWordsCount     = ''; // максимальное количество слоов в предложении по умолчанию
var minProfferCount   = ''; // минимальное количество предложений в в абзаце по умолчанию
var maxProfferCount   = ''; // максимальное количество предложений в абзаце по умолчанию
var minParagraphCount = ''; // минимальное количество абзацей в статье по умолчанию
var maxParagraphCount = ''; // максимальное количество абзацей в статье по умолчанию
var articlesSize      = ''; // длина массива со статьями
var commentsSize      = ''; // длина массива с комментариями
var linksArrSize      = ''; // длина массива со ссылками
var usernameArrSize   = ''; // длина массива с логинами пользователей
var authorName        = ''; // имя автора статьи
var dateCreateArticle = ''; // дата написания статьи
var lastDate          = ''; // дата последнего комментария
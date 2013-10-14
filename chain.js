/**
 * Цепочка слов для генерации бреда
 * (Цепь маркова)
 * @version 1.0
 * @date 10.10.2013
 * @author Vladimir Shestakov <boolive@yandex.ru>
 * @use jquery
 * @constructor
 */
var Chain = (function($, undefined){
    /**
     * Узел цепочки слов.
     * Имеет связанные узлы, в итоге образует цепочку
     * @param {string|undefined} word Слово из текста
     * @param {string|undefined} type Тип текста (тег)
     * @param {Chain|undefined} root Корневой узел цепочки
     * @param {Array|undefined} pfx Префикс
     * @constructor
     */
    var Chain = function(word, type, root, pfx){
        this.word = word || '';
        this.type = type? type : '';
        this.root = root || this;
        this.pfx = pfx || [this.word];
        this.pfx_length = this.root.pfx_length || 1;
        this.index = (this.root !== this)? this.root.index : {};
        this.children = [];
    };

    /**
     * Следующий узел цепочки, выбираемый случайно
     * @returns {Chain|null} Узел или null, если нет связанных узлов
     */
    Chain.prototype.next = function(){
        if (this.children.length > 0){
            return this.children[Math.round(Math.random() * (this.children.length-1))];
        }
        return null;
    };

    /**
     * Итератор по цепочке
     * @param min Минимальное количество итераций
     * @param max Максимальное количество итераций
     * @returns {{next: Function, current: Function, completed: Function}}
     */
    Chain.prototype.iterator = function(min, max){
        var curr = this.root;
        var cnt = Math.round(Math.random()*(max-min))+min;
        return {
            next: function(){
                if (curr && (max === 0 && !this.completed() || cnt-->0 || curr.isBadEnd())){
                    curr = curr.next();
                    // Если задано минимальное кол-во слов и текущий узел - точка
                    if (min!==0 && cnt < min && this.completed()) return this.next();
                    return curr;
                }
                return undefined;
            },
            current: function(){
                return curr;
            },
            completed: function(){
                return curr && /[.?!]+/.test(curr.word);
            }
        };
    };

    /**
     * Добавление в цепочку нового текста.
     * Текст разбивается на узлы
     * @param {string} text Текст для парсинга на цепочки
     * @param {string|undefined} type Тип текста (название html тега)
     * @returns {Chain} Новый узел или текущий, если не создан
     */
    Chain.prototype.addText = function(text, type){
        var self = this;
        var key, keys = self.pfx;
        if (!type || type == 'p') type = '';
        switch (type){
            case '':
            case 'b':
            case 'i':
            case 'u':
//            case 'li':
//            case 'blockquote':
                var words = text.match(/([a-zа-яА-ЯёЁ*'-]+|[.,:!?]+)/ig);
                if (words){
                    var i, cnt = words.length;
                    for (i=0; i<cnt; i+=1){
                        // Ключ нового узла зависит от предыдущих max_keys узлов
                        if (keys.length > this.pfx_length) keys = keys.slice(keys.length - this.pfx_length);
                        keys.push(words[i]+'#'+type);
                        key = keys.join(' ')/*.toLowerCase()*/;
                        // Создание/получение узла и добавление в родительский
                        if (typeof this.index[key] === 'undefined') this.index[key] = new Chain(words[i], type, this.root, keys);
                        if (!i && !this.index[key].isPunctuation() && type!=='li') self.root.children.push(this.index[key]);
                        self.children.push(this.index[key]);
                        self = this.index[key];
                    }
                }
                break;
            //case 'a':
            case 'pre':
//            case 'ul':
//            case 'ol':
                if (keys.length > this.pfx_length) keys = keys.slice(keys.length - this.pfx_length);
                keys.push(text+'#'+type);
                key = keys.join(' ')/*.toLowerCase()*/;
                if (typeof this.index[key] === 'undefined') this.index[key] = new Chain(text, type, this.root, keys);
                self.root.children.push(this.index[key]);
                self.children.push(this.index[key]);
                self = this.index[key];
                break;
        }
        return self;
    };
    /**
     * Добавление в цепочку нового DOM элемента.
     * Элемент парсится на текст, потом на узлы цепочки
     * @param {Node} element DOM элемент, например с текстом статьи
     * @returns {Chain} Новый узел или текущий, если не создан
     */
    Chain.prototype.addElement = function(element){
        var self = this;
        $(element).contents().each(function(node_i, node){
//            if (Node.ELEMENT_NODE === node.nodeType && (node.localName == 'ul' || node.localName == 'ol')){
//                self = self.addText('', node.localName);
//                self.addElement(node);
//            }
            if (node.textContent){
                self = self.addText(node.textContent, Node.ELEMENT_NODE === node.nodeType ? node.localName : '');
            }
        });
        return self;
    };
    /**
     * Является ли узел символом пунктуации?
     * @returns {boolean}
     */
    Chain.prototype.isPunctuation = function(){
        return /^[.,:!?]+$/.test(this.word);
    };

    Chain.prototype.isBadEnd = function(){
        return /^(вот|так|как|же|что|чем|и|или|а|то|ли|бы|в|с|к|за|на|о|об|обо|у|но|по|не|уж|из|под|при|,)$/i.test(this.word);
    };

    /**
     * Создание предложения из цепочки
     * @param words_min Минимальное кол-во слов
     * @param words_max Максимальное кол-во слов
     * @returns {string}
     */
    Chain.prototype.getSentence = function(words_min, words_max){
        var words, text = '', tag;
        words = this.iterator(words_min, words_max);
        tag = '';
        var cnt = 0, w;
        while (words.next()){
            if (words.current().type !== tag){
                if (tag) text += '</'+tag+'>';
                if (tag = words.current().type) text += '<'+words.current().type+'>';
                tag = words.current().type;
            }
            w = words.current().word;
            if (!cnt){
                if (words.current().isPunctuation()){
                    w = '';
                }else{
                    w = w[0].toLocaleUpperCase() + w.slice(1);
                }
            }
            if (!words.current().isPunctuation()){
                text += ' ';
            }
            text += w;
            cnt++;
        }
        if (!/[.,!?:]$/.test(text)) text += ".";
        if (tag) text += '</'+tag+'>';
        return text;
    };

    /**
     * Создание текста с абзацами
     * @param config Конфигурация текста (кол-во абзацев, предложений, слов)
     * @returns {string}
     */
    Chain.prototype.getText = function(config){
        var pcnt, scnt, text = '';
        pcnt = Math.round(Math.random()*(config.paragraphs.max-config.paragraphs.min))+config.paragraphs.min;
        while (pcnt-->0){
            scnt = Math.round(Math.random()*(config.sentences.max-config.sentences.min))+config.sentences.min;
            text += '<p>';
            while (scnt-->0){
                text += this.getSentence(config.words.min, config.words.max);
            }
            text += '</p>';
        }
        return text;
    };

    /**
     * Пустая ли цепочка?
     * @returns {boolean}
     */
    Chain.prototype.isEmpty = function(){
        return this.root.children.length === 0;
    };

    return Chain;

})(jQuery);
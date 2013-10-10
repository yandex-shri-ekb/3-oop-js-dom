/**
 * Цепочка слов для генерации бреда
 * (Цепь маркова)
 * @version 1.0
 * @date 10.10.2013
 * @author Vladimir Shestakov <boolive@yandex.ru>
 * @use jquery
 * @constructor
 */
var Chain = (function($){
    /**
     * Узел цепочки слов.
     * Имеет связанные узлы, в итоге образует цепочку
     * @param {string|undefined} word Слово из текста
     * @param {string|undefined} type Тип текста (тег)
     * @param {Chain|undefined} root Корневой узел цепочки
     * @constructor
     */
    var Chain = function(word, type, root){
        this.word = word || '';
        this.type = type || 'p';
        this.root = root || this;
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
     * Добавление в цепочку нового текста.
     * Текст разбивается на узлы
     * @param {string} text Текст для парсинга на цепочки
     * @param {string|undefined} type Тип текста (название html тега)
     * @returns {Chain} Новый узел или текущий, если не создан
     */
    Chain.prototype.addText = function(text, type){
        var self = this;
        if (!type) type = 'p';
        if (type == 'p'){
            var words = text.match(/([\wа-яА-ЯёЁ*'-]+|[.,:!?]+)/g);

            if (words){
                var key, keys = [], max_keys = 1;
                var i, cnt = words.length;
                for (i=0; i<cnt; i+=1){
                    // Ключ нового узла зависит от предыдущих max_keys узлов
                    if (keys.length > max_keys) keys.shift();
                    keys.push(words[i]);
                    key = keys.join(' ').toLowerCase();
                    // Создание/получение узла и добавление в родительский
                    if (typeof this.index[key] === 'undefined') this.index[key] = new Chain(words[i], type, this.root);
                    if (!i && !this.index[key].isPunctuation()) self.root.children.push(this.index[key]);
                    self.children.push(this.index[key]);
                    self = this.index[key];
                }
            }
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
            if (node.textContent){
                self = self.addText(node.textContent, Node.ELEMENT_NODE === node.nodeType ? node.localName : 'p');
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

    /**
     * Генерирует бред в html
     * @returns {string}
     */
    Chain.prototype.getHtml = function(max_p, min_w, max_w){
        if (!max_p) max_p = 10;
        if (!max_w) max_w = 50;
        if (!min_w) min_w = 50;
        var text = '', node, cur_max_w;
        var tags = [], curr_tag = '';
        while (max_p-- > 0){
            cur_max_w = Math.round(max_w*Math.random())+min_w;
            node = this;
            curr_tag = '';
            while ((node = node.next()) && cur_max_w-- > 0){
                if (node.type !== curr_tag){
                    if (curr_tag) text += '</'+curr_tag+'>';
                    text += '<'+node.type+'>';
                    curr_tag = node.type;
                }
                text += (node.isPunctuation()?'':' ')+node.word;
            }
            text += ".";
            if (curr_tag) text += '</'+curr_tag+'>';

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
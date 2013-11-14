/**
 * Бредогенератор
 *
 * @version 1.0
 * @date 10.10.2013
 * @author Vladimir Shestakov <boolive@yandex.ru>
 * @uss JQuery, chain.js
 * @constructor
 */
var Bred = (function($, Chain){
    /**
     * Генератор бреда
     * @param src Источник бреда - текс или html
     * @param config Конфигурация бреда - размеры предложений, абзацев, комментов, качества бреда
     * @constructor
     */
    var Bred = function(src, config){
        this.config = config;
        this.articles = new Chain();
        this.comments = new Chain();
        this.users = [];
        this.articles.pfx_length = config.quality;
        this.comments.pfx_length = config.quality;
        // Создание цепочек из src
        var self = this;
        if (/<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/.test(src)){
            var $articles = $('<div>').append(src).find('article');
            // HTML исходник
            $articles.each(function(article_i, article){
                // Вырезаем и обрабатываем комментарии
                var $com = $(article).find('.comments').remove();
                $com.find('.username').each(function(user_i, user){
                    self.users.push($(user).text());
                });
                $com.find('.message').each(function(message_i, message){
                    self.comments = self.comments.addElement(message);
                });
                // Обработка текста статьи
                self.articles = self.articles.addElement(article);
            });
        }else{
            // Обработка как текста
            var lines = src.split("\n");
            var cnt = lines.length;
            for (var i=0; i<cnt; i++){
                this.articles = this.articles.addText(lines[i]);
            }
        }
        this.articles = this.articles.root;
        this.comments = this.comments.root;
    };

    /**
     * Создание статьи с комментами
     * @param {object} tpl Шаблон статьи.
     * @returns {$}
     */
    Bred.prototype.render = function(tpl){
        var $article = tpl.article.clone().show();
        // Статья
        $article.find(tpl.places.title).html(this.articles.root.getSentence(3, 8));
        $article.find(tpl.places.date).text('сегодня в 11:22');
        $article.find(tpl.places.text).html(this.articles.root.getText(this.config));
        // Комменты
        var com = this.comments.isEmpty() ? this.articles.root : this.comments.root;
        var comment_list = [$article.find(tpl.places.comments)],
            $comment,
            i,cnt = Math.round(Math.random()*(this.config.comments.max-this.config.comments.min))+this.config.comments.min;
        $article.find(tpl.places.comments_cnt).text(cnt);
        var comment_cfg = {
            words:{max: 1, min: 15},
            paragraphs:{max: 1, min: 2},
            sentences:{max: 1,min: 3}
        };
        for (i=0; i<cnt; i++){
            $comment = tpl.comment.clone();
            $comment.find(tpl.places.comment_places.username).text((this.users.length > 0)? this.users[Math.round(Math.random() * (this.users.length-1))] : 'Гость');
            $comment.find(tpl.places.comment_places.date).text('сегодня');
            $comment.find(tpl.places.comment_places.text).html(com.getText(comment_cfg));
            comment_list[Math.round(Math.random() * (comment_list.length-1))].append($comment);
            comment_list.push($comment.find(tpl.places.comment_places.sub));
        }
        return $article;
    };

    return Bred;

})(jQuery, Chain);
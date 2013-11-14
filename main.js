/**
 * Создание среднестатической хабра-статьи с комментариями
 * @version 1.0
 * @date 08.10.2013
 * @author Vladimir Shestakov <boolive@yandex.ru>
 */
(function($, Bred){

    $(document).ready(function(){
        var $content = $('#content'),
            $wait = $('#bred_wait'),
            $form = $('#bred_form');

        // Генерируем и показываем бред
        $form.on('submit', function(e){

            // Шаблон статьи и комментария
            var tpl = {
                comment: $('#bred_comment').remove(),
                article: $('#bred_article').remove(),
                places:{
                    title: '.post_title',
                    date: '.post_date',
                    text: '.post_text',
                    comments: '.post_comments',
                    comments_cnt: '.post_comments_count',
                    comment_places: {
                        username: '.username',
                        date: '.date',
                        text: '.message',
                        sub: '.reply_comments'
                    }
                }
            };
            var config = {
                quality: parseInt($form.find('[name="quality"]').val()),
                words:{
                    max: parseInt($form.find('[name="words[min]"]').val()),
                    min: parseInt($form.find('[name="words[max]"]').val())
                },
                paragraphs:{
                    max: parseInt($form.find('[name="paragraphs[min]"]').val()),
                    min: parseInt($form.find('[name="paragraphs[max]"]').val())
                },
                sentences:{
                    max: parseInt($form.find('[name="sentences[min]"]').val()),
                    min: parseInt($form.find('[name="sentences[max]"]').val())
                },
                comments:{
                    max: parseInt($form.find('[name="comments[min]"]').val()),
                    min: parseInt($form.find('[name="comments[max]"]').val())
                }
            };

            $form.addClass('hide');
            $wait.show();

            $.get($form.find('[name="src"]').val(), function(src){
                $content.append((new Bred(src, config)).render(tpl));
                $wait.hide();
            });

            return false;
        })
    });
})(jQuery, Bred);
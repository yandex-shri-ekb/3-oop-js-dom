"use strict"
# @App
#
# Основной класс приложения
# Использует класс @Generator для наполнения страницы контентом
class App

  constructor: ->
    @$article = $('#article')

    # Хранение часто используемых элементов
    @view = {
      $title         : @$article.find('.post_title'),
      $content       : @$article.find('.content'),
      $author        : @$article.find('.author a'),
      $commentsCount : @$article.find('.comments_count')
      $comments      : @$article.find('.comments_list')
      $form          : @$article.find('form')
      $overlay       : $('.overlay')
    }

    @isRun = false # Не запускаем несколько генераторов статей одновременно
    @assignEvents()

  # Назначение событий
  #
  # @public
  assignEvents: ->
    $(document).on('click', '.run-btn', $.proxy(@onClickRunBtn, @))

  # Событие при нажатии на .run-btn
  #
  # @public
  onClickRunBtn: (e)->
    if @isRun then return false
    @isRun = true
    @runApp()
    return false

  # Запускает создание статьи и комментариев
  #
  # @public
  runApp: ->
    if !@generator # генератор еще не инициализирован

      @view.$overlay.show()
      # Можно было бы использовать success, error, но такой вариант мне кажется более читаемым
      # в любом случае, если передан один аргумент, то возвращается promise-версия объекта $.ajax
      $.when($.ajax('books/habr.html'))
      .done($.proxy(@onSuccessRun, @))
      .fail($.proxy(@onFailRun, @))
      .always($.proxy(@onAlwaysRun, @))
    else
      @runWriter()
      @generator.configure(@getConfig(''), false)

  # Событие при успешном запуске
  #
  # @public
  onSuccessRun: (content)->
    @generator = new Generator(@getConfig(content))
    @runWriter()
    @$article.show()

  # Событие при ошибке
  #
  # @public
  onFailRun: (e)->
    alert("Произошла ошибка при загрузки статьи. Пожалуйста, повторите через несколько минут.")

  # Событие при получении ответа от сервера
  #
  # @public
  onAlwaysRun: ->
    @view.$overlay.css('display', 'none')

  # Просим Донцову придумать статью и несколько более-менее связных комментариев
  #
  # @public
  runWriter: ->
    @writeArticle()
    @writeComments()
    @isRun = false

  # Выводит статью
  #
  # @public
  writeArticle: ->
    @view.$content.html(@generator.generateArticle())
    title = @generator.generateTitle()
    author = @generator.generateNick()
    @view.$title.html(title)
    @view.$author.html(author)
    @generator.generateImage(title)

  # Выводит несколько комментариев
  #
  # @public
  writeComments: ->
    count = Helper.getRandomInt(10, 20)
    # Через filter работает быстрее, чем если указать сразу два класса
    # Используем болванку для создания новых комментариев
    $emptyComment = @$article.find('.comment_item').filter('.hidden')

    $comments = $()

    for i in [0..count]
      $comment = $emptyComment.clone()
      message  = @generator.generateComment()
      username = @generator.generateNick()
      time     = @generator.generateTime()

      $comment.find('.message').html(message)
      $comment.find('.username').html(username)
      $comment.find('time').text(time)

      $comments = $comments.add($comment)

    $comments.removeClass('hidden')
    @view.$commentsCount.text(count)
    @view.$comments.append($comments)


  # Создает конфигурацию на основе введенных данных из формы.
  #
  # @public
  getConfig: (content)->
    # Можно заменить name на id
    form = @view.$form
    return config = {

      content: content
      npref: form.find('[name=npref]').val()

      words:
        min: form.find('[name=words_min]').val()
        max: form.find('[name=words_max]').val()

      sentences:
        min: form.find('[name=sentences_min]').val()
        max: form.find('[name=sentences_max]').val()

      paragraphs:
        min: form.find('[name=paragraphs_min]').val()
        max: form.find('[name=paragraphs_max]').val()

      libs:
        forbiddenLastWords: window.libs.forbiddenLastWords
        months: window.libs.months
    }

@App = App # делаем класс доступным из window
"use strict"

# @Generator
#
# Довольно сырая версия генератора текстов v0.05a
# Но тем не менее, на его создание я потратил последние несколько дней
# Множество раз было желание бросить все и переписать с нуля, но все-таки я дошел до какого-то логического завершения
#
# В работе использованы части регулярных выражений от @mayton и его некоторые другие идеи

# Основные функции
# - Генерация статьи и комментариев,
#   с использованием словаря запрещенных слов и указанием количества слов/предложений/абзацев
# - Генерация ников
# - Генерация даты
class Generator

  constructor : (config)->
    # Хранение различных настроек генератора
    @dict = { # словари для статьи и комментариев
      article: new Dict
      comment: new Dict
    }
    @libs = { # запрещенные последние слова в предложении
      forbiddenLastWords: config.libs.forbiddenLastWords
      nicknames: [] # зарезервировано для будущего использования
      months: config.libs.months
    }
    @cache = {
      nicknamesLen: 0 # будет обновлено при инициализации
    }

    @configure(config)
    @init()


  # Настройка параметров генератора
  #
  # @public
  configure: (config, firstInit = true) ->

    @config = {
      paragraphs: # количество абзацев в статье
        min   : if +config.paragraphs.min > 0 then +config.paragraphs.min else 6
        max   : if +config.paragraphs.max > 0 then +config.paragraphs.max else 20

      sentences: # количество предложений в абзаце
        min   : if +config.sentences.min > 0 then +config.sentences.min else 6
        max   : if +config.sentences.max > 0 then +config.sentences.max else 14

      words: # количество слов в предложении
        min   : if +config.words.min > 0 then +config.words.min else 9
        max   : if +config.words.min > 0 then +config.words.max else 17
    }

    if firstInit
      @config.content = config.content # текст для анализа
      @config.npref   = if +config.npref > 0 then +config.npref else 2    # слов в префиксе

  # Запускает разбор статей и комментариев
  #
  # @public
  init: ->
    # Находим все статьи в тексте
    $articles = @config.content.match(/<article>[\s\S]*?<\/article>/g)
    self = @

    $.map($articles, (article)->
      $article = $(article)
      $comments = $article.find('.comment') # Находим комментарии

      $.map($comments, (comment)->
        self.parseComment($(comment)) # Добавляем слова из комментария в словарь
      )
      # Добавляем слова из статьи в словарь
      self.parseArticle($article.find('.comments').remove().end())
    )
    @cache.nicknamesLen = @libs.nicknames.length

  removePre: ($el)->
    $el.find('pre').remove().end()

  # Добавляет слова из комментария в словарь
  #
  # @public
  parseComment: ($comment)->
    $comment = @removePre($comment)

    username = $comment.children('.username').text()
    @libs.nicknames.push(username)

    words = $comment.find('.message').text().split(/\s/)
      .filter (item)->
        item isnt ""
    @dict.comment.add(words, @config.npref)


  # Добавляет слова из статьи в словарь
  #
  # @public
  parseArticle: ($article)->
    $article = @removePre($article)
    words = $article.text().split(/\s/)
      .filter (item)-> item isnt "" # Убираем пустые слова
    @dict.article.add(words, @config.npref)


  # Создает текст на основе словаря
  #
  # @public
  generateText: (dict, minWords, maxWords)->
    minWords-- # Уменьшаем количество слов, т.к. индексы начинаются с нуля, а не с единицы
    maxWords--

    text = [] # Хранение текста
    dict.shuffle() # Открываем словарь на случайном слове

    while dict.isValid
      text.push(dict.current()) # Добавляем в текст текущее открытое слово в словаре
      p = (text.length - minWords) / (maxWords - minWords) #

      lastI = text.length-1

      if (maxWords <= lastI || p > Math.random()) && text[lastI].match(/[^,:-]/)
        if @lastWordIsValid(text[lastI])
          if text[lastI].match(/[^.!?]/)
            text.push('.')
          break
        else text.pop()
      dict.next()

    return text.join(' ')

  # Определяет, можно ли закончить данным словом предложение, чтобы не потярять смысл.
  #
  # @public
  lastWordIsValid: (word)->
    return !(word.toLowerCase() in @libs.forbiddenLastWords)

  # Создает заголовок для статьи
  #
  # @public
  generateTitle: ->
    text = @generateText(@dict.article, @config.words.min, @config.words.max)
    text = @purifyText(text)

  # Создает текст статью
  #
  # @public
  generateArticle: ->
    pCount = Helper.getRandomInt(@config.paragraphs.min, @config.paragraphs.max)
    text = ''
    for i in [1..pCount]
      sCount = Helper.getRandomInt(@config.sentences.min, @config.sentences.max)
      temp = @generateText(@dict.article, sCount*@config.words.min, sCount*@config.words.max)
      text += @purifyText(temp)
      if i isnt pCount then text += "<br/><br/>"

    return text

  # Создает текст комментария
  #
  # @public
  generateComment: ->
    pCount = 1
    text = ''
    for i in [1..pCount]
      sCount = Helper.getRandomInt(@config.sentences.min, @config.sentences.max)
      temp = @generateText(@dict.comment, sCount*@config.words.min, sCount*@config.words.max)
      text += @purifyText(temp) + "<br/><br/>"

    return text

  generateNick: ->
    i = Helper.getRandomInt(0, @cache.nicknamesLen)
    return @libs.nicknames[i]

  generateTime: ->
    startDate = new Date(2013, 1, 1).getTime()
    now = new Date().getTime()
    date = new Date(Helper.getRandomInt(startDate, now));
    return  "#{date.getDay()+1} #{@libs.months[date.getMonth()]} " +
            "#{date.getFullYear()} в #{@pad(date.getHours())}:#{@pad(date.getMinutes())}"

  pad: (n)-> if n <10 then '0' + n else n

  # Очищает текст и делает его красивым
  #
  # @public
  purifyText: (text) ->
    # Некоторые из регулярок позаимствованы у @mayton, за что ему огромное спасибо :)
    # Некоторые были модицированы, некоторые придуманы самостоятельно

    # Удаляем различные адреса
    text = text.replace(/(?:(?:https?|ftp):\/\/)*(?:www.|ftp.)*[А-я\w.-]+\.[A-z]{2,4}/gi, '')

    # Удаляем спецсимволы html
    text = text.replace(/&\w+;|&#\d+;/g, ' ');

    # Добавляем пробелы перед и после знаков препинания
    # т.к. возможен вариант, что перед знаком не стоит пробел
    text = text.replace(/([!?.:,—])/g, ' $1 ')

    # Удаляем все теги
    text = text.replace(/<\/?[^>]+>/g, '');

    # Раскрываем сокращения
    text = text.replace(/(т . е .|т . к .|т . п .|т . д .|т . о .|с . м .|д . р .|у . e .)/g, (result)->
      switch (result)
        when 'т . е .' then 'то есть'
        when 'т . к .' then 'так как'
        when 'т . п .' then 'тому подобное'
        when 'т . д .' then 'так далее.'
        when 'т . о .' then 'таким образом'
        when 'с . м .' then 'смотрите'
        when 'д . р .' then 'другое'
        when 'y . e .' then 'евро'
    );

    # Удаляем пробелы перед знаками препинания
    text = text.replace(/\s+([!?.:,])/g, '$1')

    # Исключаем ненужные символы
    text = text.replace(/[^A-zА-яёЁ0-9\s!?.,:\-—<>#]/g, '');

    text = text.replace(/\n|^\s*—\s+/g, '')

    # Удаляем повторяющиеся знаки
    text = text.replace(/([!?.:,—])(?:\s?[!?.:,—])+/g, '$1')

    # Заменяем несколько пробелов на один
    text = text.replace(/\s+/g, ' ');


    # Делаем первую букву нового абзаца большой
    text = text.replace(/<br\/>[a-zа-яё]/g, (firstChart)->
      firstChart.toUpperCase()
    )
    # Делаем первую букву предложения большой
    # Не получилось объединить с предыдущим
    text = text.replace(/(?:^\s*|[!?.]\s)[a-zа-яё]/g, (result) ->
      result.toUpperCase()
    )

    return text

  # Отправляет паука в Google Images, в надежде, что он найдет картинку по запросу
  #
  # @public
  generateImage: (query)->
    # Можно использовать события success и error $.ajax, но так более читаемо
    $.when($.ajax('http://ajax.googleapis.com/ajax/services/search/images', {
      data:
        v: '1.0',
        rsz: 1, # количество результатов
        q: query
      dataType: 'jsonp',
    })).then(@onSuccessGenerateImage, @onFailureGenerateImage)

  # Обрабатывает успешное событие при генерации изображения
  #
  # @public
  onSuccessGenerateImage: (data)->
    if data.responseData? && data.responseData.results? # если есть результат
      data = data.responseData.results[0]
      if data.width > 600 then data.width = '600' # уменьшаем размер, если он слишком большой

      $img = $('<img>',
        src: data.url,
        width: data.width,
        alt: data.titleNoFormatting
      )
      $('.content').prepend($img, '<br><br>')

  # Обрабатывает событие ошибки при генерации изображения
  #
  # @public
  onFailureGenerateImage: (e) ->
    alert('Произошла ошибка при получении данных с Google.com')

@Generator = Generator # делаем класс доступным из window
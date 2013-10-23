"use strict";
(function(window, $, undefined){
  var opt = {
    deep: 3
  };
  var strt = new Date();

  function rand( n ){
    return Math.floor(Math.random()*n)
  }
  function randByArray( arr ) {
    var ret = arr[0] + rand( arr[1] - arr[0] );
    return ret
  }

  function parser( $node ) {
    var txt = $.trim( $node.text().toLowerCase() ).
          replace(/[\[\]\{\}\(\)«»]/g,''). 
          replace(/\n/g,' '). 
          replace(/\s+/g,' '); 
    var textList = txt.split(' ');

    var distinct = {};

    for (var i = textList.length; i--;) {
      distinct[textList[i]] = i
    }

    var wordList = [];

    for (var i in distinct) {
      distinct[i] = wordList.push(new Word(i, distinct[i])) - 1;
    }
    
    var dic = textList.map( function( el, i, arr ){
      var tmp = new Relation();

      tmp.setPos( 0, wordList[ distinct[el] ] );
      for (var j = 1; j < opt.deep; j++ ) {
        tmp.setPos( j, 
          wordList[ distinct[ arr[ i + j ] ] ]
         );
      }

      return tmp;
    } );

    return wordList;
  }; // end of parser function

  function rels( w1, w2, wordList ) {
    var rel1 = w1.relPos[0],
        rel2 = w2.relPos[1],
        rel = [];
    for (var i = rel1.length; i--;) {
      if ( rel2.indexOf( rel1[i] ) + 1 ) {
        rel.push( rel1[i] );
      }
    };
    var rel3 = rel[ rand(rel.length) ];
    if (rel3) {
      var w3 = rel3.wordPos[2];
    };
    return w3||wordList[0];
  };

  function sentence( ln, wordList ){
    var sent = [];
    var w = wordList[ rand( wordList.length ) ];
    var rel = w.relPos[0];
    rel = rel[ rand( rel.length ) ];
    sent.push( w );
    sent.push( rel.wordPos[1] );

    for (var i = 2; i < ln; i++) {
      sent.push( rels( sent[ i - 2 ], sent[ i - 1 ] ) );
    };

    var ret = sent.join(' ').
          replace(/(^[a-zа-я]|[.!?]\s[a-zа-я])/g, function(str){ return str.toUpperCase() } ) +
          '.';
    return ret;
  };

  function paragraph(ln, sentLn, wordlist) {
    for (var i = ln, ret = []; i--;) {
      ret.push( sentence( randByArray( sentLn ), wordlist ) )
    }
    return $('<p>').text(ret.join(' '))
  }

  function section(ln, pLn, sentLn, wordlist) {
    var $ret = $('<section>');
    $ret.append( $('<h2>').text( sentence( randByArray([1,9]), wordlist ) ) );
    for (var i = ln; i--;) {
      
      $ret.append( paragraph( randByArray(sentLn), sentLn, wordlist ) )
    }
    return $ret
  }

  function article(ln, secLn, pLn, sentLn, wordlist) {
    var $ret = $('<article>');
    $ret.append( $('<h1>').text( sentence( randByArray([3,9]), wordlist ) ) );
    for (var i = ln; i--;) {
      $ret.append( section( randByArray(secLn) , pLn, sentLn, wordlist ) )
    }
    return $ret
  }


  function CommentList( wordList, nicknames ) {
    var ln = 70;
    var tmpList = [this];
    var _ln = 1;
    this.reply = [];

    for (var i = ln; i--;) {
      var tmp = new Comment( wordList, nicknames[ rand(nicknames.length) ] );
      tmpList[ rand( _ln ) ].addReply( tmp );
      _ln = tmpList.push( tmp );
      tmp.setId( _ln );
    };
  };

  CommentList.prototype.addReply = function( reply ){
    this.reply.push( reply );
  }

  CommentList.prototype.retJQ = function(){
    return $('<div class="comment-list">').html( this.reply.join(' ') );
  };

  function Comment( wordList, nick ) {
    
    this.nick = nick;
    this.reply = [];
    this.date = new Date() - rand( 3*24*60*60*1000 );
    this.content = paragraph(randByArray( [1, 3] ), [10, 20], wordList ).text();
    this.raiting = randByArray([-20, 40]);
    
  }

  Comment.prototype.addReply = CommentList.prototype.addReply;

  Comment.prototype.setId = function( id ){
    this.id = id;
  };

  Comment.prototype.retDate = function() {
    function zero( n ) {
      return n > 9 ? ( '' + n ):( '0' + n );
    };
    var mon = "января февраля марта апреля мая июня июля августа сентября октября ноября".split(' '),
        tmp = new Date(this.date),
        tmpl = "day mon year в h:m",
        data = {
          day: zero( tmp.getDate() ),
          mon: mon[ tmp.getMonth() + 1 ],
          year: tmp.getFullYear(),
          h: zero( tmp.getHours() ),
          m: zero( tmp.getMinutes() )
        };
    for (var i in data) {
      tmpl = tmpl.replace( i , data[i] );
    }
    return tmpl;
  }

  Comment.prototype.toString = function() {
    var rait = this.raiting<0?(' bad' + Math.max( -5, this.raiting )):'';
    var ret = [
     '<div class="comment" id="'+ this.id +'">' ,
     '  <div class="comment-caption">' ,
     '    <a href="http://habrahabr.ru/users/'+ this.nick +'/" class="comment-nickname">' ,
            this.nick ,
     '    </a>' , 
     '    <span class="comment-date">' ,
            this.retDate() ,
     '    </span>' ,
     '    <a href="#'+ this.id +'" class="comment-link">#</a>' ,
     '    <div class="comment-rait">' ,
            this.raiting ,
     '    </div>' ,
     '  </div>' ,
     '  <div class="comment-content'+ rait +'">' ,
          this.content ,
     '  </div>' ,
     '  <div class="comment-reply">' ,
          this.reply.join('\n') ,
     '  </div>' ,
     '</div>']
    return ret.join('\n');
  };

  function Relation() {
    this.wordPos = []
  }
  Relation.prototype.setPos = function( pos , word ) {
    if (word) {
      this.wordPos[pos] = word;
      word.relPos[pos].push( this );
    }
  }

  function Word(name, pos){
    this.name = name;
    this.pos = pos;
    this.relPos = [];
    for (var i = opt.deep; i--;) {
      this.relPos.push([]);
    }
  }
  Word.prototype.toString = function(){
    return this.name;
  }

  $.get('habr.htm', function(txt){

    var $conteiner = $(txt).eq(3);

    var users = [];
    $conteiner.find('.username').each(function(){
      users.push( $(this).remove().text() );
    });

    var $links = $conteiner.find('a').remove();
    var comments = parser( $conteiner.find('.comments').remove() );
    var articles = parser( $conteiner.remove() );

    var $article = article( randByArray([4,12]), [1,7], [3,8], [7,20], articles );

    var cl = new CommentList( comments, users );
    
    $article.append( cl.retJQ() );

    $article.appendTo( document.body );

  }, 'html');




})(window, jQuery);

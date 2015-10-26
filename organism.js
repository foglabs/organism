Lives = new Mongo.Collection("lives");

var newCount = 1;

function randi(max){
  return Math.floor(Math.random() * parseInt(max));
}

if (Meteor.isClient) {

  Template.body.helpers({
    lives: function () {
      return Lives.find({store: 0});
    }
  });

  Template.body.events({
    "dragstop .bub" : function(e){
      var w = $(window).width();
      var h = $(window).height();

      Lives.update({_id: e.target.id},  { $set: {x: e.clientX/w,  y: e.clientY/h } });

      $("img.bub").each(function(i){
        var dude = Lives.find({_id: this.id}).fetch()[0];
        $('#' + this.id).css('left', dude.x * w + 'px' ).css('top', dude.y * h + 'px' );
      });
    
    },
    "submit #cre" : function(e){
      e.preventDefault();
      var indo = $('#t');

      Meteor.call("imgsrch", indo.val(), function(er, re) {
      });

      indo.val("");
    }
  });

  Template.dell.events({
    "drop #byebye" : function(e){
      var idz = e.toElement.id;
      if(idz){
        Lives.remove({_id: idz});
      }
    }
  });
  Template.storage.events({
    "drop .storebox" : function(e){
      var idz = e.toElement.id;
      Lives.update({_id: idz}, { $set: {store: e.target.id.replace(/\D/, '') }})
    },
    "click .storebox" : function(e){
      
      Meteor.call("pullstore", e.target.id.replace(/\D/, ''), function(er, re) {});
    }

  });

  Template.mating.events({
    "drop #lb1" : function(e){
      var idz = e.toElement.id;
      var yo = Lives.find({_id: idz}).fetch()[0].img;

      if(idz){
        Session.set('zygote1', idz);
        Lives.update({_id: idz}, { $set: { x: 0.5, y: 0.5}});  
        $('#' + e.target.id).css('background-color', '#FFFFFF');
      }

      $('#lb1').css('background-image', 'url(' + yo + ')');
      $('#lbi1').attr('src', yo).addClass('flick');
    },
    "drop #lb2" : function(e){
      var idz = e.toElement.id;
      var yo = Lives.find({_id: idz}).fetch()[0].img;

      if(idz){
        Session.set('zygote2', idz);
        Lives.update({_id: idz}, { $set: { x: 0.5, y: 0.5}});
        $('#' + e.target.id).css('background-color', '#FFFFFF');
      }

      $('#lb2').css('background-image', 'url(' + yo + ')');
      $('#lbi2').attr('src', yo).addClass('flick');;
    },

    "click #mate" : function(e){
      var zy1 = Session.get('zygote1');
      var zy2 = Session.get('zygote2');

      if(zy1 && zy2){
        z1 = Lives.find({_id: zy1}).fetch()[0];
        z2 = Lives.find({_id: zy2}).fetch()[0];

        zd1 = z1.dna.split(' ');
        zd2 = z2.dna.split(' ');

        if(typeof z1 != 'undefined' && typeof z2 != 'undefined'){
          var h = $(window).height();

          var babysrch = zd1[randi(zd1.length)] + " " + zd2[randi(zd2.length)];
          Meteor.call("imgsrch", babysrch, function(er, re) {});

          var np1x = ( newCount % 5 )/ 5;
          var np1y = (Math.floor(newCount/5) * 220)/h;
          var np2x = ( (newCount+1) % 5 )/ 5;
          var np2y = (Math.floor((newCount + 1)/5) * 220)/h;

          Lives.update({_id: zy1},  { $set: {x: np1x,  y: np1y } });
          Lives.update({_id: zy2},  { $set: {x: np2x,  y: np2y } });
          newCount += 2;

          var w = $(window).width();
          var h = $(window).height()

          $("#" + zy1).css('left', Math.floor(np1x * w) + 'px').css('top', Math.floor(np1y * h) + 'px' );
          $("#" + zy2).css('left', Math.floor(np2x * w) + 'px').css('top', Math.floor(np2y * h) + 'px' );

          // var p = jsPlumb.getInstance();
          // p.importDefaults({
          //   Connector : [ "Bezier", { curviness: 150 } ],
          //   Anchors : [ "TopCenter", "BottomCenter" ]
          // });

          // p.connect({
          //   source: $('#' + zy1)[0].id,
          //   target: $('#' + zy2)[0].id
          // });

          $('.lifebub').css('background-color', '#000000');
          $('.lifebub img').removeClass('flick');
        }
      }
    }
  });

  Template.body.rendered = function(){
    var w = $(window).width();
    var h = $(window).height();

    $("body").animate({backgroundColor: '#FF0000'}, 1000);

    $("img.bub").each(function(i){
      var dude = Lives.find({_id: this.id}).fetch()[0];
      $('#' + this.id).css('left', Math.floor(dude.x * w) + 'px').css('top', Math.floor(dude.y * h) + 'px');
    });
  }

  Template.mating.rendered = function(){
    $('#lb1').droppable();
    $('#lb2').droppable();
  }

  Template.dell.rendered = function(){
    $('#byebye').droppable();
  }

  Template.storage.rendered = function(){
    $('.storebox').droppable();
  }

  Template.life.rendered = function(){

    $("img.bub").mouseover(function(e) {
      var deez = e.currentTarget.id;
      $( '#' + deez ).draggable();
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Npm.require('cheerio');

    Meteor.methods({
        imgsrch: function(que) {

          var wordo = ['the','of','and','to','a','in','for','is','on','that','by','this','with','i','you','it','not','or','be','are','from','at','as','your','all','have','new','more','an','was','we','will','home','can','us','about','if','page','my','has','search','free','but','our','one','other','do','no','information','time','they','site','he','up','may','what','which','their','news','out','use','any','there','see','only','so','his','when','contact','here','who','also','now','help','get','pm','view','online','c','e','first','am','been','would','how','were','me','s','services','some','these','its','like','service','x','than','find','price','date','back','top','people','had','list','name','just','over','state','year','day','into','email','two','n','world','re','next','used','go','b','work','last','most','products','buy','make','them','should','product','system','post','her','city','t','add','policy','number','such','please','available','copyright','support','message','after','best','then','jan','good','well','d','where','info','rights','public','through','m','each','links','she','review','years','order','very','privacy','book','items','company','r','read','group','need','many','user','said','de','does','set','under','general','january','mail','full','map','reviews','program','know','way','days','management','p','part','could','great','united','hotel','real','f','item','international','center','ebay','must','store','comments','made','report','off','member','details','line','terms','before','did','send','right','type','because','local','those','using','results','office','education','national','take','posted','internet','address','community','within','states','area','want','phone','dvd','shipping','reserved','subject','between','forum','family','l','long','based','w','code','show','o','even','check','special','prices','website','index','being','much','sign','file','link','open','today','south','case','project','same','pages','uk','version','section','own','found','sports','house','related','both','g','county','photo','members','power','while','care','network','down','systems','three','total','place','end','following','download','h','him','without','per','access','think','north','resources','current','posts','media','control','history','pictures','size','personal','since','including','guide','shop','directory','board','location','change','text','small','rating','rate','children','during','usa','return','students','v','shopping','account','times','sites','level','digital','profile','previous','form','events','love','old','john','main','call','hours','image','department','title','description','non','k','y','insurance','another','why','shall','property','class','cd','still','quality','every','listing','content','country','private'];

          var url = "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + que;
          var r = Meteor.http.get(url);

          if(!r.data.responseData){
            return;
          }

          var eemah = r.data.responseData.results[0].url;
          var dnaurl = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + que;
          var dnar = Meteor.http.get(dnaurl);

          // var $ = cheerio.load(dnar.data.responseData.results[0]);

          if(dnar.data.responseData != null && dnar.data.responseData != undefined ){
            var dna = '';
            for(i=0; i<dnar.data.responseData.results.length; i++){ 
              var words = dnar.data.responseData.results[i].content.replace(/<.*>/, '').split(' ');
              
              for(i=0; i<words.length; i++){
                words[i] = words[i].replace(/\W/, '');

                if(wordo.indexOf(words[i]) > -1){
                  continue;
                }

                if(words[i] === "" || words[i].length < 3){
                  words.splice(i, 1);
                }
              }
      
              for(c=0; c < 5; c++){
                dna += words[Math.floor(Math.random()*words.length)] + " ";
              }
            }
          }

          idee = que.replace(/\W/g, '');

          Lives.insert({
            srch: idee,
            img: eemah,
            dna: dna,
            createdAt: new Date(),
            store: 0,
            x: 0,
            y: 0
          });
        },
        pullstore: function(which) {
          var stored = Lives.find({store: which});
          Lives.update(stored, {$set: {store: 0}} );
        }
    });
  });
}
  
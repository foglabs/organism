Lives = new Mongo.Collection("lives");
// Lives.remove({});

if (Meteor.isClient) {

  Template.body.helpers({
    lives: function () {
      return Lives.find({});
    }
  });

  Template.body.events({
    "dragstop .bub" : function(e){
      console.log(e); 
    },
    "submit #cre": function(e){
      e.preventDefault();
      var indo = $('#t');

      Meteor.call("imgsrch", indo.val(), function(er, re) {
      });

      indo.val("");
    }
  });

  Template.life.rendered = function(){
    $("div.bub").mouseover(function(e) {
      // $('#' + e.currentTarget.id).css("background-color", "#222222")
      
      var deez = e.currentTarget.id;
      $( '#' + deez ).draggable();
    });

    // make connections between parents and children!
    // var p = jsPlumb.getInstance();
    // p.importDefaults({
    //   Connector : [ "Bezier", { curviness: 150 } ],
    //   Anchors : [ "TopCenter", "BottomCenter" ]
    // });

    // p.connect({
    //   source: deez,
    //   target: 'butt'
    // });
    // 
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Npm.require('cheerio');

    Meteor.methods({
        imgsrch: function(que) {
        var url = "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + que;
        
        var r = Meteor.http.get(url);
        // var zero = cheerio.load(r.data.responseData.results[0]);
        var eemah = r.data.responseData.results[0].url;

        var dnaurl = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + que;
        var dnar = Meteor.http.get(dnaurl);

        var dna = '';
        for(i=0; i<dnar.data.responseData.results.length; i++){ 
          var words = dnar.data.responseData.results[i].content.replace(/<.*>/, '').split(' ');
          
          for(i=0; i<words.length; i++){
            words[i] = words[i].replace(/\W/, '');

            if(words[i] === "" || words[i].length < 3){
              words.splice(i, 1);
            }
          }
  
          for(c=0; c < 5; c++){
            dna += words[Math.floor(Math.random()*words.length)] + " ";
          }
        }

        console.log(dna);

        idee = que.replace(/\W/g, '');

        Lives.insert({
          srch: idee,
          img: eemah,
          dna: dna,
          createdAt: new Date()
        });
      }
    });
  });
}
  
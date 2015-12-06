
//-------socket.io--------//

var hereWeGoHashtags;
var hashtaggs = 　 [];
var textPositions = [];
var socket = io();
var prevMsg;

//-------iTunes API--------//
var serchButton
var keyword;
var pTerms = []; // all of the search terms
var song;
var popularSongs = []; // data from the API

var hat;

function preload() {
  hat = loadSound('src/hat1.wav');
}


function setup() {
  createCanvas(1200, 1000);
  fill(255);
  stroke(255);

  
  socket.on('download', whenIgetTheHashtags);
  
  // function(msg) {
  //   //console.log("getting data");
  //   if (msg != prevMsg) {
  //     hashtaggs.push(msg);
  //     textPositions.push( { x: random(width), y: random(height) } );
  //   }
  //   //document.getElementById('showHash').innerHTML = hashtaggs[1];
  //   //document.getElementById('showHash').innerHTML = msg;
  //   prevNsg = msg;
  // });

}


function draw() {
  background(0);
  for (var i = 0; i < hashtaggs.length; i++) {
    var txt = hashtaggs[i];
    var pos = textPositions[i];
    
    text(txt, pos.x, pos.y);
  }
}

//-------socket.io--------//
function whenIgetTheHashtags (msg){
   if (msg != prevMsg) {
      hashtaggs.push(msg);
      textPositions.push( { x: random(width), y: random(height) } );
    }
    //document.getElementById('showHash').innerHTML = hashtaggs[1];
    //document.getElementById('showHash').innerHTML = msg;
    prevNsg = msg;
    search(msg);
}


//-------iTunes API--------//
function search(keywords) {

  keyword = keywords;
  var url = "https://itunes.apple.com/search?media=music&limit=3&entity=song&attribute=artistTerm&term=" + keyword;
  loadJSON(url, gotData, 'jsonp');
  append(pTerms, keyword);
  console.log('here');
}

function gotData(data) {
  console.log(data);
  popularSongs = data;

  // if there's no data, show an error message
  if (data.resultCount === 0) {
    hat.play();

    if (pTerms.length >= 1 && song !== undefined) {
      song.remove();
    }
  }

  // if there is data, and
  // if nothing has ever been played, create a new song
  else if (song === undefined) {
    song = createAudio(data.results[0].previewUrl); //new Audio is the other way
    song.play();
  }
  
  // if a song has been played and we're changing the song, remove the original and then create a new one
  else {
    song.remove();
    song = createAudio(data.results[0].previewUrl);
    song.play();
  }

}

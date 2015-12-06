//to get json form Twitter and Instagram
var keyword;
var twitterUrl;
var instagramUrl;

//to manage json file
var mediaUrls = [];
var texts = [];
var theTweetText = '';
var hashtags = '';
var img1;

//dom elements
var serchInput, button, greeting,hashDescription, hashTextInput, hashSubmit;

var socket = io();

function setup() {
  createCanvas(1200, 1000);
  background(255);
  fill(0);

  greeting = createElement('p', 'enter a keyword to search');
  greeting.position(20, 5);

  //search box
  serchInput = createInput();
  serchInput.position(20, 45);
  serchInput.id('mySearch');

  //submit button
  button = createButton('search');
  button.position(150, 45);
  button.mousePressed(loadImgs);

  //directing people to submit hashtags
  hashDescription = createP('describe these images in 1 word or less!');
  hashDescription.position(450, 620);

  //hashtag input textbox
  hashTextInput = createInput();
  hashTextInput.id('submitDom');
  hashTextInput.position(450, 660);

  //hashtag submit botton
  hashSubmit = createButton('submit');
  hashSubmit.position(600, 660);
  hashSubmit.id('submitBtn');
  hashSubmit.mousePressed(function() {
    submitDom = document.getElementById('submitDom');
    var uploadVal = submitDom.value;
    
    socket.emit('upload', uploadVal );
    console.log('uploaded ' + uploadVal );
  });

  hashTextInput.input(updateHashtags);
}

var lastRefreshTime = 0;

function loadImgs() {
  //call twitter image
  background(255);
  keyword = serchInput.value();
  print(keyword);
  var twitterUrl = "http://naokiishizuka.com/php/twitter.php?keyword=" + keyword;
  rawStrings = loadJSON(twitterUrl, function(data) {
    data.statuses.forEach(function(data) {
      var entities = data.entities;
      if (entities.media && entities.media.length > 0) {
        entities.media.forEach(function(media) {
          if (media.media_url && media.media_url.length > 0) {
            var thing = media.media_url;
            var tweets = data.text;
            texts.push(tweets);
            mediaUrls.push(thing);
          }
        });
      }
    });
    img1index = Math.floor(random(0, mediaUrls.length));
    loadImage(mediaUrls[img1index], function(img1) {
      //scale twitter img to fit inside 600x500 frame
      twWidth = img1.width;
      twHeight = img1.height;
      twRatio = twHeight / twWidth;
      twInverseRatio = twWidth / twHeight;
      twFrameW = 600;
      twFrameH = 500;
      twScaledW = twFrameW;
      twScaledH = twFrameW * twRatio;
      if (twScaledH > twFrameH) {
        twScaledH = twFrameH;
        twScaledW = twScaledH * twInverseRatio;
      }
      image(img1, 0, 70, twScaledW, twScaledH);
      text(theTweetText, 10, 600);
      text(hashtags, width / 2, 620);
    });
    theTweetText = texts[img1index];
  });

  //reset mediaUrls and tweets
  var mediaUrls = [];
  var texts = [];

  //load instagram image
  var instagramUrl = "http://zachcoble.com/itp/php/instagram.php?keyword=" + keyword;
  var rawInstaJson = loadJSON(instagramUrl, function(data) {
    // loadImage(data.data[0].images.standard_resolution.url, function(instaImg1)
    loadImage(data.data[0].images.standard_resolution.url, function(instaImg1) {
      //scale instagram img to fit inside 600x500 frame
      instaWidth = instaImg1.width;
      instaHeight = instaImg1.height;
      instaRatio = instaHeight / instaWidth;
      instaInverseRatio = instaWidth / instaHeight;
      instaFrameW = 600;
      instaFrameH = 500;
      instaScaledW = instaFrameW;
      instaScaledH = instaFrameW * instaRatio;
      if (instaScaledH > instaFrameH) {
        instaScaledH = instaFrameH;
        instaScaledW = instaScaledH * instaInverseRatio;
      }
      image(instaImg1, 600, 70, instaScaledW, instaScaledH);
    });
  });

  //clear text box
  serchInput.value('');
}

function drawHashtags() {
  hashtags = serchInput.value();
  console.log(hashtags);
}

function updateHashtags() {
  console.log('test');
  hashDescription.html(hashTextInput.value());

}

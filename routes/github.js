const { convert } = require('convert-svg-to-png');
var express = require('express');
var router = express.Router();

function getRandomSearch() {
    // A list of all characters that can be chosen.
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    
    // Gets a random character from the characters string.
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
  
    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + '%';
        break;
      case 1:
        randomSearch = '%' + randomCharacter + '%';
        break;
    }
  
    return randomSearch;
  }

/* GET home page. */
router.get('/', function(req, res, next) {
    const search = getRandomSearch();
    console.log(search)
    let att = 0;
    function doit() {
      att++;
        console.log("attempt number: ", att );
        retry();
    }
    function retry() {
      let randomOffset = Math.floor(Math.random() * 10000);
        req.spotify.searchTracks(search,{ limit: 1, offset: randomOffset})
        .then(async function(data) {
              let returnData = {
                "album_name": data.body.tracks.items[0].album.name,
                "album_image": data.body.tracks.items[0].album.images[2],
                "track_artist": data.body.tracks.items[0].artists[0].name,
                "track_name": data.body.tracks.items[0].name,
                "preview_url": data.body.tracks.items[0].preview_url,
                "spotify_url": data.body.tracks.items[0].external_urls.spotify,
                "is_explicit": data.body.tracks.items[0].explicit,
                "attempts": att,
              };

              const svg = `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%">
              <a href=${returnData.spotify_url}>
                <text overflow-wrap='normal' y='20'>
                Album: ${returnData.album_name} |
                Song:  ${returnData.track_name}
                </text >
                 <image y="40" href=${returnData.album_image.url}  height="${returnData.album_image.height}" width="${returnData.album_image.width}"/>
              </a>
         </svg>`
         await convert(svg, {'width': '500px', 'height': '500px'}).then(png => {
          res.set('Content-Type', 'image/svg+xml');
          res.send(png);
         }).catch(error => console.log(error))
              // res.contentType('image/svg+xml');
              // res.status(200).send(svg)
            }, function(err) {
              console.log("nope")
              doit();
        })};
        doit();
});

module.exports = router;

var express = require('express');
var router = express.Router();
var geoip = require('geoip-lite');
/* GET home page. */


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


router.get('/', function(req, res, next) {
    const search = getRandomSearch();
    console.log(search)
    let att = 0;
    // doit tracks attempts, by count
    function doit() {
      att++;
        console.log("attempt number: ", att );
        retry();
    }
    // retry makes the attempt to get data
    function retry() {
      let randomOffset = Math.floor(Math.random() * 10000);
        req.spotify.searchTracks(search,{ limit: 1, offset: randomOffset})
        .then(function(data) {

          let geo = geoip.lookup(req.connection.remoteAddress)
          console.log(geo);
          
          let returnData = {
            "album_name": data.body.tracks.items[0].album.name,
            "album_image": data.body.tracks.items[0].album.images[1],
            "track_artist": data.body.tracks.items[0].artists[0].name,
            "track_name": data.body.tracks.items[0].name,
            "preview_url": data.body.tracks.items[0].preview_url,
            "spotify_url": data.body.tracks.items[0].external_urls.spotify,
            "is_explicit": data.body.tracks.items[0].explicit,
            "attempts": att,
        };
        res.status(200).send(returnData);
        }, function(err) {
          console.log("nope")
          doit();
    })};
    doit();
    
});

module.exports = router;


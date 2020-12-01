var express = require('express');
var router = express.Router();

/* GET home page. */

const randomOffset = Math.floor(Math.random() * 1000);

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

    function doit() {
        console.log("had to retry");
        retry();
    }
    function retry() {
        req.spotify.searchTracks(search,{ limit: 1, offset: randomOffset})
        .then(function(data) {
            console.log(`Search tracks by ${search} in the artist name`, data.body);
            res.status(200).send(data.body);
        }, function(err) {
            console.log("nope")
            doit();
    })};
    retry();
    
});

module.exports = router;


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

    // new regex(/^:+[a-zA-Z]*:)
    function retry() {
      let randomOffset = Math.floor(Math.random() * 10000);
        req.spotify.searchTracks(search,{ limit: 1, offset: randomOffset})
        .then(function(data) {
          var getIpInfo = function (ip) {
            // IPV6 addresses can include IPV4 addresses
            // So req.ip can be '::ffff:86.3.182.58'
            // However geoip-lite returns null for these
            if (ip.includes('::ffff:')) {
                ip = ip.split(':').reverse()[0]
            }
            var lookedUpIP = geoip.lookup(ip);
            if ((ip === '127.0.0.1' || ip === '::1')) {
                return {error:"This won't work on localhost"}
            }
            if (!lookedUpIP){
                return { error: "Error occured while trying to process the information" }
            }
            return lookedUpIP;
        }

        var xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
        var ip = xForwardedFor || req.connection.remoteAddress;
        req.ipInfo = { ip, ...getIpInfo(ip) };
        console.log(req.ipInfo);
        let myip = getIpInfo(req.socket.remoteAddress);
        console.log(myip, req.ipInfo)

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


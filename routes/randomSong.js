var express = require('express');
var router = express.Router();
var geoip = require('geoip-lite');
var getRandomSearch = require('../lib/js/helpers/randomLib').getRandomSearch;

/* GET home page. */

// data.body.tracks.items[0].album.available_markets 
// check for current location and see if matches market else retry search


// data.body.tracks.items[0].album.name
// data.body.tracks.items[0].album.images[1]
// data.body.tracks.items[0].artists[0].name
// data.body.tracks.items[0].name
// data.body.tracks.items[0].preview_url
// data.body.tracks.items[0].external_urls.spotify
// data.body.tracks.items[0].explicit
//

/* GET random song object https://.../random */
router.get('/', function ( req, res ) {
    const search = getRandomSearch();
    console.log(search)
    let att = 0;
    // doit tracks attempts, by count
    function doit() {
        att++;
        console.log("attempt number: ", att );
        if (att >= 50){
            
        }
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
        console.log(ip);
        if (data.body.tracks.items[0].album.available_markets.includes(req.ipInfo.country) || ip === '::1'){
          console.log("passed");
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
        }
        else{
          console.log("bad Market Match");
          doit();
        }

        }, function(err) {
          console.log("nope")
          doit();
    })};
    doit();
    
});

module.exports = router;



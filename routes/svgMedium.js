const imageToBase64 = require('image-to-base64');
var express = require('express');
var router = express.Router();
var getRandomSearch = require('../lib/js/helpers/randomLib').getRandomSearch;
var geoip = require('geoip-lite');

const replaceList = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"]
];

function replacer(str) {
    replaceList.map((array) => {
        let replacer = new RegExp(array[0], 'g');
        str = str.replace(replacer, array[1]);
    });
    return str;
}

function createSVG(base64Image, imageData, songData){
    return(
        `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%">
            <a href='${songData.spotify_url}' target='_blank'>
                <text overflow-wrap='normal' y='${15}'>
                Album: '${replacer(songData.album_name)}' 
                </text >
                <text overflow-wrap='normal' y='${30}'>
                Artist(s): '${replacer(songData.track_artist)}' 
                </text >
                <text overflow-wrap='normal' y='${45}' >
                Song:  '${replacer(songData.track_name)}'
                </text >
                <text overflow-wrap='normal' y='${50 + imageData.height + 15}' >
                Explicit?  ${songData.is_explicit ? 'true' : 'false'}
                </text >
                <image y="${50}" href='data:image/jpeg;base64,${base64Image}'  height="${imageData.height}" width="${imageData.width}"/>
            </a>
        </svg>`
    )
}


router.get('/', function(req, res, next) {
    let search = getRandomSearch();
    // console.log("Search", search)
    let att = 0;
    function doit() {
      att++;
      if (att >= 50){
        search = getRandomSearch();
      }
        console.log("attempt number: ", att );
        retry();
    }
    function retry() {
        let randomOffset = Math.floor(Math.random() * 10000);
        req.spotify.searchTracks(search,{ limit: 1, offset: randomOffset})
        .then( async function(data) {
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
            if (data.body.tracks.items[0].album.available_markets.includes(req.ipInfo.country) || ip === '::1'){
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
                imageToBase64(returnData.album_image.url) // Image URL
                .then((response) => {
                    const svg = createSVG(response, returnData.album_image, returnData);
                    res.set('Content-Type', 'image/svg+xml');
                    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
                    res.send(svg);
                })
            }
        }, function(err) {
            console.log("nope")
            doit();
        })};
    doit();
});

module.exports = router;

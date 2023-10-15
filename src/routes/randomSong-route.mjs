import express from "express";
const router = express.Router();
import geoip from "geoip-lite";
import getRandomSearch from "../lib/js/helpers/randomLib.mjs";

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

const getData = (req, max, callback) => {
  let search = getRandomSearch();
  // console.log(search)
  let att = 0;
  let index = 1;
  let retArray = [];
  // doit tracks attempts, by count
  function doit() {
    att++;
    // console.log("attempt number: ", att, search );
    if (att % 50 === 0) {
      search = getRandomSearch();
    }
    retry();
  }
  // retry makes the attempt to get data

  // new regex(/^:+[a-zA-Z]*:)
  function retry() {
    let randomOffset = Math.floor(Math.random() * 10000);
    req.spotify.searchTracks(search, { limit: 1, offset: randomOffset }).then(
      function (data) {
        var getIpInfo = function (ip) {
          // IPV6 addresses can include IPV4 addresses
          // So req.ip can be '::ffff:86.3.182.58'
          // However geoip-lite returns null for these
          if (ip.includes("::ffff:")) {
            ip = ip.split(":").reverse()[0];
          }
          var lookedUpIP = geoip.lookup(ip);
          if (ip === "127.0.0.1" || ip === "::1") {
            return { error: "This won't work on localhost" };
          }
          if (!lookedUpIP) {
            return {
              error: "Error occured while trying to process the information",
            };
          }
          return lookedUpIP;
        };

        var xForwardedFor = (req.headers["x-forwarded-for"] || "").replace(
          /:\d+$/,
          ""
        );
        var ip = xForwardedFor || req.connection.remoteAddress;
        req.ipInfo = { ip, ...getIpInfo(ip) };
        const item = data.body.tracks.items[0];
        if (
          (item && item.album.available_markets.includes(req.ipInfo.country)) ||
          (process.env.NODE_ENV === "dev" && item)
        ) {
          // console.log(item.id);
          let returnData = {
            album_name: item.album.name,
            album_image: item.album.images[1],
            track_artist: item.artists[0].name,
            track_name: item.name,
            preview_url: item.preview_url,
            spotify_url: item.external_urls.spotify,
            is_explicit: item.explicit,
            track_id: item.id,
            attempts: att,
          };
          if (max === 1) {
            callback(returnData);
          } else {
            retArray.push(returnData);
            if (index >= max) {
              callback(retArray);
            } else {
              index++;
              search = getRandomSearch();
              att = 0;
              retry();
            }
          }
        } else {
          console.log("bad Market Match");
          doit();
        }
      },
      function (err) {
        doit();
      }
    );
  }
  doit();
};

/* GET random song object https://.../random */
router.get("/", function (req, res) {
  getData(req, req.body.max || 1, (returnData) => {
    res.status(200).send(returnData);
  });
});

export { router as RANDOM };

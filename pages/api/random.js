import express from "express";
const router = express.Router();
// import geoip from "geoip-lite";
import getRandomSearch from "../../lib/js/helpers/randomLib.mjs";
import { spotifyApi } from "../src/spotify-api/SpotifyClient.mjs";

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
    let randomOffset = Math.floor(Math.random() * 10);
    spotifyApi
      .searchTracks(search, { limit: 1, offset: randomOffset, method: "GET" })
      .then(
        async function (data) {
          const tracks = (await data.json()).tracks;
          if (!tracks || tracks.total === 0) {
            return doit();
          }
          // get ip from vercel headers
          const country = req.headers["x-vercel-ip-country"];
          const item = tracks.items[0];
          if (
            (country &&
              item &&
              item.album.available_markets.includes(country)) ||
            (process.env.NODE_ENV === "development" && item)
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
export const config = {
  api: {
    externalResolver: true,
  },
};

/* GET random song object https://.../random */
export default function handler(req, res) {
  if (!spotifyApi) {
    // throw new Error("No Spotify API");
    return res.status(500).send("No Spotify API");
  }
  getData(req, req.body.max || 1, (returnData) => {
    res.status(200).send(returnData);
  });
}

export { router as RANDOM };

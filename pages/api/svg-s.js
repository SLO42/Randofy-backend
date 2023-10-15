import imageToBase64 from "image-to-base64";
import getRandomSearch from "../../lib/js/helpers/randomLib.mjs";
import { spotifyApi } from "../src/spotify-api/SpotifyClient.mjs";

const replaceList = [
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
];

function replacer(str) {
  replaceList.map((array) => {
    let replacer = new RegExp(array[0], "g");
    str = str.replace(replacer, array[1]);
  });
  return str;
}

function createSVG(base64Image, imageData, songData) {
  return `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%">
        <style>svg { background-color: white; }</style>
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
                Explicit?  ${songData.is_explicit ? "true" : "false"}
                </text >
                <image y="${50}" href='data:image/jpeg;base64,${base64Image}'  height="${
    imageData.height
  }" width="${imageData.width}"/>
            </a>
        </svg>`;
}

export const config = {
  api: {
    externalResolver: true,
  },
};

export default function handler(req, res) {
  if (!spotifyApi) {
    // throw new Error("No Spotify API");
    return res.status(500).send("No Spotify API");
  }
  let search = getRandomSearch();
  let att = 0;
  function doit() {
    att++;
    if (att >= 50) {
      search = getRandomSearch();
    }
    retry();
  }
  function retry() {
    let randomOffset = Math.floor(Math.random() * 10000);
    spotifyApi.searchTracks(search, { limit: 1, offset: randomOffset }).then(
      async function (data) {
        const tracks = (await data.json()).tracks;
        if (!tracks || tracks.total === 0) {
          return doit();
        }
        // get ip from vercel headers
        const country = req.headers["x-vercel-ip-country"];
        if (
          (country &&
            tracks.items[0].album.available_markets.includes(country)) ||
          process.env.NODE_ENV === "development"
        ) {
          let returnData = {
            album_name: tracks.items[0].album.name,
            album_image: tracks.items[0].album.images[2],
            track_artist: tracks.items[0].artists[0].name,
            track_name: tracks.items[0].name,
            preview_url: tracks.items[0].preview_url,
            spotify_url: tracks.items[0].external_urls.spotify,
            is_explicit: tracks.items[0].explicit,
            attempts: att,
          };
          imageToBase64(returnData.album_image.url) // Image URL
            .then((response) => {
              const svg = createSVG(
                response,
                returnData.album_image,
                returnData
              );
              res.setHeader("Content-Type", "image/svg+xml");
              res.setHeader(
                "Cache-Control",
                "s-maxage=1, stale-while-revalidate"
              );
              res.send(svg);
            });
        }
      },
      function (err) {
        doit();
      }
    );
  }
  doit();
}

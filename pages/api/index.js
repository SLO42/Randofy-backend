// var createError = require("http-errors");
// var express = require("express");
// var cors = require("cors");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");

// var indexRouter = require("./routes/index");
// var loginRouter = require("./routes/login");
// var randomSongRouter = require("./routes/randomSong");
// var markdownRouter = require("./routes/markdown");
// var svgSmall = require("./routes/svgSmall");
// var svgMedium = require("./routes/svgMedium");
// var svgLarge = require("./routes/svgLarge");
// var token = require("./routes/token");

// var getRandomSearch = require("./lib/js/helpers/randomLib").getRandomSearch;

// require("dotenv").config();
import * as dotenv from "dotenv";
// import express from "express";
dotenv.config();
// import cors from "cors";
// const app = express();
// app.listen(3333);

export const currentRoutes = {
  LANDING: ["api/", "Home Page"],
  LOGIN: ["api/login", "login route using Spotify 2OAuth"],
  RANDOM: ["api/random", "generates random song"],
  MARKDOWN: ["api/markdown", "generates markdown compliant svg of random song"],
  TOKEN: ["api/token", "generates token for Spotify 2OAuth"],
};

// app.use((req, res, next) => {
//   //attach spotifyApi to req
//   req.spotifyApi = spotifyApi;
//   next();
// });

export default function handler(req, res) {
  let returnHTML =
    "<h1>Randofy Backend Api </h1> <h2> Available Routes: </h2> <ul>";
  Object.keys(currentRoutes).map((key, index) => {
    returnHTML += `<li key=${index}> <a href="${currentRoutes[key][0]}"> <p>${currentRoutes[key][0]}: ${currentRoutes[key][1]} </p> </a> </li>`;
  });
  returnHTML += "</ul>";
  returnHTML +=
    '<a href="https://github.com/settleformore" target="_blank"> <h3>Idea and contributions by <strong> Sabrina Settle </strong> </h3> </a>';
  returnHTML +=
    '<a href="https://github.com/SLO42" target="_blank"> <h3>Backend created by <strong> Samuel Oliveira </strong> </h3> </a>';
  returnHTML +=
    '<a href="https://github.com/SLO42/Randofy-backend" target="_blank"> <h3>Find the github project here! </strong> </h3> </a>';

  res.status(200).send(returnHTML);
}

// var app = express();
// app.use(cors());

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// var clientId = process.env.SPOT_ID,
//   clientSecret = process.env.SPOT_SECRET;
// var redirect_uri = "localhost:8888";

// let expires_at;

// // grab client creds for the first time on app launch

// const setTokens = (callback) => {
//   spotifyApi.clientCredentialsGrant().then(
//     function (data) {
//       console.log("The access token is " + data.body["access_token"]);
//       spotifyApi.setAccessToken(data.body["access_token"]);
//       let d = new Date();
//       console.log("now: ", d);
//       expires_at = new Date(d.setHours(d.getHours() + 1));

//       console.log("Expires at: ", expires_at);
//     },
//     function (err) {
//       console.log("Something went wrong!", err);
//     }
//   );
//   if (callback) callback();
// };

// setTokens(null);

// // middleware for sending spotify object to routes as needed
// // can refresh Spotify Access token as needed

// // routes with a desc
// const ROUTES = {
//   "/": "Home Page",
//   "/login": "login route using Spotify 20Auth",
//   "/random": "generates random song",
//   "/markdown": "generates markdown complient svg of random song",
//   "/svg-s": "generates small svg of a random song",
//   "/svg-m": "generates medium svg of a random song",
//   "/svg-l": "generates large svg of a random song",
// };

// // routes after above middleware.
// app.use("/", indexRouter);
// app.use("/login", loginRouter);
// app.use("/random", randomSongRouter);
// app.use("/markdown", markdownRouter);
// app.use("/svg-s", svgSmall);
// app.use("/svg-m", svgMedium);
// app.use("/svg-l", svgLarge);
// app.use("/token", token);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   let returnHTML =
//     "<h1>Page Not Found (404) </h1> <h2> Available Routes: </h2> <ul>";
//   Object.keys(ROUTES).map((key, index) => {
//     returnHTML += `<li key=${index}> <a href="${key}"> <p>${key}: ${ROUTES[key]} </p> </a> </li>`;
//   });
//   returnHTML += "</ul>";

//   // render the error page
//   res.status(err.status || 500);
//   res.send(returnHTML);
// });

// export default app;

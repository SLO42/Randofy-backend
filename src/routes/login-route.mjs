import express from "express";
const router = express.Router();

var clientId = process.env["SPOTIFY_CLIENT_ID"];
var redirect_uri =
  process.env.NODE_ENV === "dev"
    ? "localhost:3333"
    : "https://randofy.vercel.app/";

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req.spotify._credentials.clientId);
  var scopes = "user-read-private user-read-email playlist-modify-public";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      clientId +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri)
  );
});

router.get("/a", function (req, res, next) {
  res.send(`<p>testing</p>`);
});

export { router as LOGIN };

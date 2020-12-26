var express = require('express');
var router = express.Router();
var axios = require('axios');

  /* GET home page. */
  router.get('/', function(req, res, next) {
    const code = req.query.code;
    console.log("url: ", `grant_type=client_credentials&code=${encodeURIComponent(code)}&redirect_uri=${decodeURIComponent("https://randofy.vercel.app")}&client_id=${req.spotify._credentials.clientId}&client_secret=${req.spotify._credentials.clientSecret}`);
    axios.post("https://accounts.spotify.com/api/token",
    `grant_type=client_credentials&code=${encodeURIComponent(code)}&redirect_uri=${decodeURIComponent("https://randofy.vercel.app")}&client_id=${req.spotify._credentials.clientId}&client_secret=${req.spotify._credentials.clientSecret}`,
    {
        'Content_Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Header': '*',
        'Cache-Control': 'no-cache',
    })
    .then(response => {
        console.log("data", response.data);
        res.status(200).send(response.data)
    })
    .catch(error => {
        console.log("error", error.response);
        res.status(error.response.status).send(error.response.data)
    })

});

module.exports = router;

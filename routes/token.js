var express = require('express');
var router = express.Router();
var axios = require('axios');

  /* GET home page. */
  router.get('/', function(req, res, next) {
      console.log("what?")
    console.log("param check", req.query[0]);
    const code = req.query[0];
    console.log(code);
    axios.post("https://accounts.spotify.com/api/token",
    `grant_type=client_credentials&code=${encodeURIComponent(code)}&redirect_uri=${decodeURIComponent("https://randify.vercel.app")}&client_id=${req.spotify._credentials.clientId}&client_secret=${req.spotify._credentials.clientSecret}`,
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

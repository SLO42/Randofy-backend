var express = require('express');
var router = express.Router();
var axios = require('axios');
const { response } = require('express');

  /* GET home page. */
  router.get('/', function(req, res, next) {
    const code = req.query.code;
    // console.log("url: ", `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent("https://randofy.vercel.app/")}&client_id=${req.spotify._credentials.clientId}&client_secret=${req.spotify._credentials.clientSecret}`);
    axios.post("https://accounts.spotify.com/api/token",
    `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent("https://randofy.vercel.app/")}&client_id=${req.spotify._credentials.clientId}&client_secret=${req.spotify._credentials.clientSecret}`,
    {
        'Content_Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Header': '*',
        'Cache-Control': 'no-cache',
    })
    .then(response => {
        // console.log("data", response.data);
        res.status(200).send(response.data)
    })
    .catch(error => {
        // console.log("error", error.response);
        res.status(error.response.status).send(error.response.data)
    })
});

    //requires that the params that is sent is set as { params : { refresh : refresh_token }}
  router.get('/refresh', function(req, res, next) {
    const refresh = req.query.refresh_token;
    // const encoded = Buffer.from(req.spotify._credentials.clientId + ":" + req.spotify._credentials.clientSecret).toString('base64')
    // console.log("url: ", `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent("https://randofy.vercel.app/")}&client_id=${req.spotify._credentials.clientId}&client_secret=${req.spotify._credentials.clientSecret}`);
    axios.post("https://accounts.spotify.com/api/token",
    `grant_type=refresh_token&refresh_token=${refresh}&client_id=${req.spotify._credentials.clientId}&client_secret=${req.spotify._credentials.clientSecret}`,
    {
        'Content_Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Header': '*',
        'Cache-Control': 'no-cache',
    })
    .then(response => {
        // console.log("data", response.data);
        res.status(200).send(response.data)
    })
    .catch(error => {
        // console.log("error", error.response);
        res.status(error.response.status).send(error.response.data)
    })
});



module.exports = router;

var express = require('express');
var router = express.Router();
var axios = require('axios');
var btoa = require('btoa');

var clientId = process.env.SPOT_ID,
  clientSecret = process.env.SPOT_SECRET;
var auth_str = btoa(`${clientId}:${clientSecret}`)

/* GET home page. */
router.get('/', function(req, res, next) {


    axios.post("https://accounts.spotify.com/api/token",
    `grant_type=authorization_code&code=${req.body.code}&redirect_uri=${decodeURIComponent("https://randify.vercel.app")}`,
    {
        Authorization: `Basic ${auth_str}`
    })
    .then(response => {
        res.status(200).send(response)
    })
    .catch(error => {
        res.status(error.code).send(error)
    })
    // req.spotify.getMe((data) => {

    //     console.log(data);
    //     res.status(200).send(data);
    // })
});

module.exports = router;

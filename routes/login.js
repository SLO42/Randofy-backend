var express = require('express');
var router = express.Router();


var clientId = process.env.SPOT_ID;
var redirect_uri = process.env.NODE_ENV === 'dev' ? 'localhost:3000' : 'https://randify.vercel.app/';

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.spotify._credentials.clientId)
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + req.spotify._credentials.clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

router.get('/a', function(req, res, next) {
   res.send(`<p>testing</p>`);
});

module.exports = router;

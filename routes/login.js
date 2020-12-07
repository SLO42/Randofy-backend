var express = require('express');
var router = express.Router();


var clientId = process.env.SPOT_ID;
var redirect_uri = 'localhost:8888';

/* GET home page. */
router.get('/', function(req, res, next) {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

router.get('/a', function(req, res, next) {
   res.send(`<p>testing</p>`);
});

module.exports = router;

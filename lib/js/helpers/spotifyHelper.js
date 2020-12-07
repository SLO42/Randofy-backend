var SpotifyWebApi = require('spotify-web-api-node');

var clientId = process.env.SPOT_ID,
  clientSecret = process.env.SPOT_SECRET;
var redirect_uri = 'localhost:8888';

// create the spotifyWebApi object
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

let expires_at = new Date();

function getSpotifyAccessToken() {
    return spotifyApi.clientCredentialsGrant().then(
        function(data) {
            console.log('The access token is ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
            let d = new Date();
            console.log("now: ", d);
            expires_at = new Date(d.setHours((d.getHours() + 1)));
            
            console.log("Expires at: ", expires_at)
            console.log(data.body);
        },
        function(err) {
            console.log('Something went wrong!', err);
        }
    );
}

function refreshSpotifyToken() {
    spotifyApi.refreshAccessToken().then(
        function(data) {
          console.log('The access token has been refreshed!');
      
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
          console.log('Could not refresh access token', err);
        }
    );
}


module.exports = {
    spotifyApi: spotifyApi,
    getSpotifyAccessToken: getSpotifyAccessToken,
    refreshSpotifyToken: refreshSpotifyToken,
    expires_at: expires_at
};
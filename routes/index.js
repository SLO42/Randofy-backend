var express = require('express');
var router = express.Router();


const ROUTES = {
  '/': 'Home Page',
  '/login': 'login route using Spotify 20Auth',
  '/random': 'generates random song',
  '/markdown': 'generates markdown complient svg of random song',
  '/svg-s': 'generates small svg of a random song',
  '/svg-m': 'generates medium svg of a random song',
  '/svg-l': 'generates large svg of a random song',
};


/* GET home page. */
router.get('/', function(req, res, next) {
  let returnHTML = '<h1>Randify Backend Api </h1> <h2> Available Routes: </h2> <ul>';
  Object.keys(ROUTES).map((key, index) => {
    returnHTML += `<li key=${index}> <a href="${key}"> <p>${key}: ${ROUTES[key]} </p> </a> </li>`;
  })
  returnHTML += '</ul>';
  returnHTML += '<a href="https://github.com/settleformore" target="_blank"> <h3>Idea by <strong> Sabrina Settle </strong> </h3> </a>' ;
  returnHTML += '<a href="https://github.com/SLO42" target="_blank"> <h3>Backend created by <strong> Samuel Oliveira </strong> </h3> </a>' ;

  res.status(200).send(returnHTML);
});

module.exports = router;

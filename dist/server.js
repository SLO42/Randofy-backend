var express = require('express');

var next = require('next');

var port = parseInt(process.env.PORT, 10) || 3001;
var dev = process.env.NODE_ENV !== 'production';
var app = next({
  dev: dev
});
var handle = app.getRequestHandler();
app.prepare().then(function () {
  var server = express();
  server.get('/a', function (req, res) {
    return app.render(req, res, '/a', req.query);
  });
  server.get('/b', function (req, res) {
    return app.render(req, res, '/b', req.query);
  });
  server.all('*', function (req, res) {
    return handle(req, res);
  });
  server.listen(port, function (err) {
    if (err) throw err;
    console.log("> Ready on http://localhost:".concat(port));
  });
});
//# sourceMappingURL=server.js.map
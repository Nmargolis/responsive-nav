var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();

var DATA_DIR = path.join(__dirname, '..', 'data');

/* GET home page. */
router.get('*', function(req, res) {
  res.sendfile(path.join(DATA_DIR, req.url));
});

module.exports = router;

app.get('/api/nav.json', function(req, res) {
    res.send();
})
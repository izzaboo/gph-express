var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'gph-express' });
  // res.status(200).json({title: 'Neltje\' Collection'});
});

module.exports = router;

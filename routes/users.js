var express = require('express');
var router = express.Router();
var session = require('express-session')


/* GET login screen. */
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});



module.exports = router;

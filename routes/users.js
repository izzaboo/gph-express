var express = require('express');
var router = express.Router();
var session = require('express-session')
var user = require('../controllers/user_controller.js')

/* GET login screen. */
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

// router.post('/login', function(req, res, next) {
//   res.render('login', {title: 'Token Sent'});
// })

router.post('/login', user.sendToken)

module.exports = router;

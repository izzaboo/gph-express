var express = require('express');
var router = express.Router();
var user = require('../controllers/user_controller.js')

/* GET login screen. */
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

// router.post('/login', function(req, res, next) {
//   res.render('login', {title: 'Token Sent'});
// })

router.post('/login', user.sendToken);

// router.get('/session-test', function(req, res, next) {
//   res.render('login', {title: 'Session Test'});
// });
//
// router.post('/session-test', user.testSession);

module.exports = router;

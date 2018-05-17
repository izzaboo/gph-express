var express = require('express');
var router = express.Router();
var db = require('../models/db');
var user = require('../controllers/user_controller.js')

/* GET users index. */
router.get('/', function(req, res, next) {
  res.render('users', {title: 'User index'});
});

/* GET register screen. */
router.get('/register', function(req, res, next) {
  res.render('users', {title: 'Register'});

});

/* POST register complete. */
router.post('/register', function(req, res, next) {
  res.render('users', {title: 'Registration Complete'});
});

/* GET login screen. */
router.get('/login', function(req, res, next) {
  res.render('users', {title: 'Login'});
});

/* Test DB */
router.get('/all', function(req, res, next) {
  db.cn.any('SELECT * FROM users')
  .then(users => {
      // users found;
      res.status(200).json({users: users});
  })
  .catch(error => {
      // error;    
      if (error instanceof db.cn.errors.QueryFileError){
        return next(error);
      }
  })
  .finally(db.cn.$pool.end);
});

router.post('/login', user.sendToken);

module.exports = router;

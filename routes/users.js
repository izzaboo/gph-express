var express = require('express');
var router = express.Router();
var db = require('../models/db');
var user = require('../controllers/user_controller.js')
var expressValidator = require('express-validator');
const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/* GET users index. */
router.get('/', function(req, res, next) {
  res.render('users', {title: 'User index'});
});

/* GET register screen. */
router.get('/register', function(req, res, next) {
  res.render('users', {title: 'Register'});

});

/* POST register form. */
router.post('/register', [
  body('email')
    .isEmail().withMessage('The email you entered is invalid, please try again.')
    .isLength(4, 100)
    .withMessage('Email address must be between 4-100 characters long, please try again.'),
  body('password')
     .isLength(8, 100)
     .withMessage('Password must be between 8-100 characters long.')
     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
     .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.')
     .custom((value,{req, loc, path}) => {
            if (value !== req.body.passwordMatch) {
              throw new Error("Passwords don't match, please try again.");
            } else {
              return value;
            }
      }) //custom function compares two password fields
], function(req, res, next) {
  const vErrors = validationResult(req);
  if (!vErrors.isEmpty()) {
     // error from form validationResult such as bad or unmatched passwords
   //  res.status(200).json({errorsArray: vErrors.array() });
     res.render('users', { title: 'Register', errorsArray: vErrors.array() });
  } else {

    formUser = { email: req.body.email
               , password: req.body.password
               };

    db.cn.one('INSERT INTO users (email,password) VALUES (${email},${password}) RETURNING id', formUser)
      .then(users => {
         // user inserted and id returned;
         //res.status(200).json({data: users});
           res.render('users', { title: 'Registration Complete', complete: formUser.email + ' is now registered' });
      })
     .catch(error => {
        // error from postgresql such as email already exists;
        // res.status(200).json({errorsJSON: error});
           res.render('users', { title: 'Register', errorsJSON: error } );
     })
   } //end if no validation errors
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
});

router.post('/login', user.sendToken);

module.exports = router;

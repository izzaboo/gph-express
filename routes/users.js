var express = require('express');
var router = express.Router();
var db = require('../models/db');
var user = require('../controllers/user_controller.js');
var passport = require('passport');

const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users index. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  console.log(req.isAuthenticated());

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
  ],
  function(req, res, next) {
    const vErrors = validationResult(req);
    if ( !vErrors.isEmpty() ) {
       // error from form validationResult such as bad or unmatched passwords
       // res.status(200).json({errorsArray: vErrors.array() });
        res.render('users', { title: 'Register', errorsArray: vErrors.array() });

    } else {

      var email = req.body.email;
      var password = req.body.password;

      bcrypt.hash(password, saltRounds, function(err, hash) {
        db.cn.task(t => {
          return t.one('INSERT INTO users (email,password) VALUES ($1, $2) RETURNING id',
                              [email, hash])
                  .then(users => {
                    if(users) {
                      return t.one('SELECT * FROM users WHERE id = $1', users.id);
                    }
                    return []; //user not found, no no events
               });
           })
          .then(events => {
              // success
              // user inserted and id returned;
             // res.status(200).json({data: events});
              req.login(events.id, function(err){
             //   res.render('users', { title: 'Registration Complete',
             //                      complete: events.email + ' is now registered with id: ' + events.id });
                  res.redirect('/users');
               });
          })
          .catch(error => {
             // error from postgresql such as email already exists;
             console.log('err: ' + err);
            // res.status(200).json({ errorsJSON: error });
               res.render('users', { title: 'Register', errorsJSON: error } );
            })

      });  //end bcrypt.hash

     } //end if else validation errors
});


/* GET login screen. */
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

/* GET logout screen. */
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/users');
    });
});

/* GET profile screen. */
router.get('/profile', authenticationMiddleware(), function(req, res, next) {
  res.render('profile', {title: 'Profile'});
});

/* POST login screen */
router.post('/login', passport.authenticate('local',
      {
       successRedirect: '/users/profile',
       failureRedirect: '/users/login'
      }
));

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

passport.serializeUser(function(id, done) {
  done(null, id);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/users/login')
	}
}

module.exports = router;

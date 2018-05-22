var express = require('express');
//var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

require('dotenv').config();


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var db = require('./models/db.js');
var pgSession = require('connect-pg-simple')(session);

var sess = {
  store: new pgSession({
    pgPromise: db.cn
  }),
  secret: process.env.SITE_COOKIE_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// apache is configured as reverse proxy
//app.set('trust proxy', 'loopback');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('', index);
app.use('/users', users);

passport.use(new LocalStrategy(
  function(username, password, done) {
      // query db and get hashed password
      db.cn.one('SELECT id, password FROM users WHERE email = $1',[username])
            .then(user => {
              //user was found!
              //hash the password from login form
              const hash = user.password;

              // compare hashed user form password to hashed password from db
              bcrypt.compare(password, hash, function(err, response) {
                if (response === true) {
                  return done(null, {user_id: user.id});
                } else {
                  return done(null, false);
                }
              });

            })
            .catch(error => {
              // uhoh!
              console.log('error: ' + error);
              done(null, false);
            });

    }
));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

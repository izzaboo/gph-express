const path = require('path');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitizeBody } = require('express-validator/filter');

exports.testSession = [
  body('email', 'eMail address is required.').isEmail().withMessage('must be valid eMail'),
  sanitizeBody('email').trim().escape(),

  (req, res, next) => {
    console.log(req.session);
    var sessData = req.session;
    sessData.uemail = req.body.email;
    res.render('login', {title: 'Hello ' + sessData.uemail});
  }
];

var users = [
    { id: 1, email: 'greg@izzaboo.com' },
    { id: 2, email: 'gregory.haas@izzaboo.com' }
];

exports.sendToken = [

  //req.checkBody('f_search_q', 'search term required').notEmpty();
  body('email', 'eMail address is required.').isEmail().withMessage('must be valid eMail'),
  //Trim and escape the title and itemid fields.
  sanitizeBody('email').trim().escape(),
  //req.sanitize('f_search_q').trim();

  (req, res, next) => {
  const errors = validationResult(req);

//  var search = func.parseSearch();
  var search = req.body.email;
// var search = parseSearch( req.body.f_search.toString() );
  if (!errors.isEmpty()) {
      var errormsgs = errors.array().map(function (elem) {
        return elem.msg;
      });
      console.log('There are following validation errors: ' + errormsgs.join('&&'));
      res.render('login', { title: 'Login', errors: errormsgs } );
  } else {
    var errormsgs = ['Hello ' + req.body.email + '.', 'Your email was passed.','It is not yet validated.'];
    res.render('login', { title: 'Login', errors: errormsgs } );
    // form seems to have passed validation
    // db.connector.task('my-task', t => {
    //   //const sql0 = t.any('SELECT 1 + 1 AS solution');
    //   const sql1 = t.any(db.sqlGetLocations);
    //   return t.batch([sql1]);
    //   })
    //   .then(data => {
    //      res.status(200).json({ list: data });
    //     //res.render('login', {title: 'Hello ' + req.body.email, list: data} );
    //    })
    //    .catch(function (err) {
    //      console.log('uh-oh: ' + search);
    //      //console.log(process.env);
    //      return next(err);
    //     });
    }
  }
];

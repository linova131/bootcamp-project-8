var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Import Sequelize and Authenticate
const {sequelize} = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('We connected to the database!')
  } catch (error) {
    console.error('whoops, error connecting to database', error);
  }
}) ();

// view engine setup
app.use('/static', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Page not found');
  err.status = 404;
  err.message = "Sorry, that doesn't appear to be a page that exists :/ ";
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if(err.status === 404) {
    res.locals.error = err;
    res.render('page_not_found');
  } else if (err.status === undefined) {
    err.status = 500;
    err.message = 'Something went wrong!';
    res.locals.error = err;
    res.render('error');
  } else {
    res.locals.error = err;
    res.render('error');
  }
});

module.exports = app;

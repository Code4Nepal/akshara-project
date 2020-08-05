require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var logger = require('morgan');
var cors = require('cors');
const { UI } = require('bull-board')

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var syncRouter = require('./routes/sync');
var authRouter = require('./routes/auth');
var contentRouter = require('./routes/content');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // dev only
  httpOnly: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// CORS enabled - be careful. Need to remove this.
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/', contentRouter);
app.use('/sync', syncRouter);
app.use('/auth', authRouter);

// Bull Queue Admin
app.use('/admin/queues', UI)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

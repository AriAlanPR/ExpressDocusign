var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docusignRouter = require('./routes/docusign');
var sharepointRouter = require('./routes/sharepoint');

var app = express();

// view engine setup
const view_directories = [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views/docusign'),
  path.join(__dirname, 'views/sharepoint')
];

//added base directory for views
app.locals.basedir = view_directories[0];
//set view directories to expose to routes
app.set('views', view_directories);
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docusign', docusignRouter);
app.use('/sharepoint', sharepointRouter);

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

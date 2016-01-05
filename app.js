var express = require('express');
var Poet = require('poet');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var fs = require('fs');
var util = require('util');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var blog = require('./routes/blog');
//var users = require('./routes/users');
var signup = require('./routes/signup');

var app = express();

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

//var poet    = require('poet')( app );
//poet
//    .createPostRoute()
//    .createPageRoute()
//    .createTagRoute()
//    .createCategoryRoute()
//    .init();

var poet = Poet(app, {
    postsPerPage: 5,
    posts: './_posts',
    metaFormat: 'json',
    routes: {
        '/blog/posts/:post': 'post',
        '/blog/pagination/:page': 'page',
        '/blog/tags/:tag': 'tag',
        '/blog/categories/:category': 'category'
    }
});


poet.init().then(function () {
    console.log("*** POET is initialized ***");
    // ready to go!
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/blog', blog);
//app.use('/users', users);
app.use('/signup', signup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

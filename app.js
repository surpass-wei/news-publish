var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//  引入路由对象
var index = require('./routes/index');
var news = require('./routes/news');

var app = express();

//  连接数据库
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/news-publish');
mongoose.connection.on('connected', console.info.bind(console, '连接成功'));
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

//  view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  配置根路由映射
app.use('/', index);
app.use('/news', news);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

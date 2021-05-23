var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var connctDB = async() =>{
  try {
    await mongoose.connect('mongodb+srv://dbAppSmai:WMZGnIzqoScefzRH@smaiapp.zdcd7.mongodb.net/dbSmai?retryWrites=true&w=majority',
    {  useCreateIndex:true,
        useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true});
   console.log('Connected')
  } catch (error) {
    console.log(error.message);
    process.exit(1)
  }
}
connctDB();
var indexRouter = require('./routes/index');
var accountRouter = require('./routes/router.account');
var userRouter = require('./routes/user');
var postRouter = require('./routes/router.post')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/user',userRouter);
app.use('/post',postRouter);

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

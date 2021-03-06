var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

require('dotenv').config()
const cors = require('cors')
var connctDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://dbAppSmai:WMZGnIzqoScefzRH@smaiapp.zdcd7.mongodb.net/dbSmai?retryWrites=true&w=majority',
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      });
    console.log('Connected')
  } catch (error) {
    console.log(error.message);
    process.exit(1)
  }
}
connctDB();

var accountRouter = require('./routes/account.router');
var userRouter = require('./routes/user.router');
var postRouter = require('./routes/post.router')
var transactionRouter = require('./routes/transaction.router')
var doctorRouter = require('./routes/doctors.router')
var pushTokenRouter = require('./routes/pushToken.router')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/account', accountRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/transaction', transactionRouter);
app.use('/doctor', doctorRouter);
app.use("/push", pushTokenRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

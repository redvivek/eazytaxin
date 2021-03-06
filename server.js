var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var logger = require('morgan');
var path = require('path');
var enforce = require('express-sslify');


const db = require('./api/config/dbConfig');
var apiRouter = require('./api/routes/api.routes');


var app = express();

//Use enforce.HTTPS({ trustProtoHeader: true }) use in case you are behind a load balancer (e.g. Heroku). See further comments below
app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  //origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Headers', 'application/json');
  next();
});

app.use(express.static(path.join(__dirname, 'dist/eazytaxin')));
app.use('/', express.static(path.join(__dirname, 'dist/eazytaxin')));
app.use('/api', apiRouter);
app.use('/*', express.static(path.join(__dirname, 'dist/eazytaxin')));


// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
  console.log('Drop and Resync with { force: false }');
});

// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
  next(createError(404));
}); */

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status >= 100 && err.status < 600 ? err.code : 500);
  res.sendStatus(err.status);
  res.render('error');
});*/

/// error handlers
// no stacktraces leaked to user
// Adding raw body support
app.use(function(err, req, res, next) {
  res.status(err.code || 500).send('error', {
    message: err.message,
    error: err
  });
}); 

module.exports = app;
var express = require ('express'); //EXPRESS Package
var route = express.Router();   //define our app using express
var  userService = require('../services/users.service');

//Routes
/* GET home page. */
route.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});
route.post('/users/register', userService.create);
route.post('/users/login', authenticateUser);


/**
 * 
 * Register user
 */
function registerUser(req, res) {
  //res.sendStatus(200);
  userService.create(req, res)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

/**
 * 
 * Login user
 */
function authenticateUser(req, res) {
  userService.authenticate(req.body.username, req.body.password,req.body.usertype)
      .then(function (token) {
          if (token) {
              // authentication successful
              res.send({ token: token });
          } else {
              // authentication failed
              res.status(401).send('Login credentials are incorrect');
          }
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

module.exports = route;
var config = require('../config/consts.json');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');
var dateTime = require('node-datetime');

const Users = db.Userinfo;
const sequelize = db.sequelize;
 
// Find if email is already registered
exports.isEmailRegisterd = (req, res) => {
	let email = JSON.stringify(req.body.email);
	console.log("Request: "+email);
	Users.findOne(
		{ where: {Username: email} }
		).then(function (user) {
				if (user) {
					res.json({"statusCode": 400,"error": "Bad Request",message:"Email address already registerd"});
				} else {
					res.status(200);
				}
		})
		.catch(function (err) {
				res.status(400).send(err);
		});

		/*{
		"statusCode": 400,
		"error": "Bad Request",
		"message": "Email address already registerd"
		}*/
};


/*****Function for user registeration*/
/* Input Parms: {"emailId":"value","nPassword":"value","cPassword":"value","terms":value}
*/
exports.create = (req, res) => {	
	let userParam = req.body;
	console.log("Request Object: "+JSON.stringify(userParam));

	/*Check for existing user */
	let email = userParam.emailId;
	console.log("Request: "+email);
	Users.findOne(
		{ where: {Username: email} }
	)
	.then(function (user) {
		if (user) {
			res.json({"statusCode": 200,"Message": "Invalid Username"});
		} else {
			//res.status(200);
			//Save to et_userinfo table */
			sequelize.query("INSERT INTO `et_userinfo`(RoleId,Username,EmailId,Password,Hashkey) VALUES (?,?,?,?,?)",{
				replacements: [2,userParam.emailId,userParam.emailId,userParam.nPassword,bcrypt.hashSync(userParam.nPassword, 10)],
				type: sequelize.QueryTypes.INSERT 
			}).then(result => {		
				res.json({"statusCode": 200,"Message": "Successful Request"});
			})
			.catch(function (err) {
				console.log("Error "+err);
				res.status(400).send(err);
			});
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
};

/*****Function for user authentication*/
/* Input Parms:
***Response Json : 
*/
exports.authenticateUser = (req, res) => {	
	let userParam = req.body;
	console.log("Request Object: "+JSON.stringify(userParam));

	/*Check for existing user */
	let email = userParam.username;
	let pwd = userParam.password;

	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	Users.findOne(
		{ where: 
			{
				Username: email,
			}
		}
	).then(function (user) {
		if (user && bcrypt.compareSync(pwd, user.Hashkey)) {
			const token = jwt.sign({ sub: user.UserId}, config.secret);
			let resBody = {
				userid: user.UserId,
				username: user.Username,
				email:user.EmailId,
				token: token
			};


			//update last login timestamp to et_userinfo table */
			sequelize.query("UPDATE `et_userinfo` SET LastLoginTime = ? , UpdatedAt = ? WHERE  UserId = ? ",{
				replacements: [formatted ,formatted,user.UserId],
				type: sequelize.QueryTypes.UPDATE 
			}).then(result => {		
				console.log("Login time updated successfully");
			})
			.catch(function (err) {
				console.log("Login time updatation failed");
			});


			res.json({"statusCode": 200,"Message": "Valid User","body":resBody});
			
		} else {
			//update invalid login attempt count to et_userinfo table */

			let invalidlogincnt = user.InvalidLoginCounts +1;
			
			sequelize.query("UPDATE `et_userinfo` SET InvalidLoginCounts = ? , UpdatedAt = ? WHERE  UserId = ? ",{
				replacements: [invalidlogincnt ,formatted,user.UserId],
				type: sequelize.QueryTypes.UPDATE 
			}).then(result => {		
				console.log("Invalid login count updated successfully");
			})
			.catch(function (err) {
				console.log("Invalid login count updatation failed");
			});
			res.json({"statusCode": 401,"Message": "Invalid User"});
		}
	})
	.catch(function (err) {
		//console.log("Error "+err);
		res.json({"statusCode": 401,"Message": "Invalid User"});
	});
};

// Fetch all Users
exports.findAll = (req, res) => {
	Users.findAll().then(users => {
	  // Send all customers to Client
	  res.json(users);
	});
};
 
// Find a User by Id
exports.findById = (req, res) => {	
	Users.findById(req.params.userId).then(user => {
		res.json(user);
	})
};
 
// Update the user profile
exports.update = (req, res) => {
	let inputuser = req.body;
	let id = req.body.userId;
	Users.update(inputuser, 
					 { where: {userId: id} }
				   ).then(() => {
						 res.status(200).json({msg:"updated successfully a user with id = " + id});
				   });	
};
 
// Delete a Customer by Id
/*exports.delete = (req, res) => {
	const id = req.params.customerId;
	Customer.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).json({msg:'deleted successfully a customer with id = ' + id});
	});
};*/
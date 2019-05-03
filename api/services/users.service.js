var config = require('../config/consts.json');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');
var dateTime = require('node-datetime');
//var sgMail = require('../config/mailConfig');
const sgMail = require('@sendgrid/mail');
var Q               = require('q');

const Users = db.Userinfo;
const ConfigMaster = db.ConfigMaster;
const sequelize = db.sequelize;

 
// Find if email is already registered
exports.isEmailRegisterd = (req, res) => {
	let email = JSON.stringify(req.body.email);
	console.log("Request: "+email);
	Users.findOne(
		{ where: {Username: email} }
		).then(function (user) {
				if (user) {
					res.status(200);
				} else {
					res.status(201);
				}
		})
		.catch(function (err) {
				res.status(400).send(err);
		});
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
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
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
				console.log("Result UserId  "+result[0]);
				var newuserid = result[0];
				var activationCode = Math.floor((Math.random() * 100) + 54);
				//create activation link and send email to user
				//update last login timestamp to et_userinfo table */
				sequelize.query("UPDATE `et_userinfo` SET activationCode = ? , UpdatedAt = ? WHERE  UserId = ? ",{
					replacements: [activationCode ,formatted,newuserid],
					type: sequelize.QueryTypes.UPDATE 
				}).then(result => {		
					console.log("Activation code updated successfully");
					
					var host= req.get('host');
					var link="http://"+host+"/api/users/verifyUser?id="+activationCode+"&uid="+newuserid;
					mailOptions={
						to : email, //'sg.viv09@gmail.com',
						from: 'admin@easytaxin.com',
						subject : "EasyTaxin - Please confirm your Email account",
						text: 'Hello, Please copy & open this link to verify your email. '+link,
						html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
					}
					console.log(mailOptions);
					/* console.log("Regsiteration successful and activation mail sent to user");
					res.json({"statusCode": 200,"Message": "Successful Request","userid":newuserid}); */
					fetchMailKeyValue()
					.then(function(keyvalue){
						console.log("Api key "+keyvalue);
						sgMail.setApiKey(keyvalue);
						sgMail.send(mailOptions, (error, result) => {
							if (error) {
								console.log("Regsiteration successful and failed to sent activation mail to user" + error);
								res.status(400).send(error);
							}
							else {
								console.log("Regsiteration successful and activation mail sent to user");
								res.json({"statusCode": 200,"Message": "Successful Request","userid":newuserid});
							}
						});
					})
					.catch(function (err) {
						console.log("Error "+err);
						res.status(400).send(err);
					});
					
				})
				.catch(function (err) {
					console.log("Login time updatation failed" +err);
					res.status(400).send(err);
				});
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
}

/*****Function for user resend activation link*/
/* Input Parms: userid
***Response Json : statuscode and message
*/
exports.sendActivationMail = (req,res) =>{
	let userParam = req.body;
	console.log("Request Object: "+JSON.stringify(userParam));
	let uid = userParam.userid;

	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	Users.findOne(
		{ where: {UserId: uid} }
	)
	.then(function (user) {
		if (user) {
			let userid = user.UserId;
			let email = user.EmailId;
			var activationCode = Math.floor((Math.random() * 100) + 54);
			//create activation link and send email to user
			sequelize.query("UPDATE `et_userinfo` SET activationCode = ? , UpdatedAt = ? WHERE  UserId = ? ",{
				replacements: [activationCode ,formatted,userid],
				type: sequelize.QueryTypes.UPDATE 
			}).then(result => {		
				console.log("Activation code updated successfully");
				var host = req.get('host');
				var link = "http://"+host+"/api/users/verifyUser?id="+activationCode+"&uid="+userid;
				mailOptions={
					to : email, //'sg.viv09@gmail.com',
					from: 'admin@easytaxin.com',
					subject : "EasyTaxin - Please confirm your Email account",
					text: 'Hello, Please copy & open this link to verify your email. '+link,
					html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
				}
				console.log(mailOptions);
				/* console.log("Regsiteration successful and activation mail sent to user"+mailresult);
				res.json({"statusCode": 200,"Message": "Successful Request"}); */
				fetchMailKeyValue()
				.then(function(keyvalue){
					console.log("Api key "+keyvalue);
					sgMail.setApiKey(keyvalue);
					sgMail.send(mailOptions, (error, mailresult) => {
						if (error) {
							console.log("Regsiteration successful and failed to sent activation mail to user"+error);
							res.status(400).send(error);
						}
						else {
							console.log("Regsiteration successful and activation mail sent to user"+mailresult);
							res.json({"statusCode": 200,"Message": "Successful Request"});
						}
					});
				})
				.catch(function (err) {
					console.log("Error "+err);
					res.status(400).send(err);
				});
			})
			.catch(function (err) {
				console.log("Login time updatation failed"+err);
				res.status(400).send(err);
			});
		} else {
			res.status(400).send("User not registered with us.");
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

/*****Function for user verification*/
/* Input Parms: verficationCode,uid
***Response Json : statuscode and message
*/
exports.verifyUser = (req,res) =>{
	let userParam = req.query;
	console.log("Input params "+JSON.stringify(userParam));
	let id = userParam.id;
	let uid = userParam.uid;

	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');

	var host = req.get('host');
	console.log(req.protocol+":/"+req.get('host'));
	//if((req.protocol+"://"+req.get('host'))==(config.protocol+config.host))
	//{
		//console.log("Domain is matched. Information is from Authentic email");
	Users.findOne(
		{ where: {UserId: uid,Status:'Disabled'} }
	)
	.then(function (user) {
		if (user) {
			let rand = user.activationCode;
			let email = user.EmailId;
			if( rand == id){
				console.log("email is verified");

				//update last login timestamp to et_userinfo table */
				sequelize.query("UPDATE `et_userinfo` SET Status = ? ,activationCode = ?, UpdatedAt = ? WHERE  UserId = ? ",{
					replacements: ['Active' ,'',formatted,user.UserId],
					type: sequelize.QueryTypes.UPDATE 
				}).then(result => {		
					console.log("User status updated successfully");
					let redirectURL = req.protocol+"://"+req.get('host');//config.protocol+config.fehost;
					console.log("Redirect URL "+redirectURL)
					res.end("<h1>Email "+email+" is been Successfully verified. Click on <a href = '"+redirectURL+"'> Login");
					//res.redirect(redirectURL);
				})
				.catch(function (err) {
					console.log("user status updatation failed");
				});
			}else{
				console.log("email is not verified");
				res.end("<h1>Bad Request</h1>");
			}
		}else{
			console.log("email is not verified");
			res.end("<h1>Bad Request</h1>");
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.end("<h1>Bad Request</h1>");
	});
	//}
	/* else
	{
		res.end("<h1>Request is from unknown source");
	} */
}

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
		if(user && user.Status == 'Active'){
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
				res.json({"statusCode": 200,"Message": "Invalid Cred"});
			}
		}else if(user && user.Status == 'Disabled'){
			res.json({"statusCode": 200,"Message": "Inactive User","userid":user.UserId});
		}else{
			res.json({"statusCode": 200,"Message": "Invalid User"});
		}
	})
	.catch(function (err) {
		//console.log("Error "+err);
		res.json({"statusCode": 401,"Message": "Invalid User"});
	});
};

/*****Function for Forget password*/
/* Input Parms: emailid
***Response Json : statuscode and message
*/
exports.forgetPassword = (req,res)=>{
	let userParam = req.body;
	console.log("Request Object: "+JSON.stringify(userParam));

	/*Check for existing user */
	let email = userParam.emailid;
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');

	Users.findOne(
	{ where: 
		{
			EmailId: email,
		}
	}).then(function (user) {
		if(user && user.Status == 'Active'){
			var userid = user.UserId;
			var pwdResetCode = Math.floor((Math.random() * 100) + 54);
			//create pwd reset link and send email to user
			//update last login timestamp to et_userinfo table */
			sequelize.query("UPDATE `et_userinfo` SET pwdResetCode = ? , UpdatedAt = ? WHERE  UserId = ? ",{
				replacements: [pwdResetCode ,formatted,userid],
				type: sequelize.QueryTypes.UPDATE 
			}).then(result => {		
				console.log("Pwd reset code updated successfully");
				//var host= config.fehost;
				let redirectURL = req.protocol+"://"+req.get('host'); //config.protocol+config.fehost;
				console.log("Redirect URL "+redirectURL)
				var link = redirectURL+"/resetpassword?id="+pwdResetCode+"&uid="+userid;
				mailOptions={
					to : email, //'sg.viv09@gmail.com',
					from: 'admin@easytaxin.com',
					subject : "EasyTaxin - Reset your password.",
					text: 'Hello, Please copy & open this link to reset your password. '+link,
					html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Reset Password</a>" 
				}
				console.log(mailOptions);
				/* console.log("Regsiteration successful and activation mail sent to user");
				res.json({"statusCode": 200,"Message": "Successful Request","userid":newuserid}); */
				fetchMailKeyValue()
				.then(function(keyvalue){
					console.log("Api key "+keyvalue);
					sgMail.setApiKey(keyvalue);
					sgMail.send(mailOptions, (error, result) => {
						if (error) {
							console.log("Failed to sent password reset mail to user" + error);
							res.status(400).send(error);
						}
						else {
							console.log("Successfuly send password reset mail sent to user");
							res.json({"statusCode": 200,"Message": "Valid User","userid":userid});
						}
					});
				})
				.catch(function (err) {
					console.log("Error "+err);
					res.status(400).send(err);
				});
				
			})
			.catch(function (err) {
				console.log("Reset Pwd code updatation failed" +err);
				res.status(400).send(err);
			});
		}else if(user && user.Status == 'Disabled'){
			res.json({"statusCode": 200,"Message": "Inactive User","userid":user.UserId});
		}else{
			res.json({"statusCode": 200,"Message": "Invalid User"});
		}
	})
	.catch(function (err) {
		//console.log("Error "+err);
		res.json({"statusCode": 401,"Message": "Invalid User"});
	});
}

/*****Function for reset password verification*/
/* Input Parms: userid,resetcode
***Response Json : statuscode and message
*/
exports.checkResetpwdCode = (req,res)=>{
	let userParam = req.body;
	console.log("Input params "+JSON.stringify(userParam));
	let id = userParam.resetcode;
	let uid = userParam.userid;

	/* if((req.protocol+"://"+req.get('host'))==(config.protocol+config.host))
	{
		console.log("Domain is matched. Information is from Authentic email"); */
	Users.findOne(
		{ where: {UserId: uid,Status:'Active'} }
	)
	.then(function (user) {
		if (user) {
			let rand = user.pwdResetCode;
			if( rand == id){
				console.log("reset code is verified");
				res.json({"statusCode": 200,"Message": "Valid User"});
			}else{
				console.log("code is not verified");
				res.json({"statusCode": 200,"Message": "InValid link"});
			}
		}else{
			console.log("email is not verified");
			res.json({"statusCode": 200,"Message": "Invalid User"});
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
	/* }
	else
	{
		res.status(400).send('Request is from unknown source');
	} */
}

/*****Function for reset password*/
/* Input Parms: userid,pwd
***Response Json : statuscode and message
*/
exports.updatePassword = (req,res)=>{
	let userParam = req.body;
	console.log("Request Object: "+JSON.stringify(userParam));

	let pwd = userParam.password;
	let uid = userParam.userid;

	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');

	Users.findOne(
		{ where: {UserId: uid} }
	)
	.then(function (user) {
		if (user) 
		{
			let encrptpwd = bcrypt.hashSync(pwd);
			//update last login timestamp to et_userinfo table */
			sequelize.query("UPDATE `et_userinfo` SET Password = ?,Hashkey =?,UpdatedAt = ?,pwdResetCode=? WHERE  UserId = ? ",{
				replacements: [pwd,encrptpwd,formatted,'',user.UserId],
				type: sequelize.QueryTypes.UPDATE 
			}).then(result => {		
				console.log("Password updated successfully");
				res.json({"statusCode": 200,"Message": "Successful Request"});
			})
			.catch(function (err) {
				console.log("Password updatation failed" +err);
				res.status(400).send(err);
			});
		}else{
			console.log("User not found");
			res.status(400).send("User not found");
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

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

function fetchMailKeyValue(){
	var deferred = Q.defer();
	ConfigMaster.findOne(
		{ where: {KeyName:'SGMAIL'} }
	)
	.then(function (result) {
		if (result) {
			console.log("Result Key  "+JSON.stringify(result.KeyValue));
			deferred.resolve(result.KeyValue);
    }
	})
	.catch(function (err) {
		console.log("Error "+err);
		deferred.reject(err);
  });
  return deferred.promise;
}
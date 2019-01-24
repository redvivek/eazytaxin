const db = require('../config/dbConfig');
const Users = db.Userinfo;
 
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


// Post a Customer
exports.create = (req, res) => {	
	let userParam = req.body;
	// set user object to userParam without the cleartext password
	var user = _.omit(userParam, 'nPassword','cPassword','terms');

	user.RoleId = 2;
	user.Username = userParam.emailId;
	user.EmailId = userParam.emailId;

	// add hashed password to user object
	user.Hashkey = bcrypt.hashSync(userParam.nPassword, 10);

	//let usernm = user.emailId;
	//let password = user.nPassword;
	console.log("Request: "+JSON.stringify(user));
	//Save to MySQL database
	Users.create(user).then(result => {		
		// Send created customer to client
		res.json(result);
    });
    //res.json({"Success":"API successful"});
};



 
// Fetch all Customers
exports.findAll = (req, res) => {
	Customer.findAll().then(customers => {
	  // Send all customers to Client
	  res.json(customers);
	});
};
 
// Find a Customer by Id
exports.findById = (req, res) => {	
	Customer.findById(req.params.customerId).then(customer => {
		res.json(customer);
	})
};
 
// Update a Customer
exports.update = (req, res) => {
	let customer = req.body;
	let id = req.body.id;
	Customer.update(customer, 
					 { where: {id: id} }
				   ).then(() => {
						 res.status(200).json({msg:"updated successfully a customer with id = " + id});
				   });	
};
 
// Delete a Customer by Id
exports.delete = (req, res) => {
	const id = req.params.customerId;
	Customer.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).json({msg:'deleted successfully a customer with id = ' + id});
	});
};
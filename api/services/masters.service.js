const db = require('../config/dbConfig');
var dateTime = require('node-datetime');

const States         =  db.StateMaster;
const Docmasters     =  db.DocMaster;
const DeductionTypes =  db.DeductionMaster;
const sequelize      =  db.sequelize;

// Fetch all States
exports.fetchAllStates = (req, res) => {
	States.findAll().then(states => {
	  // Send all customers to Client
	  res.json(states);
	});
};

// Fetch all Document Types
exports.fetchAllDocTypes = (req, res) => {
	Docmasters.findAll().then(doctypes => {
	  // Send all customers to Client
	  res.json(doctypes);
	});
};

// Fetch all DeductionTypes
exports.fetchAllDeductionTypes = (req, res) => {
	DeductionTypes.findAll().then(deductiontypes => {
	  // Send all customers to Client
	  res.json(deductiontypes);
	});
};
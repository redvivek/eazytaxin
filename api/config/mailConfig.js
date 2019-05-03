const sgMail = require('@sendgrid/mail');
const db = require('./dbConfig');
var Q               = require('q');

const ConfigMaster = db.ConfigMaster;


module.exports = sgMail;
const sgMail = require('@sendgrid/mail');
const SENDGRID_APIKEY = "";
sgMail.setApiKey(SENDGRID_APIKEY);

module.exports = sgMail;
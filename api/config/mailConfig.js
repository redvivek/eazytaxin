const sgMail = require('@sendgrid/mail');
const SENDGRID_APIKEY = "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";
sgMail.setApiKey(SENDGRID_APIKEY);

module.exports = sgMail;
const sgMail = require('@sendgrid/mail');
const SENDGRID_APIKEY = "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";
sgMail.setApiKey(SENDGRID_APIKEY);

module.exports = sgMail;
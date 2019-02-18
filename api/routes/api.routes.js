var express = require ('express'); //EXPRESS Package
var route = express.Router();   //define our app using express
var  userService = require('../services/users.service');
var  masterService = require('../services/masters.service');
var  taxService = require('../services/tax.service');

//Routes
/* GET home page. */
route.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});

//API routes for User Reg and Login module
route.post('/users/register', userService.create);
//route.post('/users/isEmailRegisterd',userService.isEmailRegisterd);
route.post('/users/authenticate', userService.authenticateUser);
/*route.post('/users/forgetPassword', userService.forgetPassword);
route.put('/users/updatePassword', userService.updatePassword);
route.put('/users/updateProfile', userService.update);
route.get('/users/getUser', userService.findById);
route.get('/users/fetchAllUsers', userService.findAll);*/

//API to fetch Masters
/*route.get('/masters/states', masterService.fetchAllStates);
route.get('/masters/doctypes', masterService.fetchAllDocTypes);
route.get('/masters/deductiontypes', masterService.fetchAllDeductionTypes);*/


//API routes for taxfilling module
route.post('/tax/uploadxml', taxService.uploadPrefilledXML);
route.post('/tax/appMainDetails', taxService.fetchApplicationMainByAppId);

route.post('/tax/createApplication', taxService.createApplication);
route.post('/tax/saveBasicInfo', taxService.saveBasicInfoByAppId);
route.post('/tax/savePersonalInfo', taxService.savePersonalInfoByAppId);
route.post('/tax/saveAddressInfo', taxService.saveAddressInfoByAppId);
route.post('/tax/saveBankDetails', taxService.saveBankDetailsByAppId);
route.post('/tax/saveAssestsInfo', taxService.saveAssestsInfoByAppId);
route.post('/tax/saveImmAssestsInfo', taxService.saveImmAssestsInfoByAppId);
route.post('/tax/saveSalaryIncome', taxService.saveSalIncomeInfoByAppId);
route.post('/tax/saveOtherIncome', taxService.saveOthIncomeInfoByAppId);
route.post('/tax/saveHouseIncome', taxService.saveHouseIncomeInfoByAppId);
route.post('/tax/saveRentalIncome', taxService.saveRentalIncomeInfoByAppId);
route.post('/tax/saveCapitalIncome', taxService.saveCapitalIncomeInfoByAppId);
/*route.post('/tax/saveDeductions', taxService.saveDeductionsInfoByAppId);
route.post('/tax/saveTaxpaidInfo', taxService.saveTaxPaidInfoByAppId);
route.post('/tax/uploadDocument', taxService.uploadDocument);
route.post('/tax/payment', taxService.doPayment);
route.post('/tax/generateReport', taxService.generateITRReport);

route.get('/tax/fetchReportInExcel', taxService.fetchITRReportInExcel);
route.get('/tax/fetchReportInXML', taxService.fetchITRReportInXML);
route.get('/tax/fetchDocPreview', taxService.fetchDocPreview);*/
route.get('/tax/fetchDashboardInfo', taxService.fetchDashboardInfo);

module.exports = route;
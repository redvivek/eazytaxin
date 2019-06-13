var express = require ('express'); //EXPRESS Package
var route = express.Router();   //define our app using express
var  userService = require('../services/users.service');
var  masterService = require('../services/masters.service');
var  taxService = require('../services/tax.service');
var  parseService = require('../services/parser.service');

//Routes
/* GET home page. */
route.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});

//API routes for User Reg and Login module
route.post('/users/register', userService.create);
route.post('/users/isEmailRegisterd',userService.isEmailRegisterd);
route.post('/users/authenticate', userService.authenticateUser);
route.post('/users/sendActivationMail', userService.sendActivationMail);
route.get('/users/verifyUser', userService.verifyUser);
route.post('/users/sendForgetPwdLink', userService.forgetPassword);
route.post('/users/checkResetCode', userService.checkResetpwdCode);
route.post('/users/updatePassword', userService.updatePassword);
/*route.put('/users/updateProfile', userService.update);
route.get('/users/getUser', userService.findById);
route.get('/users/fetchAllUsers', userService.findAll);*/

//API to fetch Masters
/*route.get('/masters/states', masterService.fetchAllStates);
route.get('/masters/doctypes', masterService.fetchAllDocTypes);
route.get('/masters/deductiontypes', masterService.fetchAllDeductionTypes);*/


//API routes for taxfilling module
route.post('/tax/uploadxml', taxService.uploadPrefilledXML);
route.post('/tax/uploadproofDocuments', taxService.uploadproofDocuments);
route.post('/tax/appMainDetails', taxService.fetchApplicationMainByAppId);

route.post('/tax/createApplication', taxService.createApplication);
route.post('/tax/saveBasicInfo', taxService.saveBasicInfoByAppId);

route.post('/tax/savePersonalInfo', taxService.savePersonalInfoByAppId);
route.post('/tax/saveAddressInfo', taxService.saveAddressInfoByAppId);
route.post('/tax/saveBankDetails', taxService.saveBankDetailsByAppId);
route.post('/tax/saveAssestsInfo', taxService.saveAssestsInfoByAppId);
route.post('/tax/updateAssestsInfo', taxService.updateAssestsInfoByAppId);
route.post('/tax/saveImmAssestsInfo', taxService.saveImmAssestsInfoByAppId);

route.post('/tax/appPersonalDetails',taxService.fetchPersonalInfoByAppId);
route.post('/tax/checkExistingPan',taxService.checkExistingPan);
route.post('/tax/appAddressDetails',taxService.fetchAddressInfoByAppId);
route.post('/tax/appBankDetails',taxService.fetchBankInfoByAppId);
route.post('/tax/appAssetsDetails',taxService.fetchAssetsInfoByAppId);

route.post('/tax/saveSalaryIncomeForm16', taxService.saveSalIncomeF16InfoByAppId);
route.post('/tax/saveSalaryIncome', taxService.saveSalIncomeInfoByAppId);
route.post('/tax/saveOtherIncome', taxService.saveOthIncomeInfoByAppId);
route.post('/tax/updateOtherIncome', taxService.updateOthIncomeInfoByAppId);
route.post('/tax/saveHouseIncome', taxService.saveHouseIncomeInfoByAppId);
route.post('/tax/saveRentalIncome', taxService.saveRentalIncomeInfoByAppId);
route.post('/tax/updateHouseIncome',taxService.updateHouseIncomeInfoByAppId);
route.post('/tax/saveCapitalIncome', taxService.saveCapitalIncomeInfoByAppId);
route.post('/tax/updateCapitalIncome', taxService.updateCapitalIncomeInfoByAppId);

route.post('/tax/appSalaryDetails',taxService.fetchSalaryInfoByAppId);
route.post('/tax/appOthSalaryDetails',taxService.fetchOthSalaryInfoByAppId);
route.post('/tax/appSelfPropDetails',taxService.fetchSelfPropInfoByAppId);
route.post('/tax/appCapSalaryDetails',taxService.fetchCapSalaryInfoByAppId);

route.post('/tax/saveDeductions', taxService.saveDeductionsInfoByAppId);
route.post('/tax/saveOtherDeductions', taxService.saveOtherDeductionsByAppId);
route.post('/tax/fetchDeductionsDetails', taxService.fetchDeductionsDetails);
route.post('/tax/saveTaxpaidInfo', taxService.saveTaxPaidInfoByAppId);
route.post('/tax/saveOthTaxpaidInfo',taxService.saveOthTaxpaidInfoByAppId);
route.post('/tax/saveIncTaxpaidInfo',taxService.saveIncTaxpaidInfoByAppId);
route.post('/tax/fetchAppPaymentDetails',taxService.fetchAppPaymentDetails);
route.post('/tax/saveTranInfo', taxService.doPayment);
route.post('/tax/fetchAppTransDetails',taxService.fetchAppTransDetails)
route.post('/tax/submitITRApplication', taxService.generateITRReport);

/*route.get('/tax/fetchReportInExcel', taxService.fetchITRReportInExcel);
route.get('/tax/fetchReportInXML', taxService.fetchITRReportInXML);
route.get('/tax/fetchDocPreview', taxService.fetchDocPreview);*/
route.post('/tax/fetchDashboardInfo', taxService.fetchDashboardInfo);
route.post('/tax/fetchInProgApps', taxService.fetchInProgressAppsByUserid);
route.post('/tax/fetchAppInfo',taxService.fetchAppInfo);


route.post('/tax/getInfoFromXML',parseService.getInfoFromXML);

module.exports = route;
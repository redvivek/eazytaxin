const path          = require('path');
const fs            = require('fs');
const multer        = require('multer');
const bodyParser    = require('body-parser');
var Q               = require('q');
var xml2js          = require('xml2js');
var dateTime    = require('node-datetime');
var parser      = new xml2js.Parser({ attrkey: "ATTR" });

exports.getInfoFromXML = (req,res) => {
    let appid = req.body.appid;
    let userid = req.body.userid;
    let category = req.body.category;
    
    var folderPath  =   path.join(process.env.PWD, '/uploads/');
    var filename    =   userid+"_preFilledxml.xml"
    var filepath    =   folderPath+filename;

    
    //console.log("XML File path "+ filepath);
    let xml_string  =   fs.readFileSync(filepath, "utf8");
    parser.parseString(xml_string,function(error, result) {    
        if(error === null) {
            //console.log("XML output "+JSON.stringify(result["ns3:ITR"]));
            let mainNode    =   result["ns3:ITR"];
            if(mainNode != null){
                let subNode     =   mainNode["ns2:ITR1"];
                //console.log("XML output "+JSON.stringify(subNode));
                if(subNode.length > 0){
                    let forITRNode  =   subNode[0]["Form_ITR1"];
                    //console.log("ITR form info "+JSON.stringify(forITRNode));
                    
                    if(category == "PersonalInfo"){
                        let personalInfoNode = subNode[0]["PersonalInfo"];
                        if(personalInfoNode.length > 0){
                            //console.log("personal info "+JSON.stringify(personalInfoNode));
                            let assesname = personalInfoNode[0]["AssesseeName"];
                            let firstnm = assesname[0]["FirstName"];
                            let middlenm = assesname[0]["MiddleName"];
                            let lastnm = assesname[0]["SurNameOrOrgName"];
                            
                            let panno = personalInfoNode[0]["PAN"];
                            
                            let addressArr = personalInfoNode[0]["Address"];
                            let landline = addressArr[0]["Phone"];
                            let mobileno = addressArr[0]["MobileNo"];
                            let altMobileno = addressArr[0]["MobileNoSec"];
                            let email = addressArr[0]["EmailAddress"];
                            
                            let dob = personalInfoNode[0]["DOB"];
                            let emptype = personalInfoNode[0]["EmployerCategory"];
                            let gender = personalInfoNode[0]["Gender"];
                            let genVal = null;
                            if(gender == 'M')
                                genVal = "male";
                            else if(gender == 'F')
                                genVal = "female";
                            else
                                genVal = "others";
                            let resiStatus = personalInfoNode[0]["Status"];
                            let aadhar = personalInfoNode[0]["AadhaarCardNo"];
                            //console.log("Assess name info "+firstnm+middlenm+lastnm+panno+dob+emptype+genVal+resiStatus+aadhar,landline,mobileno,altMobileno,email);
                            var perinfoData = {
                               "Firstname" : firstnm,
                               "Middlename" : middlenm,
                               "Lastname" : lastnm,
                               "EmailId" : email,
                               "MobileNo" : mobileno,
                               "AltMobileNo" : altMobileno,
                               "DateOfBirth" : dob,
                               "Gender" : genVal,
                               "EmployerType" : emptype,
                               "PanNumber" : panno,
                               "AadharNumber" : aadhar
                            }
                            res.json({"statusCode": 200,"Message": "Successful Request","infoData":perinfoData});
                        }
                    }
                    
                    if(category == "addressInfo"){
                        let personalInfoNode = subNode[0]["PersonalInfo"];
                        if(personalInfoNode.length > 0){
                            //console.log("personal info "+JSON.stringify(personalInfoNode));
                            let addressArr = personalInfoNode[0]["Address"];
                            let flatno = addressArr[0]["ResidenceNo"];
                            let roadStreetnm = addressArr[0]["RoadOrStreet"];
                            let areaLocalitynm = addressArr[0]["LocalityOrArea"];
                            let citynm = addressArr[0]["CityOrTownOrDistrict"];
                            let state = addressArr[0]["StateCode"];
                            let country = addressArr[0]["CountryCode"];
                            let pincode = addressArr[0]["PinCode"];
                            //console.log("Assess Address info "+flatno+roadStreetnm+areaLocalitynm+citynm+state+country+pincode);
                            var addinfoData = {
                                "Flatno_Blockno" : flatno,
                                "Road_Street_PO" : roadStreetnm,
                                "Area_Locality" : areaLocalitynm,
                                "Pincode" : pincode,
                                "City_Town_District" : citynm,
                                "State" : state,
                                "Country" : "India"
                             }
                             res.json({"statusCode": 200,"Message": "Successful Request","infoData":addinfoData});
                        }
                    }
                    
                    if(category == "bankInfo"){
                        let bankInfoNode = subNode[0]["Refund"];
                        if(bankInfoNode.length > 0){
                            let bankDetsArr = bankInfoNode[0]["BankAccountDtls"];
                            if(bankDetsArr.length > 0){
                                let priBankDetails = bankDetsArr[0]["PriBankDetails"];
                                let othBankDetails = bankDetsArr[0]["AddtnlBankDetails"];
                                var bankDetailInput = [];
                                if(priBankDetails.length > 0){
                                    console.log("Pri bank info "+JSON.stringify(priBankDetails));
                                    for(var i=0;i<priBankDetails.length;i++){
                                        var primaryBank = {
                                            "AccountPriority" : "Primary",
                                            "AccountNumber" : priBankDetails[i]["BankAccountNo"],
                                            "AccountType" : "savings",
                                            "BankName" : priBankDetails[i]["BankName"],
                                            "IFSCCode" : priBankDetails[i]["IFSCCode"]
                                        }
                                        bankDetailInput.push(primaryBank);
                                    }
                                }
                                if(othBankDetails.length > 0){
                                    console.log("Oth bank info "+JSON.stringify(othBankDetails));
                                    for(var i=0;i<othBankDetails.length;i++){
                                        var otherBank = {
                                            "AccountPriority" : "Others",
                                            "AccountNumber" : othBankDetails[i]["BankAccountNo"],
                                            "AccountType" : "savings",
                                            "BankName" : othBankDetails[i]["BankName"],
                                            "IFSCCode" : othBankDetails[i]["IFSCCode"]
                                        }
                                        bankDetailInput.push(otherBank);
                                    }
                                }
                            }
                            res.json({"statusCode": 200,"Message": "Successful Request","infoData":bankDetailInput});
                        }
                    }
                    
                    if(category == "salIncomeInfo"){
                        let incomeInfoNode = subNode[0]["ITR1_IncomeDeductions"];
                        if(incomeInfoNode.length > 0){
                            let salTotIncome = incomeInfoNode[0]["IncomeFromSal"];
                            let hpTotIncome = incomeInfoNode[0]["TotalIncomeOfHP"];
                            let othTotIncome = incomeInfoNode[0]["IncomeOthSrc"];

                            console.log("Income info "+JSON.stringify(salTotIncome+hpTotIncome+othTotIncome));
                        }

                        
                        
                        let salTaxDeductionInfoNode = subNode[0]["TDSonSalaries"];
                        if(salTaxDeductionInfoNode.length > 0){
                            var salDetailInput = [];
                            console.log("Tax Deducted Info "+JSON.stringify(salTaxDeductionInfoNode));
                            let tdsOnSalArr = salTaxDeductionInfoNode[0]["TDSonSalary"];
                            if(tdsOnSalArr.length > 0){
                                for(var i=0;i<tdsOnSalArr.length;i++){
                                    let empDetails = tdsOnSalArr[i]["EmployerOrDeductorOrCollectDetl"];
                                    let emprTAN, emprNM;
                                    if(empDetails.length > 0){
                                        emprTAN = empDetails[0]["TAN"];
                                        emprNM = empDetails[0]["EmployerOrDeductorOrCollecterName"];  
                                    }
                                    let totalSal        = tdsOnSalArr[i]["IncChrgSal"];
                                    let totalTaxOnSal   = tdsOnSalArr[i]["TotalTDSSal"]; 
                                    var tdsSalDet = {
                                        "emprName" : emprNM,
                                        "emprTAN" : emprTAN,
                                        "totalSal" : totalSal,
                                        "totalTaxOnSal" : totalTaxOnSal
                                    }
                                    salDetailInput.push(tdsSalDet);
                                }
                            }
                        }
                    }
                    
                    if(category == "taxPaymentInfo"){
                        let taxPaymentInfoNode = subNode[0]["TaxPayments"];
                        if(taxPaymentInfoNode.length > 0){
                            console.log("26AS PaymentInfo "+JSON.stringify(taxPaymentInfoNode));
                            let taxPayArr = taxPaymentInfoNode[0]["TaxPayment"];
                            if(taxPayArr.length > 0){
                                var taxInputDetails = {
                                    "bsrCode" : taxPayArr[0]["BSRCode"],
                                    "depositDate" : taxPayArr[0]["DateDep"],
                                    "ChallanNo" : taxPayArr[0]["SrlNoOfChaln"],
                                    "Amount" : taxPayArr[0]["Amt"]
                                }
                            }
                        }
                    }
                    
                }
            }
            
            
        }
        else {
            console.log("XML output error "+error);
        }
    });
}


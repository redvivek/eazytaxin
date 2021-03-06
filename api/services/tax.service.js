const path          = require('path');
//const fs            = require('fs');
const multer        = require('multer');
const bodyParser    = require('body-parser');
var Q               = require('q');
//var xml2js        = require('xml2js');
var https           = require('https');
var http           = require('http');
const sgMail        = require('@sendgrid/mail');


const db        = require('../config/dbConfig');
var dateTime    = require('node-datetime');
//var parser      = new xml2js.Parser({ attrkey: "ATTR" });

const ConfigMaster = db.ConfigMaster;
const ApplicationMain = db.ApplicationMain;

const PersonalDetails = db.PersonalDetails;
const AddressDetails = db.AddressDetails
const BankDetails = db.BankDetails;
const AssetsDetails = db.AssetsDetails;
const ImAssetsAddDetails = db.ImAssetsAddDetails;
const AssetsAOPDetails = db.AssetsAOPDetails;

const SalariedIncome = db.SalariedIncome;
const OtherIncome = db.OtherIncome;
const OtherDepIncome = db.OtherDepIncome;
const PropertyIncome = db.PropertyIncome;
const PropCoOwnerIncome = db.PropCoOwnerIncome;
const CapitalGainsIncome = db.CapitalGainsIncome;
const Deductions = db.Deductions;
const DocumentUpload = db.DocumentUpload; 
const ChallanDetails = db.ChallanDetails;
const OthIncomeTaxPaidDetails = db.OthIncomeTaxPaidDetails;
const IncomeTaxPaidDetails = db.IncomeTaxPaidDetails;
const TaxSummary = db.TaxSummary;

const sequelize = db.sequelize;

var dt = dateTime.create();
var formattedDT = dt.format('Y-m-d H:M:S');


// Fetch all Users
exports.uploadPrefilledXML = (req, res) => {
    var new_path = path.join(process.env.PWD, '/uploads/');
    //console.log("New Path:"+new_path);
    //console.log("Request: "+JSON.stringify(req.body));

    var storage = multer.diskStorage({
        destination: new_path,
        filename: function (req, file, cb) {
            //console.log("Request Filedata: "+JSON.stringify(req.body));
            var userid          =   req.body.UserId;
            var file_ext        =   file.originalname.split('.');
            cb(null, userid + '_preFilledxml' + "." +file_ext[1])
        }
    });
    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function(err) {
        if (err) {
            console.log("success:"+false);
            res.status(400).send(err);
        } else {
            console.log('file received');
            console.log("Request Filedata: "+JSON.stringify(req.body));
            var userid          =   req.body.UserId;
            var appRefNo        =   req.body.AppRefNo;
            var assYear         =   req.body.AssesmentYear; 
            var xmlFlag         =   req.body.XmlUploadFlag;
            var docCategory     =   req.body.DocCategory;
            createApplicationMain(userid,appRefNo,assYear,xmlFlag)
            .then(function(appid){
                req.files.forEach(function(item) {
                    console.log("File item "+ JSON.stringify(item));
                    var filename = item.filename;
                    var filepath = item.path;

                    //Save the uploaded document details in document upload table
                    DocumentUpload.findOne(
                        { where: {UserId:userid,DocumentCategory:docCategory} }
                    )
                    .then(function (resultData) {
                        if (resultData) {
                            console.log("Result Doc Details  "+JSON.stringify(resultData));
                            DocumentUpload.destroy({
                                where: { documentId: resultData.documentId}
                            }).then(() => {
                                console.log('deleted successfully with id = ' + resultData.documentId);
                                sequelize.query("INSERT INTO `et_documentupload`(UserId,ApplicationId,DocumentCategory,DocumentName,DocumentPath,createdAt) VALUES (?,?,?,?,?,?)",{
                                    replacements: [userid,appid,docCategory,filename,filepath,formattedDT],
                                    type: sequelize.QueryTypes.INSERT 
                                }).then(result => {		
                                    console.log("Result AppId  "+result[0]);
                                    res.json({"statusCode": 200,"Message": "Successful Request","AppId":appid});
                                })
                                .catch(function (err) {
                                    console.log("Error "+err);
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            //Save to et_documentupload table
                            sequelize.query("INSERT INTO `et_documentupload`(UserId,ApplicationId,DocumentCategory,DocumentName,DocumentPath,createdAt) VALUES (?,?,?,?,?,?)",{
                                replacements: [userid,appid,docCategory,filename,filepath,formattedDT],
                                type: sequelize.QueryTypes.INSERT 
                            }).then(result => {		
                                console.log("Result AppId  "+result[0]);
                                res.json({"statusCode": 200,"Message": "Successful Request","AppId":appid});
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
                });
            
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        }
    });
}

exports.uploadproofDocuments = (req,res)=>{
    var new_path = path.join(process.env.PWD, '/uploads/');
    //console.log("New Path:"+new_path);
    //console.log("Request: "+JSON.stringify(req.body));

    var storage = multer.diskStorage({
        destination: new_path,
        filename: function (req, file, cb) {
            //console.log("Request Filedata: "+JSON.stringify(req.body));
            var appid       =   req.body.ApplicationId;
            var category    =   req.body.DocCategory;
            var file_ext    =   file.originalname.split('.');
            cb(null, appid+"_"+category+"_"+file_ext[0]+"." +file_ext[1])
        }
    });
    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function(err) {
        if (err) {
            console.log("success:"+false);
            res.status(400).send(err);
        } else {
            console.log('file received');
            console.log("Request Filedata: "+JSON.stringify(req.body));
            var userid      =   req.body.UserId;
            var appid       =   req.body.ApplicationId;
            var pwd         =   req.body.FilePassword != "" ? req.body.FilePassword : "";
            var docCategory =   req.body.DocCategory;
            req.files.forEach(function(item) {
                console.log("File item "+ JSON.stringify(item));
                var filename = item.filename;
                var filepath = item.path;
                DocumentUpload.findOne(
                    { where: {UserId:userid,ApplicationId: appid,DocumentCategory:docCategory} }
                )
                .then(function (resultData) {
                    if (resultData) {
                        console.log("Result Doc Details  "+JSON.stringify(resultData));
                        DocumentUpload.destroy({
                            where: { documentId: resultData.documentId}
                        }).then(() => {
                            console.log('deleted successfully with id = ' + resultData.documentId);
                            sequelize.query("INSERT INTO `et_documentupload`(UserId,ApplicationId,DocumentCategory,DocumentName,FilePassword,DocumentPath,createdAt) VALUES (?,?,?,?,?,?,?)",{
                                replacements: [userid,appid,docCategory,filename,pwd,filepath,formattedDT],
                                type: sequelize.QueryTypes.INSERT 
                            }).then(result => {		
                                console.log("Result AppId  "+result[0]);
                                res.json({"statusCode": 200,"Message": "Successful Request"});
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                                res.status(400).send(err);
                            });
                        });
                    } else {
                        //Save to et_documentupload table */
                        sequelize.query("INSERT INTO `et_documentupload`(UserId,ApplicationId,DocumentCategory,DocumentName,FilePassword,DocumentPath,createdAt) VALUES (?,?,?,?,?,?,?)",{
                            replacements: [userid,appid,docCategory,filename,pwd,filepath,formattedDT],
                            type: sequelize.QueryTypes.INSERT 
                        }).then(result => {		
                            console.log("Result AppId  "+result[0]);
                            res.json({"statusCode": 200,"Message": "Successful Request"});
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
            });
        }
    });
}

exports.createApplication = (req, res) => {
    let appParam = req.body;
	console.log("Request Object: "+JSON.stringify(appParam));

	/*Check for existing application for tax period & user */
    let assesmentYear = appParam.taxperiod;
    let userid = appParam.userId;
    let xmluploadflag = appParam.xmluploadflag;
    let appRefNo = appParam.appRefNo;
    let files = [];
    createApplicationMain(userid,appRefNo,assesmentYear,xmluploadflag)
    .then(function(appid){
        res.json({"statusCode": 200,"Message": "Successful Request","AppId":appid});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });

}

function createApplicationMain(userid,appRefNo,assYear,xmlFlag){
    var deferred = Q.defer();
    ApplicationMain.findOne(
		{ where: {UserId:userid,AssesmentYear: assYear} }
	)
	.then(function (application) {
		if (application) {
            console.log("Result AppId  "+JSON.stringify(application));
            //updateApplicationMain(application.ApplicationId,userid,1,xmlFlag);
            sequelize.query("UPDATE `et_applicationsmain` SET XmlUploadFlag=?,updatedAt=?,ApplicationStage=? WHERE ApplicationId = ? AND UserId = ? ",{
                replacements: [xmlFlag,formattedDT,1,application.ApplicationId,userid],
                type: sequelize.QueryTypes.UPDATE 
            }).then(result => {		
                console.log("Result AppId  "+result);
                deferred.resolve(application.ApplicationId);
            })
            .catch(function (err) {
                console.log("Error in app main update "+err);
                deferred.reject(err);
            });
        } else {
			//Save to et_applicationsmain table */
			sequelize.query("INSERT INTO `et_applicationsmain`(UserId,AppRefNo,AssesmentYear,xmluploadflag,createdAt,ApplicationStage,ApplicationStatus,AppPaymentStatus,AppITRUploadStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
				replacements: [userid,appRefNo,assYear,xmlFlag,formattedDT,1,'Initiated','NotStarted','No'],
				type: sequelize.QueryTypes.INSERT 
			}).then(result => {		
                console.log("Result AppId  "+result[0]);
                deferred.resolve(result[0]);
			})
			.catch(function (err) {
                console.log("Error "+err);
                deferred.reject(err);
			});
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		deferred.reject(err);
    });
    
    return deferred.promise;
}

exports.fetchApplicationMainByAppId = (req,res)=>{
    //console.log("Request param "+req.body.id);
    ApplicationMain.findByPk(req.body.id).then(appmain => {
        console.log("Result AppData "+appmain);
        res.json({"statusCode": 200,"Message": "Successful Request","AppData":appmain});
        //res.json(appmain);
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
};

exports.fetchPersonalInfoByAppId = (req,res)=>{
    console.log("Request param "+req.body.id);
    PersonalDetails.findOne(
		{ where: {ApplicationId: req.body.id} }
	)
	.then(function (resultData) {
        console.log("Result - Personal Details  "+ resultData);
        if (resultData) {
            console.log("Result - Personal Details  "+JSON.stringify(resultData));
            res.json({"statusCode": 200,"Message": "Successful Request","PerData":resultData});
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","PerData":""});
        }

	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
};

exports.checkExistingPan = (req,res)=>{
    //console.log("Request param "+req.body.panVal);
    //console.log("Request param "+req.body.userId);
    let panValue = req.body.panVal;
    let userid = req.body.userId;
    sequelize.query("SELECT COUNT(*) as cnt FROM `et_personaldetails` where UserId != ? AND PanNumber = ? ",{
        replacements: [userid,panValue],
        type: sequelize.QueryTypes.SELECT 
    }).then(resultData => {		
        console.log("Result - Exisitng PAN Details "+JSON.stringify(resultData));
        if (resultData["cnt"] > 0) {
            res.json({"statusCode": 200,"Message": "InValid"});
        }else{
            res.json({"statusCode": 200,"Message": "Valid"});
        }
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchAddressInfoByAppId = (req,res)=>{
    console.log("Request param "+req.body.id);
    console.log("Request param "+req.body.addresstype);
    AddressDetails.findOne(
		{ where: {ApplicationId: req.body.id,AddressType:req.body.addresstype} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Address Details  "+JSON.stringify(resultData));
            res.json({"statusCode": 200,"Message": "Successful Request","PerData":resultData});
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","PerData":""});
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

exports.fetchBankInfoByAppId = (req,res) =>{
    console.log("Request param "+req.body.id);
    BankDetails.findAll(
		{ where: {ApplicationId: req.body.id} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Address Details  "+JSON.stringify(resultData));
            res.json({"statusCode": 200,"Message": "Successful Request","PerData":resultData});
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","PerData":""});
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

exports.fetchAssetsInfoByAppId =(req,res)=>{
    console.log("Request param "+req.body.id);
    var resultArray = [];
    AssetsDetails.findOne(
		{ where: {ApplicationId: req.body.id} }
	)
	.then(function (resultData) {
		if (resultData) {
            //console.log("Result - Assets Details  "+JSON.stringify(resultData));
            resultArray.push({"MainData":resultData});
            if(resultData.ImmovableAssetsFlag == 1){
                ImAssetsAddDetails.findOne(
                    { where: {ALDetailsId: resultData.ALDetailsId} }
                )
                .then(function (imResultData) {
                    if (imResultData) {
                        //console.log("Result - ImAssets Details  "+JSON.stringify(imResultData));
                        resultArray.push({"ImmData":imResultData});
                        res.json({"statusCode": 200,"Message": "Successful Request","PerData":resultArray});
                    }else{
                        resultArray.push({"ImmData":[]});
                        res.json({"statusCode": 200,"Message": "Successful Request","PerData":resultArray});
                    }
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
                
            }else{
                resultArray.push({"ImmData":[]});
                res.json({"statusCode": 200,"Message": "Successful Request","PerData":resultArray});
            }
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","PerData":""});
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

exports.fetchSalaryInfoByAppId = (req,res)=>{
    console.log("Request param "+req.body.id);
    var resultArray = [];
    SalariedIncome.findOne(
		{ where: {ApplicationId: req.body.id} }
	)
	.then(function (resultData) {
		if (resultData) {
            //console.log("Result - Salary Details  "+JSON.stringify(resultData));
            res.json({"statusCode": 200,"Message": "Successful Request","SalData":resultData});
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","SalData":""});
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
};

exports.fetchOthSalaryInfoByAppId = (req,res) =>{
    console.log("Request param "+req.body.id);
    var resultArray = [];
    OtherIncome.findOne(
		{ where: {ApplicationId: req.body.id} }
	)
	.then(function (resultData) {
		if (resultData) {
            //console.log("Result - Salary Details  "+JSON.stringify(resultData));
            resultArray.push({"maindata":resultData});
            OtherDepIncome.findOne(
                { where: {IncomeSourceOthersId: resultData.IncomeSourceOthersId} }
            )
            .then(function (depResultData) {
                if (depResultData) {
                    //console.log("Result - ImAssets Details  "+JSON.stringify(imResultData));
                    resultArray.push({"depdata":depResultData});
                    res.json({"statusCode": 200,"Message": "Successful Request","SalData":resultArray});
                }else{
                    resultArray.push({"depdata":[]});
                    res.json({"statusCode": 200,"Message": "Successful Request","SalData":resultArray});
                }
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","SalData":""});
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

exports.fetchSelfPropInfoByAppId = (req,res)=>{
    console.log("Request param "+req.body.id);
    console.log("Request param1 "+req.body.type);
    var resultArray = [];
    PropertyIncome.findOne(
		{ where: {ApplicationId: req.body.id,PropertyType:req.body.type} }
	)
	.then(function (resultData) {
		if (resultData) {
            //console.log("Result - Salary Details  "+JSON.stringify(resultData));
            resultArray.push({"maindata":resultData});
            
            AddressDetails.findOne(
                { where: {ApplicationId: resultData.ApplicationId,AddressType:req.body.type} }
            )
            .then(function (addResultData) {
                if (addResultData) {
                    console.log("Result - Address Details  "+JSON.stringify(addResultData));
                    resultArray.push({"adddata":addResultData});
                    if(resultData.CoownerFlag == 1){
                        PropCoOwnerIncome.findOne(
                            { where: {IncomeHouseDetailsId: resultData.IncomeHouseDetailsId} }
                        )
                        .then(function (coResultData) {
                            if (coResultData) {
                                //console.log("Result - ImAssets Details  "+JSON.stringify(imResultData));
                                resultArray.push({"codata":coResultData});
                                res.json({"statusCode": 200,"Message": "Successful Request","SPropData":resultArray});
                            }else{
                                resultArray.push({"codata":[]});
                                res.json({"statusCode": 200,"Message": "Successful Request","SPropData":resultArray});
                            }
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            res.status(400).send(err);
                        });
                    }else{
                        resultArray.push({"codata":[]});
                        res.json({"statusCode": 200,"Message": "Successful Request","SPropData":resultArray});
                    }
                }else{
                    resultArray.push({"adddata":[]});
                    if(resultData.CoownerFlag == 1){
                        PropCoOwnerIncome.findOne(
                            { where: {IncomeHouseDetailsId: resultData.IncomeHouseDetailsId} }
                        )
                        .then(function (coResultData) {
                            if (coResultData) {
                                //console.log("Result - ImAssets Details  "+JSON.stringify(imResultData));
                                resultArray.push({"codata":coResultData});
                                res.json({"statusCode": 200,"Message": "Successful Request","SPropData":resultArray});
                            }else{
                                resultArray.push({"codata":[]});
                                res.json({"statusCode": 200,"Message": "Successful Request","SPropData":resultArray});
                            }
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            res.status(400).send(err);
                        });
                    }else{
                        resultArray.push({"codata":[]});
                        res.json({"statusCode": 200,"Message": "Successful Request","SPropData":resultArray});
                    }
                }
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","SPropData":""});
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
};

exports.fetchCapSalaryInfoByAppId = (req,res)=>{
    console.log("Request param "+req.body.id);
    CapitalGainsIncome.findOne(
		{ where: {ApplicationId: req.body.id} }
	)
	.then(function (resultData) {
		if (resultData) {
            //console.log("Result - Salary Details  "+JSON.stringify(resultData));
            res.json({"statusCode": 200,"Message": "Successful Request","SalData":resultData});
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request","SalData":""});
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
};

exports.saveBasicInfoByAppId = (req,res)=>{
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let residentIndianFlag = req.body.residentIndianFlag != ""? req.body.residentIndianFlag : null;
    let srtPresentIndiaFlag = req.body.srtPresentIndiaFlag != ""? req.body.srtPresentIndiaFlag : null;
    let lngPresentIndiaFlag = req.body.lngPresentIndiaFlag != ""? req.body.lngPresentIndiaFlag : null;
    let nonResidentIndianFlag = req.body.nonResidentIndianFlag != ""? req.body.nonResidentIndianFlag : null;
    let ociResidentIndianFlag = req.body.ociResidentIndianFlag != ""? req.body.ociResidentIndianFlag : null;
    let residenttype;

    if(residentIndianFlag == 1 ){
        if(srtPresentIndiaFlag == 1 && lngPresentIndiaFlag == 1){
            residenttype = 'ROR';
        }else if(srtPresentIndiaFlag == 1 && lngPresentIndiaFlag == 0){
            residenttype = 'RNOR';
        }else if(srtPresentIndiaFlag == 0){
            residenttype = 'RNOR';
        }
    }
    if(residentIndianFlag == 0 ){
        if(nonResidentIndianFlag == 1 && ociResidentIndianFlag == 1){
            residenttype = 'NR';
        }else if(nonResidentIndianFlag == 1 && ociResidentIndianFlag == 0){
            residenttype = 'RNOR';
        }else if(nonResidentIndianFlag == 0){
            residenttype = 'NR';
        }
    }

    let updateAt = formattedDT;

    //update basic info flags to et_applicationsmain table */
    sequelize.query("UPDATE `et_applicationsmain` SET ResidentIndianFlag=?, NonResidentIndianFlag=?, OciResidentIndianFlag=?, LngPresentIndiaFlag=?,ShrtPresentIndiaFlag=?, ResidentType=? ,updatedAt = ?, ApplicationStage=?, ApplicationStatus=? WHERE ApplicationId = ? AND UserId = ? ",{
        replacements: [residentIndianFlag,nonResidentIndianFlag,ociResidentIndianFlag,lngPresentIndiaFlag,srtPresentIndiaFlag,residenttype,updateAt,2,'Progress',appid,userid],
        type: sequelize.QueryTypes.UPDATE 
    }).then(result => {		
        console.log("Result AppId  "+result);
        res.json({"statusCode": 200,"Message": "Successful Request"});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
};

exports.savePersonalInfoByAppId = (req,res)=>{
    //res.status(200);
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let firstName = req.body.Firstname;
    let lastName = req.body.Lastname;
    let middleName = req.body.Middlename;
    let emailId = req.body.EmailId;
    let fatherName = req.body.Fathername;
    let mob = req.body.MobileNo;
    let altMob = req.body.AltMobileNo;
    let dob = req.body.DateOfBirth;
    //let gender = req.body.Gender;
    //let empType = req.body.EmployerType;
    let panNumber = req.body.PanNumber;
    let aadharNumber = req.body.AadharNumber;
    let updateAt = formattedDT;

    //console.log("Input - Personal Details  "+dob.formatted);

    PersonalDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Personal Details  "+JSON.stringify(resultData));
            PersonalDetails.destroy({
                where: { PersonalDetailsId: resultData.PersonalDetailsId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.PersonalDetailsId);
                sequelize.query("INSERT INTO `et_personaldetails`(ApplicationId,UserId,Firstname,Middlename,Lastname,EmailId,Fathername,MobileNo,AltMobileNo,DateOfBirth,PanNumber,AadharNumber,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,firstName,middleName,lastName,emailId,fatherName,mob,altMob,dob.formatted,panNumber,aadharNumber,updateAt,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_applicationsmain table */
                    updateApplicationMain(appid,userid,4);

                    res.json({"statusCode": 200,"Message": "Successful Request","PerInfoId":result[0]});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//res.status(200);
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_personaldetails`(ApplicationId,UserId,Firstname,Middlename,Lastname,EmailId,Fathername,MobileNo,AltMobileNo,DateOfBirth,PanNumber,AadharNumber,createdAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,firstName,middleName,lastName,emailId,fatherName,mob,altMob,dob.formatted,panNumber,aadharNumber,updateAt,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,4);
                res.json({"statusCode": 200,"Message": "Successful Request","PerInfoId":result[0]});
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
};

exports.saveAddressInfoByAppId = (req,res)=>{
    //res.status(200);
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let addressType = req.body.Addresstype;
    let flatno = req.body.Flatno;
    let building = req.body.Building;
    let street = req.body.Street;
    let area = req.body.Area;
    let pincode = req.body.Pincode;
    let city = req.body.City;
    let state = req.body.State;
    let country = req.body.Country;
    let updateAt = formattedDT;

    AddressDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Personal Details  "+JSON.stringify(resultData));
            AddressDetails.destroy({
                where: { AdressDetailsId: resultData.AdressDetailsId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.AdressDetailsId);
                sequelize.query("INSERT INTO `et_addressdetails`(ApplicationId,UserId,AddressType,Flatno_Blockno,Building_Village_Premises,Road_Street_PO,Area_Locality,City_Town_District,State,Country,Pincode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,addressType,flatno,building,street,area,city,state,country,pincode,updateAt,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_applicationsmain table */
                    updateApplicationMain(appid,userid,5);

                    res.json({"statusCode": 200,"Message": "Successful Request","addInfoId":result[0]});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//res.status(200);
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_addressdetails`(ApplicationId,UserId,AddressType,Flatno_Blockno,Building_Village_Premises,Road_Street_PO,Area_Locality,City_Town_District,State,Country,Pincode,createdAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,addressType,flatno,building,street,area,city,state,country,pincode,updateAt,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {			
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,5);
                res.json({"statusCode": 200,"Message": "Successful Request","addInfoId":result[0]});
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
};

exports.saveBankDetailsByAppId = (req,res)=>{
    //res.status(200);
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let details = req.body.Details;
    let acctype = req.body.accType;
    let updateAt = formattedDT;

    BankDetails.findOne(
        { where: {UserId:userid,ApplicationId: appid,AccountPriority:acctype} }
    )
    .then(function (resultData) {
        if (resultData) {
            console.log("Result - Personal Details  "+JSON.stringify(resultData));
            BankDetails.destroy({
                where: {UserId:userid,ApplicationId: appid,AccountPriority:acctype}
            }).then(() => {
                console.log('deleted successfully with id = ' + appid);
                
                if(details.length > 0){
                    for(var i=0;i < details.length;i++){
                        let accPriority = details[i].AccPriority;
                        let accNumber = details[i].AccNumber;
                        let bankNm = details[i].BankNm;
                        let ifscCode = details[i].IFSCCode;
                        console.log("Result cnt  "+ i);
                        if( i != details.length-1){
                            insertBankDetails(appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt)
                            .then(result =>{
                                console.log("Result AppId  "+result);
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                                res.status(400).send(err);
                            });
                        }
                        else{
                            insertBankDetailsAndSendResponse(appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt)
                            .then(result =>{
                                console.log("Result AppId  "+result);
                                res.json({"statusCode": 200,"Message": "Successful Request"});
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                                res.status(400).send(err);
                            });
                        }
                    }
                }
            });
        } else {
            //res.status(200);
            if(details.length > 0){
                for(i=0;i < details.length;i++){
                    let accPriority = details[i].AccPriority;
                    let accNumber = details[i].AccNumber;
                    let bankNm = details[i].BankNm;
                    let ifscCode = details[i].IFSCCode;

                    console.log("Result cnt  "+ i);
                    if( i != details.length-1){
                        insertBankDetails(appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt)
                        .then(result =>{
                            console.log("Result AppId  "+result);
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            res.status(400).send(err);
                        });
                    }
                    else{
                        insertBankDetailsAndSendResponse(appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt)
                        .then(result =>{
                            console.log("Result AppId  "+result);
                            res.json({"statusCode": 200,"Message": "Successful Request"});
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            res.status(400).send(err);
                        });
                    }
                }
            }
        }
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
};

function insertBankDetails(appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt){
    var deferred = Q.defer();
    sequelize.query("INSERT INTO `et_bankdetails`(ApplicationId,UserId,AccountPriority,AccountNumber,BankName,IFSCCode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?)",{
        replacements: [appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt,'Yes'],
        type: sequelize.QueryTypes.INSERT 
    }).then(result => {		
        console.log("Result AppId  "+result[0]);
        deferred.resolve(result[0]);
    })
    .catch(function (err) {
        console.log("Error "+err);
        deferred.reject(err);
    });
    return deferred.promise;
}

function insertBankDetailsAndSendResponse(appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt){
    var deferred = Q.defer();
    sequelize.query("INSERT INTO `et_bankdetails`(ApplicationId,UserId,AccountPriority,AccountNumber,BankName,IFSCCode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?)",{
        replacements: [appid,userid,accPriority,accNumber,bankNm,ifscCode,updateAt,'Yes'],
        type: sequelize.QueryTypes.INSERT 
    }).then(result => {		
        console.log("Result AppId  "+result[0]);
        //update flags to et_applicationsmain table */
        updateApplicationMain(appid,userid,6);
        deferred.resolve(result[0]);
    })
    .catch(function (err) {
        console.log("Error "+err);
        deferred.reject(err);
        //res.status(400).send(err);
    });
    return deferred.promise;
}

exports.saveAssestsInfoByAppId = (req,res)=>{
    //res.status(200);
    let inputdata = req.body;
    console.log("Input Req "+ JSON.stringify(inputdata));
    let appid = req.body.appId;
    let userid = req.body.userId;
    let movJwellaryItemsAmount = req.body.movJwellaryItemsAmount!= "" ? parseFloat(req.body.movJwellaryItemsAmount) : 0.00;
    let movCraftItemsAmount = req.body.movCraftItemsAmount!= "" ? parseFloat(req.body.movCraftItemsAmount) : 0.00;
    let movConveninceItemsAmount = req.body.movConveninceItemsAmount!= "" ? parseFloat(req.body.movConveninceItemsAmount) : 0.00; 
    let movFABankAmount = req.body.movFABankAmount!= "" ? parseFloat(req.body.movFABankAmount) : 0.00;
    let movFASharesAmount = req.body.movFASharesAmount!= "" ? parseFloat(req.body.movFASharesAmount) : 0.00;
    let movFAInsAmount = req.body.movFAInsAmount!= "" ? parseFloat(req.body.movFAInsAmount) : 0.00;
    let movFALoansGivenAmount = req.body.movFALoansGivenAmount!= "" ? parseFloat(req.body.movFALoansGivenAmount) : 0.00;
    let movInHandCashAmount = req.body.movInHandCashAmount!= "" ? parseFloat(req.body.movInHandCashAmount) : 0.00;
    let totalLiability = req.body.totalLiability!= "" ? parseFloat(req.body.totalLiability) : 0.00;
    let updateAt = formattedDT;
    AssetsDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Assets Details  "+JSON.stringify(resultData));
            
                sequelize.query("UPDATE `et_assetsliabilitiesdetails` SET MovJwellaryItemsAmount = ?,MovCraftItemsAmount = ?,MovConveninceItemsAmount = ?,MovFABankAmount = ?,MovFASharesAmount =?,MovFAInsAmount =?,MovFALoansGivenAmount =?,MovInHandCashAmount =?,TotalLiability =?,updatedAt =? WHERE ApplicationId = ? AND UserId = ? ",{
                    replacements: [movJwellaryItemsAmount,movCraftItemsAmount,movConveninceItemsAmount,movFABankAmount,movFASharesAmount,movFAInsAmount,movFALoansGivenAmount,movInHandCashAmount,totalLiability,updateAt,appid,userid],
                    type: sequelize.QueryTypes.UPDATE 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_assetsliabilitiesdetails table */
                    updateApplicationMain(appid,userid,7);
                    res.json({"statusCode": 200,"Message": "Successful Request","assInfoId":result[0]});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
        } else {
            //update flags to et_assetsliabilitiesdetails table */
            updateApplicationMain(appid,userid,7);
            res.json({"statusCode": 200,"Message": "Successful Request","assInfoId":result[0]});
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
};

exports.saveImmAssestsInfoByAppId = (req,res)=>{
    let inputdata = req.body;
    console.log("Input Req "+ JSON.stringify(inputdata));
    let immovableAssInput = req.body.immovableAssInputParam
    let appid = immovableAssInput.appId;
    let userid = immovableAssInput.userId;
    let immovableAssetsFlag = immovableAssInput.immovableAssetsFlag;
    let description = immovableAssInput.description;
    let flatNo = immovableAssInput.flatNo;
    let premiseName = immovableAssInput.premiseName;
    let streetName = immovableAssInput.streetName;
    let locality = immovableAssInput.locality;
    let city = immovableAssInput.city;
    let state = immovableAssInput.state;
    let pincode = immovableAssInput.pincode;
    let country = immovableAssInput.country;
    let purchaseCost = immovableAssInput.purchaseCost!= "" ? parseFloat(immovableAssInput.purchaseCost) : 0.00;
    let totalLiabilites = immovableAssInput.totalLiabilites!= "" ? parseFloat(immovableAssInput.totalLiabilites) : 0.00;
    let updateAt = formattedDT;
    console.log("Input Req "+ JSON.stringify(inputdata));
    
    AssetsDetails.findOne(
        { where: {UserId:userid,ApplicationId: appid} }
    )
    .then(function (resultData) {
        if (resultData) {
            console.log("Result - Assets Details  "+JSON.stringify(resultData)); 
            sequelize.query("UPDATE `et_assetsliabilitiesdetails` SET ImmovableAssetsFlag=? WHERE ALDetailsId = ?",{
                replacements: [immovableAssetsFlag,resultData.ALDetailsId],
                type: sequelize.QueryTypes.UPDATE 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_assetsliabilitiesdetails table */
                updateApplicationMain(appid,userid,7);
                if(immovableAssetsFlag == 1){
                    
                    ImAssetsAddDetails.findOne(
                        { where: {UserId:userid,ApplicationId: appid} }
                    )
                    .then(function (immResultData) {
                        if (immResultData) {
                            console.log("Result - ImmAssets Details  "+JSON.stringify(immResultData));
                            ImAssetsAddDetails.destroy({
                                where: { ImmovableAssetsDetailsId: immResultData.ImmovableAssetsDetailsId}
                            }).then(() => {
                                console.log('deleted successfully with id = ' + immResultData.ImmovableAssetsDetailsId);
                                sequelize.query("INSERT INTO `et_immovableassetsdetails`(ApplicationId,UserId,ALDetailsId,Description,FlatNo,PremiseName,StreetName,AreaLocality,City,State,Country,Pincode,Amount,Immlaibilityamt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                                    replacements: [appid,userid,resultData.ALDetailsId,description,flatNo,premiseName,streetName,locality,city,state,country,pincode,purchaseCost,totalLiabilites,updateAt],
                                    type: sequelize.QueryTypes.INSERT 
                                }).then(result => {		
                                    console.log("Result AppId  "+result[0]);
                                    res.json({"statusCode": 200,"Message": "Successful Request","immAssInfoId":result[0]});
                                })
                                .catch(function (err) {
                                    console.log("Error "+err);
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            //Save to et_immovableassetsdetails table */
                            sequelize.query("INSERT INTO `et_immovableassetsdetails`(ApplicationId,UserId,ALDetailsId,Description,FlatNo,PremiseName,StreetName,AreaLocality,City,State,Country,Pincode,Amount,Immlaibilityamt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                                replacements: [appid,userid,resultData.ALDetailsId,description,flatNo,premiseName,streetName,locality,city,state,country,pincode,purchaseCost,totalLiabilites,updateAt],
                                type: sequelize.QueryTypes.INSERT 
                            }).then(result => {		
                                console.log("Result AppId  "+result[0]);
                                res.json({"statusCode": 200,"Message": "Successful Request","immAssInfoId":result[0]});
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
                }else{
                    
                    ImAssetsAddDetails.findOne(
                        { where: {UserId:userid,ApplicationId: appid} }
                    )
                    .then(function (immResultData) {
                        if (immResultData) {
                            console.log("Result - ImmAssets Details  "+JSON.stringify(immResultData));
                            ImAssetsAddDetails.destroy({
                                where: { ImmovableAssetsDetailsId: immResultData.ImmovableAssetsDetailsId}
                            }).then(() => {
                                console.log('deleted successfully with id = ' + immResultData.ImmovableAssetsDetailsId);
                                res.json({"statusCode": 200,"Message": "Successful Request"});
                            });
                        }else{
                            res.json({"statusCode": 200,"Message": "Successful Request"});
                        }
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
        } else {
            //Save to et_assetsliabilitiesdetails table */
            sequelize.query("INSERT INTO `et_assetsliabilitiesdetails`(ApplicationId,UserId,ImmovableAssetsFlag,updatedAt,CompletionStatus) VALUES (?,?,?,?,?)",{
                replacements: [appid,userid,immovableAssetsFlag,updateAt,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {			
                console.log("Result AppId  "+result[0]);
                let ALDetailsId = result[0];
                //update flags to et_assetsliabilitiesdetails table */
                updateApplicationMain(appid,userid,7);
                if(immovableAssetsFlag == 1){
                    ImAssetsAddDetails.findOne(
                        { where: {UserId:userid,ApplicationId: appid} }
                    )
                    .then(function (resultData) {
                        if (resultData) {
                            console.log("Result - ImmAssets Details  "+JSON.stringify(resultData));
                            ImAssetsAddDetails.destroy({
                                where: { ImmovableAssetsDetailsId: resultData.ImmovableAssetsDetailsId}
                            }).then(() => {
                                console.log('deleted successfully with id = ' + resultData.ImmovableAssetsDetailsId);
                                sequelize.query("INSERT INTO `et_immovableassetsdetails`(ApplicationId,UserId,ALDetailsId,Description,FlatNo,PremiseName,StreetName,AreaLocality,City,State,Country,Pincode,Amount,Immlaibilityamt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                                    replacements: [appid,userid,ALDetailsId,description,flatNo,premiseName,streetName,locality,city,state,country,pincode,purchaseCost,totalLiabilites,updateAt],
                                    type: sequelize.QueryTypes.INSERT 
                                }).then(result => {		
                                    console.log("Result AppId  "+result[0]);
                                    res.json({"statusCode": 200,"Message": "Successful Request","immAssInfoId":result[0]});
                                })
                                .catch(function (err) {
                                    console.log("Error "+err);
                                    res.status(400).send(err);
                                });
                            });
                        } else {
                            //Save to et_immovableassetsdetails table */
                            sequelize.query("INSERT INTO `et_immovableassetsdetails`(ApplicationId,UserId,ALDetailsId,Description,FlatNo,PremiseName,StreetName,AreaLocality,City,State,Country,Pincode,Amount,Immlaibilityamt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                                replacements: [appid,userid,ALDetailsId,description,flatNo,premiseName,streetName,locality,city,state,country,pincode,purchaseCost,totalLiabilites,updateAt],
                                type: sequelize.QueryTypes.INSERT 
                            }).then(result => {		
                                console.log("Result AppId  "+result[0]);
                                res.json({"statusCode": 200,"Message": "Successful Request","immAssInfoId":result[0]});
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
                }else{
                    ImAssetsAddDetails.findOne(
                        { where: {UserId:userid,ApplicationId: appid} }
                    )
                    .then(function (resultData) {
                        if (resultData) {
                            console.log("Result - ImmAssets Details  "+JSON.stringify(resultData));
                            ImAssetsAddDetails.destroy({
                                where: { ImmovableAssetsDetailsId: resultData.ImmovableAssetsDetailsId}
                            }).then(() => {
                                console.log('deleted successfully with id = ' + resultData.ImmovableAssetsDetailsId);
                                res.json({"statusCode": 200,"Message": "Successful Request"});
                            });
                        }else{
                            res.json({"statusCode": 200,"Message": "Successful Request"});
                        }
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
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
};

exports.updateAssestsInfoByAppId = (req,res)=>{
    let inputdata = req.body;
    console.log("Input Req "+ JSON.stringify(inputdata));
    let appid = req.body.appId;
    let userid = req.body.userId;
    let foreignAssFlag = req.body.foreignAssFlag;
    let updateAt = formattedDT;

    if(foreignAssFlag == 0){
        DocumentUpload.findOne(
            { where: {UserId:userid,ApplicationId: appid,DocumentCategory:'ForeignAssets' }}
        )
        .then(function (resultData) {
            if (resultData) {
                console.log("Result Doc Details  "+JSON.stringify(resultData));
                DocumentUpload.destroy({
                    where: { documentId: resultData.documentId}
                }).then(() => {
                    console.log('deleted successfully with id = ' + resultData.documentId);
                });
            } 
        })
        .catch(function (err) {
            console.log("Error "+err);
        });
    }

    AssetsDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Assets Details  "+JSON.stringify(resultData));
            sequelize.query("UPDATE `et_assetsliabilitiesdetails` SET ForeignAssesDocUploadFlag=?,updatedAt=?,CompletionStatus=? WHERE  ApplicationId=? AND UserId=?",{
                replacements: [foreignAssFlag,updateAt,'Yes',appid,userid],
                type: sequelize.QueryTypes.UPDATE 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_assetsliabilitiesdetails table */
                updateApplicationMain(appid,userid,7);
                res.json({"statusCode": 200,"Message": "Successful Request","assInfoId":result[0]});
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        } else {
			//res.status(200);
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_assetsliabilitiesdetails`(ApplicationId,UserId,ForeignAssesDocUploadFlag,updatedAt,CompletionStatus) VALUES (?,?,?,?,?)",{
                replacements: [appid,userid,foreignAssFlag,updateAt,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {			
                console.log("Result AppId  "+result[0]);
                //update flags to et_assetsliabilitiesdetails table */
                updateApplicationMain(appid,userid,7);
                res.json({"statusCode": 200,"Message": "Successful Request","assInfoId":result[0]});
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

exports.saveSalIncomeF16InfoByAppId= (req,res) => {
    console.log("Request param "+ JSON.stringify(req.body));
    let appid = req.body.appId;
    let userid = req.body.userId;
    let uploadDocFlag = req.body.form16uploadflag;

    SalariedIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Salary Income details  "+JSON.stringify(resultData));
            sequelize.query("UPDATE `et_income_salary` SET Form16UploadFlag = ? WHERE ApplicationId = ? ,UserId = ?",{
                replacements: [uploadDocFlag,appid,userid],
                type: sequelize.QueryTypes.UPDATE 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                res.json({"statusCode": 200,"Message": "Successful Request"});
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        } else {
			//Save to et_income_salary table */
			sequelize.query("INSERT INTO `et_income_salary`(ApplicationId,UserId,Form16UploadFlag,CompletionStatus) VALUES (?,?,?,?)",{
                replacements: [appid,userid,uploadDocFlag,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,9);
                res.json({"statusCode": 200,"Message": "Successful Request"});
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

exports.saveSalIncomeInfoByAppId = (req,res) => {
    console.log("Request param "+ JSON.stringify(req.body));
    let appid = req.body.appId;
    let userid = req.body.userId;
    let employernm = req.body.employernm;
    let salamount = req.body.salamount;
    let inputEmployertype = req.body.employertype;
    let employertan = req.body.employerTan;
    let allowances = req.body.allowances!= "" ? parseFloat(req.body.allowances) : 0.00;
    let valPrequisties = req.body.valPrequisties!= "" ? parseFloat(req.body.valPrequisties) : 0.00;
    let inputSalProfits = req.body.inputSalProfits!= "" ? parseFloat(req.body.inputSalProfits) : 0.00;
    let deductionEnter = req.body.deductionEnter!= "" ? parseFloat(req.body.deductionEnter) : 0.00;
    let inputLTAAmount = req.body.inputLTAAmount!= "" ? parseFloat(req.body.inputLTAAmount) : 0.00;
    let nonMoneyPrequisties = req.body.nonMoneyPrequisties!= "" ? parseFloat(req.body.nonMoneyPrequisties) : 0.00;
    let expAllowanceHR = req.body.expAllowanceHR!= "" ? parseFloat(req.body.expAllowanceHR) : 0.00;
    let othAllowance = req.body.othAllowance!= "" ? parseFloat(req.body.othAllowance) : 0.00;

    SalariedIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Salary Income details  "+JSON.stringify(resultData));
            sequelize.query("UPDATE `et_income_salary` SET SalaryPaidAmount=?,EmployerName=?,EmployerCategory=?,EmployerTAN=?,Allowances=?,ValPrequisties=?,SalProfits=?,EntertainmentDeduction=?,LTAAmount=?,NMoneyPrequisties=?,ExpAllowanceHR=?,OthAllowance=?,CompletionStatus=? WHERE ApplicationId=? AND UserId=?",{
                replacements: [salamount,employernm,inputEmployertype,employertan,allowances,valPrequisties,inputSalProfits,deductionEnter,inputLTAAmount,nonMoneyPrequisties,expAllowanceHR,othAllowance,'Yes',appid,userid],
                type: sequelize.QueryTypes.UPDATE 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_income_salary table */
                updateApplicationMain(appid,userid,9);

                res.json({"statusCode": 200,"Message": "Successful Request"});
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        } else {
			//Save to et_income_salary table */
			sequelize.query("INSERT INTO `et_income_salary`(ApplicationId,UserId,SalaryPaidAmount,EmployerName,EmployerCategory,EmployerTAN,Allowances,ValPrequisties,SalProfits,EntertainmentDeduction,LTAAmount,NMoneyPrequisties,ExpAllowanceHR,OthAllowance,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,salamount,employernm,inputEmployertype,employertan,allowances,valPrequisties,inputSalProfits,deductionEnter,inputLTAAmount,nonMoneyPrequisties,expAllowanceHR,othAllowance,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,9);
                res.json({"statusCode": 200,"Message": "Successful Request"});
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

exports.saveOthIncomeInfoByAppId = (req,res) => {
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let savingsIncome = req.body.savingsIncome!= "" ? parseFloat(req.body.savingsIncome) : 0.00;
    let fdincome = req.body.fdincome!= "" ? parseFloat(req.body.fdincome) : 0.00;
    let refundIncome = req.body.refundIncome!= "" ? parseFloat(req.body.refundIncome) : 0.00;
    let OtherIntIncome = req.body.OtherIntIncome!= "" ? parseFloat(req.body.OtherIntIncome) : 0.00;
    let othericnome = req.body.othericnome!= "" ? parseFloat(req.body.othericnome) : 0.00;
    let shareincome = req.body.shareincome!= "" ? parseFloat(req.body.shareincome) : 0.00;
    let exemptincome = req.body.exemptincome!= "" ? parseFloat(req.body.exemptincome) : 0.00;
    let otherexemptincome = req.body.otherexemptincome!= "" ? parseFloat(req.body.otherexemptincome) : 0.00;
    let agriincome = req.body.agriincome!= "" ? parseFloat(req.body.agriincome) : 0.00;
    let agriexpend = req.body.agriexpend!= "" ? parseFloat(req.body.agriexpend) : 0.00;
    let agriloss = req.body.agriloss!= "" ? parseFloat(req.body.agriloss) : 0.00;
    let depincome = req.body.depincome!= "" ? parseFloat(req.body.depincome) : 0.00;
    let depname = req.body.depname;
    let deprelation = req.body.deprelation;
    let depincomeNature = req.body.depincomeNature;
    let taxperiod = req.body.taxperiod;
    let pfincome = req.body.pfincome!= "" ? parseFloat(req.body.pfincome) : 0.00;
    let pfincometax = req.body.pfincometax!= "" ? parseFloat(req.body.pfincometax) : 0.00;

    OtherIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Other Income details  "+JSON.stringify(resultData));
            OtherIncome.destroy({
                where: { IncomeSourceOthersId: resultData.IncomeSourceOthersId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.IncomeSourceOthersId);
                sequelize.query("INSERT INTO `et_income_others`(ApplicationId,UserId,SavingsInterestAmount,FDInterestAmount,GiftsIncome,DividendEarnedAmount,ExemptInterestIncome,OtherExemptIncome,GrossAgriIncome,AgriExpenditure,AgriLoss,PFWithdrawalIncome,PFWithdrawalTaxrate,CompletionStatus,updatedAt,Taxperiod,RefundInterestIncome,OtherInterestIncome) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,savingsIncome,fdincome,othericnome,shareincome,exemptincome,otherexemptincome,agriincome,agriexpend,agriloss,pfincome,pfincometax,'Yes',formattedDT,taxperiod,refundIncome,OtherIntIncome],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    insertDependentIncome(appid,userid,result[0],depincome,depname,deprelation,depincomeNature,res);
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//Save to et_income_others table */
			sequelize.query("INSERT INTO `et_income_others`(ApplicationId,UserId,SavingsInterestAmount,FDInterestAmount,GiftsIncome,DividendEarnedAmount,ExemptInterestIncome,OtherExemptIncome,GrossAgriIncome,AgriExpenditure,AgriLoss,PFWithdrawalIncome,PFWithdrawalTaxrate,CompletionStatus,updatedAt,Taxperiod,RefundInterestIncome,OtherInterestIncome) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,savingsIncome,fdincome,othericnome,shareincome,exemptincome,otherexemptincome,agriincome,agriexpend,agriloss,pfincome,pfincometax,'Yes',formattedDT,taxperiod,refundIncome,OtherIntIncome],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                insertDependentIncome(appid,userid,result[0],depincome,depname,deprelation,depincomeNature,res);
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

};

exports.updateOthIncomeInfoByAppId = (req,res)=>{
    let appid = req.body.appId;
    let userid = req.body.userId;
    let uploadFlag = req.body.docUploadflag;

    OtherIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Other Income details  "+JSON.stringify(resultData));
            
            sequelize.query("UPDATE `et_income_others` SET DocumentUploadFlag=?, updatedAt=? WHERE ApplicationId=? AND UserId=?",{
                replacements: [uploadFlag,formattedDT,appid,userid],
                type: sequelize.QueryTypes.UPDATE
            }).then(result => {		
                //console.log("Result AppId  "+result[0]);
                res.json({"statusCode": 200,"Message": "Successful Request"});
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request"});
        } 
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

function insertDependentIncome(appid,userid,otherIncomeId,depincome,depname,deprelation,depincomeNature,res){
    OtherDepIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Other Dep Income details  "+JSON.stringify(resultData));
            OtherDepIncome.destroy({
                where: { DepIncomeId: resultData.DepIncomeId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.DepIncomeId);
                sequelize.query("INSERT INTO `et_income_dependentincome`(IncomeSourceOthersId,ApplicationId,UserId,Amount,PersonName,Relationship,NatureOfIncome) VALUES (?,?,?,?,?,?,?)",{
                    replacements: [otherIncomeId,appid,userid,depincome,depname,deprelation,depincomeNature],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_applicationsmain table */
                    updateApplicationMain(appid,userid,10);
                    res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                });
            });
        } else {
			//Save to et_income_dependentincome table */
			sequelize.query("INSERT INTO `et_income_dependentincome`(IncomeSourceOthersId,ApplicationId,UserId,Amount,PersonName,Relationship,NatureOfIncome) VALUES (?,?,?,?,?,?,?)",{
                replacements: [otherIncomeId,appid,userid,depincome,depname,deprelation,depincomeNature],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,10);
            })
            .catch(function (err) {
                console.log("Error "+err);
            });
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
	});
};

exports.saveHouseIncomeInfoByAppId = (req,res) => {
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let propType = "Houseprop";
    let flatno = req.body.flatno;
    let premises = req.body.premises;
    let street = req.body.street;
    let area = req.body.area;
    let city = req.body.city;
    let pincode = req.body.pincode;
    let country = req.body.country;
    let state = req.body.state;
    let proploanflag = req.body.proploanflag;
    let propinterestpaid = req.body.propinterestpaid!= "" ? parseFloat(req.body.propinterestpaid) : 0.00;
    let coflag = req.body.coflag;
    let selfshare = req.body.selfshare!= "" ? parseFloat(req.body.selfshare) : 0;
    let coname = req.body.coname;
    let copan = req.body.copan;
    let coshare = req.body.coshare!= "" ? parseFloat(req.body.coshare) : 0;

    PropertyIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid, PropertyType:propType} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - House Income details  "+JSON.stringify(resultData));
            PropertyIncome.destroy({
                where: { IncomeHouseDetailsId: resultData.IncomeHouseDetailsId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.IncomeHouseDetailsId);
                sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,HouseloanFlag,InterestAmount,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,propType,proploanflag,propinterestpaid,coflag,selfshare,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    insertHousePropAddress(appid,userid,result[0],propType,flatno,premises,street,area,city,pincode,country,state,coname,copan,coshare,res);
                    //res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,HouseloanFlag,InterestAmount,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,propType,proploanflag,propinterestpaid,coflag,selfshare,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                insertHousePropAddress(appid,userid,result[0],propType,flatno,premises,street,area,city,pincode,country,state,coname,copan,coshare,res);
                //res.json({"statusCode": 200,"Message": "Successful Request"});
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

};

function insertHousePropAddress(appid,userid,propertyId,propType,flatno,premises,street,area,city,pincode,country,state,coname,copan,coshare,res){
    if(propType == "Houseprop"){
        stage = 11;
    }else if(propType == "Rentalprop"){
        stage = 12;
    }
    
    AddressDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid, AddressType:propType} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Address Details  "+JSON.stringify(resultData));
            AddressDetails.destroy({
                where: { AdressDetailsId: resultData.AdressDetailsId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.AdressDetailsId);
                sequelize.query("INSERT INTO `et_addressdetails`(ApplicationId,UserId,IncomeHouseDetailsId,AddressType,Flatno_Blockno,Building_Village_Premises,Road_Street_PO,Area_Locality,City_Town_District,State,Country,Pincode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,propertyId,propType,flatno,premises,street,area,city,state,country,pincode,formattedDT,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //insert coowner details */
                    insertCoownerDetails(appid,userid,propertyId,propType,coname,copan,coshare,stage,res);
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//res.status(200);
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_addressdetails`(ApplicationId,UserId,IncomeHouseDetailsId,AddressType,Flatno_Blockno,Building_Village_Premises,Road_Street_PO,Area_Locality,City_Town_District,State,Country,Pincode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,propertyId,propType,flatno,premises,street,area,city,state,country,pincode,formattedDT,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {			
                console.log("Result AppId  "+result[0]);
                //insert coowner details */
                insertCoownerDetails(appid,userid,propertyId,propType,coname,copan,coshare,stage,res);
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

function insertCoownerDetails(appid,userid,propertyId,propType,coname,copan,coshare,stage,res){
    PropCoOwnerIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid,PropertyType:propType} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Other Dep Income details  "+JSON.stringify(resultData));
            PropCoOwnerIncome.destroy({
                where: { cownerId: resultData.cownerId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.cownerId);
                sequelize.query("INSERT INTO `et_property_coownerdetails`(IncomeHouseDetailsId,ApplicationId,UserId,PropertyType,PersonName,Panno,Share) VALUES (?,?,?,?,?,?,?)",{
                    replacements: [propertyId,appid,userid,propType,coname,copan,coshare],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_applicationsmain table */
                    updateApplicationMain(appid,userid,stage);
                    res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//Save to et_property_coownerdetails table */
			sequelize.query("INSERT INTO `et_property_coownerdetails`(IncomeHouseDetailsId,ApplicationId,UserId,PropertyType,PersonName,Panno,Share) VALUES (?,?,?,?,?,?,?)",{
                replacements: [propertyId,appid,userid,propType,coname,copan,coshare],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,stage);
                res.json({"statusCode": 200,"Message": "Successful Request"});
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
};

exports.saveRentalIncomeInfoByAppId = (req,res) => {
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let propType = "Rentalprop";
    let flatno = req.body.flatno;
    let premises = req.body.premises;
    let street = req.body.street;
    let area = req.body.area;
    let city = req.body.city;
    let pincode = req.body.pincode;
    let country = req.body.country;
    let state = req.body.state;
    
    let rentAmountRcvd = req.body.rentAmountRcvd!= "" ? parseFloat(req.body.rentAmountRcvd) : 0.00;
    let rentHouseTaxPaid = req.body.rentHouseTaxPaid!= "" ? parseFloat(req.body.rentHouseTaxPaid) : 0.00;
    let rentalTenantNm = req.body.rentalTenantNm;
    let rentalTenantPan = req.body.rentalTenantPan;
    
    let rentalPropLoanFlag = req.body.rentalPropLoanFlag;
    let rentalpropInterestPaid = req.body.rentalpropInterestPaid!= "" ? parseFloat(req.body.rentalpropInterestPaid) : 0.00;

    let coflag = req.body.coflag;
    let selfshare = req.body.selfshare!= "" ? parseFloat(req.body.selfshare) : 0;
    let unRealizedRent = req.body.unRealizedRent!= "" ? parseFloat(req.body.unRealizedRent) : 0.00;
    let coname = req.body.coname;
    let copan = req.body.copan;
    let coshare = req.body.coshare!= "" ? parseFloat(req.body.coshare) : 0;

    PropertyIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid, PropertyType:propType} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - House Income details  "+JSON.stringify(resultData));
            PropertyIncome.destroy({
                where: { IncomeHouseDetailsId: resultData.IncomeHouseDetailsId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.IncomeHouseDetailsId);
                sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,AmountReceived,HousetaxPaid,TenantName,TanantPanno,HouseloanFlag,InterestAmount,UnrealizedRentAmount,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,propType,rentAmountRcvd,rentHouseTaxPaid,rentalTenantNm,rentalTenantPan,rentalPropLoanFlag,rentalpropInterestPaid,unRealizedRent,coflag,selfshare,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    insertHousePropAddress(appid,userid,result[0],propType,flatno,premises,street,area,city,pincode,country,state,coname,copan,coshare,res);
                    //res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,AmountReceived,HousetaxPaid,TenantName,TanantPanno,HouseloanFlag,InterestAmount,UnrealizedRentAmount,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,propType,rentAmountRcvd,rentHouseTaxPaid,rentalTenantNm,rentalTenantPan,rentalPropLoanFlag,rentalpropInterestPaid,unRealizedRent,coflag,selfshare,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                insertHousePropAddress(appid,userid,result[0],propType,flatno,premises,street,area,city,pincode,country,state,coname,copan,coshare,res);
                //res.json({"statusCode": 200,"Message": "Successful Request"});
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
};

exports.updateHouseIncomeInfoByAppId = (req,res) =>{
    let appid = req.body.appId;
    let userid = req.body.userId;
    let propType = req.body.type;
    let uploadFlag = req.body.docUploadflag;

    PropertyIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid, PropertyType:propType} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - House Income details  "+JSON.stringify(resultData));
            sequelize.query("UPDATE `et_income_property` SET DocumentUploadFlag=?,updatedAt=? WHERE IncomeHouseDetailsId=?",{
                replacements: [uploadFlag,formattedDT,resultData.IncomeHouseDetailsId],
                type: sequelize.QueryTypes.UPDATE
            }).then(result => {		
                //console.log("Result AppId  "+result[0]);
                res.json({"statusCode": 200,"Message": "Successful Request"});
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        }else{
            res.json({"statusCode": 200,"Message": "Successful Request"});
        } 
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

exports.saveCapitalIncomeInfoByAppId = (req,res) => {
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let inpSaleType = req.body.inpSaleType;
    let inputSalesProceed = req.body.inputSalesProceed!= "" ? parseFloat(req.body.inputSalesProceed) : 0.00;
    let inputSalesDate = req.body.inputSalesDate.formatted != null ? req.body.inputSalesDate.formatted : '';
    let inpSTTPaid = req.body.inpSTTPaid;
    let inputCostBasis = req.body.inputCostBasis!= "" ? parseFloat(req.body.inputCostBasis) : 0.00;
    let inputPurDate = req.body.inputPurDate.formatted != null ? req.body.inputPurDate.formatted : '';;

    CapitalGainsIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Capital Income details  "+JSON.stringify(resultData));
            CapitalGainsIncome.destroy({
                where: { CapitalgainID: resultData.CapitalgainID}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.CapitalgainID);
                sequelize.query("INSERT INTO `et_income_capitalgains`(ApplicationId,UserId,SaleType,SalesProceedAmt,SalesDate,SalesTaxPaid,CostBasis,PurchaseDate,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,inpSaleType,inputSalesProceed,inputSalesDate,inpSTTPaid,inputCostBasis,inputPurDate,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_income_salary table */
                    updateApplicationMain(appid,userid,13);

                    res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//res.status(200);
			//Save to et_income_salary table */
			sequelize.query("INSERT INTO `et_income_capitalgains`(ApplicationId,UserId,SaleType,SalesProceedAmt,SalesDate,SalesTaxPaid,CostBasis,PurchaseDate,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,inpSaleType,inputSalesProceed,inputSalesDate,inpSTTPaid,inputCostBasis,inputPurDate,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,13);
                res.json({"statusCode": 200,"Message": "Successful Request"});
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
};

exports.updateCapitalIncomeInfoByAppId = (req,res)=>{
    let appid = req.body.appId;
    let userid = req.body.userId;
    let uploadFlag = req.body.docUploadflag;

    CapitalGainsIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Capital Income details  "+JSON.stringify(resultData));
            sequelize.query("UPDATE `et_income_capitalgains` SET DocUploadFlag=?,updatedAt=? WHERE CapitalgainID=? ",{
                replacements: [uploadFlag, formattedDT, resultData.CapitalgainID],
                type: sequelize.QueryTypes.UPDATE 
            }).then(result => {		
                //console.log("Result AppId  "+result[0]);
                res.json({"statusCode": 200,"Message": "Successful Request"});
            })
            .catch(function (err) {
                console.log("Error "+err);
                res.status(400).send(err);
            });
        } else {
			res.json({"statusCode": 200,"Message": "Successful Request"});
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
};

/*
//Save data to deductions table
*/
exports.saveDeductionsInfoByAppId = (req,res)=>{
    let inputdata = req.body;
    let appid, userid , deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,SelfMedPremAmt;
    let depHCfees,medInsReln,DHCReln,ParMedInsReln,parMedPremAmt,DoneeNm,DoneePan,DonDedLimit;
    let DoneeQualPer,DonAddress,DoneeCity,DoneeState, DonPincode,DonCountry;
    if(inputdata.length > 0){
        for(var i=0;i<inputdata.length;i++){
            appid = inputdata[i].appId;
            userid = inputdata[i].userId;
            deductiontype = inputdata[i].DeductionType;
            dedcategory = inputdata[i].DeductionCat;
            deductionamount = inputdata[i].DeductionAmt != "" ? parseFloat(inputdata[i].DeductionAmt) : 0.00;
            investCat = inputdata[i].InvestmentCat;
            docUploadFlag = inputdata[i].docUploadFlag;
            SelfMedPremAmt = inputdata[i].SelfMedPremAmt != "" ? parseFloat(inputdata[i].SelfMedPremAmt) : 0.00;
            depHCfees = inputdata[i].depHCfees != "" ? parseFloat(inputdata[i].depHCfees) : null;
            medInsReln = inputdata[i].medInsReln;
            DHCReln = inputdata[i].DHCReln;
            ParMedInsReln = inputdata[i].parMedInsReln;
            parMedPremAmt = inputdata[i].parMedPremAmt != "" ? parseFloat(inputdata[i].parMedPremAmt) : 0.00;
            DoneeNm = inputdata[i].DoneeNm;
            DoneePan = inputdata[i].DoneePan;
            DonDedLimit = inputdata[i].DonDedLimit;
            DoneeQualPer = inputdata[i].DoneeQualPer;
            DonAddress = inputdata[i].DonAddress;
            DoneeCity = inputdata[i].DoneeCity;
            DoneeState = inputdata[i].DoneeState;
            DonPincode = inputdata[i].DonPincode;
            DonCountry = inputdata[i].DonCountry;
            RentPerMonth = 0;
            TreatAge = "";

            saveMainDeductionsData(appid,userid,deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,
                SelfMedPremAmt,depHCfees,medInsReln,DHCReln,ParMedInsReln,parMedPremAmt,DoneeNm,DoneePan,
                DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,DonPincode,DonCountry,RentPerMonth,TreatAge,i,res,inputdata.length,15);
        }
    }
}

exports.saveOtherDeductionsByAppId = (req,res)=>{
    let inputdata = req.body;
    let appid, userid , deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,SelfMedPremAmt;
    let depHCfees,medInsReln,DHCReln,ParMedInsReln,parMedPremAmt,DoneeNm,DoneePan,DonDedLimit;
    let DoneeQualPer,DonAddress,DoneeCity,DoneeState, DonPincode,DonCountry;
    if(inputdata.length > 0){
        for(var i=0;i<inputdata.length;i++){
            appid = inputdata[i].appId;
            userid = inputdata[i].userId;
            deductiontype = inputdata[i].DeductionType;
            dedcategory = inputdata[i].DeductionCat;
            deductionamount = inputdata[i].DeductionAmt != "" ? parseFloat(inputdata[i].DeductionAmt) : 0.00;
            investCat = inputdata[i].InvestmentCat;
            docUploadFlag = inputdata[i].docUploadFlag;
            
            SelfMedPremAmt = 0.00;
            depHCfees = 0.00;
            medInsReln = null;
            DHCReln = null;
            ParMedInsReln = null;
            parMedPremAmt = 0.00;
            DoneeNm = null;
            DoneePan = null;
            DonDedLimit = null;
            DoneeQualPer = null;
            DonAddress = null;
            DoneeCity = null;
            DoneeState = null;
            DonPincode = null;
            DonCountry = null;

            RentPerMonth = inputdata[i].RentPerMonth == "" ? 0 :inputdata[i].RentPerMonth;
            TreatAge = inputdata[i].TreatAge;

            saveMainDeductionsData(appid,userid,deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,
                SelfMedPremAmt,depHCfees,medInsReln,DHCReln,ParMedInsReln,parMedPremAmt,DoneeNm,DoneePan,
                DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,DonPincode,DonCountry,RentPerMonth,TreatAge,i,res,inputdata.length,16);
        }
    }
}

function saveMainDeductionsData(appid,userid,deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,
SelfMedPremAmt,depHCfees,medInsReln,DHCReln,ParMedInsReln,parMedPremAmt,DoneeNm,DoneePan,
DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,DonPincode,DonCountry,RentPerMonth,TreatAge,index,res,len,appstage)
{
    Deductions.findAll(
        { where: {UserId:userid,ApplicationId: appid,DeductionTypes:deductiontype} }
    )
    .then(function (resultData) {
        if (resultData) {
            console.log("Result -Exisitng Deductions details  "+JSON.stringify(resultData));
            Deductions.destroy({
                where: { UserId:userid,ApplicationId: appid,DeductionTypes:deductiontype}
            }).then(() => {
                console.log('deleted successfully with id = ');
                sequelize.query("INSERT INTO `et_deductions`(ApplicationId,UserId,DeductionTypes,DeductionCategory,"+
                    "InvestmentCategory,DeductionAmount,Self_MI_PremiumAmt,Self_HC_Fees,Parents_MI_PremiumAmt,"+
                    "MedInsRelation,DepHealthCheckReln,ParMedInsReln,NoHRA_TotalMonths,SpecificDisease_PersonAge,"+
                    "CompletionStatus,DocUploadFlag,updatedAt) "+
                    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                {
                    replacements: [appid,userid,deductiontype,dedcategory,investCat,deductionamount,SelfMedPremAmt,
                    depHCfees,parMedPremAmt,medInsReln,DHCReln,ParMedInsReln,RentPerMonth,TreatAge,'Yes',docUploadFlag,formattedDT],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    if(index == len-1){
                        //update flags to et_applicationsmain table */
                        updateApplicationMain(appid,userid,appstage);
    
                        res.json({"statusCode": 200,"Message": "Successful Request"});
                    }
                    
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    if(index == len-1){
                        res.status(400).send(err);
                    }
                });
            });
        } else {
            //res.status(200);
            //Save to et_deductions table */
            sequelize.query("INSERT INTO `et_deductions`(ApplicationId,UserId,DeductionTypes,DeductionCategory,"+
                "InvestmentCategory,DeductionAmount,Self_MI_PremiumAmt,Self_HC_Fees,Parents_MI_PremiumAmt,"+
                "MedInsRelation,DepHealthCheckReln,ParMedInsReln,NoHRA_TotalMonths,SpecificDisease_PersonAge,DoneeName,DoneePan,DoneeDeductionLimit,DoneeQualPer,DoneeAddress,DoneeCity,"+
                "DoneeState,DoneeCountry,DonePincode,CompletionStatus,DocUploadFlag,updatedAt) "+
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            {
                replacements: [appid,userid,deductiontype,dedcategory,investCat,deductionamount,SelfMedPremAmt,
                depHCfees,parMedPremAmt,medInsReln,DHCReln,ParMedInsReln,RentPerMonth,TreatAge,DoneeNm,DoneePan,DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,
                DonCountry,DonPincode,'Yes',docUploadFlag,formattedDT],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                if(index == len-1){
                    //update flags to et_applicationsmain table */
                    updateApplicationMain(appid,userid,appstage);

                    res.json({"statusCode": 200,"Message": "Successful Request"});
                }
            })
            .catch(function (err) {
                console.log("Error "+err);
                if(index == len-1){
                    res.status(400).send(err);
                }
            });
        }
    })
    .catch(function (err) {
        console.log("Error "+err);
        if(index == len-1){
            res.status(400).send(err);
        }
    });
}

exports.saveTaxPaidInfoByAppId = (req,res)=>{
    console.log("Request param "+ JSON.stringify(req.body));
    let appid = req.body.appId;
    let userid = req.body.userId;
    let details = req.body.Details;
    let updateAt = formattedDT;
    

    ChallanDetails.findAll(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Exisitng Challan details  "+JSON.stringify(resultData));
            ChallanDetails.destroy({
                where: {UserId:userid,ApplicationId: appid}
            }).then(() => {
                console.log('deleted successfully all challan details');
                if(details.length > 0){
                    for(var i=0;i < details.length;i++){
                        let inpBSRCode = details[i].bsrcode;
                        let inpChallanPaymentDate = details[i].challanpaydate.formatted != null ? details[i].challanpaydate.formatted : '';
                        let inpChallanNumber = details[i].challannum;
                        let inpChallanAmount = details[i].challanamt!= "" ? parseFloat(details[i].challanamt) : 0.00;
                        console.log("Result cnt  "+ i);
                        if( i != details.length-1){
                            insertChallanDetails(appid,userid,inpBSRCode,inpChallanPaymentDate,inpChallanNumber,inpChallanAmount,updateAt)
                            .then(result =>{
                                console.log("Result AppId  "+result);
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                                res.status(400).send(err);
                            });
                        }
                        else{
                            insertChallanDetails(appid,userid,inpBSRCode,inpChallanPaymentDate,inpChallanNumber,inpChallanAmount,updateAt)
                            .then(result =>{
                                console.log("Result AppId  "+result);
                                updateApplicationMain(appid,userid,18);
                                res.json({"statusCode": 200,"Message": "Successful Request"});
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                                res.status(400).send(err);
                            });
                        }
                    }
                }
            });
        } else {
            if(details.length > 0){
                for(var i=0;i < details.length;i++){
                    let inpBSRCode = details[i].bsrcode;
                    let inpChallanPaymentDate = details[i].challanpaydate;
                    let inpChallanNumber = details[i].challannum;
                    let inpChallanAmount = details[i].challanamt!= "" ? parseFloat(details[i].challanamt) : 0.00;
                    console.log("Result cnt  "+ i);
                    if( i != details.length-1){
                        insertChallanDetails(appid,userid,inpBSRCode,inpChallanPaymentDate,inpChallanNumber,inpChallanAmount,updateAt)
                        .then(result =>{
                            console.log("Result AppId  "+result);
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            res.status(400).send(err);
                        });
                    }
                    else{
                        insertChallanDetails(appid,userid,inpBSRCode,inpChallanPaymentDate,inpChallanNumber,inpChallanAmount,updateAt)
                        .then(result =>{
                            console.log("Result AppId  "+result);
                            updateApplicationMain(appid,userid,18);
                            res.json({"statusCode": 200,"Message": "Successful Request"});
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            res.status(400).send(err);
                        });
                    }
                }
            }
		}
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

function insertChallanDetails(appid,userid,inpBSRCode,inpChallanPaymentDate,inpChallanNumber,inpChallanAmount,updateAt){
    var deferred = Q.defer();
    sequelize.query("INSERT INTO `et_challandetails`(ApplicationId,UserId,BSR_Code,PaymentDate,ChallanNo,TaxPaid,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
        replacements: [appid,userid,inpBSRCode,inpChallanPaymentDate,inpChallanNumber,inpChallanAmount,'Yes'],
        type: sequelize.QueryTypes.INSERT 
    }).then(result => {		
        console.log("Result AppId  "+result[0]);
        deferred.resolve(result[0]);
    })
    .catch(function (err) {
        console.log("Error "+err);
        deferred.reject(err);
    });
    return deferred.promise;
}

exports.saveOthTaxpaidInfoByAppId = (req,res)=>{
    let inputdata = req.body;
    console.log("Input Req "+ JSON.stringify(inputdata));
    let appid = req.body.appId;
    let userid = req.body.userId;
    let taxCreditBelongsTo = req.body.taxCreditBelongsTo;
    let taxDedName = req.body.taxDedName;
    let taxDedTAN = req.body.taxDedTAN;
    let taxCertiNumber = req.body.taxCertiNumber;
    let UnclaimedTDSYr = req.body.UnclaimedTDSYr;
    let UnclaimedTDSAmt = req.body.UnclaimedTDSAmt!= "" ? parseFloat(req.body.UnclaimedTDSAmt) : 0.00;
    let AmtClaimedCurrYr = req.body.AmtClaimedCurrYr!= "" ? parseFloat(req.body.AmtClaimedCurrYr) : 0.00;
    let TDSDedFromReln = req.body.TDSDedFromReln!= "" ? parseFloat(req.body.TDSDedFromReln) : 0.00; 
    let taxCreditCarryFwd = req.body.taxCreditCarryFwd!= "" ? parseFloat(req.body.taxCreditCarryFwd) : 0.00;

    OthIncomeTaxPaidDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Assets Details  "+JSON.stringify(resultData));
            OthIncomeTaxPaidDetails.destroy({
                where: { OthIncomeTaxPaidId: resultData.OthIncomeTaxPaidId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.OthIncomeTaxPaidId);
                sequelize.query("INSERT INTO `et_otherincometaxpaiddetails`(ApplicationId,UserId,OthIncome_TaxCreditBelongsTo,OthIncome_TaxDedName,OthIncome_TaxDedTAN,OthIncome_TDSCertiNum,OthIncome_UnclaimedTDSYear,OthIncome_UnclaimedTDSAmount,OthIncome_TDSDedFrmReln,OthIncome_AmtClaimedCurrYr,OthIncome_TaxCreditCFwd,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,taxCreditBelongsTo,taxDedName,taxDedTAN,taxCertiNumber,UnclaimedTDSYr,UnclaimedTDSAmt,AmtClaimedCurrYr,TDSDedFromReln,taxCreditCarryFwd,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_assetsliabilitiesdetails table */
                    updateApplicationMain(appid,userid,18);
                    res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_otherincometaxpaiddetails`(ApplicationId,UserId,OthIncome_TaxCreditBelongsTo,OthIncome_TaxDedName,OthIncome_TaxDedTAN,OthIncome_TDSCertiNum,OthIncome_UnclaimedTDSYear,OthIncome_UnclaimedTDSAmount,OthIncome_TDSDedFrmReln,OthIncome_AmtClaimedCurrYr,OthIncome_TaxCreditCFwd,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,taxCreditBelongsTo,taxDedName,taxDedTAN,taxCertiNumber,UnclaimedTDSYr,UnclaimedTDSAmt,AmtClaimedCurrYr,TDSDedFromReln,taxCreditCarryFwd,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {			
                console.log("Result AppId  "+result[0]);
                //update flags to et_assetsliabilitiesdetails table */
                updateApplicationMain(appid,userid,18);
                res.json({"statusCode": 200,"Message": "Successful Request"});
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

exports.saveIncTaxpaidInfoByAppId = (req,res)=>{
    let inputdata = req.body;
    console.log("Input Req "+ JSON.stringify(inputdata));
    let appid = req.body.appId;
    let userid = req.body.userId;
    let taxDedName = req.body.taxDedName;
    let taxDedTAN = req.body.taxDedTAN;
    let incomeChargeUSal = req.body.incomeChargeUSal!= "" ? parseFloat(req.body.incomeChargeUSal) : 0.00;
    let totaltaxDeducted = req.body.totaltaxDeducted!= "" ? parseFloat(req.body.totaltaxDeducted) : 0.00;

    IncomeTaxPaidDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Assets Details  "+JSON.stringify(resultData));
            IncomeTaxPaidDetails.destroy({
                where: { IncomeTaxPaidId: resultData.IncomeTaxPaidId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.IncomeTaxPaidId);
                sequelize.query("INSERT INTO `et_incometaxpaiddetails`(ApplicationId,UserId,IncomTaxDeductorName,IncomeTaxDeductorTan,IncomeChargeUSal,IncomeTotalTaxDeducted,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,taxDedName,taxDedTAN,incomeChargeUSal,totaltaxDeducted,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    updateApplicationMain(appid,userid,18);
                    res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_incometaxpaiddetails`(ApplicationId,UserId,IncomTaxDeductorName,IncomeTaxDeductorTan,IncomeChargeUSal,IncomeTotalTaxDeducted,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                replacements: [appid,userid,taxDedName,taxDedTAN,incomeChargeUSal,totaltaxDeducted,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {			
                console.log("Result AppId  "+result[0]);
                updateApplicationMain(appid,userid,18);
                res.json({"statusCode": 200,"Message": "Successful Request"});
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

exports.fetchAppPaymentDetails = (req,res)=>{
    let appid = req.body.appid;
    let userid = req.body.userid;
    //console.log("Input Data  "+appid+"-"+userid);
    sequelize.query("SELECT main.ApplicationId, main.UserId,main.Plantype, pp.PlanName,pp.PlanAmount,per.PersonalDetailsId, per.Firstname, per.Lastname,per.MobileNo,per.EmailId,per.PanNumber FROM `et_applicationsmain` as main, `et_personaldetails` as per,`et_pricingplans` as pp where main.UserId = ? AND main.ApplicationId = ? AND main.ApplicationId = per.ApplicationId AND pp.PlanId = main.Plantype",{
        replacements: [userid,appid],
        type: sequelize.QueryTypes.SELECT 
    }).then(result => {		
        //console.log("Result App pay details  "+JSON.stringify(result));
        res.json({"statusCode": 200,"Message": "Successful Request","Result":result});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchAppTransDetails = (req,res)=>{
    let appid = req.body.appid;
    let userid = req.body.userid;
    //console.log("Input Data  "+appid+"-"+userid);
    sequelize.query("SELECT * FROM `et_paymentdetails` where UserId = ? AND ApplicationId = ? AND TransactionStatus = 'Success' ",{
        replacements: [userid,appid],
        type: sequelize.QueryTypes.SELECT 
    }).then(result => {		
        //console.log("Result App pay details  "+JSON.stringify(result));
        res.json({"statusCode": 200,"Message": "Successful Request","Result":result});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.doPayment = (req,res)=>{
    console.log("Request Payment Det "+JSON.stringify(req.body));
    let appid = req.body.appid;
    let userid = req.body.userid;
    let amount = req.body.amount;
    let transId = req.body.transactionId;
    let transStatus = req.body.transStatus;
    let transMsg = req.body.transMsg;
    sequelize.query("INSERT INTO `et_paymentdetails`(ApplicationId,UserId,Amount,TransactionId,TransactionStartTime,TransactionStatus,TransactionMesage) VALUES (?,?,?,?,?,?,?)",{
        replacements: [appid,userid,amount,transId,formattedDT,transStatus,transMsg],
        type: sequelize.QueryTypes.INSERT 
    }).then(result => {		
        console.log("Result AppId  "+result[0]);
        //update flags to et_applicationsmain table */
        updateAppMainPaymentStatus(appid,userid,'Complete',res);
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchDeductionsDetails = (req,res)=>{
    let appid = req.body.appid;
    let userid = req.body.userid;
    console.log("Input Data  "+req.body.appid);
    Deductions.findAll({ 
        where: {UserId:userid,ApplicationId: appid} 
    })
    .then(function (resultData) {
        if (resultData) {
            console.log("Result -Exisitng Deductions details  "+JSON.stringify(resultData));
            res.json({"statusCode": 200,"Message": "Successful Request","ResultData":resultData});
        } 
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchInProgressAppsByUserid = (req,res)=>{
    //console.log("Request "+req.body.userid);
    let userid = req.body.userid;
    let selYear = req.body.selYear;
    sequelize.query("SELECT * FROM `et_applicationsmain` where UserId = ? AND AssesmentYear = ? AND ApplicationStatus != 'Complete' ",{
        replacements: [userid,selYear],
        type: sequelize.QueryTypes.SELECT 
    }).then(result => {		
        //console.log("Result -In Progress Applications  "+JSON.stringify(result));
        res.json({"statusCode": 200,"Message": "Successful Request","ResultData":result});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchDashboardInfo = (req,res)=>{
    let assYear = req.body.assYear;
    let userid = req.body.userid;
    //console.log("Input Data  "+assYear+"-"+userid);
    sequelize.query("SELECT ApplicationId, UserId, AssesmentYear,Plantype,ApplicationStatus,AppITRUploadStatus FROM `et_applicationsmain` where UserId = ? AND AssesmentYear = ?",{
    //sequelize.query("SELECT a.ApplicationId, a.UserId, a.AssesmentYear,a.Plantype,a.ApplicationStatus,b.GrandTotalIncome,b.TotalDeductions,b.NetTaxIncome,b.TotalTaxLiability,b.TaxCredit,b.TaxesPaid,b.TotalInterestAmount,b.TotalBalance,b.UserApproval FROM `et_applicationsmain` a, et_taxsummary b where a.UserId = ? AND a.AssesmentYear = ? AND a.ApplicationId = b.ApplicationId",{
        replacements: [userid,assYear],
        type: sequelize.QueryTypes.SELECT 
    }).then(result => {		
        //console.log("Result App details  "+JSON.stringify(result));
        res.json({"statusCode": 200,"Message": "Successful Request","Result":result});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchAppInfo = (req,res)=>{
    let appid = req.body.appId;
    let userid = req.body.userId;
    //console.log("Input Data  "+appid+"-"+userid);
    sequelize.query("SELECT main.ApplicationId, main.UserId,main.Plantype, pp.PlanName,pp.PlanAmount,per.PersonalDetailsId, per.Firstname, per.Lastname,per.MobileNo,per.EmailId,per.PanNumber,per.DateOfBirth FROM `et_applicationsmain` as main, `et_personaldetails` as per,`et_pricingplans` as pp where main.UserId = ? AND main.ApplicationId = ? AND main.ApplicationId = per.ApplicationId AND pp.PlanId = main.Plantype",{
        replacements: [userid,appid],
        type: sequelize.QueryTypes.SELECT 
    }).then(result => {		
        //console.log("Result App details  "+JSON.stringify(result));
        res.json({"statusCode": 200,"Message": "Successful Request","Result":result});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchTaxSummaryData = (req,res)=>{
    let appid = req.body.appId;
    let userid = req.body.userId;
    //console.log("Input Data  "+appid+"-"+userid);
    var query = "select * From et_taxsummary Where ApplicationId = ? AND UserId = ?";
    sequelize.query(query,{
        replacements: [appid,userid],
        type: sequelize.QueryTypes.SELECT 
    }).then(result => {		
        //console.log("Result App details  "+JSON.stringify(result));
        res.json({"statusCode": 200,"Message": "Successful Request","Result":result});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.updateTaxSummary = (req,res)=>{
    console.log("Tax summary data "+JSON.stringify(req.body));

    var appId = req.body.appId;
    var userId = req.body.userId;

    TaxSummary.findOne(
        { where: {UserId:userId,ApplicationId: appId} }
    )
    .then(function (resultData) {
        if (resultData) {
            //console.log("Result Doc Details  "+JSON.stringify(resultData));
            //update
            sequelize.query("UPDATE `et_taxsummary` SET UserApproval=?,updatedAt=? WHERE SummaryId=?",{
                replacements: ['Yes',formattedDT,resultData.SummaryId],
                type: sequelize.QueryTypes.UPDATE 
            }).then(result => {		
                //console.log("Result AppId  "+result[0]);
                mailOptions={
                    to :  'sg.viv09@gmail.com',//'usha.tanna@easytaxin.com',
                    from: 'no-reply@easytaxin.com',
                    subject : "EasyTaxin - Tax Summary Approved By User",
                    text: 'Hello Admin, This is to notify you user has approved its tax summary. Please login to Admin panel to check details',
                    html : "Hello Admin,<br> This is to notify you user has approved its tax summary.<br> Please login to Admin panel to check details." 
                }

                console.log(mailOptions);
                /* console.log("Regsiteration successful and activation mail sent to user"+mailresult);
                res.json({"statusCode": 200,"Message": "Successful Request"}); */
                fetchMailKeyValue()
                .then(function(keyvalue){
                    //console.log("Api key "+keyvalue);
                    sgMail.setApiKey(keyvalue);
                    sgMail.send(mailOptions, (error, mailresult) => {
                        if (error) {
                            console.log("Application submitted successfully and failed to sent activation mail to admin \n"+ JSON.stringify(error));
                            var msg = "Application submitted successfully and failed to sent activation mail to admin";
                            res.json({"statusCode": 200,"Message": msg});
                        }
                        if (mailresult) { 
                            console.log("Application submitted successfully and mail sent to admin");
                            var msg = "Application submitted successfully and mail sent to admin";
                            res.json({"statusCode": 200,"Message": msg});
                        }
                    });
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
                //res.json({"statusCode": 200,"Message": "Successful Request"});
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

//update flags to et_applicationsmain table */
function updateApplicationMain(appid,userid,appStage){
    sequelize.query("UPDATE `et_applicationsmain` SET updatedAt=?,ApplicationStage=? WHERE ApplicationId = ? AND UserId = ? ",{
        replacements: [formattedDT,appStage,appid,userid],
        type: sequelize.QueryTypes.UPDATE 
    }).then(result => {		
        console.log("Result AppId  "+result);
    })
    .catch(function (err) {
        console.log("Error in app main update "+err);
    });
};

function updateAppMainPaymentStatus(appid,userid,appPayStatus,res){
    sequelize.query("UPDATE `et_applicationsmain` SET AppPaymentStatus=?,updatedAt=? WHERE ApplicationId = ? AND UserId = ? ",{
        replacements: [appPayStatus,formattedDT,appid,userid],
        type: sequelize.QueryTypes.UPDATE 
    }).then(result => {		
        console.log("Result AppId  "+result);
        res.json({"statusCode": 200,"Message": "Successful Request"});
    })
    .catch(function (err) {
        console.log("Error in app main update "+err);
        res.status(400).send(err);
    });
};

exports.generateITRReport = (req,res)=>{
    console.log("Request for ITR report "+JSON.stringify(req.body));
    let userid = req.body.userid;
    let appid = req.body.appid;

    updateAppMainFinalStatus(appid,userid,'No',res)
    .then(function(message){
        if(message){
            res.json({"statusCode": 200,"Message": "Successful Request"});
        }
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
    
}

function updateAppMainFinalStatus(appid,userid,ITRStatus,res){
    var deferred = Q.defer();
    sequelize.query("UPDATE `et_applicationsmain` SET ApplicationCompletionDate = ?,updatedAt=?,ApplicationStatus=?,AppITRUploadStatus=? WHERE ApplicationId = ? AND UserId = ? ",{
        replacements: [formattedDT,formattedDT,'Complete',ITRStatus,appid,userid],
        type: sequelize.QueryTypes.UPDATE 
    }).then(result => {		
        console.log("Result AppId  "+result);
        mailOptions={
            to :  'usha.tanna@easytaxin.com', //'sg.viv09@gmail.com',
            from: 'no-reply@easytaxin.com',
            subject : "EasyTaxin - ITR Application Submitted successfully",
            text: 'Hello Admin, This is to notify you that new ITR application has submitted. Please login to Admin panel to check details',
            html : "Hello Admin,<br> This is to notify you that new ITR application has submitted.<br> Please login to Admin panel to check details." 
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
                    console.log("Application submitted successfully and failed to sent activation mail to admin \n"+ JSON.stringify(error));
                    //res.status(200).send("Application submitted successfully and failed to sent activation mail to admin");
                    var msg = "Application submitted successfully and failed to sent activation mail to admin";
                    //res.json({"statusCode": 200,"Message": "Successful Request"});
                    deferred.resolve(msg);
                }
                if (mailresult) { 
                    console.log("Application submitted successfully and mail sent to admin");
                    var msg = "Application submitted successfully and mail sent to admin";
                    //res.json({"statusCode": 200,"Message": "Successful Request"});
                    deferred.resolve(msg);
                }
            });
        })
        .catch(function (err) {
            console.log("Error "+err);
            deferred.reject(err);
        });
    })
    .catch(function (err) {
        console.log("Error in app main update "+err);
        deferred.reject(err);
    });

    return deferred.promise;
}

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


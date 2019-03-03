const path          = require('path');
//const fs            = require('fs');
const multer        = require('multer');
const bodyParser    = require('body-parser');
var Q               = require('q');
//var xml2js          = require('xml2js');


const db        = require('../config/dbConfig');
var dateTime    = require('node-datetime');
//var parser      = new xml2js.Parser({ attrkey: "ATTR" });

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
            createApplicationMain(userid,appRefNo,assYear,xmlFlag,res)
            .then(function(appid){
                req.files.forEach(function(item) {
                    console.log("File item "+ JSON.stringify(item));
                    var filename = item.fieldname;
                    var filepath = item.path;

                    //Save the uploaded document details in document upload table
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
            var userid      =   req.body.UserId;
            var category    =   req.body.DocCategory;
            var file_ext    =   file.originalname.split('.');
            cb(null, userid + '_'+category+ "." +file_ext[1])
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
                var filename = item.fieldname;
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
                        //res.status(200);
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
    createApplicationMain(userid,appRefNo,assYear,xmlFlag,res)
    .then(function(appid){
        res.json({"statusCode": 200,"Message": "Successful Request","AppId":appid});
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });

}

function createApplicationMain(userid,appRefNo,assYear,xmlFlag,res){
    var deferred = Q.defer();
    ApplicationMain.findOne(
		{ where: {UserId:userid,AssesmentYear: assYear} }
	)
	.then(function (application) {
		if (application) {
            console.log("Result AppId  "+JSON.stringify(application));
            if(xmlFlag == 1){
                updateApplicationMain(application.ApplicationId,userid,1,xmlFlag);
                deferred.resolve(application.ApplicationId);
            }else{
                deferred.resolve(application.ApplicationId);
                //res.json({"statusCode": 301,"Message": "Existing AppId","AppId":application.ApplicationId});
            }
        } else {
			//res.status(200);
			//Save to et_applicationsmain table */
			sequelize.query("INSERT INTO `et_applicationsmain`(UserId,AppRefNo,AssesmentYear,xmluploadflag,createdAt,ApplicationStage,ApplicationStatus,AppPaymentStatus,AppITRUploadStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
				replacements: [userid,appRefNo,assYear,xmlFlag,formattedDT,1,'Initiated','NotStarted','No'],
				type: sequelize.QueryTypes.INSERT 
			}).then(result => {		
                console.log("Result AppId  "+result[0]);
                //if(xmlFlag == 1){
                    deferred.resolve(result[0]);
                //}else{
                  //  res.json({"statusCode": 200,"Message": "Successful Request","AppId":result[0]});
                //}
			})
			.catch(function (err) {
                console.log("Error "+err);
                deferred.reject(err);
				//res.status(400).send(err);
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
                        res.json({"statusCode": 200,"Message": "Successful Request","PerData":""});
                    }
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
                
            }else{
                res.json({"statusCode": 200,"Message": "Successful Request","PerData":resultArray});
            }
            
        }
	})
	.catch(function (err) {
		console.log("Error "+err);
		res.status(400).send(err);
	});
}

exports.saveBasicInfoByAppId = (req,res)=>{
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let incomeFromSalary = req.body.incomeFromSalary;
    let incomeFromOtherSources = req.body.incomeFromOtherSources;
    let selfOccupiedProp = req.body.selfOccupiedProp;
    let rentalProperty = req.body.rentalProperty;
    let incomeFromCapitals = req.body.incomeFromCapitals;
    let deductionsFlag = req.body.deductionsFlag;
    let residentIndianFlag = req.body.residentIndianFlag;
    let nonResidentIndianFlag = req.body.nonResidentIndianFlag;
    let ociResidentIndianFlag = req.body.ociResidentIndianFlag;
    let presentIndiaFlag = req.body.presentIndiaFlag;
    let updateAt = formattedDT;

    //update basic info flags to et_applicationsmain table */
    sequelize.query("UPDATE `et_applicationsmain` SET IncomeSalaryFlag = ?, IncomeOthersFlag = ?, IncomeHouseFlag = ?, IncomeRentalFlag=?, IncomeCapitalGainsFlag=?, DeductionsFlag=?, ResidentIndianFlag=?, NonResidentIndianFlag=?, OciResidentIndianFlag=?, PresentIndiaFlag=?, updatedAt = ?, ApplicationStage=?, ApplicationStatus=? WHERE ApplicationId = ? AND UserId = ? ",{
        replacements: [incomeFromSalary,incomeFromOtherSources,selfOccupiedProp,rentalProperty,incomeFromCapitals,deductionsFlag,residentIndianFlag,nonResidentIndianFlag,ociResidentIndianFlag,presentIndiaFlag,updateAt,2,'Progress',appid,userid],
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
    let gender = req.body.Gender;
    let empName = req.body.EmployerName;
    let empType = req.body.EmployerType;
    let panNumber = req.body.PanNumber;
    let aadharNumber = req.body.AadharNumber;
    let passportNumber = req.body.PassportNumber;
    let updateAt = formattedDT;

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
                sequelize.query("INSERT INTO `et_personaldetails`(ApplicationId,UserId,Firstname,Middlename,Lastname,EmailId,Fathername,MobileNo,AltMobileNo,DateOfBirth,Gender,EmployerName,EmployerType,PanNumber,AadharNumber,PassportNumber,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,firstName,middleName,lastName,emailId,fatherName,mob,altMob,dob,gender,empName,empType,panNumber,aadharNumber,passportNumber,updateAt,'Yes'],
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
			sequelize.query("INSERT INTO `et_personaldetails`(ApplicationId,UserId,Firstname,Middlename,Lastname,EmailId,Fathername,MobileNo,AltMobileNo,DateOfBirth,Gender,EmployerName,EmployerType,PanNumber,AadharNumber,PassportNumber,createdAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,firstName,middleName,lastName,emailId,fatherName,mob,altMob,dob,gender,empName,empType,panNumber,aadharNumber,passportNumber,updateAt,'Yes'],
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

function savePersonalInfofromXML(appid,userid,firstnm,middlenm,lastnm,panno,landline,mobileno,altMobileno,email,dob,emptype,genVal,aadhar,resiStatus){
    var deferred = Q.defer();
    let updateAt = formattedDT;
    //let resiStatus = resiStatus;
    
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
                sequelize.query("INSERT INTO `et_personaldetails`(ApplicationId,UserId,Firstname,Middlename,Lastname,EmailId,MobileNo,AltMobileNo,landlineNo,DateOfBirth,Gender,EmployerType,PanNumber,AadharNumber,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,firstnm,middlenm,lastnm,email,mobileno,altMobileno,landline,dob,genVal,emptype,panno,aadhar,updateAt,'No'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_applicationsmain table */
                    updateApplicationMain(appid,userid,4);
                    deferred.resolve();
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    deferred.reject(err);
                });
            });
        } else {
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_personaldetails`(ApplicationId,UserId,Firstname,Middlename,Lastname,EmailId,MobileNo,AltMobileNo,landlineNo,DateOfBirth,Gender,EmployerType,PanNumber,AadharNumber,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,firstnm,middlenm,lastnm,email,mobileno,altMobileno,landline,dob,genVal,emptype,panno,aadhar,updateAt,'No'],
                type: sequelize.QueryTypes.INSERT
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,4);
                deferred.resolve();
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

function saveAddressInfofromXML(appid,userid,flatno,roadStreetnm,areaLocalitynm,citynm,state,pincode){
    var deferred = Q.defer();
    let addressType = "Residence";
    let building = "";
    country = "India";

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
                    replacements: [appid,userid,addressType,flatno,building,roadStreetnm,areaLocalitynm,citynm,state,country,pincode,updateAt,'No'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_applicationsmain table */
                    updateApplicationMain(appid,userid,5);

                    deferred.resolve();
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    deferred.reject(err);
                });
            });
        } else {
			//res.status(200);
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_addressdetails`(ApplicationId,UserId,AddressType,Flatno_Blockno,Building_Village_Premises,Road_Street_PO,Area_Locality,City_Town_District,State,Country,Pincode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,addressType,flatno,building,roadStreetnm,areaLocalitynm,citynm,state,country,pincode,updateAt,'No'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {			
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,5);
                deferred.resolve();
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

exports.saveBankDetailsByAppId = (req,res)=>{
    //res.status(200);
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let details = req.body.Details;
    let updateAt = formattedDT;

    BankDetails.findOne(
        { where: {UserId:userid,ApplicationId: appid} }
    )
    .then(function (resultData) {
        if (resultData) {
            console.log("Result - Personal Details  "+JSON.stringify(resultData));
            BankDetails.destroy({
                where: {UserId:userid,ApplicationId: appid}
            }).then(() => {
                console.log('deleted successfully with id = ' + appid);
                
                if(details.length > 0){
                    for(var i=0;i < details.length;i++){
                        let accPriority = details[i].AccPriority;
                        let accNumber = details[i].AccNumber;
                        let accType = details[i].AccType;
                        let bankNm = details[i].BankNm;
                        let ifscCode = details[i].IFSCCode;
                        console.log("Result cnt  "+ i);
                        if( i != details.length-1){
                            insertBankDetails(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
                            .then(result =>{
                                console.log("Result AppId  "+result);
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                                res.status(400).send(err);
                            });
                        }
                        else{
                            insertBankDetailsAndSendResponse(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
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
                    let accType = details[i].AccType;
                    let bankNm = details[i].BankNm;
                    let ifscCode = details[i].IFSCCode;

                    console.log("Result cnt  "+ i);
                    if( i != details.length-1){
                        insertBankDetails(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
                        .then(result =>{
                            console.log("Result AppId  "+result);
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            res.status(400).send(err);
                        });
                    }
                    else{
                        insertBankDetailsAndSendResponse(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
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

function saveBankDetailsFromXML(userid,appid,bankDetailsArr){
    var deferred = Q.defer();

    BankDetails.findOne(
        { where: {UserId:userid,ApplicationId: appid} }
    )
    .then(function (resultData) {
        if (resultData) {
            console.log("Result - Bank Details  "+JSON.stringify(resultData));
            BankDetails.destroy({
                where: {UserId:userid,ApplicationId: appid}
            }).then(() => {
                console.log('deleted successfully with id = ' + appid);
                
                if(bankDetailsArr.length > 0){
                    for(var i=0;i < bankDetailsArr.length;i++){
                        let accPriority = bankDetailsArr[i].AccPriority;
                        let accNumber = bankDetailsArr[i].AccNumber;
                        let accType = "Savings";
                        let bankNm = bankDetailsArr[i].BankNm;
                        let ifscCode = bankDetailsArr[i].IFSCCode;
                        console.log("Result cnt  "+ i);
                        if( i != details.length-1){
                            insertBankDetails(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
                            .then(result =>{
                                console.log("Result AppId  "+result);
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                            });
                        }
                        else{
                            insertBankDetails(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
                            .then(result =>{
                                console.log("Result AppId  "+result);
                                deferred.resolve();
                            })
                            .catch(function (err) {
                                console.log("Error "+err);
                                deferred.reject(err);
                            });
                        }
                    }
                }
            });
        } else {
            if(bankDetailsArr.length > 0){
                for(var i=0;i < bankDetailsArr.length;i++){
                    let accPriority = bankDetailsArr[i].AccPriority;
                    let accNumber = bankDetailsArr[i].AccNumber;
                    let accType = "Savings";
                    let bankNm = bankDetailsArr[i].BankNm;
                    let ifscCode = bankDetailsArr[i].IFSCCode;
                    console.log("Result cnt  "+ i);
                    if( i != details.length-1){
                        insertBankDetails(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
                        .then(result =>{
                            console.log("Result AppId  "+result);
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                        });
                    }
                    else{
                        insertBankDetails(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt)
                        .then(result =>{
                            console.log("Result AppId  "+result);
                            deferred.resolve();
                        })
                        .catch(function (err) {
                            console.log("Error "+err);
                            deferred.reject(err);
                        });
                    }
                }
            }
        }
    })
    .catch(function (err) {
        console.log("Error "+err);
        deferred.reject(err);
    });

    return deferred.promise;
}

function insertBankDetails(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt){
    var deferred = Q.defer();
    sequelize.query("INSERT INTO `et_bankdetails`(ApplicationId,UserId,AccountPriority,AccountNumber,AccountType,BankName,IFSCCode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
        replacements: [appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt,'Yes'],
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

function insertBankDetailsAndSendResponse(appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt){
    var deferred = Q.defer();
    sequelize.query("INSERT INTO `et_bankdetails`(ApplicationId,UserId,AccountPriority,AccountNumber,AccountType,BankName,IFSCCode,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
        replacements: [appid,userid,accPriority,accNumber,accType,bankNm,ifscCode,updateAt,'Yes'],
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
    let immovableAssetsFlag = req.body.immovableAssetsFlag;
    let movJwellaryItemsAmount = req.body.movJwellaryItemsAmount;
    let movCraftItemsAmount = req.body.movCraftItemsAmount;
    let movConveninceItemsAmount = req.body.movConveninceItemsAmount;
    let movFABankAmount = req.body.movFABankAmount;
    let movFASharesAmount = req.body.movFASharesAmount;
    let movFAInsAmount = req.body.movFAInsAmount;
    let movFALoansGivenAmount = req.body.movFALoansGivenAmount;
    let movInHandCashAmount = req.body.movInHandCashAmount;
    let totalLiability = req.body.totalLiability;
    let foreignAssFlag = req.body.foreignAssFlag;
    let updateAt = formattedDT;
    AssetsDetails.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Assets Details  "+JSON.stringify(resultData));
            AssetsDetails.destroy({
                where: { ALDetailsId: resultData.ALDetailsId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.ALDetailsId);
                sequelize.query("INSERT INTO `et_assetsliabilitiesdetails`(ApplicationId,UserId,ImmovableAssetsFlag,MovJwellaryItemsAmount,MovCraftItemsAmount,MovConveninceItemsAmount,MovFABankAmount,MovFASharesAmount,MovFAInsAmount,MovFALoansGivenAmount,MovInHandCashAmount,TotalLiability,ForeignAssesDocUploadFlag,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,immovableAssetsFlag,movJwellaryItemsAmount,movCraftItemsAmount,movConveninceItemsAmount,movFABankAmount,movFASharesAmount,movFAInsAmount,movFALoansGivenAmount,movInHandCashAmount,totalLiability,foreignAssFlag,updateAt,'Yes'],
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
            });
        } else {
			//res.status(200);
			//Save to et_personaldetails table */
			sequelize.query("INSERT INTO `et_assetsliabilitiesdetails`(ApplicationId,UserId,ImmovableAssetsFlag,MovJwellaryItemsAmount,MovCraftItemsAmount,MovConveninceItemsAmount,MovFABankAmount,MovFASharesAmount,MovFAInsAmount,MovFALoansGivenAmount,MovInHandCashAmount,TotalLiability,ForeignAssesDocUploadFlag,updatedAt,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,immovableAssetsFlag,movJwellaryItemsAmount,movCraftItemsAmount,movConveninceItemsAmount,movFABankAmount,movFASharesAmount,movFAInsAmount,movFALoansGivenAmount,movInHandCashAmount,totalLiability,foreignAssFlag,updateAt,'Yes'],
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
};

exports.saveImmAssestsInfoByAppId = (req,res)=>{
    let inputdata = req.body;
    console.log("Input Req "+ JSON.stringify(inputdata));
    let assInfoId = req.body.assInfoId;
    let immovableAssInput = req.body.immovableAssInputParam
    let appid = immovableAssInput.appId;
    let userid = immovableAssInput.userId;
    let description = immovableAssInput.description;
    let flatNo = immovableAssInput.flatNo;
    let premiseName = immovableAssInput.premiseName;
    let streetName = immovableAssInput.streetName;
    let locality = immovableAssInput.locality;
    let state = immovableAssInput.state;
    let pincode = immovableAssInput.pincode;
    let country = immovableAssInput.country;
    let purchaseCost = parseFloat(immovableAssInput.purchaseCost);
    let totalLiabilites = immovableAssInput.totalLiabilites;
    let updateAt = formattedDT;
    console.log("Input Req "+ JSON.stringify(inputdata));
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
                sequelize.query("INSERT INTO `et_immovableassetsdetails`(ALDetailsId,ApplicationId,UserId,Description,FlatNo,PremiseName,StreetName,AreaLocality,State,Pincode,Amount,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [assInfoId,appid,userid,description,flatNo,premiseName,streetName,locality,state,pincode,purchaseCost,updateAt],
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
			//res.status(200);
			//Save to et_immovableassetsdetails table */
			sequelize.query("INSERT INTO `et_immovableassetsdetails`(ALDetailsId,ApplicationId,UserId,Description,FlatNo,PremiseName,StreetName,AreaLocality,State,Pincode,Amount,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [assInfoId,appid,userid,description,flatNo,premiseName,streetName,locality,state,pincode,purchaseCost,updateAt],
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
};

exports.saveSalIncomeInfoByAppId = (req,res) => {
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let uploadDocFlag = req.body.uploadDocFlag;
    let employernm = req.body.employernm;
    let salamount = req.body.salamount;
    let inputEmployertype = req.body.inputEmployertype;

    SalariedIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Salary Income details  "+JSON.stringify(resultData));
            SalariedIncome.destroy({
                where: { IncomeSourceSalId: resultData.IncomeSourceSalId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.IncomeSourceSalId);
                sequelize.query("INSERT INTO `et_income_salary`(ApplicationId,UserId,Form16UploadFlag,SalaryPaidAmount,EmployerName,EmployerCategory,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,uploadDocFlag,salamount,employernm,inputEmployertype,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
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
            });
        } else {
			//res.status(200);
			//Save to et_income_salary table */
			sequelize.query("INSERT INTO `et_income_salary`(ApplicationId,UserId,Form16UploadFlag,SalaryPaidAmount,EmployerName,EmployerCategory,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                replacements: [appid,userid,uploadDocFlag,salamount,employernm,inputEmployertype,'Yes'],
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

};

function saveSalaryDetailsFromXML(userid,appid,salDetailInput){
    var deferred = Q.defer();

    SalariedIncome.findOne(
		{ where: {UserId:userid,ApplicationId: appid} }
	)
	.then(function (resultData) {
		if (resultData) {
            console.log("Result - Salary Income details  "+JSON.stringify(resultData));
            SalariedIncome.destroy({
                where: { IncomeSourceSalId: resultData.IncomeSourceSalId}
            }).then(() => {
                console.log('deleted successfully with id = ' + resultData.IncomeSourceSalId);
                sequelize.query("INSERT INTO `et_income_salary`(ApplicationId,UserId,Form16UploadFlag,SalaryPaidAmount,EmployerName,EmployerCategory,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,uploadDocFlag,salamount,employernm,inputEmployertype,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    //update flags to et_income_salary table */
                    updateApplicationMain(appid,userid,9);

                    deferred.resolve();
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    deferred.reject(err);
                });
            });
        } else {
			//Save to et_income_salary table */
			sequelize.query("INSERT INTO `et_income_salary`(ApplicationId,UserId,Form16UploadFlag,SalaryPaidAmount,EmployerName,EmployerCategory,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                replacements: [appid,userid,uploadDocFlag,salamount,employernm,inputEmployertype,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                //update flags to et_applicationsmain table */
                updateApplicationMain(appid,userid,9);
                deferred.resolve();
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

exports.saveOthIncomeInfoByAppId = (req,res) => {
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let uploadDocFlag = req.body.uploadDocFlag;
    let savingsIncome = req.body.savingsIncome;
    let fdincome = req.body.fdincome;
    let othericnome = req.body.othericnome;
    let shareincome = req.body.shareincome;
    let exemptincome = req.body.exemptincome;
    let otherexemptincome = req.body.otherexemptincome;
    let agriincome = req.body.agriincome;
    let agriexpend = req.body.agriexpend;
    let agriloss = req.body.agriloss;
    let depincome = req.body.depincome;
    let depname = req.body.depname;
    let deprelation = req.body.deprelation;
    let depincomeNature = req.body.depincomeNature;
    let pfincome = req.body.pfincome;
    let pfincometax = req.body.pfincometax;

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
                sequelize.query("INSERT INTO `et_income_others`(ApplicationId,UserId,DocumentUploadFlag,SavingsInterestAmount,FDInterestAmount,GiftsIncome,DividendEarnedAmount,ExemptInterestIncome,OtherExemptIncome,GrossAgriIncome,AgriExpenditure,AgriLoss,PFWithdrawalIncome,PFWithdrawalTaxrate,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,uploadDocFlag,savingsIncome,fdincome,othericnome,shareincome,exemptincome,otherexemptincome,agriincome,agriexpend,agriloss,pfincome,pfincometax,'Yes'],
                    type: sequelize.QueryTypes.INSERT 
                }).then(result => {		
                    console.log("Result AppId  "+result[0]);
                    insertDependentIncome(appid,userid,result[0],depincome,depname,deprelation,depincomeNature);
                    res.json({"statusCode": 200,"Message": "Successful Request"});
                })
                .catch(function (err) {
                    console.log("Error "+err);
                    res.status(400).send(err);
                });
            });
        } else {
			//res.status(200);
			//Save to et_income_others table */
			sequelize.query("INSERT INTO `et_income_others`(ApplicationId,UserId,DocumentUploadFlag,SavingsInterestAmount,FDInterestAmount,GiftsIncome,DividendEarnedAmount,ExemptInterestIncome,OtherExemptIncome,GrossAgriIncome,AgriExpenditure,AgriLoss,PFWithdrawalIncome,PFWithdrawalTaxrate,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,uploadDocFlag,savingsIncome,fdincome,othericnome,shareincome,exemptincome,otherexemptincome,agriincome,agriexpend,agriloss,pfincome,pfincometax,'Yes'],
                type: sequelize.QueryTypes.INSERT 
            }).then(result => {		
                console.log("Result AppId  "+result[0]);
                insertDependentIncome(appid,userid,result[0],depincome,depname,deprelation,depincomeNature);
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

function insertDependentIncome(appid,userid,otherIncomeId,depincome,depname,deprelation,depincomeNature){
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
    let uploadDocFlag = req.body.uploadDocFlag;
    let flatno = req.body.flatno;
    let premises = req.body.premises;
    let street = req.body.street;
    let area = req.body.area;
    let city = req.body.city;
    let pincode = req.body.pincode;
    let country = req.body.country;
    let state = req.body.state;
    let proploanflag = req.body.proploanflag;
    let propinterestpaid = req.body.propinterestpaid;
    let coflag = req.body.coflag;
    let selfshare = req.body.selfshare;
    let coname = req.body.coname;
    let copan = req.body.copan;
    let coshare = req.body.coshare;

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
                sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,HouseloanFlag,InterestAmount,DocumentUploadFlag,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,propType,proploanflag,propinterestpaid,uploadDocFlag,coflag,selfshare,'Yes'],
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
			sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,HouseloanFlag,InterestAmount,DocumentUploadFlag,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,propType,proploanflag,propinterestpaid,uploadDocFlag,coflag,selfshare,'Yes'],
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

function insertHousePropAddress(appid,userid,propertyId,propType,flatno,premises,street,area,city,pincode,country,state,res){
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
                insertCoownerDetails(appid,userid,propertyId,coname,propType,copan,coshare,stage,res);
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
    let uploadDocFlag = req.body.uploadDocFlag;
    let flatno = req.body.flatno;
    let premises = req.body.premises;
    let street = req.body.street;
    let area = req.body.area;
    let city = req.body.city;
    let pincode = req.body.pincode;
    let country = req.body.country;
    let state = req.body.state;
    
    let rentAmountRcvd = req.body.rentAmountRcvd;
    let rentHouseTaxPaid = req.body.rentHouseTaxPaid;
    let rentalTenantNm = req.body.rentalTenantNm;
    let rentalTenantPan = req.body.rentalTenantPan;
    
    let rentalPropLoanFlag = req.body.rentalPropLoanFlag;
    let rentalpropInterestPaid = req.body.rentalpropInterestPaid;

    let coflag = req.body.coflag;
    let selfshare = req.body.selfshare;
    let unRealizedRent = req.body.unRealizedRent;
    let coname = req.body.coname;
    let copan = req.body.copan;
    let coshare = req.body.coshare;

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
                sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,AmountReceived,HousetaxPaid,TenantName,TanantPanno,HouseloanFlag,InterestAmount,DocumentUploadFlag,UnrealizedRentAmount,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,propType,rentAmountRcvd,rentHouseTaxPaid,rentalTenantNm,rentalTenantPan,rentalPropLoanFlag,rentalpropInterestPaid,uploadDocFlag,unRealizedRent,coflag,selfshare,'Yes'],
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
			sequelize.query("INSERT INTO `et_income_property`(ApplicationId,UserId,PropertyType,AmountReceived,HousetaxPaid,TenantName,TanantPanno,HouseloanFlag,InterestAmount,DocumentUploadFlag,UnrealizedRentAmount,CoownerFlag,OwnershipShare,CompletionStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",{
                replacements: [appid,userid,propType,rentAmountRcvd,rentHouseTaxPaid,rentalTenantNm,rentalTenantPan,rentalPropLoanFlag,rentalpropInterestPaid,uploadDocFlag,unRealizedRent,coflag,selfshare,'Yes'],
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

exports.saveCapitalIncomeInfoByAppId = (req,res) => {
    //let inputdata = req.body;
    let appid = req.body.appId;
    let userid = req.body.userId;
    let shareIncomeFlag = req.body.shareIncomeFlag;
    let landsaleproof = req.body.landsaleproof;
    let assestSaleProof = req.body.assestSaleProof;
    let MFSaleProof = req.body.MFSaleProof;

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
                sequelize.query("INSERT INTO `et_income_capitalgains`(ApplicationId,UserId,Shares_Sell_Flag,Property_Sell_Flag,Assests_Sell_Flag,MF_Sell_Flag,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                    replacements: [appid,userid,shareIncomeFlag,landsaleproof,assestSaleProof,MFSaleProof,'Yes'],
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
			sequelize.query("INSERT INTO `et_income_capitalgains`(ApplicationId,UserId,Shares_Sell_Flag,Property_Sell_Flag,Assests_Sell_Flag,MF_Sell_Flag,CompletionStatus) VALUES (?,?,?,?,?,?,?)",{
                replacements: [appid,userid,shareIncomeFlag,landsaleproof,assestSaleProof,MFSaleProof,'Yes'],
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

/*
//Save data to deductions table
*/
exports.saveDeductionsInfoByAppId = (req,res)=>{
    let inputdata = req.body;
    let appid, userid , deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,SelfMedPremAmt;
    let depHCfees,parentSCFlag,parMedPremAmt,DoneeNm,DoneePan,DonDedLimit;
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
            parentSCFlag = inputdata[i].parentSCFlag;
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
                SelfMedPremAmt,depHCfees,parentSCFlag,parMedPremAmt,DoneeNm,DoneePan,
                DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,DonPincode,DonCountry,RentPerMonth,TreatAge,i,res,inputdata.length,15);
        }
    }
}

exports.saveOtherDeductionsByAppId = (req,res)=>{
    let inputdata = req.body;
    let appid, userid , deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,SelfMedPremAmt;
    let depHCfees,parentSCFlag,parMedPremAmt,DoneeNm,DoneePan,DonDedLimit;
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
            parentSCFlag = 0;
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
                SelfMedPremAmt,depHCfees,parentSCFlag,parMedPremAmt,DoneeNm,DoneePan,
                DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,DonPincode,DonCountry,RentPerMonth,TreatAge,i,res,inputdata.length,16);
        }
    }
}

function saveMainDeductionsData(appid,userid,deductiontype,dedcategory,deductionamount,investCat,docUploadFlag,
SelfMedPremAmt,depHCfees,parentSCFlag,parMedPremAmt,DoneeNm,DoneePan,
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
                    "Parents_SC_PolicyFlag,NoHRA_TotalMonths,SpecificDisease_PersonAge,DoneeName,DoneePan,DoneeDeductionLimit,DoneeQualPer,DoneeAddress,DoneeCity,"+
                    "DoneeState,DoneeCountry,DonePincode,CompletionStatus,DocUploadFlag,updatedAt) "+
                    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                {
                    replacements: [appid,userid,deductiontype,dedcategory,investCat,deductionamount,SelfMedPremAmt,
                    depHCfees,parMedPremAmt,parentSCFlag,RentPerMonth,TreatAge,DoneeNm,DoneePan,DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,
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
            });
        } else {
            //res.status(200);
            //Save to et_deductions table */
            sequelize.query("INSERT INTO `et_deductions`(ApplicationId,UserId,DeductionTypes,DeductionCategory,"+
                "InvestmentCategory,DeductionAmount,Self_MI_PremiumAmt,Self_HC_Fees,Parents_MI_PremiumAmt,"+
                "Parents_SC_PolicyFlag,NoHRA_TotalMonths,SpecificDisease_PersonAge,DoneeName,DoneePan,DoneeDeductionLimit,DoneeQualPer,DoneeAddress,DoneeCity,"+
                "DoneeState,DoneeCountry,DonePincode,CompletionStatus,DocUploadFlag,createdAt) "+
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            {
                replacements: [appid,userid,deductiontype,dedcategory,investCat,deductionamount,SelfMedPremAmt,
                depHCfees,parMedPremAmt,parentSCFlag,RentPerMonth,TreatAge,DoneeNm,DoneePan,DonDedLimit,DoneeQualPer,DonAddress,DoneeCity,DoneeState,
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

function saveTaxPaidDetailsFromXML(){
    var deferred = Q.defer();

    return deferred.promise;

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
    console.log("Request "+req.body.userid);
    let userid = req.body.userid;
    ApplicationMain.findAll({ 
        where: {UserId:userid,ApplicationStatus:'Progress'} 
    })
    .then(function (resultData) {
        if (resultData) {
            console.log("Result -In Progress Applications  "+JSON.stringify(resultData));
            res.json({"statusCode": 200,"Message": "Successful Request","ResultData":resultData});
        } 
    })
    .catch(function (err) {
        console.log("Error "+err);
        res.status(400).send(err);
    });
}

exports.fetchDashboardInfo = (req,res)=>{
    res.json({"statusCode": 200,"Message": "Successful Request","ResultData":null});
}

//update flags to et_applicationsmain table */
function updateApplicationMain(appid,userid,appStage,xmlflag=0){
    if(xmlflag != 0){
        sequelize.query("UPDATE `et_applicationsmain` SET XmlUploadFlag=?,updatedAt=?,ApplicationStage=? WHERE ApplicationId = ? AND UserId = ? ",{
            replacements: [xmlflag,formattedDT,appStage,appid,userid],
            type: sequelize.QueryTypes.UPDATE 
        }).then(result => {		
            console.log("Result AppId  "+result);
        })
        .catch(function (err) {
            console.log("Error in app main update "+err);
        });
    }else{
        sequelize.query("UPDATE `et_applicationsmain` SET updatedAt=?,ApplicationStage=? WHERE ApplicationId = ? AND UserId = ? ",{
            replacements: [formattedDT,appStage,appid,userid],
            type: sequelize.QueryTypes.UPDATE 
        }).then(result => {		
            console.log("Result AppId  "+result);
        })
        .catch(function (err) {
            console.log("Error in app main update "+err);
        });
    }
    
};


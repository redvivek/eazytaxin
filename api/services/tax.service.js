const path = require('path');
const fs = require('fs');
const multer = require('multer');


const db = require('../config/dbConfig');
var dateTime = require('node-datetime');

const ApplicationMain = db.ApplicationMain;
const sequelize = db.sequelize;

var dt = dateTime.create();
var formattedDT = dt.format('Y-m-d H:M:S');


// Fetch all Users
exports.uploadPrefilledXML = (req, res) => {
    var new_path = path.join(process.env.PWD, '/uploads/');
    console.log("New Path:"+new_path);

    var storage = multer.diskStorage({
        destination: new_path,
        filename: function (req, file, cb) {
            var file_ext        =   file.originalname.split('.');
            cb(null, file_ext[0] + '_' + Date.now()+ "." +file_ext[1])
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
            req.files.forEach(function(item) {
                console.log("File item "+item);
            });
            return res.send({
                success: true
            })
        }
    });
};

exports.createApplication = (req, res) => {
    let appParam = req.body;
	console.log("Request Object: "+JSON.stringify(appParam));

	/*Check for existing application for tax period & user */
    let assesmentYear = appParam.taxperiod;
    let userid = appParam.userId;
    let xmluploadflag = appParam.xmluploadflag;
    let appRefNo = appParam.appRefNo;

	ApplicationMain.findOne(
		{ where: {UserId:userid,AssesmentYear: assesmentYear} }
	)
	.then(function (application) {
		if (application) {
            console.log("Result AppId  "+JSON.stringify(application));
            res.json({"statusCode": 301,"Message": "Existing AppId","AppId":application.ApplicationId});
        } else {
			//res.status(200);
			//Save to et_userinfo table */
			sequelize.query("INSERT INTO `et_applicationsmain`(UserId,AppRefNo,AssesmentYear,xmluploadflag,createdAt,ApplicationStage,ApplicationStatus,AppPaymentStatus,AppITRUploadStatus) VALUES (?,?,?,?,?,?,?,?,?)",{
				replacements: [userid,appRefNo,assesmentYear,xmluploadflag,formattedDT,1,'Initiated','NotStarted','No'],
				type: sequelize.QueryTypes.INSERT 
			}).then(result => {		
                console.log("Result AppId  "+result[0]);
                res.json({"statusCode": 200,"Message": "Successful Request","AppId":result[0]});
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

exports.fetchApplicationMainByAppId = (req,res)=>{
    console.log("Request param "+req.body.id);
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

exports.saveBasicInfoByAppId = (req,res)=>{
    let inputdata = req.body;
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
    sequelize.query("UPDATE `et_applicationsmain` SET IncomeSalaryFlag = ?, IncomeOthersFlag = ?, IncomeHouseFlag = ?, IncomeRentalFlag=?, IncomeCapitalGainsFlag=?, DeductionsFlag=?, ResidentIndianFlag=?, NonResidentIndianFlag=?, OciResidentIndianFlag=?, PresentIndiaFlag=?, updatedAt = ?, ApplicationStage=? WHERE ApplicationId = ? AND UserId = ? ",{
        replacements: [incomeFromSalary,incomeFromOtherSources,selfOccupiedProp,rentalProperty,incomeFromCapitals,deductionsFlag,residentIndianFlag,nonResidentIndianFlag,ociResidentIndianFlag,presentIndiaFlag,updateAt,2,appid,userid],
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
    res.status(200);
};

exports.saveAddressInfoByAppId = (req,res)=>{
    res.status(200);
};

exports.saveBankDetailsByAppId = (req,res)=>{
    res.status(200);
};

exports.saveAssestsInfoByAppId = (req,res)=>{
    res.status(200);
};
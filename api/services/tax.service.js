const path = require('path');
const fs = require('fs');
const multer = require('multer');


const db = require('../config/dbConfig');
var dateTime = require('node-datetime');


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
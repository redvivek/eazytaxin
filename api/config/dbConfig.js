const env = require('./env');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  },
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true
  },
  // disable logging; default: console.log
  logging: false
});

sequelize.sync();
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
//Models/tables
db.Userinfo             =   require('../model/et_userinfo')(sequelize, Sequelize);
db.StateMaster          =   require('../model/et_statemaster')(sequelize, Sequelize);
db.DocMaster            =   require('../model/et_documentmaster')(sequelize, Sequelize);
db.DeductionMaster      =   require('../model/et_deductiontypemaster')(sequelize, Sequelize);
db.ApplicationMain      =   require('../model/et_applicationsmain')(sequelize, Sequelize);
db.PersonalDetails      =   require('../model/et_personaldetails')(sequelize, Sequelize);
db.AddressDetails       =   require('../model/et_addressdetails')(sequelize, Sequelize);
db.BankDetails          =   require('../model/et_bankdetails')(sequelize, Sequelize);
db.AssetsDetails        =   require('../model/et_assetsliabilitiesdetails')(sequelize, Sequelize);
db.ImAssetsAddDetails   =   require('../model/et_immovableassetsdetails')(sequelize, Sequelize);
db.AssetsAOPDetails     =   require('../model/et_assetsaopdetails')(sequelize, Sequelize);
db.SalariedIncome       =   require('../model/et_income_salary')(sequelize, Sequelize);
db.OtherIncome          =   require('../model/et_income_others')(sequelize, Sequelize);
db.OtherDepIncome       =   require('../model/et_income_dependentincome')(sequelize, Sequelize);
db.PropertyIncome       =   require('../model/et_income_property')(sequelize, Sequelize);
db.PropCoOwnerIncome    =   require('../model/et_property_coownerdetails')(sequelize, Sequelize);
db.CapitalGainsIncome   =   require('../model/et_income_capitalgains')(sequelize, Sequelize);
db.Deductions           =   require('../model/et_deductions')(sequelize, Sequelize);
db.ChallanDetails       =   require('../model/et_challandetails')(sequelize, Sequelize);
db.OthIncomeTaxPaidDetails  =   require('../model/et_otherincometaxpaiddetails')(sequelize, Sequelize);
db.IncomeTaxPaidDetails     =   require('../model/et_incometaxpaiddetails')(sequelize, Sequelize);
db.PaymentDetails       =   require('../model/et_paymentdetails')(sequelize, Sequelize);
db.DocumentUpload       =   require('../model/et_documentupload')(sequelize, Sequelize);
db.ConfigMaster         =   require('../model/et_configmaster')(sequelize, Sequelize);
db.TaxSummary         =   require('../model/et_taxsummary')(sequelize, Sequelize);
 
module.exports = db;
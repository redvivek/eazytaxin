const env = {
    host     : 'eu-cdbr-west-02.cleardb.net',
    username : 'bddda19dc52c5c',
    password : '990b7713',
    database : 'heroku_f384db653570ab3',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  };
   
  module.exports = env;
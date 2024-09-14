const mysqldb = require('../../DB/mysql');
const sqlserverdb = require('../../DB/sqlserver');
const postgredb = require('../../DB/postgre');

function infodbmysql(dbconfig) {
  return mysqldb.infodbmysql(dbconfig);
}


function infodbsqlserver(dbconfig) {
  return sqlserverdb.infodbsqlserver(dbconfig);
}

function infodbpostgresql(dbconfig) {
  return postgredb.infodbpostgresql(dbconfig);
}

module.exports = {
  infodbmysql,
  infodbsqlserver,
  infodbpostgresql,
};

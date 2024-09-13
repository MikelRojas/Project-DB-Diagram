const db = require('../../DB/mysql');

function infodbmysql(dbconfig){
    return db.infodbmysql(dbconfig);
}

function infodbsqlserver(dbconfig){
    return db.infodbsqlserver(dbconfig);
}

module.exports = {
    infodbmysql,
}
const mysql = require('../../common/db_utils');
var debug = require('debug')('v2:users:dao');
const BaseDao = require('./base_dao');

class UserDao extends BaseDao {

    generateSplitResults(connection, table_name) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                var sql_query  = `SHOW COLUMNS FROM ${process.env.WRITE_DB_DATABASE}.${table_name}`;
                debug("generateSplitResults :", sql_query);
                let queryres = await connection.query(sql_query);
                return resolve(queryres);
            } catch (err) {
                debug('getCouponDetail :', err)
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getCouponDetail DB Error ', err)
                return reject(err_code);
            }  
        })
    }

    getUserLogin(connection, user_id, pwd) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.User_Master U  INNER JOIN  ${process.env.WRITE_DB_DATABASE}.Branch_Master B on B.branch_id=U.branch_id WHERE user_id='${user_id}' AND 
               pwd='${pwd}' AND user_status='Y'`;
                debug("custQuery", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found or Incorrect Password!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, User Not Found or Incorrect Password!.", developerMessage: "Sorry, User Not Found or Incorrect Password!." };
                    return resolve(error_code)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0];
                    return resolve(response)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getUserLog Error :', error)
                return reject(err_code);
            }
        })
    }
}

module.exports = {
    UserDao
}
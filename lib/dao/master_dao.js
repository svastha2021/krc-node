const mysql = require('../../common/db_utils');
var debug = require('debug')('v2:masters:dao');
const BaseDao = require('./base_dao');

class MasterDao extends BaseDao {

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

    getMasterReference(connection, ref_type, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.ref_code) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master WHERE ref_type='${ref_type}' AND ref_code='${query.filter.ref_code}' 
                    LIMIT ${strPagination}`;
                }
                else{
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master WHERE ref_type='${ref_type}' LIMIT ${strPagination}`; 
                }
                debug("getMasterReference", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Data Not Available!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Data Not Available!.", developerMessage: "Data Not Available!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getMasterReference error :', error)
                return reject(err_code);
            }
        })
    }

    getCountMasterReference(connection, ref_type, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.ref_code) {
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master WHERE ref_type='${ref_type}' AND ref_code='${query.filter.ref_code}'`;
                }
                else{
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master WHERE ref_type='${ref_type}'`; 
                }
                debug("getCountMasterReference", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    return resolve(0)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0].count;
                    return resolve(response)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getCountMasterReference error :', error)
                return reject(err_code);
            }
        })
    }

    getLabTestLists(connection, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.branch_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master WHERE branch_id='${query.filter.branch_id}'  
                    LIMIT ${strPagination}`;
                }
                else if(query.filter.org_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master WHERE org_id='${query.filter.org_id}' 
                    LIMIT ${strPagination}`;
                }
                else if(query.filter.test_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master WHERE test_id='${query.filter.test_id}' 
                    LIMIT ${strPagination}`;
                }
                else{
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master`; 
                }
                debug("getLabTestLists", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Data Not Available!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Data Not Available!.", developerMessage: "Data Not Available!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getLabTestLists error :', error)
                return reject(err_code);
            }
        })
    }

    getCountLabTestLists(connection, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.branch_id) {
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master WHERE branch_id='${query.filter.branch_id}'`;
                }
                else if(query.filter.org_id) {
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master WHERE org_id='${query.filter.org_id}'`;
                }
                else if(query.filter.test_id) {
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master WHERE test_id='${query.filter.test_id}'`;
                }
                else{
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Lab_Test_Master`; 
                }
                debug("getCountLabTestLists", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    return resolve(0)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0].count;
                    return resolve(response)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getCountLabTestLists error :', error)
                return reject(err_code);
            }
        })
    }
}

module.exports = {
    MasterDao
}
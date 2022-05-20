const mysql = require('../../common/db_utils');
var debug = require('debug')('v2:products:dao');
const BaseDao = require('./base_dao');

class ProductDao extends BaseDao {

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

    GetProductDetail(connection, product_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT p.*,s.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.product_id='${product_id}'`;
                debug("GetProductDetail", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Product Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Product Data Not Found!.", developerMessage: "Sorry, Product Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    var _res = JSON.parse(JSON.stringify(queryres));
                    var response = _res[0];
                    return resolve(response)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('GetProductDetail Error :', error)
                return reject(err_code);
            }
        })
    }

    getProductsByBranchIdBuId(connection, branch_id, bu_id, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT p.*,s.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.branch_id='${branch_id}' AND bu_id='${bu_id}' LIMIT ${strPagination}`;
                debug("getProductsByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Product Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Product Data Not Found!.", developerMessage: "Sorry, Product Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getProductsByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getCountProductsByBranchIdBuId(connection, branch_id, bu_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.branch_id='${branch_id}' AND bu_id='${bu_id}'`;
                debug("getCountProductsByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
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
                debug('getCountProductsByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getProductsByBranchId(connection, branch_id, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT p.*,s.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.branch_id='${branch_id}' LIMIT ${strPagination}`;
                debug("getProductsByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Product Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Product Data Not Found!.", developerMessage: "Sorry, Product Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getProductsByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getCountProductsByBranchId(connection, branch_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.branch_id='${branch_id}'`;
                debug("getCountProductsByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
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
                debug('getCountProductsByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getProductsByOrgIdBuId(connection, org_id, bu_id, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT p.*,s.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.org_id='${org_id}' AND bu_id='${bu_id}' LIMIT ${strPagination}`;
                debug("getProductsByOrgIdBuId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Product Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Product Data Not Found!.", developerMessage: "Sorry, Product Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getProductsByOrgIdBuId Error :', error)
                return reject(err_code);
            }
        })
    }

    getCountProductsByOrgIdBuId(connection, org_id, bu_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.org_id='${org_id}' AND bu_id='${bu_id}'`;
                debug("getCountProductsByOrgIdBuId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
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
                debug('getCountProductsByOrgIdBuId Error :', error)
                return reject(err_code);
            }
        })
    }

    getProductsByOrgId(connection, org_id, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT p.*,s.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.org_id='${org_id}' LIMIT ${strPagination}`;
                debug("getProductsByOrgId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Product Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Product Data Not Found!.", developerMessage: "Sorry, Product Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getProductsByOrgId Error :', error)
                return reject(err_code);
            }
        })
    }

    getCountProductsByOrgId(connection, org_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.org_id='${org_id}'`;
                debug("getCountProductsByOrgId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
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
                debug('getCountProductsByOrgId Error :', error)
                return reject(err_code);
            }
        })
    }
}

module.exports = {
    ProductDao
}
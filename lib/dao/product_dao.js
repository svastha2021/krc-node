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


    getEOD(connection,org_id,branch_id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                console.log('in dao');
                var custQuery = `SELECT DATE_FORMAT(eod_date,'%Y-%m-%d') as eod_date, org_id, branch_id, active_flag FROM 
                ${process.env.WRITE_DB_DATABASE}.Swastha_EOD_OPS where active_flag='Y' and org_id='${org_id}' AND  branch_id='${branch_id}'`;
                console.log(custQuery);
                
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    var invoice_lists = [];
                    return resolve(invoice_lists);
                }
                else{
                    return resolve(queryres);
                }
            }
            catch (err) {
                console.log(err);
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage: "Sorry, Internal Server Error!." };
                debug("Fetch patient advance :", err);
                return reject(err_code);
            }
        })
    }

    GetMultiPrice(connection, branch_id,bu_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
              
                var custQuery = `SELECT multi_pricing FROM ${process.env.WRITE_DB_DATABASE}.BU_Branch_Master WHERE   branch_id='${branch_id}' and bu_id='${bu_id}' `;
                debug("GetProductById", custQuery)
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

    GetProductById(connection, product_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Product_Master WHERE product_id='${product_id}'`;
                debug("GetProductById", custQuery)
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


    getProductsByBranchIdBuId(connection, branch_id, bu_id, query,eod_date,multi_pricing) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                var bill_flag;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                //debug("getProductsByBranchId", eod_date)
            if(query.filter.bu_id && query.filter.patient_type) {
                var insurance_type=query.filter.patient_type;
                if(multi_pricing == "N"){
                    insurance_type="N";
                }
                    if(query.filter.hasOwnProperty('screen_id') && query.filter.hasOwnProperty('eod_date')) {
                        debug("Inside ", eod_date)
                        if(query.filter.screen_id == "Invoice"){                            
                            bill_flag='("I","B")';
                          
                        custQuery = `Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                        a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                        from ${process.env.WRITE_DB_DATABASE}.Product_Master a,  ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b 
                        where a.product_id=b.product_id and a.bu_id='${bu_id}' and b.insurance_type_id= '${insurance_type}' 
                        and  a.billing_flag in ${bill_flag} and '${eod_date}'  >= b.eff_from and '${eod_date}'  <=if(isnull(b.eff_to),curdate(),b.eff_to)`;

                            // custQuery = `Select * from 
                            // (Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                            //     a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                            // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master b 
                            // where a.product_id=b.product_id and a.bu_id='${bu_id}' and b.insurance_type_id= '${query.filter.patient_type}'  
                            // and  a.billing_flag in ${bill_flag} and '${eod_date}' >= b.eff_from and '${eod_date}' <=if(isnull(b.eff_to),curdate(),b.eff_to)
                            // union 
                            // Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                            // a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,
                            // ( case  WHEN '${bu_id}'="DIALY" THEN "N" ELSE '${query.filter.patient_type}' END ) insurance_type_id, a.prod_name_invoice,a.gst_value 
                            // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b
                            // where a.product_id=b.product_id and a.bu_id='${bu_id}' and  a.billing_flag in ${bill_flag} and '${eod_date}' >= b.eff_from and '${eod_date}' <=if(isnull(b.eff_to),curdate(),b.eff_to) ) a
                            //  where insurance_type_id='${query.filter.patient_type}'`;
                        }else if(query.filter.screen_id == "PO"){                            
                            bill_flag='("P","B")';

                            custQuery = `SELECT a.* FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a WHERE a.bu_id='${bu_id}' and  a.billing_flag in ${bill_flag} `;
                            
                        }
                     
                 }
                else if(query.filter.hasOwnProperty('screen_id')) {
                    if(query.filter.screen_id == "Invoice"){                            
                        bill_flag='("I","B")';

                       
                            custQuery = `Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                            a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                            from ${process.env.WRITE_DB_DATABASE}.Product_Master a,  ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b 
                            where a.product_id=b.product_id and a.bu_id='${bu_id}' and b.insurance_type_id= '${insurance_type}' 
                            and  a.billing_flag in ${bill_flag} `;
    
                           

                        // custQuery = `Select * from 
                        // (Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                        //     a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                        // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master b 
                        // where a.product_id=b.product_id and a.bu_id='${bu_id}' and b.insurance_type_id= '${query.filter.patient_type}' 
                        // and  a.billing_flag in ${bill_flag} 
                        // union 
                        // Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                        // a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,
                        // ( case  WHEN '${bu_id}'="DIALY" THEN "N" ELSE '${query.filter.patient_type}' END ) insurance_type_id, a.prod_name_invoice,a.gst_value 
                        // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b
                        // where a.product_id=b.product_id and a.bu_id='${bu_id}' and  a.billing_flag in ${bill_flag}) a
                        //  where insurance_type_id='${query.filter.patient_type}' `;
                    }else if(query.filter.screen_id == "PO"){                            
                        bill_flag='("P","B")';
                        custQuery = `SELECT a.* FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a WHERE a.bu_id='${bu_id}' and  a.billing_flag in ${bill_flag} `;
                           
                    }
                       
                 } 
                 else if(query.filter.hasOwnProperty('eod_date')) {
                    custQuery = `Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                        a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                        from ${process.env.WRITE_DB_DATABASE}.Product_Master a,  ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b 
                        where a.product_id=b.product_id and a.bu_id=bu_id and b.insurance_type_id= '${query.filter.patient_type}' 
                        and  '${eod_date}'  >= b.eff_from and '${eod_date}'  <=if(isnull(b.eff_to),curdate(),b.eff_to)`;


                    //     custQuery = `Select * from 
                    // (Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    //     a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                    // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master b 
                    // where a.product_id=b.product_id and a.bu_id='${bu_id}' and b.insurance_type_id= '${query.filter.patient_type}' 
                    // and '${eod_date}' >= b.eff_from and '${eod_date}' <=if(isnull(b.eff_to),curdate(),b.eff_to)
                    // union 
                    // Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    // a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,
                    // ( case  WHEN '${bu_id}'="DIALY" THEN "N" ELSE '${query.filter.patient_type}' END ) insurance_type_id, a.prod_name_invoice,a.gst_value 
                    // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b
                    // where a.product_id=b.product_id and a.bu_id='${bu_id}' and '${eod_date}' >= b.eff_from and '${eod_date}' <=if(isnull(b.eff_to),curdate(),b.eff_to)) a 
                    // where insurance_type_id='${query.filter.patient_type}'`;
                }
                else{
                    custQuery = `Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                    from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_selling_Price_Master b 
                    where a.product_id=b.product_id and a.bu_id=bu_id and b.insurance_type_id= '${query.filter.patient_type}'`;

                    // custQuery = `Select * from 
                    // (Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    //     a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,b.insurance_type_id, a.prod_name_invoice,a.gst_value
                    // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master b 
                    // where a.product_id=b.product_id and a.bu_id='${bu_id}' and b.insurance_type_id= '${query.filter.patient_type}'
                    // union 
                    // Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    // a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price,
                    // ( case  WHEN '${bu_id}'="DIALY" THEN "N" ELSE '${query.filter.patient_type}' END ) insurance_type_id, a.prod_name_invoice,a.gst_value 
                    // from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b
                    // where a.product_id=b.product_id and a.bu_id='${bu_id}' ) a
                    //  where insurance_type_id='${query.filter.patient_type}'`;
    
                }
            }
                else{
                    if(query.filter.hasOwnProperty('screen_id') && query.filter.hasOwnProperty('eod_date')) {
                        if(query.filter.screen_id == "Invoice"){                            
                            bill_flag='("I","B")';
                            custQuery = `SELECT a.*,b.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a INNER JOIN 
                        ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b ON a.product_id=b.product_id WHERE a.branch_id='${branch_id}' AND bu_id='${bu_id}' 
                        and  a.billing_flag in ${bill_flag} and '${eod_date}' >= b.eff_from and '${eod_date}' <=if(isnull(b.eff_to),curdate(),b.eff_to)`;
    
                        }else if(query.filter.screen_id == "PO"){                            
                            bill_flag='("P","B")';
                            custQuery = `SELECT a.* FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a WHERE a.bu_id='${bu_id}' and  a.billing_flag in ${bill_flag} `;
                          
                        }
                        
                    }else if(query.filter.hasOwnProperty('screen_id')) {
                        if(query.filter.screen_id == "Invoice"){                            
                            bill_flag='("I","B")';
                            custQuery = `SELECT a.*,b.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a INNER JOIN 
                            ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b ON a.product_id=b.product_id WHERE a.branch_id='${branch_id}' AND bu_id='${bu_id}' and  a.billing_flag in ${bill_flag}`;
        
                        }else if(query.filter.screen_id == "PO"){                            
                            bill_flag='("P","B")';
                            custQuery = `SELECT a.* FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a WHERE a.bu_id='${bu_id}' and  a.billing_flag in ${bill_flag} `;
                        }
                       
                    }  else if(query.filter.hasOwnProperty('eod_date')) {
                        custQuery = `SELECT a.*,b.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a INNER JOIN 
                        ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b ON a.product_id=b.product_id WHERE a.branch_id='${branch_id}' AND bu_id='${bu_id}' 
                        and '${eod_date}' >= b.eff_from and '${eod_date}' <=if(isnull(b.eff_to),curdate(),b.eff_to)`;
    
                    }else{
                    custQuery = `SELECT a.*,b.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master a INNER JOIN 
                    ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b ON a.product_id=b.product_id WHERE a.branch_id='${branch_id}' AND bu_id='${bu_id}'`;
                    }
            }
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

    getCountProductsByBranchIdBuId(connection, branch_id, bu_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.bu_id && query.filter.patient_type) {
                    custQuery = `SELECT COUNT(*) AS count FROM (Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price from ${process.env.WRITE_DB_DATABASE}.Product_Master a INNER JOIN ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b
                    ON a.product_id=b.product_id WHERE a.bu_id='${bu_id}'  Union
                    Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price from ${process.env.WRITE_DB_DATABASE}.Product_Master a INNER JOIN ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master b 
                    ON a.product_id=b.product_id WHERE a.bu_id='${bu_id}' and b.insurance_type_id='${query.filter.patient_type}') as count;`
                }
                else{
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                    ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.branch_id='${branch_id}' AND bu_id='${bu_id}'`;
                }
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
    getEOD(connection,org_id,branch_id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                console.log('in dao');
                var custQuery = `SELECT DATE_FORMAT(eod_date,'%Y-%m-%d') as eod_date, org_id, branch_id, active_flag FROM 
                ${process.env.WRITE_DB_DATABASE}.Swastha_EOD_OPS where active_flag='Y' and org_id='${org_id}' AND  branch_id='${branch_id}'`;
                console.log(custQuery);
                
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    var invoice_lists = [];
                    return resolve(invoice_lists);
                }
                else{
                    return resolve(queryres);
                }
            }
            catch (err) {
                console.log(err);
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage: "Sorry, Internal Server Error!." };
                debug("Fetch patient advance :", err);
                return reject(err_code);
            }
        })
    }

    getProductSellingPriceList(connection, branch_id,product_id, eod_date) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }

                var custQuery = `Select   a.product_name, b.product_price,c.ref_desc
                from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b , 
                ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master c   where a.product_id=b.product_id and a.product_id='${product_id}' and 
                '${eod_date}' >= b.eff_from and '${eod_date}' <=if(isnull(b.eff_to),curdate(),b.eff_to) and 
                 c.ref_type="PATTYP" and c.ref_code=b.insurance_type_id`;

                // var custQuery = `SELECT p.*,s.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                // ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.branch_id='${branch_id}' LIMIT ${strPagination}`;
                debug("getProductSellingPriceList", custQuery)
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

    getProductsByOrgIdBuId(connection, org_id, bu_id, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.bu_id && query.filter.patient_type) {
                    if(query.filter.patient_type=='N'){
                        custQuery = `Select  a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, 
                        a.reorder_level, a.price_deviation, a.updated_by, a.updated_date, a.created_by, a.created_date,a.prod_name_invoice,a.gst_value,
                        b.product_price, '${query.filter.patient_type}' insurance_type_id
                        from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b
                        where a.product_id=b.product_id and a.branch_id=b.branch_id and
                        a.bu_id='${bu_id}' and a.branch_id='${branch_id}'`;
                    }else{
                        custQuery = ` Select   a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, 
                        a.reorder_level, a.price_deviation, a.updated_by, a.updated_date, a.created_by, a.created_date, 
                         b.product_price,b.insurance_type_id,a.prod_name_invoice,a.gst_value
                        from ${process.env.WRITE_DB_DATABASE}.Product_Master a, ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master b 
                        where a.branch_id=b.branch_id and a.product_id=b.product_id and 
                          a.bu_id='${bu_id}' and b.insurance_type_id= '${query.filter.patient_type}' and a.branch_id='${branch_id}'`;

                    }
                  
                    
                }
                else{
                    custQuery = `SELECT p.*,s.product_price FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                    ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.org_id='${org_id}' AND bu_id='${bu_id}' LIMIT ${strPagination}`;
                }
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


    getCountProductsByOrgIdBuId(connection, org_id, bu_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.bu_id && query.filter.patient_type) {
                    custQuery = `SELECT COUNT(*) AS count FROM (Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price from ${process.env.WRITE_DB_DATABASE} a INNER JOIN ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master b
                    ON a.product_id=b.product_id WHERE a.bu_id='${bu_id}'  Union
                    Select a.org_id, a.branch_id, a.product_id, a.product_name, a.uom, a.bu_id, a.stock_in_hand, a.min_stock, a.max_stock, a.reorder_level, a.price_deviation, 
                    a.updated_by, a.updated_date, a.created_by, a.created_date, b.product_price from ${process.env.WRITE_DB_DATABASE}.Product_Master a INNER JOIN ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master b 
                    ON a.product_id=b.product_id WHERE a.bu_id='${bu_id}' and b.insurance_type_id='${query.filter.product_type}') as count;`
                }
                else{
                    custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p INNER JOIN 
                    ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master s ON p.product_id=s.product_id WHERE p.org_id='${org_id}' AND bu_id='${bu_id}'`;
                }
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


    getProductMasterByOrgIdBuId(connection, org_id, bu_id, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                custQuery = `SELECT  p.*,b.multi_pricing FROM Product_Master p, BU_Branch_Master b
                where p.org_id='${org_id}' and b.branch_id=p.branch_id and p.bu_id=b.bu_id and b.bu_id='${bu_id}'`;
                    //custQuery = `SELECT  p.* FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p WHERE p.org_id='${org_id}' AND bu_id='${bu_id}' `;
              
                debug("getProductMasterByOrgIdBuId", custQuery)
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
                debug('getProductMasterByOrgIdBuId Error :', error)
                return reject(err_code);
            }
        })
    }

    getProductMasterByOrgId(connection, org_id, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT p.* FROM ${process.env.WRITE_DB_DATABASE}.Product_Master p  WHERE p.org_id='${org_id}' `;
                debug("getProductMasterByOrgId", custQuery)
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
                debug('getProductMasterByOrgId Error :', error)
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

    createProduct(connection, product_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Product_Master SET ?`, product_data);
                debug('COMMIT at createProduct', product_data);
                return resolve(product_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create product error :", err);
                return reject(err_code);
            }
        })
    }

    updateProduct(connection, set_product_data, product_id) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Product_Master SET ? WHERE product_id='${product_id}' `, set_product_data);
                debug('COMMIT at updateProduct', `UPDATE ${process.env.WRITE_DB_DATABASE}.Product_Master SET ? WHERE product_id='${product_id}' `, set_product_data);
                return resolve(set_product_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateProduct Error :", err);
                return reject(err_code);
            }
        })
    }


    getGenerateProductId(connection, seq_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT concat(concat(seq_type,branch_id),LPAD(last_seq_no+1,6,'0')) as product_id ,last_seq_no+1 as last_seq_no 
                FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator WHERE  seq_type='${seq_type}'`;
                debug("getGenerateProductId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug("Firtst time");
                    var new_patient_data = {
                        seq_type: seq_type,                   
                        last_seq_no: 0,
                        branch_pad: 'Y'
                    }
                    await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator SET ?`, new_patient_data);

                    var newpatientquery = `SELECT concat(concat(branch_id,seq_type),LPAD(0,6,'0')) as product_id ,last_seq_no as last_seq_no 
                    FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator WHERE  seq_type='${seq_type}'`;

                    debug("getGenerateProductId", newpatientquery)
                    let queryres_newpatientquery = await connection.query(newpatientquery);
                    if(queryres_newpatientquery.length == 0) {
                        return resolve(null);
                    }
                    else{
                        var _response = JSON.parse(JSON.stringify(queryres_newpatientquery));
                        var newpat_response = _response[0];
                        return resolve(newpat_response);
                    } 
                }
                else{
                    debug("Already Have")
                    var _res = JSON.parse(JSON.stringify(queryres));
                    var response = _res[0];
                    debug("Already Have Response", response)
                    await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator SET last_seq_no=${response.last_seq_no} 
                    WHERE   seq_type='${seq_type}'`);
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getInvoiceNo error :', error)
                return reject(err_code);
            }
        })
    }

    GetProductPricing(connection, org_id, branch_id, product_id, previous_date) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${previous_date}' AND eff_to IS NULL AND product_id='${product_id}'`;
                debug("getCountProductsByOrgId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
                    return resolve(0)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0];
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


    GetProductPricingExisting(connection, org_id, branch_id, product_id, eff_from, insurance_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${eff_from}'  AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
                debug("GetProductPricingExisting", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
                    return resolve(0)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0];
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


    GetProductPricingExist(connection, org_id, branch_id, product_id, eff_from,insurance_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${eff_from}'  AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
                debug("GetProductPricingExist", custQuery)
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
                // var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                // debug('GetProductPricingExist Error :', error)
                // return reject(err_code);
                debug('Sorry, Appointment Not Found!.', queryres);
                return resolve(0)
            }
        })
    }

    GetProductPricingCount(connection, org_id, branch_id, product_id, previous_date, insurance_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from<='${previous_date}' AND eff_to IS NULL AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
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
                // var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                // debug('getCountProductsByOrgId Error :', error)
                // return reject(err_code);
                debug('Sorry, Appointment Not Found!.', queryres);
                return resolve(0)
            }
        })
    }

    createProductPricing(connection, set_product_pricing_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master SET ?`, set_product_pricing_data);
                debug('COMMIT at createProductPricing', set_product_pricing_data);
                return resolve(set_product_pricing_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("createProductPricing error :", err);
                return reject(err_code);
            }
        })
    }

    updateProductPricing(connection, set_product_pricing_data, org_id, branch_id, product_id, previous_date, insurance_type) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master SET ? WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from<='${previous_date}' AND eff_to IS NULL AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`, set_product_pricing_data);
                debug('COMMIT at updateProductPricing');
                return resolve(set_product_pricing_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateProductPricing Error :", err);
                return reject(err_code);
            }
        })
    }

    updateProductPricingExisting(connection, set_product_pricing_data, org_id, branch_id, product_id, eff_from, insurance_type) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                
                debug('COMMIT at updateProductPricingExisting',eff_from);
                debug('COMMIT at updateProductPricingExisting',set_product_pricing_data);
                var dd=`UPDATE ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master SET ? WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${eff_from}'  AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
                debug('update query',dd);
                
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Prod_Selling_Price_Master SET ? WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${eff_from}'  AND product_id='${product_id}' `, set_product_pricing_data);
             
                return resolve(set_product_pricing_data);
            }
            catch (err) {
                var err_code = { status: 200, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateProductPricingExisting Error :", err);
                return reject(err_code);
            }
        })
    }

    GetProductInsurancePricing(connection, org_id, branch_id, product_id, previous_date, insurance_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from<='${previous_date}' AND eff_to IS NULL AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
                debug("getCountProductsByOrgId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
                    return resolve(0)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0];
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


    GetProductInsurancePricingExisting(connection, org_id, branch_id, product_id, eff_from, insurance_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${eff_from}'  AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
                debug("GetProductInsurancePricingExisting", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Appointment Not Found!.', queryres);
                    return resolve(0)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0];
                    return resolve(response)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('GetProductInsurancePricingExisting Error :', error)
                return reject(err_code);
            }
        })
    }

    GetProductInsurancePricingCount(connection, org_id, branch_id, product_id, previous_date, insurance_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from<='${previous_date}' AND eff_to IS NULL AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
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

    GetProductInsurancePricingExistCount(connection, org_id, branch_id, product_id, eff_from, insurance_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                debug("GetProductInsurancePricingExist insurance_type", insurance_type)
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${eff_from}' AND product_id='${product_id}' AND insurance_type_id='${insurance_type}'`;
                debug("GetProductInsurancePricingExist", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, GetProductInsurancePricingExist Not Found!.', queryres);
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
                debug('GetProductInsurancePricingExist Error :', error)
                return reject(err_code);
            }
        })
    }

    createProductInsurancePricing(connection, set_product_pricing_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master SET ?`, set_product_pricing_data);
                debug('COMMIT at createProductPricing', set_product_pricing_data);
                return resolve(set_product_pricing_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("createProductPricing error :", err);
                return reject(err_code);
            }
        })
    }

    updateProductInsurancePricing(connection, set_product_pricing_data, org_id, branch_id, product_id, previous_date, insurance_type) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master SET ? WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from<='${previous_date}' AND eff_to IS NULL AND product_id='${product_id}' AND 
                insurance_type_id='${insurance_type}'`, set_product_pricing_data);
                debug('COMMIT at updateProductPricing');
                return resolve(set_product_pricing_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateProductPricing Error :", err);
                return reject(err_code);
            }
        })
    }


    updateProductInsurancePricingExisting(connection, set_product_pricing_data, org_id, branch_id, product_id, eff_from, insurance_type) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Prod_Ins_Selling_Master SET ? WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' AND eff_from='${eff_from}' AND product_id='${product_id}' AND 
                insurance_type_id='${insurance_type}'`, set_product_pricing_data);
                debug('COMMIT at updateProductPricing');
                return resolve(set_product_pricing_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateProductPricing Error :", err);
                return reject(err_code);
            }
        })
    }
}

module.exports = {
    ProductDao
}
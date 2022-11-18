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

    getVitalParams(connection) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                //console.log('in dao');
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Key_Health_Param_Master`;
                console.log(custQuery);
                let queryres = await connection.query(custQuery);
                if (queryres.length == 0) {
                    debug('Sorry, Details Not Found!.', queryres);
                    return resolve(null)
                }
                else {
                    var _response = JSON.parse(JSON.stringify(queryres));
                    var response = _response;
                    console.log(response);
                    return resolve(response);
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



    getEOD(connection,org_id,branch_id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                //console.log('in dao');
                var custQuery = `SELECT DATE_FORMAT(eod_date,'%Y-%m-%d') as eod_date, org_id, branch_id, active_flag FROM ${process.env.WRITE_DB_DATABASE}.Swastha_EOD_OPS where active_flag='Y' and org_id='${org_id}' AND  branch_id='${branch_id}'`;
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

    getBranches(connection,org_id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                //console.log('in dao');
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Branch_Master where org_id='${org_id}' `;
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

    getAccounts(connection,org_id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                //console.log('in dao');
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Account_Master where org_id='${org_id}' `;
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

    getAccountsByAccountType(connection,org_id,account_type) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                //console.log('in dao');
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Account_Master where org_id='${org_id}'  and account_type='${account_type}'`;
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
    
    createEOD(connection, eod_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Swastha_EOD_OPS SET ?`, eod_data);
                debug('COMMIT at createEOD', eod_data);
                return resolve(eod_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create createEOD error :", err);
                return reject(err_code);
            }
        })
    }


  
    updateEOD(connection,  eod_date) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Swastha_EOD_OPS SET active_flag='C' WHERE eod_date='${eod_date}' `);
               
                return resolve(eod_date);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateEOD Error :", err);
                return reject(err_code);
            }
        })
    }

    // Inventory Start
      
    updateGoodReceiptInventory(connection,  org_id, branch_id, old_eod_date) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                debug("1 --->updateGoodReceiptInventory  :" );
                await connection.query(` update ${process.env.WRITE_DB_DATABASE}.Swastha_Daily_inventory b set received_stock = (
                    select sum(gr_qty_received) from  ${process.env.WRITE_DB_DATABASE}.PO_Goods_Receipt a  
                where a.org_id='${org_id}' and a.branch_id='${branch_id}' and a.receipt_date='${old_eod_date}' 
                and a.org_id=b.org_id and a.branch_id=b.branch_id and a.item_code=b.product_id and b.trans_date='${old_eod_date}'  
                group by item_code ) `);
                
                return resolve(old_eod_date);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateGoodReceiptInventory Error :", err);
                return reject(err_code);
            }
        })
    }

    updateInvoiceInventory(connection,  org_id, branch_id, old_eod_date) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                debug("2 --->updateInvoiceInventory  :" );

                await connection.query(` update ${process.env.WRITE_DB_DATABASE}.Swastha_Daily_inventory c set sold_stock = (
                    Select sum(product_qty) from  ${process.env.WRITE_DB_DATABASE}.Billing_Detail a,  ${process.env.WRITE_DB_DATABASE}.Billing_Header b 
                    where a.org_id='${org_id}' and a.branch_id='${branch_id}' and a.org_id=b.org_id and a.branch_id=b.branch_id and a.invoice_no=b.invoice_no 
                     and  b.inv_date='${old_eod_date}' and  a.org_id=c.org_id and a.branch_id=c.branch_id and a.product_id=c.product_id and c.trans_date='${old_eod_date}' 
                     group by product_id   )`);
                   
                return resolve(old_eod_date);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateInvoiceUpdateInventory Error :", err);
                return reject(err_code);
            }
        })
    }

    updateInvoiceProductInventory(connection,  org_id, branch_id, old_eod_date) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                debug("3 --->updateInvoiceProductInventory  :" );
                await connection.query(`update  ${process.env.WRITE_DB_DATABASE}.Swastha_Daily_inventory d set sold_stock = sold_stock + 
                (Select sum(c.qty_impact) from  ${process.env.WRITE_DB_DATABASE}.Billing_Detail a,  ${process.env.WRITE_DB_DATABASE}.Billing_Header b,
                ${process.env.WRITE_DB_DATABASE}.Swastha_Inventory_Product_Map c
                where a.org_id='${org_id}' and a.branch_id='${branch_id}' 
                  and a.org_id=b.org_id and a.branch_id=b.branch_id and a.invoice_no=b.invoice_no
                 and  b.inv_date='${old_eod_date}'   
                 and  a.org_id=c.org_id and a.branch_id=c.branch_id and a.product_id=c.source_product_id 
                 and  a.org_id=d.org_id and a.branch_id=d.branch_id and d.product_id=c.target_product_id and d.trans_date ='${old_eod_date}'
                 group by c.target_product_id )`);
               
                return resolve(old_eod_date);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateInvoiceUpdateInventory Error :", err);
                return reject(err_code);
            }
        })
    }
   
    updateInvoiceCloseStockInventory(connection,  org_id, branch_id, old_eod_date) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                debug("4 --->updateInvoiceCloseStockInventory  :" );
                await connection.query(` update ${process.env.WRITE_DB_DATABASE}.Swastha_Daily_inventory 
                set close_stock=if(isnull(open_stock),0,open_stock)+if(isnull(received_stock),0,received_stock)-if(isnull(sold_stock),0,sold_stock) 
               where org_id='${org_id}' and branch_id='${branch_id}' and trans_date='${old_eod_date}'`);
               
                return resolve(old_eod_date);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateInvoiceCloseStockInventory Error :", err);
                return reject(err_code);
            }
        })
    }

    createInventoryBase(connection,  org_id, branch_id, new_eod_date, old_eod_date) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                debug("5 --->createInventoryBase  :" );
                await connection.query(`Insert into ${process.env.WRITE_DB_DATABASE}.Swastha_Daily_inventory (org_id,branch_id,product_id,trans_date,open_stock,received_stock,sold_stock,close_stock)
                select a.org_id,a.branch_id,a.product_id, '${new_eod_date}' trans_date, if(isnull(close_stock),0,close_stock), 0,0,0
                from ${process.env.WRITE_DB_DATABASE}.Swastha_Inventory_Config a left join  ${process.env.WRITE_DB_DATABASE}.Swastha_Daily_inventory b 
                on a.org_id='${org_id}' and a.branch_id='${branch_id}' and a.part_of_inventory="Y" 
                  and a.org_id=b.org_id and a.branch_id=b.branch_id and a.product_id=b.product_id and b.trans_date='${old_eod_date}'`);
               
                return resolve(old_eod_date);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateInvoiceCloseStockInventory Error :", err);
                return reject(err_code);
            }
        })
    }

    // Inventory End




   

}

module.exports = {
    MasterDao
}
const mysql = require('../../common/db_utils');
var debug = require('debug')('v2:billing:dao');
const BaseDao = require('./base_dao');

class BillingDao extends BaseDao {

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

    createBillingHeader(connection, billing_header_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Billing_Header SET ?`, billing_header_data);
                debug('COMMIT at createBilling');
                return resolve(billing_header_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create Billing error :", err);
                return reject(err_code);
            }
        })
    }

    createBillingDetail(connection, set_billing_detail) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Billing_Detail SET ?`, set_billing_detail);
                debug('COMMIT at createBilling');
                return resolve(set_billing_detail);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create Billing error :", err);
                return reject(err_code);
            }
        })
    }

    updateBillingHeader(connection, update_billing_header, invoice_no) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Billing_Header SET ? WHERE invoice_no='${invoice_no}'`, update_billing_header);
                debug('COMMIT at updateBilling');
                return resolve(update_billing_header);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateBillingHeader Error :", err);
                return reject(err_code);
            }
        })
    }

    getBillingByBranchId(connection, branch_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE branch_id='${branch_id}' AND patient_id='${query.filter.patient_id}' AND inv_status='P'`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE branch_id='${branch_id}' AND doctor_id='${query.filter.doctor_id}' AND inv_status='P'`;
                }
                else{
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE branch_id='${branch_id}' AND inv_status='P'`;
                }
                debug("getBillingByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Billing Not Found!.", developerMessage: "Sorry, Billing Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getBillingByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getCountBillingByBranchId(connection, branch_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE branch_id='${branch_id}' AND patient_id='${query.filter.patient_id}' AND inv_status='P'`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE branch_id='${branch_id}' AND doctor_id='${query.filter.doctor_id}' AND inv_status='P'`;
                }
                else{
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE branch_id='${branch_id}' AND inv_status='P'`;
                }
                debug("getCountBillingByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
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
                debug('getCountBillingByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getBillingHead(connection, invoice_no) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE invoice_no='${invoice_no}'`;
                debug("getBillingHead", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Billing Data Not Available!.", developerMessage: "Sorry,Billing Data Not Available!." };
                    return resolve(error_code)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres));
                    var response = res[0];
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getBillingHead error :', error)
                return reject(err_code);
            }
        })
    }

    getBillingDetail(connection, invoice_no) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Detail WHERE invoice_no='${invoice_no}'`;
                debug("getBillingDetail", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Billing Data Not Available!.", developerMessage: "Sorry,Billing Data Not Available!." };
                    return resolve(error_code);
                }
                else{
                    return resolve(queryres);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getBillingDetail error :', error)
                return reject(err_code);
            }
        })
    }

    getBillingByOrgId(connection, org_id, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND patient_id='${query.filter.patient_id}' AND inv_status='P'`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND doctor_id='${query.filter.doctor_id}' AND inv_status='P'`;
                }
                else if(query.filter.branch_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND branch_id='${query.filter.branch_id}' AND inv_status='P'`;
                }
                else{
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND inv_status='P'`;
                }
                debug("getBillingByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Billing Not Found!.", developerMessage: "Sorry, Billing Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getBillingByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getCountBillingByOrgId(connection, org_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND patient_id='${query.filter.patient_id}' AND inv_status='P'`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND doctor_id='${query.filter.doctor_id}' AND inv_status='P'`;
                }
                else if(query.filter.branch_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND branch_id='${query.filter.branch_id}' AND inv_status='P'`;
                }
                else{
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${org_id}' AND inv_status='P'`;
                }
                debug("getCountBillingByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
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
                debug('getCountBillingByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getInvoiceNo(connection, branch_id, seq_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }

                var custQuery = `SELECT concat(concat(seq_type,branch_id),LPAD(last_seq_no+1,10,'0')) as invoice_no ,last_seq_no+1 as last_seq_no 
                FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator WHERE branch_id='${branch_id}' AND seq_type='${seq_type}'`;
                debug("getInvoiceNo", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug("Firtst time");
                    var new_patient_data = {
                        seq_type: seq_type,
                        branch_id: branch_id,
                        last_seq_no: 0,
                        branch_pad: 'Y'
                    }
                    await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator SET ?`, new_patient_data);

                    var newpatientquery = `SELECT concat(concat(seq_type,branch_id),LPAD(0,10,'0')) as invoice_no ,last_seq_no as last_seq_no 
                    FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator WHERE branch_id='${branch_id}' AND seq_type='${seq_type}'`;

                    debug("getInvoiceNo", newpatientquery)
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
                    WHERE  branch_id='${branch_id}' AND seq_type='${seq_type}'`);
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

    getPatientBillingData(connection, get_patient_data, patient_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT sum(net_inv_amount) AS net_inv_amount,sum(net_inv_paid) AS net_inv_paid, sum(net_inv_balance) AS net_inv_balance 
                FROM ${process.env.WRITE_DB_DATABASE}.Billing_Header WHERE org_id='${get_patient_data.org_id}' AND  branch_id='${get_patient_data.branch_id}' 
                AND patient_id='${patient_id}' AND inv_status='P' group by patient_id`;
                
                debug("getBillingByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    return resolve(null)
                }
                else{
                    var _response = JSON.parse(JSON.stringify(queryres));
                    var response = _response[0];
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getBillingByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getPaymentMaxNumber(connection, data) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT max(payment_num) AS payment_num FROM ${process.env.WRITE_DB_DATABASE}.Billing_Payment_Detail WHERE org_id='${data.org_id}' AND 
                branch_id='${data.branch_id}' AND invoice_no='${data.invoice_no}' AND inv_srl_no='${data.inv_srl_no}'`;
                
                debug("getBillingByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    return resolve(null)
                }
                else{
                    var _response = JSON.parse(JSON.stringify(queryres));
                    var response = _response[0];
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getBillingByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    getBillingDtl(connection, invoice_no, inv_srl_no) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Billing_Detail WHERE invoice_no='${invoice_no}' AND inv_srl_no='${inv_srl_no}'`;
                debug("getBillingDtl", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    return resolve(null);
                }
                else{
                    var _response = JSON.parse(JSON.stringify(queryres));
                    var response = _response[0];
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getBillingDtl error :', error)
                return reject(err_code);
            }
        })
    }

    createBillingPaymentDetail(connection, billing_payment_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Billing_Payment_Detail SET ?`, billing_payment_data);
                debug('COMMIT at createBilling');
                return resolve(billing_payment_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create Billing error :", err);
                return reject(err_code);
            }
        })
    }

    updateBillingDetail(connection, update_billing_detail, invoice_no, inv_srl_no) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Billing_Detail SET ? WHERE invoice_no='${invoice_no}' AND inv_srl_no='${inv_srl_no}'`, update_billing_detail);
                debug('COMMIT at updateBillingDetail');
                return resolve(update_billing_detail);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateBillingDetail Error :", err);
                return reject(err_code);
            }
        })
    }

    updateBillingDtl(connection, update_billing_detail, invoice_no) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Billing_Detail SET ? WHERE invoice_no='${invoice_no}'`, update_billing_detail);
                debug('COMMIT at updateBillingDetail');
                return resolve(update_billing_detail);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateBillingDetail Error :", err);
                return reject(err_code);
            }
        })
    }

    getTotalBillingDetailCount(connection, invoice_no) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Billing_Detail WHERE invoice_no='${invoice_no}'`;
                debug("getTotalBillingDetailCount", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Billing Not Found!.', queryres);
                    return resolve(0);
                }
                else{
                    var _response = JSON.parse(JSON.stringify(queryres));
                    var response = _response[0].count;
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getTotalBillingDetailCount error :', error)
                return reject(err_code);
            }
        })
    }
}

module.exports = {
    BillingDao
}
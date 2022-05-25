const mysql = require('../../common/db_utils');
var debug = require('debug')('v2:consulting:dao');
const BaseDao = require('./base_dao');

class ConsultDao extends BaseDao {

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

    createConsultingHeader(connection, consulting_header_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header SET ?`, consulting_header_data);
                debug('COMMIT at createBilling');
                return resolve(consulting_header_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create Billing error :", err);
                return reject(err_code);
            }
        })
    }

    createDialysisConsulting(connection, dialysis_consult_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Dialysis_Detail SET ?`, dialysis_consult_data);
                debug('COMMIT at createBilling');
                return resolve(dialysis_consult_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create Billing error :", err);
                return reject(err_code);
            }
        })
    }

    updateDialysisConsulting(connection, set_pat_dialysis_consult_data, get_consult) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Dialysis_Detail SET ? WHERE visit_no='${get_consult.visit_no}' AND patient_id='${get_consult.patient_id}'`, set_pat_dialysis_consult_data);
                debug('COMMIT at updateDialysisConsulting');
                return resolve(set_pat_dialysis_consult_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateDialysisConsulting Error :", err);
                return reject(err_code);
            }
        })
    }

    getConsultVisitMaxNumber(connection, data) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT max(visit_no) AS visit_no FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header  WHERE patient_id='${data.patient_id}'`;
                
                debug("getConsultVisitMaxNumber", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Visit NO Not Found!.', queryres);
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
                debug('getConsultVisitMaxNumber Error :', error)
                return reject(err_code);
            }
        })
    }
    
    getConsultingPrevDate(connection, patient_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE patient_id='${patient_id}' ORDER BY visit_no DESC Limit 0,1`;
                debug("getConsultingHead", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Consult Data Not Available!.", developerMessage: "Sorry,Consult Data Not Available!." };
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
                debug('getConsultingHead error :', error)
                return reject(err_code);
            }
        })
    }

    getConsultingHead(connection, visit_no) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE visit_no='${visit_no}'`;
                debug("getConsultingHead", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Consult Data Not Available!.", developerMessage: "Sorry,Consult Data Not Available!." };
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
                debug('getConsultingHead error :', error)
                return reject(err_code);
            }
        })
    }

    getConsultingPatientHead(connection, visit_no, patient_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE visit_no='${visit_no}' AND patient_id='${patient_id}'`;
                debug("getConsultingPatientHead", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Consult Data Not Available!.", developerMessage: "Sorry,Consult Data Not Available!." };
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
                debug('getConsultingPatientHead error :', error)
                return reject(err_code);
            }
        })
    }

    GetConsultingListsByBranchId(connection, branch_id, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE branch_id='${branch_id}' AND 
                    patient_id='${query.filter.patient_id}' LIMIT ${strPagination}`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE branch_id='${branch_id}' AND 
                    doctor_id='${query.filter.doctor_id}' LIMIT ${strPagination}`;
                }
                else{
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE branch_id='${branch_id}' LIMIT ${strPagination}`;
                }
                debug("GetConsultingListsByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Consult Data Not Found!.", developerMessage: "Sorry, Consult Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('GetConsultingListsByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    GetCountConsultingListsByBranchId(connection, branch_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE branch_id='${branch_id}' AND patient_id='${query.filter.patient_id}'`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE branch_id='${branch_id}' AND doctor_id='${query.filter.doctor_id}'`;
                }
                else{
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE branch_id='${branch_id}'`;
                }
                debug("GetCountConsultingListsByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
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
                debug('GetCountConsultingListsByBranchId Error :', error)
                return reject(err_code);
            }
        })
    }

    GetConsultingListsByOrgId(connection, org_id, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}' AND 
                    patient_id='${query.filter.patient_id}' LIMIT ${strPagination}`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}' AND 
                    doctor_id='${query.filter.doctor_id}' LIMIT ${strPagination}`;
                }
                else if(query.filter.branch_id) {
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}' AND 
                    branch_id='${query.filter.branch_id}' LIMIT ${strPagination}`;
                }
                else{
                    custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}'`;
                }
                debug("GetConsultingListsByOrgId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Consult Data Not Found!.", developerMessage: "Sorry, Consult Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('GetConsultingListsByOrgId Error :', error)
                return reject(err_code);
            }
        })
    }

    GetCountConsultingListsByOrgId(connection, org_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                var custQuery;
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                if(query.filter.patient_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}' AND patient_id='${query.filter.patient_id}'`;
                }
                else if(query.filter.doctor_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}' AND doctor_id='${query.filter.doctor_id}'`;
                }
                else if(query.filter.branch_id) {
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}' AND branch_id='${query.filter.branch_id}'`;
                }
                else{
                    custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Header WHERE org_id='${org_id}'`;
                }
                debug("GetCountConsultingListsByOrgId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
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
                debug('GetCountConsultingListsByOrgId Error :', error)
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

    getDialysisConsultData(connection, visit_no, patient_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Dialysis_Detail WHERE visit_no='${visit_no}' AND patient_id='${patient_id}'`;
                debug("getConsultingHead", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    return resolve(null)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres));
                    var response = res[0];
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getConsultingHead error :', error)
                return reject(err_code);
            }
        })
    }

    GetPatientDailysisList(connection, patient_id, query, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Dialysis_Detail WHERE patient_id='${patient_id}' LIMIT ${strPagination}`;
                debug("getConsultingHead", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Consult Dialysis Data Not Found!.", developerMessage: "Sorry, Consult Dialysis Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getConsultingHead error :', error)
                return reject(err_code);
            }
        })
    }

    GetCountPatientDailysisList(connection, patient_id, query) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Dialysis_Detail WHERE patient_id='${patient_id}'`;
                debug("GetCountPatientDailysisList", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
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
                debug('GetCountPatientDailysisList error :', error)
                return reject(err_code);
            }
        })
    }

    getConsultingLabPatient(connection, visit_no, patient_id, test_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Lab_Detail WHERE visit_no='${visit_no}' AND 
                patient_id='${patient_id}' AND test_id='${test_id}'`;
                debug("getConsultingLabPatient", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Consult Data Not Available!.", developerMessage: "Sorry,Consult Data Not Available!." };
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
                debug('getConsultingLabPatient error :', error)
                return reject(err_code);
            }
        })
    }

    createLabConsulting(connection, lab_consult_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Lab_Detail SET ?`, lab_consult_data);
                debug('COMMIT at createLabConsulting');
                return resolve(lab_consult_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("createLabConsulting error :", err);
                return reject(err_code);
            }
        })
    }

    updateLabConsulting(connection, set_pat_lab_consult_data, get_consult) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Lab_Detail SET ? WHERE visit_no='${get_consult.visit_no}' 
                AND patient_id='${get_consult.patient_id}' AND test_id='${get_consult.test_id}'`, set_pat_lab_consult_data);
                debug('COMMIT at updateLabConsulting');
                return resolve(set_pat_lab_consult_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateLabConsulting Error :", err);
                return reject(err_code);
            }
        })
    }

    getLatestLabLists(connection, patient_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT max(visit_no) AS visit_no FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Lab_Detail WHERE patient_id='${patient_id}'`;
                debug("GetPatientLabList", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    return resolve(0);
                }
                else{
                    var _response = JSON.parse(JSON.stringify(queryres));
                    var response = _response[0].visit_no;
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('GetPatientLabList error :', error)
                return reject(err_code);
            }
        })
    }

    GetPatientLabList(connection, patient_id, query, visit_no, strPagination) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Lab_Detail WHERE patient_id='${patient_id}' AND visit_no='${visit_no}' LIMIT ${strPagination}`;
                debug("GetPatientLabList", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Consult Lab Data Not Found!.", developerMessage: "Sorry, Consult Lab Data Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('GetPatientLabList error :', error)
                return reject(err_code);
            }
        })
    }

    GetCountPatientLabList(connection, patient_id, query, visit_no) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) AS count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Consult_Lab_Detail WHERE patient_id='${patient_id}' AND visit_no='${visit_no}'`;
                debug("GetCountPatientLabList", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Consult Not Found!.', queryres);
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
                debug('GetCountPatientLabList error :', error)
                return reject(err_code);
            }
        })
    }
}

module.exports = {
    ConsultDao
}
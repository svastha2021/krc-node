const mysql = require('../../common/db_utils');
var debug = require('debug')('v2:patients:dao');
const BaseDao = require('./base_dao');

class PatientDao extends BaseDao {

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

    getPatientEmail(connection, email_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE email_id='${email_id}'`;
                debug("getPatienEmail", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
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
                debug('getPatienEmail Error :', error)
                return reject(err_code);
            }
        })
    }

    getPatientId(connection, patient_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT *,(SELECT ref_desc FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master where 
                ref_type='PATTYP' AND ref_code=Patient_Master.patient_type) as patient_type_name FROM 
                ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE patient_id='${patient_id}'`;
                debug("getPatientMobile", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
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
                debug('getPatientMobile Error :', error)
                return reject(err_code);
            }
        })
    }

    getPatientMobile(connection, mobile_no) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE mobile_no='${mobile_no}'`;
                debug("getPatientMobile", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
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
                debug('getPatientMobile Error :', error)
                return reject(err_code);
            }
        })
    }

    getPatientMobileByBranchId(connection, mobile_no, branch_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT a.* ,b.ref_desc as patient_type_name  FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master a, 
                ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master b  WHERE a.patient_type=b.ref_code and b.ref_type="PATTYP" and  a.mobile_no='${mobile_no}' AND a.branch_id='${branch_id}'`;
                debug("getPatientMobile", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getPatientMobile Error :', error)
                return reject(err_code);
            }
        })
    }

    getPatientNameByBranchId(connection, patient_name, branch_id) {
        return new Promise(async(resolve, reject)=> {
            var pat_name='%'+patient_name+'%';
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE patient_name LIKE '${pat_name}' AND branch_id='${branch_id}'`;
                debug("getPatientMobile", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getPatientMobile Error :', error)
                return reject(err_code);
            }
        })
    }
    
    getPatientidByBranchId(connection, patient_id, branch_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT a.* ,b.ref_desc as patient_type_name  FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master a, 
                ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master b  WHERE a.patient_type=b.ref_code and b.ref_type="PATTYP" and  patient_id='${patient_id}' AND a.branch_id='${branch_id}'`;
               
               // var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE patient_id='${patient_id}' AND branch_id='${branch_id}'`;
                debug("getPatientidByBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
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
                debug('getPatientidByBranchId error :', error)
                return reject(err_code);
            }
        })
    }

    getPatientidByPatientId(connection, patient_id, branch_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT a.* ,b.ref_desc as patient_type_name  FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master a, 
                ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master b  WHERE a.patient_type=b.ref_code and b.ref_type="PATTYP" and  patient_id='${patient_id}' `;
               
                
              //  var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE patient_id='${patient_id}' AND branch_id='${branch_id}'`;
                debug("getPatientid", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getPatientid error :', error)
                return reject(err_code);
            }
        })
    }

    getPatientbyBranchId(connection, branch_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT a.* ,b.ref_desc as patient_type_name  FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master a, 
                ${process.env.WRITE_DB_DATABASE}.Swastha_Ref_Master b  WHERE a.patient_type=b.ref_code and b.ref_type="PATTYP"  AND a.branch_id='${branch_id}'`;
               
             //   var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE branch_id='${branch_id}'`;
                debug("getPatientbyBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
                    return resolve(error_code)
                }
                else{
                    return resolve(queryres);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getPatientbyBranchId error :', error)
                return reject(err_code);
            }
        })
    }

    getCountPatientbyBranchId(connection, branch_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT COUNT(*) as count FROM ${process.env.WRITE_DB_DATABASE}.Patient_Master WHERE branch_id='${branch_id}'`;
                debug("getCountPatientbyBranchId", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, User Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry, Patient Not Found!.", developerMessage: "Sorry, Patient Not Found!." };
                    return resolve(error_code)
                }
                else{
                    var res = JSON.parse(JSON.stringify(queryres))
                    var response = res[0].count;
                    return resolve(response)
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getCountPatientbyBranchId error :', error)
                return reject(err_code);
            }
        })
    }

    createPatient(connection, patient_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Patient_Master SET ?`, patient_data);
                debug('COMMIT at createPatient');
                return resolve(patient_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create Customer Error :", err);
                return reject(err_code);
            }
        })
    }

    getPatientIdByPAT(connection, branch_id, seq_type) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }

                var custQuery = `SELECT concat(concat(seq_type,branch_id),LPAD(last_seq_no+1,5,'0')) as patient_id ,last_seq_no+1 as last_seq_no 
                FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator WHERE branch_id='${branch_id}' AND seq_type='${seq_type}'`;
                debug("getPatientIdByPAT", custQuery)
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

                    var newpatientquery = `SELECT concat(concat(seq_type,branch_id),LPAD(0,5,'0')) as patient_id ,last_seq_no as last_seq_no 
                    FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator WHERE branch_id='${branch_id}' AND seq_type='${seq_type}'`;

                    debug("getPatientIdByPAT", newpatientquery)
                    let queryres_newpatientquery = await connection.query(newpatientquery);
                    if(queryres.length == 0) {
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

                    `update Swastha_Seq_Generator set last_seq_no=2  where branch_id='KRC001' and seq_type='PAT';`
                    await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Swastha_Seq_Generator SET last_seq_no=${response.last_seq_no} 
                    WHERE  branch_id='${branch_id}' AND seq_type='${seq_type}'`);
                    return resolve(response);
                }
            }
            catch(error) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug('getPatientIdByPAT error :', error)
                return reject(err_code);
            }
        })
    }

    updatePatient(connection, update_patient_data, patient_id) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Patient_Master SET ? WHERE patient_id='${patient_id}'`, update_patient_data);
                debug('COMMIT at createPatient');
                return resolve(update_patient_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create Customer Error :", err);
                return reject(err_code);
            }
        })
    }

    updateAppointByphoneno(connection, phone_no, patient_id) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Patient_Appt_Details SET patient_id='${patient_id}' WHERE patient_id is null and phone_no='${phone_no}'`);
                debug('COMMIT at updateAppointByphoneno');
                return resolve(phone_no);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateAppointByphoneno error :", err);
                return resolve(err_code);
            }
        })
    }


    //Create Schedule

    createSchedule(connection, schedule_data) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`INSERT INTO ${process.env.WRITE_DB_DATABASE}.Swastha_Patient_Schedule SET ?`, schedule_data);
                debug('COMMIT at createSchedule'+schedule_data);
                return resolve(schedule_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("create createSchedule Error :", err);
                return reject(err_code);
            }
        })
    }

    updateSchedule(connection, updateschedule_data, patient_id, bu_id, schedule_num) {
        return new Promise(async(resolve, reject) => {
            try {
                if(connection == null ) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage:"DB Connection Failed!." };
                    return reject (err_code)
                }
                await connection.query(`UPDATE ${process.env.WRITE_DB_DATABASE}.Swastha_Patient_Schedule SET ? WHERE patient_id='${patient_id}' 
                and bu_id='${bu_id}' and schedule_num='${schedule_num}'`, updateschedule_data);
                debug('COMMIT at updateSchedule');
                return resolve(updateschedule_data);
            }
            catch (err) {
                var err_code = { status: 500, code: 5001, message: "Sorry, Internal Server Error!.", developerMessage:"Sorry, Internal Server Error!." };
                debug("updateScheduler Error :", err);
                return reject(err_code);
            }
        })
    }

    getSchedulbyNumber(connection,branch_id, patient_id, bu_id,schedule_num) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT d.org_id,d.branch_id,DATE_FORMAT(d.schedule_date,'%Y-%m-%d') as schedule_date,DATE_FORMAT(d.planned_date,'%Y-%m-%d') as planned_date,
                d.schedule_ver,d.schedule_num,d.bu_id,d.patient_id,DATE_FORMAT(d.actual_date,'%Y-%m-%d') as actual_date ,d.schedule_purpose,d.visit_flag,addl_remarks FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Patient_Schedule d 
                WHERE d.branch_id='${branch_id}' and d.patient_id='${patient_id}' and d.bu_id='${bu_id}' and d.schedule_num=${schedule_num}`;
    
               
                debug("getSchedulNumber", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Data Not Available!.", developerMessage: "Sorry,Data Not Available!." };
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
                debug('getPoNumber error :', error)
                return reject(err_code);
            }
        })
    }

    getSchedulbyNumberUpdate(connection,branch_id, patient_id, bu_id,schedule_num) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT * FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Patient_Schedule d 
                WHERE d.branch_id='${branch_id}' and d.patient_id='${patient_id}' and d.bu_id='${bu_id}' and d.schedule_num=${schedule_num}`;
    
               
                debug("getSchedulNumber", custQuery)
                let queryres = await connection.query(custQuery);
                if(queryres.length == 0) {
                    debug('Sorry, Data Not Found!.', queryres);
                    var error_code = { status: 404, code: 4001, message: "Sorry,Data Not Available!.", developerMessage: "Sorry,Data Not Available!." };
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
                debug('getPoNumber error :', error)
                return reject(err_code);
            }
        })
    }

    
   


    getMaxScheduleNumber(connection,  org_id, branch_id, patient_id, bu_id) {
        return new Promise(async(resolve, reject)=> {
            try{
                if(connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!", developerMessage:"DB Connection Failed!"};
                    return reject(err_code);
                }
                var custQuery = `SELECT max(schedule_num) AS schedule_num FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Patient_Schedule WHERE org_id='${org_id}' AND 
                branch_id='${branch_id}' and  patient_id='${patient_id}' AND bu_id='${bu_id}'`;
                
                debug("getMaxScheduleNumber", custQuery)
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
                debug('getMaxScheduleNumber Error :', error)
                return reject(err_code);
            }
        })
    }

    getScheduleList(connection,  org_id, branch_id, patient_id, bu_id) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                var custQuery = `SELECT d.org_id,d.branch_id,DATE_FORMAT(d.schedule_date,'%Y-%m-%d') as schedule_date,DATE_FORMAT(d.planned_date,'%Y-%m-%d') as planned_date,
                (SELECT ref_desc FROM swastha_hms.Swastha_Ref_Master where ref_type='SCHTYP' and ref_code=d.visit_flag) as visit_flag_name,
                d.schedule_ver,d.schedule_num,d.bu_id,d.patient_id,DATE_FORMAT(d.actual_date,'%Y-%m-%d') as actual_date ,d.schedule_purpose,d.visit_flag,addl_remarks FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Patient_Schedule d 
                WHERE d.org_id='${org_id}' and d.branch_id='${branch_id}' and d.patient_id='${patient_id}' and d.bu_id='${bu_id}'`;
    
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


    getScheduleListByMonth(connection,  org_id, branch_id, patient_id, bu_id, month, year) {
        return new Promise(async (resolve, reject) => {
            try {
                if (connection == null) {
                    var err_code = { status: 500, code: 5001, message: "DB Connection Failed!.", developerMessage: "DB Connection Failed!." };
                    return reject(err_code)
                }
                var custQuery = `SELECT d.org_id,d.branch_id,DATE_FORMAT(d.schedule_date,'%Y-%m-%d') as schedule_date,DATE_FORMAT(d.planned_date,'%Y-%m-%d') as planned_date,
                (SELECT ref_desc FROM swastha_hms.Swastha_Ref_Master where ref_type='SCHTYP' and ref_code=d.visit_flag) as visit_flag_name,
                d.schedule_ver,d.schedule_num,d.bu_id,d.patient_id,DATE_FORMAT(d.actual_date,'%Y-%m-%d') as actual_date ,d.schedule_purpose,d.visit_flag,addl_remarks FROM ${process.env.WRITE_DB_DATABASE}.Swastha_Patient_Schedule d 
                WHERE d.org_id='${org_id}' and d.branch_id='${branch_id}' and d.patient_id='${patient_id}' and d.bu_id='${bu_id}' and month(d.schedule_date)=${month} and year(d.schedule_date)=${year} and visit_flag<>'C'`;
    
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
   
}

module.exports = {
    PatientDao
}
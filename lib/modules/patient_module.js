const { PatientDao } = require('../dao/patient_dao');
var debug = require('debug')('v2:patients:module');
const {changeLog} = require('../../common/error_handling');
var moment = require('moment-timezone');
const { GetRandomPatientID } = require('../../common/app_utils');

function generateParamString(query) {
    var key;
    var keys = new Array();
    var values = new Array();

    for (key in query.filter) {
        if (query.filter.hasOwnProperty(key)) {
            keys.push(key);
            values.push(query.filter[key])
        }
    }
    var strParams = '';

    for (i = 0; i < keys.length; i++) {
        var str = (keys.length - 1 != i) ? ' && ' : '';
        strParams += keys[i] + '=' + values[i] + str

    }
    // console.log('Parameters for query :',strParams)
    return strParams;
}

function generateSortOrder(query) {
    var key;
    var keys = new Array();
    var values = new Array();

    for (key in query.sort) {
        if (query.sort.hasOwnProperty(key)) {
            keys.push(key);
            values.push(query.sort[key])
        }
    }
    var strSortParams = ' ORDER BY ';

    for (i = 0; i < keys.length; i++) {
        var order = (values[i] == '-1') ? 'DESC' : 'ASC';
        var str = (keys.length - 1 != i) ? ', ' : '';
        strSortParams += keys[i] + ' ' + order + str
    }

    // console.log('Parameters for Sorting :',strSortParams)
    return strSortParams;
}

class PatientModule {

    createPatient(data,  query) {
        return new Promise(async (resolve, reject) => {
            var patientDao = new PatientDao();
            var read_connection = null;
            var set_patient, get_patient, error_code, user_data, response;
            var returnResponse;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            try {
                read_connection = await patientDao.getReadConnection();
                /* if(data.hasOwnProperty('email_id')) {
                    get_patient = await patientDao.getPatientEmail(read_connection, data.email_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        get_patient = await patientDao.getPatientMobile(read_connection, data.mobile_no);
                        if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                            user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                            set_patient = await patientDao.createPatient(read_connection, user_data);
                            response = { patient: user_data };
                            if (read_connection) {
                                await patientDao.releaseReadConnection(read_connection);
                            }
                            return resolve(response);
                        }
                        else{
                            error_code = { status: 404, code: 4001, message: "Sorry, Patient Already Exists!.", developerMessage: "Sorry, Patient Already Exists!." };
                            if (read_connection) {
                                await patientDao.releaseReadConnection(read_connection);
                            }
                            return resolve(error_code)
                        }
                    }
                    else{
                        if(data.hasOwnProperty('mobile_no')) {
                            get_patient = await patientDao.getPatientMobile(read_connection, data.mobile_no);
                            if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                                user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                                set_patient = await patientDao.createPatient(read_connection, user_data);
                                response = { patient: user_data };
                                if (read_connection) {
                                    await patientDao.releaseReadConnection(read_connection);
                                }
                                return resolve(response);
                            }
                            else{
                                error_code = { status: 404, code: 4001, message: "Sorry, Patient Already Exists!.", developerMessage: "Sorry, Patient Already Exists!." };
                                if (read_connection) {
                                    await patientDao.releaseReadConnection(read_connection);
                                }
                                return resolve(error_code)
                            }
                        }
                        else{
                            user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                                set_patient = await patientDao.createPatient(read_connection, user_data);
                                response = { patient: user_data };
                                if (read_connection) {
                                    await patientDao.releaseReadConnection(read_connection);
                                }
                                return resolve(response);
                        }
                    }
                }else{ */
                    if(data.hasOwnProperty("reapproval") && data.reapproval.toUpperCase() == 'Y') {
                        user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                        set_patient = await patientDao.createPatient(read_connection, user_data);
                        response = { patient: user_data };
                        if (read_connection) {
                            await patientDao.releaseReadConnection(read_connection);
                        }
                        return resolve(response);
                    }
                    else{
                        if(data.hasOwnProperty('mobile_no')) {
                            get_patient = await patientDao.getPatientMobile(read_connection, data.mobile_no);
                            if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                                user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                                set_patient = await patientDao.createPatient(read_connection, user_data);
                                response = { patient: user_data };
                                if (read_connection) {
                                    await patientDao.releaseReadConnection(read_connection);
                                }
                                return resolve(response);
                            }
                            else{
                                error_code = { status: 404, code: 4001, message: "Sorry, Patient Mobile No Already Exists!.", developerMessage: "Sorry, Patient Mobile No Already Exists!." };
                                if (read_connection) {
                                    await patientDao.releaseReadConnection(read_connection);
                                }
                                return resolve(error_code)
                            }
                        }
                        else{
                            error_code = { status: 404, code: 4001, message: "Sorry, Patient Mobile No Already Exists!.", developerMessage: "Sorry, Patient Mobile No Already Exists!." };
                            if (read_connection) {
                                await patientDao.releaseReadConnection(read_connection);
                            }
                            return resolve(error_code)
                        }
                    }
                // }
            }
            catch (error) {
                if (read_connection) {
                    await patientDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    getPatient(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var patientDao = new PatientDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_patient, get_patient_count, results;
            
            try {
                connection = await patientDao.getReadConnection();
                debug("query.filter", query)
                if(query.filter.hasOwnProperty('mobile_no')) {
                    get_patient = await patientDao.getPatientMobileByBranchId(connection, query.filter.mobile_no, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await patientDao.releaseReadConnection(connection);
                        }
                        return resolve(get_patient);
                    }
                    else{
                        var total_size = 1;
                        var page_size = 1;
                        var result_size = 1;
                        // var total_size = query.limit?query.limit:results.length;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_patient
                        }
                        if (connection) {
                            await patientDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else if(query.filter.hasOwnProperty('patient_id')) {
                    get_patient = await patientDao.getPatientidByPatientId(connection, query.filter.patient_id, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await patientDao.releaseReadConnection(connection);
                        }
                        return resolve(get_patient);
                    }
                    else{
                        var total_size = 1;
                        var page_size = 1;
                        var result_size = 1;
                        // var total_size = query.limit?query.limit:results.length;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_patient
                        }
                        if (connection) {
                            await patientDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else{
                    get_patient = await patientDao.getPatientbyBranchId(connection, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await patientDao.releaseReadConnection(connection);
                        }
                        return resolve(get_patient);
                    }
                    else{
                        get_patient_count = await patientDao.getCountPatientbyBranchId(connection, branch_id);

                        var total_size = get_patient_count;
                        var page_size = query.skip ? query.skip : get_patient_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_patient
                        }
                        if (connection) {
                            await patientDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await patientDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    updatePatient(data, patient_id, query){
        return new Promise(async (resolve, reject) => {
            var patientDao = new PatientDao();
            var read_connection = null;
            var set_patient, get_patient, user_data, response;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            try {
                read_connection = await patientDao.getReadConnection();
                get_patient = await patientDao.getPatientId(read_connection, patient_id);
                if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                    if (read_connection) {
                        await patientDao.releaseReadConnection(read_connection);
                    }
                    return resolve(get_patient)   
                }
                else{
                    user_data = await categories_data_to_schema_update_patient_data(data, date, get_patient);
                    set_patient = await patientDao.updatePatient(read_connection, user_data, patient_id);
                    response = { patient: user_data };
                    if (read_connection) {
                        await patientDao.releaseReadConnection(read_connection);
                    }
                    return resolve(response);
                }
            }
            catch (error) {
                if (read_connection) {
                    await patientDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }
}

function generateId(connection, data, seq_type) {
    return new Promise(async(resolve, reject) => {
        var patientDao = new PatientDao();
        var get_patient_id, patient_id;
        
        try{
            get_patient_id = await patientDao.getPatientIdByPAT(connection,data.branch_id, seq_type);
            if(get_patient_id != null) {
                patient_id = get_patient_id.patient_id;
                return resolve(patient_id);
            }
            else{
               return generateId(connection, data, seq_type)
            }
        }
        catch(error) {
            return reject(error)
        }
    })
}

function categories_data_to_schema_patient_data(connection, data, date) {
    return new Promise(async(resolve, reject) => {
        try {
            var dob, patientdob, first_visit_date, first_visitdate, patient_id, age;
            var seq_type='PAT';
            if(data.hasOwnProperty('dob')) {
                patientdob = new Date(data.dob);
                dob = moment(patientdob).utc().format("YYYY-MM-DD");
            }
            else{
                patientdob = new Date();
                dob = null;
            }
            if(data.hasOwnProperty('first_visit_date')) {
                first_visitdate = new Date(data.first_visit_date);
                first_visit_date = moment(first_visitdate).utc().format("YYYY-MM-DD");
            }
            else{
                first_visitdate = new Date();
                first_visit_date = moment(first_visitdate).utc().format("YYYY-MM-DD");
            }
            if(data.hasOwnProperty('age')) {
                if(data.age != null) {
                    var pattern = /^[0-9]$/;
                    var age_test = pattern.test(data.age);
                    if(age_test == true) {
                        age = data.age;
                    }
                    else{
                        age = null;
                    }
                }
                else{
                    age = null;
                }
            }
            else{
                age = null;
            }
            patient_id = await generateId(connection, data, seq_type)
            var patientdata = { 
                patient_id: patient_id,
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                patient_name: data.patient_name, 
                patient_photo: data.patient_photo, 
                dob: dob, 
                sex: data.sex, 
                mobile_no: data.mobile_no, 
                alt_mobile_no: data.alt_mobile_no, 
                email_id: data.email_id, 
                alt_email_id: data.alt_email_id, 
                first_visit_date: first_visit_date, 
                aadhar_no: data.aadhar_no, 
                patient_type: data.patient_type, 
                address: data.address, 
                communicate_address: data.communicate_address, 
                advance_amount_paid: data.advance_amount_paid, 
                advance_amount_balance: data.advance_amount_balance, 
                created_by: data.user_id, 
                created_date: date,
                updated_by: data.user_id, 
                updated_date: date,
                identity_mark:data.identity_mark,
                ailment:data.ailment,
                age: age,
                guardian_type:data.guardian_type,
                guardian_name:data.guardian_name,
                husband_name:data.husband_name,
                father_name:data.father_name,
                blood_group:data.blood_group
            }
            return resolve(patientdata)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_update_patient_data(data, date, get_patient) {
    return new Promise(async(resolve, reject) => {
        try {
            var dob, patientdob, first_visit_date, first_visitdate;
            if(data.hasOwnProperty('dob')) {
                patientdob = new Date(data.dob);
                dob = moment(patientdob).utc().format("YYYY-MM-DD");
            }
            else{
                dob = get_patient.dob;
            }
            if(data.hasOwnProperty('first_visit_date')) {
                first_visitdate = new Date(data.first_visit_date);
                first_visit_date = moment(first_visitdate).utc().format("YYYY-MM-DD");
            }
            else{
                first_visit_date = get_patient.first_visit_date;
            }
            var patientdata = {
                org_id: (data.hasOwnProperty('org_id'))?data.org_id:get_patient.org_id, 
                branch_id: (data.hasOwnProperty('branch_id'))?data.branch_id:get_patient.branch_id, 
                patient_name: (data.hasOwnProperty('patient_name'))?data.patient_name:get_patient.patient_name, 
                patient_photo: (data.hasOwnProperty('patient_photo'))?data.patient_photo:get_patient.patient_photo, 
                dob: dob, 
                sex: (data.hasOwnProperty('sex'))?data.sex:get_patient.sex, 
                mobile_no: (data.hasOwnProperty('mobile_no'))?data.mobile_no:get_patient.mobile_no, 
                alt_mobile_no: (data.hasOwnProperty('alt_mobile_no'))?data.alt_mobile_no:get_patient.alt_mobile_no, 
                email_id: (data.hasOwnProperty('email_id'))?data.email_id:get_patient.email_id, 
                alt_email_id: (data.hasOwnProperty('alt_email_id'))?data.alt_email_id:get_patient.alt_email_id, 
                first_visit_date: first_visit_date, 
                aadhar_no: (data.hasOwnProperty('aadhar_no'))?data.aadhar_no:get_patient.aadhar_no, 
                patient_type: (data.hasOwnProperty('patient_type'))?data.patient_type:get_patient.patient_type, 
                address: (data.hasOwnProperty('address'))?data.address:get_patient.address, 
                communicate_address: (data.hasOwnProperty('communicate_address'))?data.communicate_address:get_patient.communicate_address, 
                advance_amount_paid: (data.hasOwnProperty('advance_amount_paid'))?data.advance_amount_paid:get_patient.advance_amount_paid, 
                advance_amount_balance: (data.hasOwnProperty('advance_amount_balance'))?data.advance_amount_balance:get_patient.advance_amount_balance, 
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:get_patient.user_id, 
                updated_date: date,
                identity_mark:(data.hasOwnProperty('identity_mark'))?data.identity_mark:get_patient.identity_mark, 
                ailment:(data.hasOwnProperty('ailment'))?data.ailment:get_patient.ailment,
                age:(data.hasOwnProperty('age'))?data.age:get_patient.age,
                guardian_type:(data.hasOwnProperty('guardian_type'))?data.guardian_type:get_patient.guardian_type,
                guardian_name:(data.hasOwnProperty('guardian_name'))?data.guardian_name:get_patient.guardian_name,
                husband_name:(data.hasOwnProperty('husband_name'))?data.husband_name:get_patient.husband_name,
                father_name:(data.hasOwnProperty('father_name'))?data.father_name:get_patient.father_name,
                blood_group:(data.hasOwnProperty('blood_group'))?data.blood_group:get_patient.blood_group,
            }
            return resolve(patientdata)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

module.exports = {
   PatientModule,
   generateId
}
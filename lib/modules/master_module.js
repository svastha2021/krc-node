const { MasterDao } = require('../dao/master_dao');
var debug = require('debug')('v2:users:module');
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

class MasterModule {

    getDoctors(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var MasterDao = new MasterDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_patient, get_patient_count;
            
            try {
                connection = await userDao.getReadConnection();
                debug("query.filter", query)
                if(query.filter.hasOwnProperty('mobile_no')) {
                    get_patient = await userDao.getPatientMobileByBranchId(connection, query.filter.mobile_no, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
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
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else if(query.filter.hasOwnProperty('patient_id')) {
                    get_patient = await userDao.getPatientidByBranchId(connection, query.filter.patient_id, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
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
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else{
                    get_patient = await userDao.getPatientbyBranchId(connection, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(get_patient);
                    }
                    else{
                        get_patient_count = await userDao.getCountPatientbyBranchId(connection, branch_id);

                        var total_size = get_patient_count;
                        var page_size = query.skip ? query.skip : get_patient_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await userDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    GetDoctorDetail(doctor_id, query) {
        return new Promise(async(resolve, reject) => {
            var masterDao = new MasterDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            
            try {
                connection = await masterDao.getReadConnection();
                debug("query.filter", query)
            
                var get_doctor = await masterDao.getDoctorDetail(connection, doctor_id);
                if(get_doctor.hasOwnProperty('status') && get_doctor.status == 404) {
                    if (connection) {
                        await masterDao.releaseReadConnection(connection);
                    }
                    return resolve(get_doctor);
                }
                else{
                    if (connection) {
                        await masterDao.releaseReadConnection(connection);
                    }
                    return resolve(get_doctor)
                }
            }
            catch(error) {
                if (connection) {
                    await masterDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    getUserLoginDetail(data,  query) {
        return new Promise(async (resolve, reject) => {
            var userDao = new UserDao();
            var read_connection = null;
            var get_user; 
            var returnResponse;
            var lang;       
            try {
                if (query.filter.hasOwnProperty('lang')) {
                    lang = query.filter.lang;
                } else {
                    lang = 'en';
                }
                read_connection = await userDao.getReadConnection();
                get_user = await userDao.getUserLogin(read_connection, data.user.user_id, data.user.pwd);
                if (get_user.hasOwnProperty('status') && get_user.status == 404) {
                    if (read_connection) {
                        await userDao.releaseReadConnection(read_connection);
                    }
                    returnResponse = changeLog(get_user.code,lang);
                    return resolve(returnResponse);
                }
                else{
                    debug("Get User Login Details", get_user, );
                    var user_data = await categories_schema_to_data_user(get_user);
                    var response = { user: user_data };
                    if (read_connection) {
                        await userDao.releaseReadConnection(read_connection);
                    }
                    return resolve(response);
                    
                }
            }
            catch (error) {
                if (read_connection) {
                    await userDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    createPatient(data,  query) {
        return new Promise(async (resolve, reject) => {
            var userDao = new UserDao();
            var read_connection = null;
            var set_patient, get_patient, error_code, user_data, response;
            var returnResponse;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            try {
                read_connection = await userDao.getReadConnection();
                if(data.hasOwnProperty('email_id')) {
                    get_patient = await userDao.getPatientEmail(read_connection, data.email_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        get_patient = await userDao.getPatientMobile(read_connection, data.mobile_no);
                        if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                            user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                            set_patient = await userDao.createPatient(read_connection, user_data);
                            response = { patient: user_data };
                            if (read_connection) {
                                await userDao.releaseReadConnection(read_connection);
                            }
                            return resolve(response);
                        }
                        else{
                            error_code = { status: 404, code: 4001, message: "Sorry, Patient Already Exists!.", developerMessage: "Sorry, Patient Already Exists!." };
                            if (read_connection) {
                                await userDao.releaseReadConnection(read_connection);
                            }
                            return resolve(error_code)
                        }
                    }
                    else{
                        if(data.hasOwnProperty('mobile_no')) {
                            get_patient = await userDao.getPatientMobile(read_connection, data.mobile_no);
                            if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                                user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                                set_patient = await userDao.createPatient(read_connection, user_data);
                                response = { patient: user_data };
                                if (read_connection) {
                                    await userDao.releaseReadConnection(read_connection);
                                }
                                return resolve(response);
                            }
                            else{
                                error_code = { status: 404, code: 4001, message: "Sorry, Patient Already Exists!.", developerMessage: "Sorry, Patient Already Exists!." };
                                if (read_connection) {
                                    await userDao.releaseReadConnection(read_connection);
                                }
                                return resolve(error_code)
                            }
                        }
                        else{
                            user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                                set_patient = await userDao.createPatient(read_connection, user_data);
                                response = { patient: user_data };
                                if (read_connection) {
                                    await userDao.releaseReadConnection(read_connection);
                                }
                                return resolve(response);
                        }
                    }
                }else{
                    if(data.hasOwnProperty('mobile_no')) {
                        get_patient = await userDao.getPatientMobile(read_connection, data.mobile_no);
                        if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                            user_data = await categories_data_to_schema_patient_data(read_connection, data, date);
                            set_patient = await userDao.createPatient(read_connection, user_data);
                            response = { patient: user_data };
                            if (read_connection) {
                                await userDao.releaseReadConnection(read_connection);
                            }
                            return resolve(response);
                        }
                        else{
                            error_code = { status: 404, code: 4001, message: "Sorry, Patient Already Exists!.", developerMessage: "Sorry, Patient Already Exists!." };
                            if (read_connection) {
                                await userDao.releaseReadConnection(read_connection);
                            }
                            return resolve(error_code)
                        }
                    }
                    else{
                        error_code = { status: 404, code: 4001, message: "Sorry, Patient Already Exists!.", developerMessage: "Sorry, Patient Already Exists!." };
                        if (read_connection) {
                            await userDao.releaseReadConnection(read_connection);
                        }
                        return resolve(error_code)
                    }
                }
            }
            catch (error) {
                if (read_connection) {
                    await userDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    getPatient(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var userDao = new UserDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_patient, get_patient_count;
            
            try {
                connection = await userDao.getReadConnection();
                debug("query.filter", query)
                if(query.filter.hasOwnProperty('mobile_no')) {
                    get_patient = await userDao.getPatientMobileByBranchId(connection, query.filter.mobile_no, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
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
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else if(query.filter.hasOwnProperty('patient_id')) {
                    get_patient = await userDao.getPatientidByBranchId(connection, query.filter.patient_id, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
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
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else{
                    get_patient = await userDao.getPatientbyBranchId(connection, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(get_patient);
                    }
                    else{
                        get_patient_count = await userDao.getCountPatientbyBranchId(connection, branch_id);

                        var total_size = get_patient_count;
                        var page_size = query.skip ? query.skip : get_patient_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await userDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    appointmentBooking(data,  query) {
        return new Promise(async (resolve, reject) => {
            var userDao = new UserDao();
            var read_connection = null;
            var set_patient_appointment, get_patient, error_code, user_data_appointment, response;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            try {
                read_connection = await userDao.getReadConnection();
                get_patient = await userDao.getPatientMobile(read_connection, data.mobile_no);
                if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                    error_code = { status: 404, code: 4001, message: "Sorry, Patient Already Exists!.", developerMessage: "Sorry, Patient Already Exists!." };
                    if (read_connection) {
                        await userDao.releaseReadConnection(read_connection);
                    }
                    return resolve(error_code)
                }
                else{
                    user_data_appointment = await categories_data_to_schema_patient_appointment_data(read_connection, data, date, get_patient.patient_id);
                    set_patient_appointment = await userDao.createPatientAppointment(read_connection, user_data_appointment);
                    response = { patient: user_data_appointment };
                    if (read_connection) {
                        await userDao.releaseReadConnection(read_connection);
                    }
                    return resolve(response);
                }
            }
            catch (error) {
                if (read_connection) {
                    await userDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }
   

    getAppointment(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var userDao = new UserDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_patient, get_patient_count;
            
            try {
                connection = await userDao.getReadConnection();
                debug("query.filter", query)
                if(query.filter.hasOwnProperty('mobile_no')) {
                    get_patient = await userDao.getPatientMobileByBranchId(connection, query.filter.mobile_no, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
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
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else if(query.filter.hasOwnProperty('patient_id')) {
                    get_patient = await userDao.getPatientidByBranchId(connection, query.filter.patient_id, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
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
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else{
                    get_patient = await userDao.getPatientbyBranchId(connection, branch_id);
                    if(get_patient.hasOwnProperty('status') && get_patient.status == 404) {
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(get_patient);
                    }
                    else{
                        get_patient_count = await userDao.getCountPatientbyBranchId(connection, branch_id);

                        var total_size = get_patient_count;
                        var page_size = query.skip ? query.skip : get_patient_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, get_patient
                        }
                        if (connection) {
                            await userDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await userDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

}

function categories_schema_to_data_user(userdata) {
    return new Promise((resolve, reject) => {
        var categorydata = {
            user_id: userdata.user_id,
            branch_id: userdata.branch_id,
            org_id:userdata.org_id,
            user_name: userdata.user_name,
            user_type: userdata.user_type,
            user_status: userdata.user_status,
            branch_name: userdata.branch_name0p
        }
        return resolve(categorydata)
    })
}

function generateId(connection, data, seq_type) {
    return new Promise(async(resolve, reject) => {
        var userDao = new UserDao();
        var get_patient_id, patient_id;
        
        try{
            get_patient_id = await userDao.getPatientIdByPAT(connection,data.branch_id, seq_type);
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
            var patient_dob, patientdob, first_visit_date, first_visitdate, patient_id;
            var seq_type='PAT';
            if(data.hasOwnProperty('patient_dob')) {
                patientdob = new Date(data.patient_dob);
                patient_dob = moment(patientdob).utc().format("YYYY-MM-DD");
            }
            else{
                patientdob = new Date();
                patient_dob = moment(patientdob).utc().format("YYYY-MM-DD");
            }
            if(data.hasOwnProperty('first_visit_date')) {
                first_visitdate = new Date(data.first_visit_date);
                first_visit_date = moment(first_visitdate).utc().format("YYYY-MM-DD");
            }
            else{
                first_visitdate = new Date();
                first_visit_date = moment(first_visitdate).utc().format("YYYY-MM-DD");
            }
            patient_id = await generateId(connection, data, seq_type)
            var patientdata = { 
                patient_id: patient_id,
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                patient_name: data.patient_name, 
                patient_photo: data.patient_photo, 
                dob: patient_dob, 
                sex: data.sex, 
                mobile_no: data.mobile_no, 
                alternative_mobile_bo: data.alternative_mobile_no, 
                email_id: data.email_id, 
                alternative_email_id: data.alternative_email_id, 
                first_visit_date: first_visit_date, 
                aadhar_no: data.aadhar_no, 
                patient_type: data.patient_type, 
                address: data.address, 
                communicate_address: data.communicate_address, 
                advance_amount_paid: data.advance_amount_paid, 
                advance_amount_balance: data.advance_amount_balance, 
                updated_by: data.user_id, 
                updated_on: date
            }
            return resolve(patientdata)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_patient_appointment_data(connection, data, date, patient_id){
    return new Promise(async(resolve, reject) => {
        try {
            var appoint_no, apptdate, appt_date, appttime, appt_time;
            var seq_type='APT';
            debug("data.appointment_date", data.appointment_date, "data.appointment_time", data.appointment_time)
            if(data.hasOwnProperty('appointment_date')) {
                apptdate = new Date(data.appointment_date);
                appt_date = moment(apptdate).utc().format("YYYY-MM-DD");
            }
            else{
                apptdate = new Date();
                appt_date = moment(apptdate).utc().format("YYYY-MM-DD");
            }
            if(!data.hasOwnProperty('appointment_time')) {
                console.log("Not having");
                appttime = new Date();
                appt_time = moment(appttime).utc().format("HH:MM:SS");
              }
              else{
                console.log("Not having");
                appt_time = data.appointment_time;
              }

            appoint_no = await generateId(connection, data, seq_type)
            var patient_appointment_data = { 
                patient_id: (data.hasOwnProperty('patient_id'))?data.patient_id:patient_id,
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                phone_no: data.mobile_no,
                patient_name: data.patient_name, 
                doctor_name: data.doctor_name,
                aliment: data.aliment,
                appoint_date: appt_date,
                appoint_time: appt_time,
                appoint_status: data.appointment_status,
                appoint_no: appoint_no,
                updated_by: data.user_id, 
                updated_on: date
            }
            return resolve(patient_appointment_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

module.exports = {
   MasterModule,
   generateId
}
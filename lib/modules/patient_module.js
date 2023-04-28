const { PatientDao } = require('../dao/patient_dao');
const { PatientInsDao } = require('../dao/patient_ins_dao');
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
            var patientinsDao = new PatientInsDao();
            var read_connection = null;
            var set_patient, get_patient, error_code, user_data,create_insurance,insurance_data, response,update_appoint;
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
                        insurance_data = await categories_data_to_schema_patient_ins_header_data_to_create(data, user_data, date);
                        create_insurance = await patientinsDao.createPatientInsHeader(read_connection,insurance_data);
                        update_appoint = await patientDao.updateAppointByphoneno(read_connection,user_data.mobile_no,user_data.patient_id);
                       

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
                                insurance_data = await categories_data_to_schema_patient_ins_header_data_to_create(data, user_data, date);
                                create_insurance = await patientinsDao.createPatientInsHeader(read_connection,insurance_data);
                                update_appoint = await patientDao.updateAppointByphoneno(read_connection,user_data.mobile_no,user_data.patient_id);
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
            var strLimit = (query.limit ? query.limit : 2000);
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
                 else if(query.filter.hasOwnProperty('patient_name')) {
                    get_patient = await patientDao.getPatientNameByBranchId(connection, query.filter.patient_name, branch_id);
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

//Create / update   Schedule
    createSchedule(data,  query) {
        return new Promise(async (resolve, reject) => {
            var patientDao = new PatientDao();
            var user_data;
            var read_connection = null;
            var set_schedule;
            var schedule_results = [];
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            try {
                read_connection = await patientDao.getReadConnection();

                for(var i in data.schedule_lists) {
                    var schedule_data = data.schedule_lists[i];
                    if(schedule_data.hasOwnProperty('schedule_num') )  {
                        
                        var get_schedule_data = await patientDao.getSchedulbyNumberUpdate(read_connection, data.branch_id, data.patient_id, data.bu_id, schedule_data.schedule_num);
                        if(get_schedule_data.hasOwnProperty('status')) {
                            user_data = await categories_data_to_schema_schedule_data(read_connection, data, schedule_data, date);
                            set_schedule = await patientDao.createSchedule(read_connection, user_data);
                            schedule_results.push(schedule_data)
                            
                        }
                        else{
                            user_data = await categories_data_to_schema_update_schedule_data(data,date,get_schedule_data,schedule_data);
                            set_schedule = await patientDao.updateSchedule(read_connection, user_data, data.patient_id, data.bu_id, schedule_data.schedule_num);
                            schedule_results.push(schedule_data)
                           
                        }
                    }
                    else{
                        user_data = await categories_data_to_schema_schedule_data(read_connection, data, schedule_data, date);
                        debug('Module Schedule ->'+user_data);
                        set_schedule = await patientDao.createSchedule(read_connection, user_data);
                        schedule_results.push(schedule_data)
                        
                    }

                    

                    
                }

                if (read_connection) {
                    await patientDao.releaseReadConnection(read_connection);
                }
                return resolve({results: schedule_results}); 
              
                   
                    
                // }
            }
            catch (error) {
                debug('Module Schedule ->'+error);
                if (read_connection) {
                    await patientDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }
    // Get Schedule List
    GetSchedulesList(org_id,branch_id,patient_id, query) {
        return new Promise(async(resolve, reject) => {
            var patientDao = new PatientDao();
            var connection = null;
            var today = new Date();
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 2000);
            var strPagination = strSkip + ',' + strLimit;
            var get_schedules;
            try {
                connection = await patientDao.getReadConnection();
                debug("query.filter", query)
               //month and year
               if((query.filter.hasOwnProperty('sch_month')) && (query.filter.hasOwnProperty('sch_year')))  {
                get_schedules = await patientDao.getScheduleListByMonth(connection, org_id,branch_id,patient_id,query.filter.bu_id,query.filter.sch_month,query.filter.sch_year);
               }else{
                get_schedules = await patientDao.getScheduleList(connection, org_id,branch_id,patient_id,query.filter.bu_id);
               }
                if(get_schedules.hasOwnProperty('status') && get_schedules.status == 404) {
                    if (connection) {
                        await patientDao.releaseReadConnection(connection);
                    }
                    return resolve(get_schedules);
                }
                else{
                    var total_size = get_schedules.length;
                    var page_size = get_schedules.length//query.skip ? query.skip : total_size;
                    var result_size = get_schedules.length//strLimit;
                    
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_schedules
                    }
                    if (connection) {
                        await patientDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
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



    // Get Report List
    GetPatientReportList(org_id,branch_id,patient_id, query) {
        return new Promise(async(resolve, reject) => {
            var patientDao = new PatientDao();
            var connection = null;
            try {
                connection = await patientDao.getReadConnection();
                debug("query.filter", query)
                
                var get_patient_last_visit_date_count = await patientDao.GetPatientLastVisitDateCount(connection, org_id, branch_id, patient_id);

                var get_patient_last_dialysis_date_count = await patientDao.GetPatientLastDialysisDateCount(connection, org_id, branch_id, patient_id);

                var last_visit_pharmacy_count = await patientDao.GetMaxVisitNoPharmacyPrescriptionCount(connection, org_id, branch_id, patient_id);

                var get_last_visit_med_prescribed = await patientDao.GetLastVisitMedPrescribed(connection, org_id, branch_id, patient_id, last_visit_pharmacy_count);

                var last_visit_test_count = await patientDao.GetMaxVisitNoTestCount(connection, org_id, branch_id, patient_id);

                var get_last_visit_test_details = await patientDao.GetLastVisitTestDetails(connection, org_id, branch_id, patient_id, last_visit_test_count);
            
                var get_max_visit_health_param_count = await patientDao.GetMaxVisitHealthParamCount(connection, org_id, branch_id, patient_id);

                var get_max_visit_health_param_details = await patientDao.GetMaxVisitHealthParamDetails(connection, org_id, branch_id, patient_id, get_max_visit_health_param_count);

                var req_res = {
                    org_id: org_id,
                    branch_id: branch_id,
                    patient_id: patient_id,
                    last_visit_count: get_patient_last_visit_date_count.cnt,
                    last_visit_date: get_patient_last_visit_date_count.visit_date,
                    last_dialysis_count: get_patient_last_dialysis_date_count.Dialy_cnt,
                    last_dialysis_date: get_patient_last_dialysis_date_count.last_dialy_date,
                    patient_last_visit_medicine_prescribed: get_last_visit_med_prescribed,
                    patient_last_visit_test_details: get_last_visit_test_details,
                    patient_last_visit_health_details: get_max_visit_health_param_details
                }
                if (connection) {
                    await patientDao.releaseReadConnection(connection);
                }
                return resolve(req_res);
            }
            catch(error) {
                if (connection) {
                    await patientDao.releaseReadConnection(connection);
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
            if(data.hasOwnProperty('dob') && data.dob!='' &&  data.dob!=null) {
            
                dob = moment(data.dob).format("YYYY-MM-DD");
            }
            else{
                patientdob = new Date();
                dob = null;
            }
            if(data.hasOwnProperty('first_visit_date') && data.first_visit_date!='' &&  data.first_visit_date!=null) {
              
                first_visit_date = moment(data.first_visit_date).format("YYYY-MM-DD");
            }
            else{
                first_visitdate = new Date();
                first_visit_date = null;
            }
            if(data.hasOwnProperty('age')) {
                if(data.age != null) {
                    var pattern = /^[0-9]+$/;
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
                blood_group:data.blood_group,
                ration_cardno:data.ration_cardno,
                profession:data.profession,
                attender1_name:data.attender1_name,
                attender1_relation_type:data.attender1_relation_type,
                attender1_contact:data.attender1_contact,
                attender2_name:data.attender2_name,
                attender2_relation_type:data.attender2_relation_type,
                attender2_contact:data.attender2_contact,
                pincode:data.pincode
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
            var dob, patientdob, first_visit_date, first_visitdate, age;

            if(data.hasOwnProperty('dob') && data.dob!='' &&  data.dob!=null) {
            
                dob = moment(data.dob).format("YYYY-MM-DD");
            }
            else{
                
                dob = null;
            }
            if(data.hasOwnProperty('first_visit_date') && data.first_visit_date!='' &&  data.first_visit_date!=null) {
              
                first_visit_date = moment(data.first_visit_date).format("YYYY-MM-DD");
            }
            else{
            
                first_visit_date = null;
            }

            if(data.hasOwnProperty('age')) {
                if(data.age != null) {
                    var pattern = /^[0-9]+$/;
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
                age:(data.hasOwnProperty('age'))?age:get_patient.age,
                guardian_type:(data.hasOwnProperty('guardian_type'))?data.guardian_type:get_patient.guardian_type,
                guardian_name:(data.hasOwnProperty('guardian_name'))?data.guardian_name:get_patient.guardian_name,
                husband_name:(data.hasOwnProperty('husband_name'))?data.husband_name:get_patient.husband_name,
                father_name:(data.hasOwnProperty('father_name'))?data.father_name:get_patient.father_name,
                blood_group:(data.hasOwnProperty('blood_group'))?data.blood_group:get_patient.blood_group,
                ration_cardno:(data.hasOwnProperty('ration_cardno'))?data.ration_cardno:get_patient.ration_cardno,
                profession:(data.hasOwnProperty('profession'))?data.profession:get_patient.profession,
                attender1_name:(data.hasOwnProperty('attender1_name'))?data.attender1_name:get_patient.attender1_name,
                attender1_relation_type:(data.hasOwnProperty('attender1_relation_type'))?data.attender1_relation_type:get_patient.attender1_relation_type,
                attender1_contact:(data.hasOwnProperty('attender1_contact'))?data.attender1_contact:get_patient.attender1_contact,
                attender2_name:(data.hasOwnProperty('attender2_name'))?data.attender2_name:get_patient.attender2_name,
                attender2_relation_type:(data.hasOwnProperty('attender2_relation_type'))?data.attender2_relation_type:get_patient.attender2_relation_type,
                attender2_contact:(data.hasOwnProperty('attender2_contact'))?data.attender2_contact:get_patient.attender2_contact,
                pincode:(data.hasOwnProperty('pincode'))?data.pincode:get_patient.pincode
            }
            return resolve(patientdata)
        }
        catch (error) {
            return reject(error);    
        }
    })
}



function categories_data_to_schema_patient_ins_header_data_to_create(data, patient_data, date) {
    return new Promise(async(resolve, reject) => {
        try {
            var patient_ins_header_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                patient_id: patient_data.patient_id,
                bu_id: "DIALY",
                doctor_id: (data.hasOwnProperty('doctor_id'))?data.doctor_id:null,
                header_remarks1: (data.hasOwnProperty('header_remarks1'))?data.header_remarks1: null, 
                header_remarks2:(data.hasOwnProperty('header_remarks2'))?data.header_remarks2: null, 
                footer_remarks: (data.hasOwnProperty('footer_remarks'))?data.footer_remarks: null,
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                updated_date: date, 
                created_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                created_date: date
            }
            return resolve(patient_ins_header_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

//Schedule
function categories_data_to_schema_schedule_data(connection, data,schedule_data, date) {
    return new Promise(async(resolve, reject) => {
        try {
            var schedule_date, scheduledob, planned_date, planneddate,actual_date,actualdate, schedule_num;
           
            if(schedule_data.hasOwnProperty('schedule_date') && schedule_data.schedule_date!='' && schedule_data.schedule_date!=null) {
                scheduledob = new Date(schedule_data.schedule_date);
                schedule_date = moment(scheduledob).utc().format("YYYY-MM-DD");
            }
            else{
                scheduledob = new Date();
                schedule_date = null;
            }
            if(schedule_data.hasOwnProperty('planned_date') && schedule_data.planned_date!='' && schedule_data.planned_date!=null) {
                planneddate = new Date(schedule_data.planned_date);
                planned_date = moment(planneddate).utc().format("YYYY-MM-DD");
              
            }
            else{
                planneddate = new Date();
                planned_date = null;
              
            }

            if(schedule_data.hasOwnProperty('actual_date') && schedule_data.actual_date!=''&& schedule_data.actual_date!=null) {
                actualdate = new Date(schedule_data.actual_date);
                actual_date = moment(actualdate).utc().format("YYYY-MM-DD");
            }
            else{
                actualdate = new Date();
                actual_date = null;
            }
          
            schedule_num = await generateScheduleNum(connection, data)  
         
            var scheduledata = { 
                schedule_num:schedule_num,
                patient_id: data.patient_id,
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                schedule_date: schedule_date, 
                planned_date: planned_date, 
                actual_date: actual_date, 
                schedule_ver: schedule_data.schedule_ver, 
                bu_id: data.bu_id, 
                visit_flag: schedule_data.visit_flag, 
                schedule_purpose: schedule_data.schedule_purpose, 
                addl_remarks: schedule_data.addl_remarks,
                created_by: data.user_id, 
                created_date: date,
                updated_by: data.user_id, 
                updated_date: date,
                
            }
           console.log("SHan",scheduledata);
            return resolve(scheduledata)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

//update schdule

function categories_data_to_schema_update_schedule_data(data, date, get_schedule,schedule_data) {
    return new Promise(async(resolve, reject) => {
        try {
            var schedule_date, scheduledob, planned_date, planneddate,actual_date,actualdate;
           
            if(schedule_data.hasOwnProperty('schedule_date') && schedule_data.schedule_date!='' && schedule_data.schedule_date!=null) {
                scheduledob = new Date(schedule_data.schedule_date);
                schedule_date = moment(scheduledob).utc().format("YYYY-MM-DD");
            }
            else{
                scheduledob = new Date();
                schedule_date = get_schedule.schedule_date;
            }
            if(schedule_data.hasOwnProperty('planned_date') && schedule_data.planned_date!='' && schedule_data.planned_date!= null) {
                planneddate = new Date(schedule_data.planned_date);
                planned_date = moment(planneddate).utc().format("YYYY-MM-DD");
               
            }
            else{
                planneddate = new Date();
                planned_date = get_schedule.planned_date;
               
            }

            if(schedule_data.hasOwnProperty('actual_date') && schedule_data.actual_date!='' && schedule_data.actual_date!= null) {
                actualdate = new Date(schedule_data.actual_date);
                actual_date = moment(actualdate).utc().format("YYYY-MM-DD");
            }
            else{
                actualdate = new Date();
                actual_date = get_schedule.actual_date;
            }
          
           
         
            var scheduledata = { 
              
                patient_id: (data.hasOwnProperty('patient_id'))?data.patient_id:get_schedule.patient_id, 
                org_id: (data.hasOwnProperty('org_id'))?data.org_id:get_schedule.org_id, 
                branch_id: (data.hasOwnProperty('branch_id'))?data.branch_id:get_schedule.branch_id,           
                schedule_date: schedule_date, 
                planned_date: planned_date, 
                actual_date: actual_date, 
                schedule_ver: (schedule_data.hasOwnProperty('schedule_ver'))?schedule_data.schedule_ver:get_schedule.schedule_ver, 
                bu_id: (data.hasOwnProperty('bu_id'))?data.bu_id:get_schedule.bu_id, 
                visit_flag: (schedule_data.hasOwnProperty('visit_flag'))?schedule_data.visit_flag:get_schedule.visit_flag, 
                schedule_purpose: (schedule_data.hasOwnProperty('schedule_purpose'))?schedule_data.schedule_purpose:get_schedule.schedule_purpose, 
                addl_remarks: (schedule_data.hasOwnProperty('addl_remarks'))?schedule_data.addl_remarks:get_schedule.addl_remarks,                
                updated_by: data.user_id, 
                updated_date: date,
                
            }
            return resolve(scheduledata)
        }
        catch (error) {
            return reject(error);    
        }
    })
}





    function generateScheduleNum(connection, data) {
        return new Promise(async(resolve, reject) => {
            var patientDao = new PatientDao();
            var po_invoice, po_number;
            
            try{
                po_invoice = await patientDao.getMaxScheduleNumber(connection,data.org_id, data.branch_id,data.patient_id,data.bu_id);
                if(po_invoice != null) {
                    po_number = po_invoice.schedule_num+1;
                    
                    return resolve(po_number);
                }
                else{
                    po_number =1;
                    return resolve(po_number);
                }
            }
            catch(error) {
                return reject(error)
            }
        })
    }


module.exports = {
   PatientModule,
   generateId
}
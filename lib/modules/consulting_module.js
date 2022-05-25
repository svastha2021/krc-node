const { ConsultDao } = require('../dao/consulting_dao');
var debug = require('debug')('v2:consulting:module');
const {changeLog} = require('../../common/error_handling');
var moment = require('moment-timezone');
const { GetRandomPatientID } = require('../../common/app_utils');
const { PatientDao } = require('../dao/patient_dao');

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

class ConsultingModule {

    CreateConsulting(data,  query) {
        return new Promise(async (resolve, reject) => {
            var consultDao = new ConsultDao();
            var read_connection = null;
            var consulting_header_data, set_pat_consultheader_data;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            try {
                read_connection = await consultDao.getReadConnection();
                set_pat_consultheader_data = await categories_data_to_schema_consult_header_data_to_create(read_connection, data, date);
                consulting_header_data = await consultDao.createConsultingHeader(read_connection, set_pat_consultheader_data);
                if (read_connection) {
                    await consultDao.releaseReadConnection(read_connection);
                }
                return resolve(consulting_header_data);
            }
            catch (error) {
                debug("error", error)
                if (read_connection) {
                    await consultDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    CreateDialysisConsulting(data,  query) {
        return new Promise(async (resolve, reject) => {
            var consultDao = new ConsultDao();
            var read_connection = null;
            var get_consult, consulting_dialysis_data, set_pat_dialysis_consult_data;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            try {
                read_connection = await consultDao.getReadConnection();
                get_consult = await consultDao.getConsultingDialysis(read_connection, data.visit_no, data.patient_id);
                if(get_consult.hasOwnProperty('status') && get_consult.status == 404) {
                    set_pat_dialysis_consult_data = await categories_data_to_schema_dialysis_consult_data_to_create(read_connection, data, date);
                    consulting_dialysis_data = await consultDao.createDialysisConsulting(read_connection, set_pat_dialysis_consult_data);
                    if (read_connection) {
                        await consultDao.releaseReadConnection(read_connection);
                    }
                    return resolve(consulting_dialysis_data);
                }
                else{
                    set_pat_dialysis_consult_data = await categories_data_to_schema_dialysis_consult_data_to_update(read_connection, data, date, get_consult);
                    consulting_dialysis_data = await consultDao.updateDialysisConsulting(read_connection, set_pat_dialysis_consult_data, get_consult);
                    if (read_connection) {
                        await consultDao.releaseReadConnection(read_connection);
                    }
                    return resolve(consulting_dialysis_data);
                }
            }
            catch (error) {
                debug("error", error)
                if (read_connection) {
                    await consultDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    CreateLabConsulting(data,  query) {
        return new Promise(async (resolve, reject) => {
            var consultDao = new ConsultDao();
            var read_connection = null;
            var get_consult, consulting_lab_data, set_pat_lab_consult_data;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            var succes_data = 'Y';
            var lab_results = [];
            try {
                read_connection = await consultDao.getReadConnection();
                for(var i in data.lab_lists) {
                    var lab_data = data.lab_lists[i];
                    get_consult = await consultDao.getConsultingLabPatient(read_connection, data.visit_no, data.patient_id, lab_data.test_id);
                    if(get_consult.hasOwnProperty('status') && get_consult.status == 404) {
                        debug("Get consult", get_consult);
                        set_pat_lab_consult_data = await categories_data_to_schema_lab_consult_data_to_create(read_connection, data, date, lab_data);
                        consulting_lab_data = await consultDao.createLabConsulting(read_connection, set_pat_lab_consult_data);
                        lab_results.push(set_pat_lab_consult_data);
                    }
                    else{
                        debug("Get new consult", get_consult);
                        set_pat_lab_consult_data = await categories_data_to_schema_lab_consult_data_to_update(date, get_consult, lab_data);
                        consulting_lab_data = await consultDao.updateLabConsulting(read_connection, set_pat_lab_consult_data, get_consult);
                        lab_results.push(get_consult);
                    }
                }
                if (read_connection) {
                    await consultDao.releaseReadConnection(read_connection);
                }
                return resolve({results: lab_results})
            }
            catch (error) {
                debug("error", error)
                if (read_connection) {
                    await consultDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    GetConsultingDetail(visit_no, query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var get_consult;
            
            try {
                connection = await consultDao.getReadConnection();
                get_consult = await consultDao.getConsultingHead(connection, visit_no);
                if(get_consult.hasOwnProperty('status') && get_consult.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consult);
                }
                else{
                    /* var get_dialysis_consult_data = await consultDao.getDialysisConsultData(connection, visit_no, get_consult.patient_id);
                    get_consult['dialysis_consult_data'] = get_dialysis_consult_data; */
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consult)
                }
            }
            catch(error) {
                if (connection) {
                    await consultDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    GetConsultingListsByBranchId(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_consults, get_consults_count;
            try {
                connection = await consultDao.getReadConnection();
                debug("query.filter", query)
                get_consults = await consultDao.GetConsultingListsByBranchId(connection, branch_id, query, strPagination);
                if(get_consults.hasOwnProperty('status') && get_consults.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consults);
                }
                else{
                    get_consults_count = await consultDao.GetCountConsultingListsByBranchId(connection, branch_id, query);
                    var total_size = get_consults_count;
                    var page_size = query.skip ? query.skip : get_consults_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_consults
                    }
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
                }
            }
            catch(error) {
                if (connection) {
                    await consultDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    GetConsultingListsByOrgId(org_id, query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_consults, get_consults_count;
            try {
                connection = await consultDao.getReadConnection();
                debug("query.filter", query)
                get_consults = await consultDao.GetConsultingListsByOrgId(connection, org_id, query, strPagination);
                if(get_consults.hasOwnProperty('status') && get_consults.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consults);
                }
                else{
                    get_consults_count = await consultDao.GetCountConsultingListsByOrgId(connection, org_id, query);
                    var total_size = get_consults_count;
                    var page_size = query.skip ? query.skip : get_consults_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_consults
                    }
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
                }
            }
            catch(error) {
                if (connection) {
                    await consultDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    getPatientDialysisLists(patient_id,  query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_consult_dialysis, get_consult_dialysis_count;
            try {
                connection = await consultDao.getReadConnection();
                debug("query.filter", query)
                get_consult_dialysis = await consultDao.GetPatientDailysisList(connection, patient_id, query, strPagination);
                if(get_consult_dialysis.hasOwnProperty('status') && get_consult_dialysis.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consult_dialysis);
                }
                else{
                    get_consult_dialysis_count = await consultDao.GetCountPatientDailysisList(connection, patient_id, query);
                    var total_size = get_consult_dialysis_count;
                    var page_size = query.skip ? query.skip : get_consult_dialysis_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_consult_dialysis
                    }
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
                }
            }
            catch(error) {
                if (connection) {
                    await consultDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    getPatientLabLists(patient_id,  query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_consult_lab, get_consult_lab_count;
            try {
                connection = await consultDao.getReadConnection();
                debug("query.filter", query);
                var get_lastest_lab_list = await consultDao.getLatestLabLists(connection, patient_id);
                get_consult_lab = await consultDao.GetPatientLabList(connection, patient_id, query, get_lastest_lab_list, strPagination);
                if(get_consult_lab.hasOwnProperty('status') && get_consult_lab.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consult_lab);;
                }
                else{
                    get_consult_lab_count = await consultDao.GetCountPatientLabList(connection, patient_id, query, get_lastest_lab_list);
                    var total_size = get_consult_lab_count;
                    var page_size = query.skip ? query.skip : get_consult_lab_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_consult_lab
                    }
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
                }
            }
            catch(error) {
                if (connection) {
                    await consultDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }
}

function generateId(connection, data, seq_type) {
    return new Promise(async(resolve, reject) => {
        var consultDao = new ConsultDao();
        var billing_invoice, invoice_no;
        
        try{
            billing_invoice = await consultDao.getInvoiceNo(connection,data.branch_id, seq_type);
            if(billing_invoice != null) {
                invoice_no = billing_invoice.invoice_no;
                return resolve(invoice_no);
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

function categories_data_to_schema_consult_header_data_to_create(connection, data, date){
    return new Promise(async(resolve, reject) => {
        try {
            debug("Data", data)
            var consultDao = new ConsultDao();
            var visit_no;
            var prev_visit_no;
            var prev_visit_date;
            var prev_notes;
            // var seq_type = 'INV';
            // invoice_no = await generateId(connection, data, seq_type)
            var get_consult_visit_no = await consultDao.getConsultVisitMaxNumber(connection, data);
            var get_consult_prev=await consultDao.getConsultingPrevDate(connection,data.patient_id);
            if(get_consult_visit_no != null) {
                debug("get_consult_visit_no", get_consult_visit_no)
                if(get_consult_visit_no.visit_no != null) {
                    prev_visit_no=get_consult_visit_no.visit_no;
                    visit_no = get_consult_visit_no.visit_no + 1;
                }
                else{
                    visit_no = 1;
                    prev_visit_no=0;
                }
            }
            else {
                visit_no = 1;
                prev_visit_no=0;
            }

            if(get_consult_prev != null) {
                
                prev_visit_date= moment(get_consult_prev.visit_date).utc().format("YYYY-MM-DD HH:mm:ss");
                prev_notes=get_consult_prev.doctor_notes;
            }else{
                prev_visit_date=null;
                prev_notes=null;
            }
            var consulting_header_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id, 
                visit_date: data.visit_date, 
                visit_no: visit_no, 
                prev_visit_no: prev_visit_no, 
                prev_visit_date: prev_visit_date, 
                prev_history: data.prev_notes, 
                doctor_notes: data.doctor_notes, 
               // consultation_fee: data.consultation_fee, 
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                updated_date: date, 
                created_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                created_date: date, 
             //   consultation_fee_paid: data.consultation_fee_paid, 
               // fee_payment_mode: data.fee_payment_mode, 
              //  fee_payment_desc: data.fee_payment_desc
            }
            return resolve(consulting_header_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_dialysis_consult_data_to_create(connection, data, date) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var dialysis_consulting_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no, 
                prescription_date: data.prescription_date, 
                dialysis_notes: data.dialysis_notes, 
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                updated_date: date, 
                created_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                created_date: date
            }
            return resolve(dialysis_consulting_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_dialysis_consult_data_to_update(connection, data, date, consult_header) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var dialysis_consulting_data = {
                /* org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no,  */
                prescription_date: data.prescription_date, 
                dialysis_notes: data.dialysis_notes, 
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:consult_header.updated_by, 
                updated_date: date, 
            }
            return resolve(dialysis_consulting_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_lab_consult_data_to_create(connection, data, date, lab_data) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var lab_consulting_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no, 
                prescription_date: date,
                test_id: lab_data.test_id, 
                test_notes: lab_data.test_notes, 
                test_date: lab_data.test_date,
                test_status: 'P', 
                remarks: (lab_data.hasOwnProperty('remarks'))?lab_data.remarks: null, 
                invoice_num: (lab_data.hasOwnProperty('invoice_num'))?lab_data.invoice_num: null, 
                result_delivery_mode: (lab_data.hasOwnProperty('result_delivery_mode'))?lab_data.result_delivery_mode: null, 
                test_delivered: (lab_data.hasOwnProperty('test_delivered'))?lab_data.test_delivered: null, 
                test_delivery_date: (lab_data.hasOwnProperty('test_delivery_date'))?lab_data.test_delivery_date: null,
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                updated_date: date, 
                created_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                created_date: date
            }
            return resolve(lab_consulting_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_lab_consult_data_to_update(date, get_consult, lab_data) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var lab_consulting_data = {
                /* org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no, 
                prescription_date: date,
                test_id: lab_data.test_id,  */
                test_notes: lab_data.test_notes, 
                test_date: lab_data.test_date,
                test_status: 'P', 
                remarks: (lab_data.hasOwnProperty('remarks'))?lab_data.remarks: get_consult.remarks, 
                invoice_num: (lab_data.hasOwnProperty('invoice_num'))?lab_data.invoice_num: get_consult.invoice_num, 
                result_delivery_mode: (lab_data.hasOwnProperty('result_delivery_mode'))?lab_data.result_delivery_mode: get_consult.result_delivery_mode, 
                test_delivered: (lab_data.hasOwnProperty('test_delivered'))?lab_data.test_delivered: get_consult.test_delivered, 
                test_delivery_date: (lab_data.hasOwnProperty('test_delivery_date'))?lab_data.test_delivery_date: get_consult.test_delivery_date,
                updated_by: (lab_data.hasOwnProperty('user_id'))?lab_data.user_id:get_consult.updated_by, 
                updated_date: date
            }
            return resolve(lab_consulting_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

module.exports = {
   ConsultingModule,
   generateId
}
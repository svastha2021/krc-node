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

    CreateHealthConsulting(data,  query) {
        return new Promise(async (resolve, reject) => {
            var consultDao = new ConsultDao();
            var read_connection = null;
            var get_consult, consulting_health_data, set_pat_health_consult_data;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            var succes_data = 'Y';
            var health_results = [];
            try {
                read_connection = await consultDao.getReadConnection();
                for(var i in data.health_lists) {
                    var health_data = data.health_lists[i];
                    get_consult = await consultDao.getConsultingHealthPatient(read_connection, data.visit_no, data.patient_id, health_data.khi_code);
                    if(get_consult.hasOwnProperty('status') && get_consult.status == 404) {
                        debug("Get consult", get_consult);
                        set_pat_health_consult_data = await categories_data_to_schema_health_consult_data_to_create(read_connection, data, date, health_data);
                        consulting_health_data = await consultDao.createHealthConsulting(read_connection, set_pat_health_consult_data);
                        health_results.push(set_pat_health_consult_data);
                    }
                    else{
                        debug("Get new consult", get_consult);
                        set_pat_health_consult_data = await categories_data_to_schema_health_consult_data_to_update(date, get_consult, health_data);
                        consulting_health_data = await consultDao.updateHealthConsulting(read_connection, set_pat_health_consult_data, get_consult);
                        health_results.push(get_consult);
                    }
                }
                if (read_connection) {
                    await consultDao.releaseReadConnection(read_connection);
                }
                return resolve({results: health_results})
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

    CreatePharmConsulting(data,  query) {
        return new Promise(async (resolve, reject) => {
            var consultDao = new ConsultDao();
            var read_connection = null;
            var get_consult, consulting_pharm_data, set_pat_pharm_consult_data;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            var succes_data = 'Y';
            var pharm_results = [];
            try {
                read_connection = await consultDao.getReadConnection();
                for(var i in data.pharm_lists) {
                    var pharm_data = data.pharm_lists[i];
                    get_consult = await consultDao.getConsultingPharmPatient(read_connection, data.visit_no, data.patient_id, pharm_data.medicine_id);
                    if(get_consult.hasOwnProperty('status') && get_consult.status == 404) {
                        debug("Get consult", get_consult);
                        set_pat_pharm_consult_data = await categories_data_to_schema_pharm_consult_data_to_create(read_connection, data, date, pharm_data);
                        consulting_pharm_data = await consultDao.createPharmConsulting(read_connection, set_pat_pharm_consult_data);
                        pharm_results.push(set_pat_pharm_consult_data);
                    }
                    else{
                        debug("Get new consult", get_consult);
                        set_pat_pharm_consult_data = await categories_data_to_schema_pharm_consult_data_to_update(date, get_consult, pharm_data);
                        consulting_pharm_data = await consultDao.updatePharmConsulting(read_connection, set_pat_pharm_consult_data, get_consult);
                        pharm_results.push(get_consult);
                    }
                }
                if (read_connection) {
                    await consultDao.releaseReadConnection(read_connection);
                }
                return resolve({results: pharm_results})
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
            var strLimit = (query.limit ? query.limit : 2000);
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
            var strLimit = (query.limit ? query.limit : 2000);
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
            var strLimit = (query.limit ? query.limit : 2000);
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
            var strLimit = (query.limit ? query.limit : 2000);
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

    getPatientPharmLists(patient_id,  query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 2000);
            var strPagination = strSkip + ',' + strLimit;
            var get_consult_pharm, get_consult_pharm_count;
            try {
                connection = await consultDao.getReadConnection();
                debug("query.filter", query);
                var get_lastest_pharm_list = await consultDao.getLatestPharmLists(connection, patient_id);
                get_consult_pharm = await consultDao.GetPatientPharmList(connection, patient_id, query, get_lastest_pharm_list, strPagination);
                if(get_consult_pharm.hasOwnProperty('status') && get_consult_pharm.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consult_pharm);;
                }
                else{
                    get_consult_pharm_count = await consultDao.GetCountPatientPharmList(connection, patient_id, query, get_lastest_pharm_list);
                    var total_size = get_consult_pharm_count;
                    var page_size = query.skip ? query.skip : get_consult_pharm_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_consult_pharm
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

    getPatientPharmaLists(patient_id,  query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 2000);
            var strPagination = strSkip + ',' + strLimit;
            var get_consult_pharm, get_consult_pharm_count;
            try {
                connection = await consultDao.getReadConnection();
                debug("query.filter", query);
                get_consult_pharm = await consultDao.GetPatientPharmaList(connection, patient_id, query, strPagination);
                if(get_consult_pharm.hasOwnProperty('status') && get_consult_pharm.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consult_pharm);;
                }
                else{
                    get_consult_pharm_count = await consultDao.GetCountPatientPharmaList(connection, patient_id, query);
                    var total_size = get_consult_pharm_count;
                    var page_size = query.skip ? query.skip : get_consult_pharm_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_consult_pharm
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

    getPatientHealthLists(patient_id,  query) {
        return new Promise(async(resolve, reject) => {
            var consultDao = new ConsultDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 2000);
            var strPagination = strSkip + ',' + strLimit;
            var get_consult_health, get_consult_health_count;
            try {
                connection = await consultDao.getReadConnection();
                debug("query.filter", query);
                var get_lastest_health_list = await consultDao.getLatestHealthLists(connection, patient_id);
                get_consult_health = await consultDao.GetPatientHealthList(connection, patient_id, query, get_lastest_health_list, strPagination);
                if(get_consult_health.hasOwnProperty('status') && get_consult_health.status == 404) {
                    if (connection) {
                        await consultDao.releaseReadConnection(connection);
                    }
                    return resolve(get_consult_health);;
                }
                else{
                    get_consult_health_count = await consultDao.GetCountPatientHealthList(connection, patient_id, query, get_lastest_health_list);
                    var total_size = get_consult_health_count;
                    var page_size = query.skip ? query.skip : get_consult_health_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_consult_health
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

function categories_data_to_schema_health_consult_data_to_create(connection, data, date, health_data) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var health_consulting_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id,
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no, 
                khi_code: health_data.khi_code, 
                khi_value: health_data.khi_value, 
                khi_notes: health_data.khi_notes, 
                
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                updated_date: date, 
                created_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                created_date: date
            }
            return resolve(health_consulting_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_health_consult_data_to_update(date, get_consult, health_data) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var health_consulting_data = {
                /* org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no,
                medicine_id: pharm_data.medicine_id, 
                prescription_date: date, */ 
                khi_value: (health_data.hasOwnProperty('khi_value'))?health_data.khi_value:get_consult.khi_value, 
                khi_notes: (health_data.hasOwnProperty('khi_notes'))?health_data.khi_notes:get_consult.khi_notes, 
                updated_by: (health_data.hasOwnProperty('user_id'))?health_data.user_id:get_consult.updated_by, 
                updated_date: date
            }
            return resolve(health_consulting_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_pharm_consult_data_to_create(connection, data, date, pharm_data) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var pharm_consulting_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no, 
                prescription_date: date,
                medicine_id: pharm_data.medicine_id, 
                morning_bf: pharm_data.morning_bf, 
                morning_af: pharm_data.morning_af, 
                noon_bf: pharm_data.noon_bf, 
                noon_af: pharm_data.noon_af, 
                evening_bf: pharm_data.evening_bf, 
                evening_af: pharm_data.evening_af, 
                night_bf: pharm_data.night_bf, 
                night_af: pharm_data.night_af, 
                other_time_desc: pharm_data.other_time_desc, 
                other_time_bf: pharm_data.other_time_bf, 
                other_time_af: pharm_data.other_time_af, 
                no_of_days: pharm_data.no_of_days,  
                invoiced: pharm_data.invoiced, 
                remarks: pharm_data.remarks, 
                delivery_mode: pharm_data.delivery_mode, 
                invoice_num: pharm_data.invoice_num,
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                updated_date: date, 
                created_by: (data.hasOwnProperty('user_id'))?data.user_id:null, 
                created_date: date
            }
            return resolve(pharm_consulting_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_pharm_consult_data_to_update(date, get_consult, pharm_data) {
    return new Promise(async(resolve, reject) => {
        try {
            var consultDao = new ConsultDao();
            var pharm_consulting_data = {
                /* org_id: data.org_id, 
                branch_id: data.branch_id, 
                business_id: data.business_id, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                visit_no: data.visit_no,
                medicine_id: pharm_data.medicine_id, 
                prescription_date: date, */ 
                morning_bf: (pharm_data.hasOwnProperty('morning_bf'))?pharm_data.morning_bf:get_consult.morning_bf, 
                morning_af: (pharm_data.hasOwnProperty('morning_af'))?pharm_data.morning_af:get_consult.morning_af, 
                noon_bf: (pharm_data.hasOwnProperty('noon_bf'))?pharm_data.noon_bf:get_consult.noon_bf, 
                noon_af: (pharm_data.hasOwnProperty('noon_af'))?pharm_data.noon_af:get_consult.noon_af, 
                evening_bf: (pharm_data.hasOwnProperty('evening_bf'))?pharm_data.evening_bf:get_consult.evening_bf, 
                evening_af: (pharm_data.hasOwnProperty('evening_af'))?pharm_data.evening_af:get_consult.evening_af, 
                night_bf: (pharm_data.hasOwnProperty('night_bf'))?pharm_data.night_bf:get_consult.night_bf, 
                night_af: (pharm_data.hasOwnProperty('night_af'))?pharm_data.night_af:get_consult.night_af, 
                other_time_desc: (pharm_data.hasOwnProperty('other_time_desc'))?pharm_data.other_time_desc:get_consult.other_time_desc, 
                other_time_bf: (pharm_data.hasOwnProperty('other_time_bf'))?pharm_data.other_time_bf:get_consult.other_time_bf, 
                other_time_af: (pharm_data.hasOwnProperty('other_time_af'))?pharm_data.other_time_af:get_consult.other_time_af, 
                no_of_days: (pharm_data.hasOwnProperty('no_of_days'))?pharm_data.no_of_days:get_consult.no_of_days,  
                invoiced: (pharm_data.hasOwnProperty('invoiced'))?pharm_data.invoiced:get_consult.invoiced, 
                remarks: (pharm_data.hasOwnProperty('remarks'))?pharm_data.remarks:get_consult.remarks, 
                delivery_mode: (pharm_data.hasOwnProperty('delivery_mode'))?pharm_data.delivery_mode:get_consult.delivery_mode, 
                invoice_num: (pharm_data.hasOwnProperty('invoice_num'))?pharm_data.invoice_num:get_consult.invoice_num,
                updated_by: (pharm_data.hasOwnProperty('user_id'))?pharm_data.user_id:get_consult.updated_by, 
                updated_date: date
            }
            return resolve(pharm_consulting_data)
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
const { BillingDao } = require('../dao/billing_dao');
var debug = require('debug')('v2:billing:module');
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

class BillingModule {

    createBilling(data,  query) {
        return new Promise(async (resolve, reject) => {
            var billingDao = new BillingDao();
            var read_connection = null;
            var billing_header_data, set_billing_detail, user_billing_header;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            try {
                read_connection = await billingDao.getReadConnection();
                user_billing_header = await categories_data_to_schema_billing_header_data_to_create(read_connection, data, date);
                billing_header_data = await billingDao.createBillingHeader(read_connection, user_billing_header);
                set_billing_detail = await InitBillingDetail(read_connection, data, user_billing_header, date);
                if (read_connection) {
                    await billingDao.releaseReadConnection(read_connection);
                }
                return resolve(billing_header_data);
            }
            catch (error) {
                if (read_connection) {
                    await billingDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    GetBillingDetail(invoice_no, query) {
        return new Promise(async(resolve, reject) => {
            var billingDao = new BillingDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var get_billing;
            
            try {
                connection = await billingDao.getReadConnection();
                get_billing = await billingDao.getBillingHead(connection, invoice_no);
                if(get_billing.hasOwnProperty('status') && get_billing.status == 404) {
                    if (connection) {
                        await billingDao.releaseReadConnection(connection);
                    }
                    return resolve(get_billing);
                }
                else{
                    var get_billing_detail = await billingDao.getBillingDetail(connection, invoice_no);
                    get_billing['invoice_details'] = get_billing_detail;
                    if (connection) {
                        await billingDao.releaseReadConnection(connection);
                    }
                    return resolve(get_billing)
                }
            }
            catch(error) {
                if (connection) {
                    await billingDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    GetBillingListsByBranchId(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var billingDao = new BillingDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_billings, get_billings_count;
            try {
                connection = await billingDao.getReadConnection();
                debug("query.filter", query)
                get_billings = await billingDao.getBillingByBranchId(connection, branch_id, query);
                if(get_billings.hasOwnProperty('status') && get_billings.status == 404) {
                    if (connection) {
                        await billingDao.releaseReadConnection(connection);
                    }
                    return resolve(get_billings);
                }
                else{
                    /* for(var i in get_billings) {
                        var get_billing_detail = await billingDao.getBillingDetail(connection, get_billings[i].invoice_no);
                        if(get_billing_detail.hasOwnProperty('status') && get_billing_detail.status == 404) {
                            var empty_array = [];
                            get_billings[i]['invoice_details'] = empty_array;
                        }
                        else{
                            // billing_detail.push(get_billing_detail);
                            get_billings[i]['invoice_details'] = get_billing_detail;
                        }
                    } */
                    get_billings_count = await billingDao.getCountBillingByBranchId(connection, branch_id, query);
                    var total_size = get_billings_count;
                    var page_size = query.skip ? query.skip : get_billings_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_billings
                    }
                    if (connection) {
                        await billingDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
                }
            }
            catch(error) {
                if (connection) {
                    await billingDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    GetBillingListsByOrgId(org_id, query) {
        return new Promise(async(resolve, reject) => {
            var billingDao = new BillingDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_billings, get_billings_count;
            try {
                connection = await billingDao.getReadConnection();
                debug("query.filter", query)
                get_billings = await billingDao.getBillingByOrgId(connection, org_id, query, strPagination);
                if(get_billings.hasOwnProperty('status') && get_billings.status == 404) {
                    if (connection) {
                        await billingDao.releaseReadConnection(connection);
                    }
                    return resolve(get_billings);
                }
                else{
                    /* for(var i in get_billings) {
                        var get_billing_detail = await billingDao.getBillingDetail(connection, get_billings[i].invoice_no);
                        if(get_billing_detail.hasOwnProperty('status') && get_billing_detail.status == 404) {
                            var empty_array = [];
                            get_billings[i]['invoice_details'] = empty_array;
                        }
                        else{
                            // billing_detail.push(get_billing_detail);
                            get_billings[i]['invoice_details'] = get_billing_detail;
                        }
                    } */
                    get_billings_count = await billingDao.getCountBillingByOrgId(connection, org_id, query);
                    var total_size = get_billings_count;
                    var page_size = query.skip ? query.skip : get_billings_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_billings
                    }
                    if (connection) {
                        await billingDao.releaseReadConnection(connection);
                    }
                    return resolve(res)
                }
            }
            catch(error) {
                if (connection) {
                    await billingDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    GetPatientHeaderDetail(patient_id, query) {
        return new Promise(async(resolve, reject) => {
            var billingDao = new BillingDao();
            var patientDao = new PatientDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_billings, patient_data;
            try {
                connection = await billingDao.getReadConnection();
                var get_patient_data = await patientDao.getPatientId(connection, patient_id);
                if(get_patient_data.hasOwnProperty('status') && get_patient_data.status == 404) {
                    if (connection) {
                        await billingDao.releaseReadConnection(connection);
                    }
                    return resolve(get_patient_data);
                }
                else{
                    patient_data = {
                        org_id: get_patient_data.org_id, 
                        branch_id: get_patient_data.branch_id, 
                        patient_id: get_patient_data.patient_id, 
                        patient_name: get_patient_data.patient_name, 
                        age: get_patient_data.age,
                        sex: get_patient_data.sex, 
                        mobile_no: get_patient_data.mobile_no,
                        patient_type: get_patient_data.patient_type, 
                        dob: get_patient_data.dob, 
                        advance_amount_paid: get_patient_data.advance_amount_paid, 
                        advance_amount_balance: get_patient_data.advance_amount_balance
                    }
                    get_billings = await billingDao.getPatientBillingData(connection, get_patient_data, patient_id);
                    debug("get_billings", get_billings);
                    if(get_billings == null) {
                        patient_data['net_inv_amount'] = 0;
                        patient_data['net_inv_paid'] = 0;
                        patient_data['net_inv_balance'] = 0;
                        debug("patient_data", patient_data)
                        if (connection) {
                            await billingDao.releaseReadConnection(connection);
                        }
                        return resolve(patient_data)
                    }
                    else{
                        patient_data['net_inv_amount'] = (get_billings.net_inv_amount != null)?get_billings.net_inv_amount:0;
                        patient_data['net_inv_paid'] = (get_billings.net_inv_paid != null)?get_billings.net_inv_paid:0;
                        patient_data['net_inv_balance'] = (get_billings.net_inv_balance != null)?get_billings.net_inv_balance:0;
                        debug("patient_data", patient_data)
                        if (connection) {
                            await billingDao.releaseReadConnection(connection);
                        }
                        return resolve(patient_data)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await billingDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    updateBilling(data, invoice_no, query) {
        return new Promise(async (resolve, reject) => {
            var billingDao = new BillingDao();
            var read_connection = null;
            var update_billing_data, get_billing, update_billing, response;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            try {
                read_connection = await billingDao.getReadConnection();
                get_billing = await billingDao.getBillingHead(read_connection, invoice_no);
                if(get_billing.hasOwnProperty('status') && get_billing.status == 404) {
                    if (read_connection) {
                        await billingDao.releaseReadConnection(read_connection);
                    }
                    return resolve(get_billing);
                }
                else{
                    update_billing = await categories_data_to_schema_update_billing_data(data, date, get_billing);
                    update_billing_data = await billingDao.updateBilling(read_connection, update_billing, invoice_no);
                    response = { appoint: update_billing };
                    if (read_connection) {
                        await billingDao.releaseReadConnection(read_connection);
                    }
                    return resolve(response);
                }
            }
            catch (error) {
                if (read_connection) {
                    await billingDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    createBillingPaymentDetail(data,  query) {
        return new Promise(async (resolve, reject) => {
            var billingDao = new BillingDao();
            var read_connection = null;
            var set_payment_data;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            try {
                read_connection = await billingDao.getReadConnection();
                var get_billing_head = await billingDao.getBillingHead(read_connection, data.invoice_no);
                if(get_billing_head.hasOwnProperty('status') && get_billing_data.status == 404) {
                    var error_code = { status: 404, code: 4001, message: "Invalid Invoice No!.", developerMessage: "Invalid Invoice No!." };
                    if (read_connection) {
                        await billingDao.releaseReadConnection(read_connection);
                    }
                    return resolve(error_code);
                }
                else{
                    var get_payment_data = await billingDao.getPaymentMaxNumber(read_connection, data);
                    var get_billing_data = await billingDao.getBillingDtl(read_connection, data.invoice_no, data.inv_srl_no);
                    set_payment_data = await categories_data_to_schema_billing_payment_data_create(read_connection, data, get_payment_data, get_billing_data, get_billing_head, date);
                    if (read_connection) {
                        await billingDao.releaseReadConnection(read_connection);
                    }
                    return resolve(set_payment_data);
                }
            }
            catch (error) {
                if (read_connection) {
                    await billingDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }
}

function generateId(connection, data, seq_type) {
    return new Promise(async(resolve, reject) => {
        var billingDao = new BillingDao();
        var billing_invoice, invoice_no;
        
        try{
            billing_invoice = await billingDao.getInvoiceNo(connection,data.branch_id, seq_type);
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

function categories_data_to_schema_billing_header_data_to_create(connection, data, date){
    return new Promise(async(resolve, reject) => {
        try {
            var invoice_no;
            var seq_type = 'INV';
            invoice_no = await generateId(connection, data, seq_type)
            var billing_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                invoice_no: invoice_no, 
                inv_date: date, 
                doctor_id: data.doctor_id, 
                patient_id: data.patient_id,
                net_inv_paid: (data.hasOwnProperty('net_inv_paid'))?data.net_inv_paid:0, 
                net_inv_balance: (data.hasOwnProperty('net_inv_balance'))?data.net_inv_balance:0,
                net_balance: (data.hasOwnProperty('net_inv_balance'))?data.net_inv_balance:0,
                inv_status: 'P',
                updated_by: data.user_id, 
                updated_date: date, 
                created_by: data.user_id, 
                created_date: date
            }
            return resolve(billing_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function InitBillingDetail(connection, data, billing_header_data, date) {
    return new Promise(async(resolve, reject) => {
        try {
            var billingDao = new BillingDao();
            var billing_detail = []; 
            var product_value, product_cost, product_qty, other_charge1, other_charge2, other_charge3, discount1, discount2, discount3;
            var gross_inv_amount = 0;
            var gross_discount = 0;
            var net_amount = 0;
            var net_inv_amount = 0;
            var count = 0;
            for(var i in data.invoice_details) {
                var invoice_details = data.invoice_details[i];
                count = count + 1;
               /*  if(invoice_details.hasOwnProperty('other_charge1')) {
                    if(invoice_details.other_charge1 != null || invoice_details.other_charge1 != '') {
                        other_charge1 = invoice_details.other_charge1;
                    }
                    else{
                        other_charge1 = 0;
                    }
                }
                else{
                    other_charge1 = 0;
                }
                if(invoice_details.hasOwnProperty('other_charge2')) {
                    if(invoice_details.other_charge2 != null || invoice_details.other_charge2 != '') {
                        other_charge2 = invoice_details.other_charge2;
                    }
                    else{
                        other_charge2 = 0;
                    }
                }
                else{
                    other_charge2 = 0;
                }
                if(invoice_details.hasOwnProperty('other_charge3')) {
                    if(invoice_details.other_charge3 != null || invoice_details.other_charge3 != '') {
                        other_charge3 = invoice_details.other_charge3;
                    }
                    else{
                        other_charge3 = 0;
                    }
                }
                else{
                    other_charge3 = 0;
                }
                if(invoice_details.hasOwnProperty('discount1')) {
                    if(invoice_details.discount1 != null || invoice_details.discount1 != '') {
                        discount1 = invoice_details.discount1;
                    }
                    else{
                        discount1 = 0;
                    }
                }
                else{
                    discount1 = 0;
                }
                if(invoice_details.hasOwnProperty('discount2')) {
                    if(invoice_details.discount2 != null || invoice_details.discount2 != '') {
                        discount2 = invoice_details.discount2;
                    }
                    else{
                        discount2 = 0;
                    }
                }
                else{
                    discount2 = 0;
                }
                if(invoice_details.hasOwnProperty('discount3')) {
                    if(invoice_details.discount3 != null || invoice_details.discount3 != '') {
                        discount3 = invoice_details.discount3;
                    }
                    else{
                        discount3 = 0;
                    }
                }
                else{
                    discount3 = 0;
                }
                if(invoice_details.hasOwnProperty('product_cost')) {
                    if(invoice_details.product_cost != null || invoice_details.product_cost != '') {
                        product_cost = invoice_details.product_cost;
                    }
                    else{
                        product_cost = 0;
                    }
                }
                else{
                    product_cost = 0;
                }
                if(invoice_details.hasOwnProperty('product_qty')) {
                    if(invoice_details.product_qty != null || invoice_details.product_qty != '') {
                        product_qty = invoice_details.product_qty;
                    }
                    else{
                        product_qty = 0;
                    }
                }
                else{
                    product_qty = 0;
                }
    
                product_value = (product_qty * product_cost);
                gross_inv_amount = (product_value + other_charge1 + other_charge2 + other_charge3);
                gross_discount = (discount1 + discount2 + discount3);
                net_amount = (gross_inv_amount - gross_discount); */
    
                net_inv_amount = net_inv_amount + invoice_details.net_amount;
    
                var billing_detail_data = {
                    org_id: data.org_id, 
                    branch_id: data.branch_id, 
                    invoice_no: billing_header_data.invoice_no, 
                    inv_srl_no: count, 
                    bu_id: invoice_details.bu_id, 
                    product_id: invoice_details.product_id, 
                    product_qty: invoice_details.product_qty, 
                    product_cost: invoice_details.product_cost, 
                    product_value: invoice_details.product_value, 
                    other_charge1: invoice_details.other_charge1, 
                    other_charge_remark1: invoice_details.other_charge_remark1, 
                    other_charge2: invoice_details.other_charge2, 
                    other_charge_remark2: invoice_details.other_charge_remark2, 
                    other_charge3: invoice_details.other_charge3, 
                    other_charge_remark3: invoice_details.other_charge_remark3, 
                    gross_inv_amount: invoice_details.gross_inv_amount, 
                    discount1: invoice_details.discount1, 
                    discount_remark1: invoice_details.discount_remark1, 
                    discount2: invoice_details.discount2, 
                    discount_remark2: invoice_details.discount_remark2, 
                    discount3: invoice_details.discount3, 
                    discount_remark3: invoice_details.discount_remark3, 
                    gross_discount: invoice_details.gross_discount, 
                    net_amount: invoice_details.net_amount, 
                    net_paid: invoice_details.net_paid, 
                    net_balance: invoice_details.net_amount, 
                    updated_by: data.user_id,
                    inv_status: 'P',
                    updated_date: date, 
                    created_by: data.user_id, 
                    created_date: date
                }
                var set_billing_detail_data = await billingDao.createBillingDetail(connection, billing_detail_data);
                billing_detail.push(set_billing_detail_data);
            }
            var update_billing_header = {
                net_inv_amount : net_inv_amount
            }
            var update_billing_data = await billingDao.updateBillingHeader(connection, update_billing_header, billing_header_data.invoice_no);
            debug("update_billing_data", update_billing_data);
            var return_data = {billing_detail: billing_detail, update_billing_data: update_billing_data}
            return resolve(return_data);
        }
        catch (error) {
            debug("Error in initbillingdetail", error);
            return reject(error);    
        }
    })
}

function categories_data_to_schema_update_billing_data(data, date, get_billing){
    return new Promise(async(resolve, reject) => {
        try {
            var apptdate, appt_date, appttime, appt_time;
            debug("data", data, "get_billing", get_billing)
            if(data.hasOwnProperty('appoint_date')) {
                apptdate = new Date(data.appoint_date);
                appt_date = moment(apptdate).format("YYYY-MM-DD");
            }
            else{
                appt_date = get_billing.appoint_date;
            }
            if(!data.hasOwnProperty('appoint_time')) {
                appt_time = get_billing.appoint_time;
              }
              else{
                appt_time = data.appoint_time;
              }

            var patient_appointment_data = { 
                org_id: (data.hasOwnProperty('org_id'))?data.org_id:get_billing.org_id, 
                branch_id: (data.hasOwnProperty('branch_id'))?data.branch_id:get_billing.branch_id, 
                phone_no: (data.hasOwnProperty('phone_no'))?data.phone_no:get_billing.phone_no,
                patient_name: (data.hasOwnProperty('patient_name'))?data.patient_name:get_billing.patient_name, 
                doctor_id: (data.hasOwnProperty('doctor_id'))?data.doctor_id:get_billing.doctor_id,
                ailment: (data.hasOwnProperty('ailment'))?data.ailment:get_billing.ailment,
                appoint_date: appt_date,
                appoint_time: appt_time,
                appoint_status: (data.hasOwnProperty('appointment_status'))?data.appointment_status:get_billing.appoint_status,
                updated_on: date
            }
            debug("patient_appointment_data", patient_appointment_data)
            return resolve(patient_appointment_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_billing_payment_data_create(connection, data, get_payment_data, get_billing_data, get_billing_head, date) {
    return new Promise(async(resolve, reject) => {
        try {
            var billingDao = new BillingDao();
            var payment_num, inv_status;
            var net_paid = 0;
            var net_balance = 0;
            var net_inv_paid = 0;
            var net_inv_balance = 0;
            if(get_payment_data != null) {
                debug("get_payment_data", get_payment_data)
                if(get_payment_data.payment_num != null) {
                    payment_num = get_payment_data.payment_num + 1;
                }
                else{
                    payment_num = 1;
                }
            }
            else {
                payment_num = 1;
            }
            var billing_payment_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                invoice_no: data.invoice_no, 
                inv_srl_no: data.inv_srl_no, 
                payment_num: payment_num, 
                payment_date: date, 
                payment_mode: data.payment_mode, 
                payment_remark: data.payment_remark, 
                payment_amount: data.payment_amount, 
                updated_by: (data.hasOwnProperty('user_id'))?data.user_id: null, 
                updated_date: date, 
                created_by: (data.hasOwnProperty('user_id'))?data.user_id: null, 
                created_date: date
            }
            var set_billing_payment_data = await billingDao.createBillingPaymentDetail(connection, billing_payment_data);
            
            net_paid = get_billing_data.net_paid + data.payment_amount;
            net_balance = get_billing_data.net_amount - net_paid;
            if(get_billing_data.net_amount == net_paid) {
                inv_status = 'F';
            }
            else{
                inv_status = 'P';
            }
            var update_billing_detail = {
                net_paid: net_paid,
                net_balance: net_balance,
                inv_status: inv_status,
                updated_date: date
            }
            var update_billing_data = await billingDao.updateBillingDetail(connection, update_billing_detail, data.invoice_no, data.inv_srl_no);
            debug("update_billing_data", update_billing_data);

            net_inv_paid = get_billing_head.net_inv_paid + data.payment_amount;
            net_inv_balance =  get_billing_head.net_inv_amount - net_paid;
            if(get_billing_head.net_inv_amount == net_inv_paid) {
                inv_status = 'F';
            }
            else{
                inv_status = 'P';
            }
            var update_billing_head = {
                net_inv_paid: net_inv_paid,
                net_inv_balance: net_inv_balance,
                inv_status: inv_status,
                updated_date: date
            }
            var update_billing_data = await billingDao.updateBillingHeader(connection, update_billing_head, data.invoice_no);
            debug("update_billing_data", update_billing_data);
            return resolve(set_billing_payment_data);
        }
        catch (error) {
            debug("error in payment create data", error) 
            return reject(error);
        }
    })
}

module.exports = {
   BillingModule,
   generateId
}
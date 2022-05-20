const { SendResponse } = require('../../common/app_utils');
const { BillingModule } = require('../modules/billing_module');
var debug = require('debug')('v2:billing:actions');

var billingModule = new BillingModule();
class BillingAction {

    CreateBilling(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_for_create_billing(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.createBilling(body_data,  query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }

    UpdateBilling(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_update_billing(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.updateBilling(body_data, query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }

    UpdateBillingdtl(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_update_billing(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.updateBillingDtl(body_data, query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }

    GetBillingListsByBranchId(event, context) {      
        var branch_id = event.pathParameters.branch_id;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.GetBillingListsByBranchId(branch_id,  query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }

    GetBillingListsByOrgId(event, context) {      
        var org_id = event.pathParameters.org_id;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.GetBillingListsByOrgId(org_id,  query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }

    GetBillingDetail(event, context) {      
        var invoice_no = event.pathParameters.invoice_no;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.GetBillingDetail(invoice_no,  query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }

    GetPatientHeaderDetail(event, context) {
        var query = event.queryParameters;
        var patient_id = event.pathParameters.patient_id;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.GetPatientHeaderDetail(patient_id, query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }

    CreatePaymentsDetail(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_for_create_billing_payment_detail(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return billingModule.createBillingPaymentDetail(body_data,  query)
        })
        .then(function(response){
            if(response.hasOwnProperty('status') && (response.status == 404))
            context.done(null, SendResponse(401, response))
            else
            context.done(null, SendResponse(200, response));
        })
        .catch(function(err){
            context.done(null, SendResponse(500, err));
        })
    }
}

function validate_data_for_create_billing(appointment_data) {
    return new Promise((resolve, reject) => {
        /* {
    "org_id": "KRC",
    "branch_id": "KRC001",
    "patient_id": "PATKRC00100010",
    "doctor_id": "DOC0001",
    "user_id": "KRC000001",
    "invoice_details": [
        {
            "bu_id": "DIALY",
            "product_id": "PRD00001",
            "product_qty": "1",
            "product_cost": 1500,
            "product_value": 3000,
            "other_charge1": 10,
            "other_charge_remark1": "DAILY",
            "other_charge2": 50,
            "other_charge_remark2": "BILL",
            "other_charge3": 50,
            "other_charge_remark3": "ROOM",
            "gross_inv_amount": 5000,
            "discount1": 500,
            "discount_remark1": "DAILY",
            "discount2": 500,
            "discount_remark2": "BILL",
            "discount3": 100,
            "discount_remark3": "ROOM",
            "gross_discount": 1100,
            "net_amount": 3900,
            "net_paid": 3500,
            "net_balance": 3500
        }
    ]
} */
        return resolve(appointment_data)
    })
}

function validate_data_update_billing(appointment_data) {
    return new Promise((resolve, reject) => {
        debug("appointment_data :", appointment_data)
        return resolve(appointment_data);
    })
}

function validate_data(data) {
    return new Promise((resolve, reject) => {
        return resolve(data);
    })
}

function validate_data_for_create_billing_payment_detail(data) {
    return new Promise((resolve, reject) => {
        return resolve(data);
    })
}
module.exports = {
    BillingAction,
}
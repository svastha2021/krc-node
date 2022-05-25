const { SendResponse } = require('../../common/app_utils');
const { ConsultingModule } = require('../modules/consulting_module');
var debug = require('debug')('v2:consulting:actions');

var consultModule = new ConsultingModule();
class ConsultAction {

    CreateConsulting(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_for_create_consulting(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.CreateConsulting(body_data,  query)
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

    CreateDialysisConsulting(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_for_create_dialysis_consulting(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.CreateDialysisConsulting(body_data,  query)
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

    CreateLabConsulting(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_for_create_lab_consulting(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.CreateLabConsulting(body_data,  query)
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

    GetConsultingListsByBranchId(event, context) {      
        var branch_id = event.pathParameters.branch_id;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.GetConsultingListsByBranchId(branch_id,  query)
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

    GetConsultingListsByOrgId(event, context) {      
        var org_id = event.pathParameters.org_id;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.GetConsultingListsByOrgId(org_id,  query)
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

    GetConsultingDetail(event, context) {      
        var visit_no = event.pathParameters.visit_no;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.GetConsultingDetail(visit_no,  query)
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

    getPatientDialysisList(event, context) {
        var query = event.queryParameters;
        var patient_id = event.pathParameters.patient_id;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.getPatientDialysisLists(patient_id,  query)
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

    getPatientLabLists(event, context) {
        var query = event.queryParameters;
        var patient_id = event.pathParameters.patient_id;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return consultModule.getPatientLabLists(patient_id,  query)
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

function validate_data_for_create_consulting(consulting_data) {
    return new Promise((resolve, reject) => {
        return resolve(consulting_data)
    })
}

function validate_data_for_create_dialysis_consulting(dialysis_consulting_data) {
    return new Promise((resolve, reject) => {
        return resolve(dialysis_consulting_data)
    })
}

function validate_data_for_create_lab_consulting(lab_consulting_data) {
    return new Promise((resolve, reject) => {
        return resolve(lab_consulting_data)
    })
}

function validate_data(data) {
    return new Promise((resolve, reject) => {
        return resolve(data);
    })
}

module.exports = {
    ConsultAction,
}
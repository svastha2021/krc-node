const { SendResponse } = require('../../common/app_utils');
const { MasterModule } = require('../modules/master_module');
var debug = require('debug')('v2:users:actions');

var masterModule = new MasterModule();
class MasterAction {

    CreatePatients(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_create_patients(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return masterModule.createPatient(body_data,  query)
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

    GetPatients(event, context) {      
        var branch_id = event.pathParameters.branch_id;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return masterModule.getPatient(branch_id,  query)
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

    BookAppointments(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_appointment_booking(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return masterModule.appointmentBooking(body_data,  query)
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

    GetAppointments(event, context) {      
        var branch_id = event.pathParameters.branch_id;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return masterModule.getPatient(branch_id,  query)
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

    GetDoctorDetail(event, context) {      
        var doctor_id = event.pathParameters.doctor_id;
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return masterModule.GetDoctorDetail(doctor_id,  query)
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

function validate_data_login(userdata) {
    
    return new Promise((resolve, reject) => {
        debug("userdata :", userdata)
      
        if ((!userdata.hasOwnProperty('user'))) {
            var err_response = { status: 404, code: 4004, message: "Missing User detail.", developerMessage: 'Missing User detail.' };
            return reject(err_response);
        }
        else if ((!userdata.user.hasOwnProperty('user_id'))) {
            var err_response = { status: 404, code: 4004, message: "Missing User_id.", developerMessage: 'Missing User_id.' };
            return reject(err_response);
        }
        else if ((!userdata.user.hasOwnProperty('pwd'))) {
            var err_response = { status: 404, code: 4004, message: "Please, Enter the user Password!", developerMessage: 'Please, Enter the user Password!.' };
            return reject(err_response);
        }
        else{
                return resolve(userdata)
            }
    })
}

function validate_data_create_patients(patiendata) {
    return new Promise((resolve, reject) => {
        debug("patiendata :", patiendata)
        if ((!patiendata.hasOwnProperty('patient_name'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient Name.", developerMessage: 'Please Enter Patient Name.' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('patient_photo'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient Photo.", developerMessage: 'Please Enter Patient Photo.' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('patient_dob'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient DOB.", developerMessage: 'Please Enter Patient DOB..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('sex'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient sex.", developerMessage: 'Please Enter Patient sex..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('mobile_no'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient MobileNo.", developerMessage: 'Please Enter Patient MobileNo..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('email_id'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient EmailId.", developerMessage: 'Please Enter Patient EmailId..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('address'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient address.", developerMessage: 'Please Enter Patient address..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('communicate_address'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient Communicate Address.", developerMessage: 'Please Enter Patient Communicate Address..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('first_visit_date'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient First visit date.", developerMessage: 'Please Enter Patient First visit date..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('user_id'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter user_id.", developerMessage: 'Please Enter user_id..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('branch_id'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter branch_id.", developerMessage: 'Please Enter branch_id..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('org_id'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter org_id.", developerMessage: 'Please Enter org_id..' };
            return reject(err_response);
        }
        else{
            return resolve(patiendata)
        }
    })
}

function validate_data_appointment_booking(patiendata) {
    return new Promise((resolve, reject) => {
        debug("patiendata :", patiendata)
        if ((!patiendata.hasOwnProperty('patient_name'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient Name.", developerMessage: 'Please Enter Patient Name.' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('mobile_no'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter Patient MobileNo.", developerMessage: 'Please Enter Patient MobileNo..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('doctor_id'))) {
            var err_response = { status: 404, code: 4004, message: "Please Select Doctor Name.", developerMessage: 'Please Select Doctor Name.' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('ailment'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter the Name of the Diseases.", developerMessage: 'Please Enter the Name of the Diseases.' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('appointment_date'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter the Appointment Date.", developerMessage: 'Please Enter the Appointment Date..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('appointment_time'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter the Appointment Time.", developerMessage: 'Please Enter the Appointment Time..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('branch_id'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter branch_id.", developerMessage: 'Please Enter branch_id..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('appointment_status'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter the Appoinment Status.", developerMessage: 'Please Enter the Appoinment Status..' };
            return reject(err_response);
        }
        else if ((!patiendata.hasOwnProperty('org_id'))) {
            var err_response = { status: 404, code: 4004, message: "Please Enter org_id.", developerMessage: 'Please Enter org_id..' };
            return reject(err_response);
        }
        else{
            return resolve(patiendata)
        }
    })
}

function validate_data(data) {
    return new Promise((resolve, reject) => {
        return resolve(data);
    })
}
module.exports = {
    MasterAction,
}
const { SendResponse } = require('../../common/app_utils');
const { MasterModule } = require('../modules/master_module');
var debug = require('debug')('v2:users:actions');

var masterModule = new MasterModule();
class MasterAction {

    GetReferenceList(event, context) {
        var query = event.queryParameters;
        var ref_type = event.pathParameters.ref_type;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return masterModule.getReferenceList(ref_type,  query)
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
    
    LabTestList(event, context) {
        var query = event.queryParameters;
        validate_data(event)       
        .then(function(_response) {
            debug("validate data ", _response);
            return masterModule.getLabTestLists(query)
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

function validate_data(data) {
    
    return new Promise((resolve, reject) => {
        return resolve(data)
    })
}

module.exports = {
    MasterAction
}
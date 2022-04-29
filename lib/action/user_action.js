const { SendResponse } = require('../../common/app_utils');
const { UserModule } = require('../modules/user_module');
var debug = require('debug')('v2:users:actions');

var userModule = new UserModule();
class UserAction {

    getUserLogin(event, context) {      
        var body_data = event.body;
        var query = event.queryParameters;
        validate_data_login(event.body)       
        .then(function(_response) {
            debug("validate data ", _response);
            return userModule.getUserLoginDetail(body_data,  query)
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

module.exports = {
    UserAction,
}
const { UserDao } = require('../dao/user_dao');
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

class UserModule {

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
            branch_name: userdata.branch_name
        }
        return resolve(categorydata)
    })
}

module.exports = {
   UserModule
}
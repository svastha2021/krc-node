const { DoctorDao } = require('../dao/doctor_dao');
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

class DoctorModule {

    GetDoctorDetail(doctor_id, query) {
        return new Promise(async(resolve, reject) => {
            var doctorDao = new DoctorDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            
            try {
                connection = await doctorDao.getReadConnection();
                debug("query.filter", query)
            
                var get_doctor = await doctorDao.getDoctorDetail(connection, doctor_id);
                if(get_doctor.hasOwnProperty('status') && get_doctor.status == 404) {
                    if (connection) {
                        await doctorDao.releaseReadConnection(connection);
                    }
                    return resolve(get_doctor);
                }
                else{
                    if (connection) {
                        await doctorDao.releaseReadConnection(connection);
                    }
                    return resolve(get_doctor)
                }
            }
            catch(error) {
                if (connection) {
                    await doctorDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    getDoctor(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var doctorDao = new DoctorDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_doctor, get_doctor_count, results;
            
            try {
                connection = await doctorDao.getReadConnection();
                debug("query.filter", query)
             if(query.filter.hasOwnProperty('doctor_id')) {
                    get_doctor = await doctorDao.getDoctorById(connection, query.filter.doctor_id, branch_id);
                    if(get_doctor.hasOwnProperty('status') && get_doctor.status == 404) {
                        if (connection) {
                            await doctorDao.releaseReadConnection(connection);
                        }
                        return resolve(get_doctor);
                    }
                    else{
                        var total_size = 1;
                        var page_size = 1;
                        var result_size = 1;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_doctor
                        }
                        if (connection) {
                            await doctorDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else{
                    get_doctor = await doctorDao.getDoctorsByBranchId(connection, branch_id);
                    if(get_doctor.hasOwnProperty('status') && get_doctor.status == 404) {
                        if (connection) {
                            await doctorDao.releaseReadConnection(connection);
                        }
                        return resolve(get_doctor);
                    }
                    else{
                        get_doctor_count = await doctorDao.getCountDoctorByBranchId(connection, branch_id);

                        var total_size = get_doctor_count;
                        var page_size = query.skip ? query.skip : get_doctor_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_doctor
                        }
                        if (connection) {
                            await doctorDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await doctorDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }
}

module.exports = {
   DoctorModule
}
const { MasterDao } = require('../dao/master_dao');
var debug = require('debug')('v2:users:module');
const {changeLog} = require('../../common/error_handling');
var moment = require('moment-timezone');

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

class MasterModule {

    getReferenceList(ref_type, query) {
        return new Promise(async (resolve, reject) => {
            var masterDao = new MasterDao();
            var read_connection = null;
            var get_reference, get_reference_count;
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            try {
                read_connection = await masterDao.getReadConnection();
                get_reference = await masterDao.getMasterReference(read_connection, ref_type, query, strPagination);
                if (get_reference.hasOwnProperty('status') && get_reference.status == 404) {
                    if (read_connection) {
                        await masterDao.releaseReadConnection(read_connection);
                    }
                    return resolve(get_reference);
                }
                else{
                    get_reference_count = await masterDao.getCountMasterReference(read_connection, ref_type, query);

                    var total_size = get_reference_count;
                    var page_size = query.skip ? query.skip : get_reference_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_reference
                    }
                    if (read_connection) {
                        await masterDao.releaseReadConnection(read_connection);
                    }
                    return resolve(res);
                    
                }
            }
            catch (error) {
                if (read_connection) {
                    await masterDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    getLabTestLists(query) {
        return new Promise(async (resolve, reject) => {
            var masterDao = new MasterDao();
            var read_connection = null;
            var get_lat_test, get_lat_test_count;
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            try {
                read_connection = await masterDao.getReadConnection();
                get_lat_test = await masterDao.getLabTestLists(read_connection, query, strPagination);
                if (get_lat_test.hasOwnProperty('status') && get_lat_test.status == 404) {
                    if (read_connection) {
                        await masterDao.releaseReadConnection(read_connection);
                    }
                    return resolve(get_lat_test);
                }
                else{
                    get_lat_test_count = await masterDao.getCountLabTestLists(read_connection, query);

                    var total_size = get_lat_test_count;
                    var page_size = query.skip ? query.skip : get_lat_test_count;
                    var result_size = strLimit;
                    console.log("Totalsize :", total_size);
                    var summary = {
                        filteredsize: page_size, resultsize: result_size, totalsize: total_size
                    };
                    var res = {
                        summary, results: get_lat_test
                    }
                    if (read_connection) {
                        await masterDao.releaseReadConnection(read_connection);
                    }
                    return resolve(res);
                    
                }
            }
            catch (error) {
                if (read_connection) {
                    await masterDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }
}

module.exports = {
   MasterModule
}
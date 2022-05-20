const { ProductDao } = require('../dao/product_dao');
var debug = require('debug')('v2:products:module');
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

class ProductModule {

    getProductDetail(product_id, query) {
        return new Promise(async(resolve, reject) => {
            var productDao = new ProductDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var get_product;
            
            try {
                connection = await productDao.getReadConnection();
                get_product = await productDao.GetProductDetail(connection, product_id);
                if(get_product.hasOwnProperty('status') && get_product.status == 404) {
                    if (connection) {
                        await productDao.releaseReadConnection(connection);
                    }
                    return resolve(get_product);
                }
                else{
                    if (connection) {
                        await productDao.releaseReadConnection(connection);
                    }
                    return resolve(get_product)
                }
            }
            catch(error) {
                if (connection) {
                    await productDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    getProducts(branch_id, query) {
        return new Promise(async(resolve, reject) => {
            var productDao = new ProductDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_products, get_products_count;
            try {
                connection = await productDao.getReadConnection();
                debug("query.filter", query);
                if(query.filter.hasOwnProperty('bu_id')) {
                    get_products = await productDao.getProductsByBranchIdBuId(connection, branch_id, query.filter.bu_id, strPagination);
                    if(get_products.hasOwnProperty('status') && get_products.status == 404) {
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(get_products);
                    }
                    else{
                        get_products_count = await productDao.getCountProductsByBranchIdBuId(connection, branch_id, query.filter.bu_id);
                        var total_size = get_products_count;
                        var page_size = query.skip ? query.skip : get_products_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_products
                        }
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else{
                    get_products = await productDao.getProductsByBranchId(connection, branch_id, strPagination);
                    if(get_products.hasOwnProperty('status') && get_products.status == 404) {
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(get_products);
                    }
                    else{
                        get_products_count = await productDao.getCountProductsByBranchId(connection, branch_id);
                        var total_size = get_products_count;
                        var page_size = query.skip ? query.skip : get_products_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_products
                        }
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await productDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }

    getProductsOrgId(org_id, query) {
        return new Promise(async(resolve, reject) => {
            var productDao = new ProductDao();
            var connection = null;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD HH:mm:ss");
            var strSkip = (query.skip ? query.skip : 0);
            var strLimit = (query.limit ? query.limit : 25);
            var strPagination = strSkip + ',' + strLimit;
            var get_products, get_products_count;
            try {
                connection = await productDao.getReadConnection();
                debug("query.filter", query);
                if(query.filter.hasOwnProperty('bu_id')) {
                    get_products = await productDao.getProductsByOrgIdBuId(connection, org_id, query.filter.bu_id, strPagination);
                    if(get_products.hasOwnProperty('status') && get_products.status == 404) {
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(get_products);
                    }
                    else{
                        get_products_count = await productDao.getCountProductsByOrgIdBuId(connection, org_id, query.filter.bu_id);
                        var total_size = get_products_count;
                        var page_size = query.skip ? query.skip : get_products_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_products
                        }
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
                else{
                    get_products = await productDao.getProductsByOrgId(connection, org_id, strPagination);
                    if(get_products.hasOwnProperty('status') && get_products.status == 404) {
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(get_products);
                    }
                    else{
                        get_products_count = await productDao.getCountProductsByOrgId(connection, org_id);
                        var total_size = get_products_count;
                        var page_size = query.skip ? query.skip : get_products_count;
                        var result_size = strLimit;
                        console.log("Totalsize :", total_size);
                        var summary = {
                            filteredsize: page_size, resultsize: result_size, totalsize: total_size
                        };
                        var res = {
                            summary, results: get_products
                        }
                        if (connection) {
                            await productDao.releaseReadConnection(connection);
                        }
                        return resolve(res)
                    }
                }
            }
            catch(error) {
                if (connection) {
                    await productDao.releaseReadConnection(connection);
                }
                return reject(error)
            }
        })
    }
}

module.exports = {
   ProductModule
}
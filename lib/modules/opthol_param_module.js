const { OptholParamDao } = require('../dao/opthol_param_dao');
var debug = require('debug')('v2:optholparam:module');
var moment = require('moment-timezone');


class OptholParamModule {
    CreateOptholParam(data,  query) {
        return new Promise(async (resolve, reject) => {
            var optholParamDao = new OptholParamDao();
            var read_connection = null;
            var opthol_data, set_opthol_data;
            var today = new Date();
            var date = moment(today).utc().format("YYYY-MM-DD");
            try {
                read_connection = await optholParamDao.getReadConnection();

                if(data.hasOwnProperty('visit_no') && (data.visit_no != null && data.visit_no.length >5)) {
                    var get_opthol_param_data = await optholParamDao.getOptholParamDetailData(read_connection, data);
                    if(get_opthol_param_data == null) {
                        set_opthol_data = await categories_data_to_schema_opthol_param_detail_data_to_create(read_connection, data, date);
                        debug("set_opthol_data", set_opthol_data)
                        opthol_data = await optholParamDao.createOptholParamData(read_connection, set_opthol_data);
                        if (read_connection) {
                            await optholParamDao.releaseReadConnection(read_connection);
                        }
                        return resolve(opthol_data); 
                    }
                    else{
                        var update_opthol_param_data = await categories_data_to_schema_opthol_param_detail_to_update(data, get_opthol_param_data, date);
                        opthol_data = await optholParamDao.updateOptholParamData(read_connection, update_opthol_param_data, data);
                        if (read_connection) {
                            await optholParamDao.releaseReadConnection(read_connection);
                        }
                        return resolve(opthol_data); 
                    }
                }
                else{
                    set_opthol_data = await categories_data_to_schema_opthol_param_detail_data_to_create(read_connection, data, date);
                    debug("set_doctor_data", set_opthol_data)
                    opthol_data = await optholParamDao.createOptholParamData(read_connection, set_opthol_data);
                    if (read_connection) {
                        await optholParamDao.releaseReadConnection(read_connection);
                    }
                    return resolve(opthol_data);
                }
            }
            catch (error) {
                debug("error", error)
                if (read_connection) {
                    await optholParamDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }

    GetOptholParamDetail(org_id, branch_id, query){
        return new Promise(async (resolve, reject) => {
            var optholParamDao = new OptholParamDao();
            var read_connection = null;
            var get_param;
            try {
                read_connection = await optholParamDao.getReadConnection();
                get_param = await optholParamDao.getOptholParamDetail(read_connection, org_id, branch_id, query);
                if (get_param.hasOwnProperty('status') && get_param.status == 404) {
                    if (read_connection) {
                        await optholParamDao.releaseReadConnection(read_connection);
                    }
                    return resolve(get_param);
                }
                else{
                    if (read_connection) {
                        await optholParamDao.releaseReadConnection(read_connection);
                    }
                    return resolve(get_param);
                    
                }
            }
            catch (error) {
                if (read_connection) {
                    await optholParamDao.releaseReadConnection(read_connection);
                }
                return reject(error)
            }
        })
    }
}

function generateId(connection, data, seq_type) {
    return new Promise(async(resolve, reject) => {
        var optholParamDao = new OptholParamDao();
        var check_opthol_visit_no, check_opthol_visit_no;
        
        try{
            check_opthol_visit_no = await optholParamDao.getOpotholParamVisitNo(connection,data, seq_type);
            if(check_opthol_visit_no != null) {
                var visit_no = check_opthol_visit_no.visit_no + 1;
                return resolve(visit_no);
            }
            else{
               return generateId(1)
            }
        }
        catch(error) {
            return reject(error)
        }
    })
}

function categories_data_to_schema_opthol_param_detail_data_to_create(connection, data, date){
    return new Promise(async(resolve, reject) => {
        try {
            var visit_date;
            if(data.hasOwnProperty('visit_date')) {
                var visitdate = new Date(data.visit_date);
                visit_date = moment(visitdate).utc().format("YYYY-MM-DD");
            }
            else{  
                visit_date = null;
            }

            var seq_type = 'OPTHAL';
            var visit_no = await generateId(connection, data, seq_type)
            var opthol_data = {
                org_id: data.org_id, 
                branch_id: data.branch_id, 
                patient_id: data.patient_id, 
                visit_no: visit_no, 
                param_type: data.param_type, 
                param_code: data.param_code, 
                param_value_RE: data.param_value_RE, 
                param_value_LE: data.param_value_LE, 
                visit_date: visit_date,
                updated_by: data.user_id, 
                updated_date: date, 
                created_by: data.user_id, 
                created_date: date
            }
            return resolve(opthol_data)
        }
        catch (error) {
            return reject(error);    
        }
    })
}

function categories_data_to_schema_opthol_param_detail_to_update(data, get_opthol_param_data, date){
    return new Promise(async(resolve, reject) => {
        try {
            var visit_date;
            if(data.hasOwnProperty('visit_date')) {
                var visitdate = new Date(data.visit_date);
                visit_date = moment(visitdate).utc().format("YYYY-MM-DD");
            }
            else{  
                visit_date = null;
            }
            var category_data = {
                param_type: (data.hasOwnProperty('param_type'))?data.param_type:get_opthol_param_data.param_type,
                param_value_RE: (data.hasOwnProperty('param_value_RE'))?data.param_value_RE:get_opthol_param_data.param_value_RE,
                param_value_LE: (data.hasOwnProperty('param_value_LE'))?data.param_value_LE:get_opthol_param_data.param_value_LE,
                visit_date: (data.hasOwnProperty('visit_date'))?visit_date:get_opthol_param_data.visit_date,
                updated_by : (data.hasOwnProperty('user_id'))?data.user_id:get_opthol_param_data.user_id,  
                updated_date: date
            }
            return resolve(category_data);
        }
        catch (error) {
            return reject(error);    
        }
    })
}

module.exports = {
    OptholParamModule
}
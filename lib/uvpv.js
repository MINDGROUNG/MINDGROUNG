'use strict';
//======================================import======================================//
const commonUtil = require('../util/commonUtil');
const DataCacheManager = require('../manager/dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();
//======================================import======================================//

module.exports = () => {
    return (req, res, next) => {
        let path = req.path;
                
        if(!path.includes('.') && !path.includes('protocol') && !path.includes('admin'))
        {
            let nowDate = commonUtil.getFormatDateYYYYMMDD(new Date());

            let pageLogDate = req.cookies.pageLogDate;

            //날짜가 없다면...
            if(!pageLogDate || nowDate != pageLogDate)
            {
                res.cookie('pageLogDate', nowDate, {httpOnly: true});
                res.cookie('pagelog', JSON.stringify({}), {httpOnly: true});
            }

            let mapPageLog = req.cookies.pagelog ? JSON.parse(req.cookies.pagelog) : {};
            
            if(!mapPageLog.hasOwnProperty(path))
            {
                mapPageLog[path] = new Date();
                res.cookie('pagelog', JSON.stringify(mapPageLog), {httpOnly: true});
                
                //UV입력
                dataCacheManager.setUVLog(path);
                //console.log("[uv] path = " + path);
            }
            
            //PV입력
            dataCacheManager.setPVLog(path);
            //console.log("[pv] path = " + path);
        }
        next();
    }
    
};
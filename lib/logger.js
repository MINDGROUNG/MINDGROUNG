const winston = require('winston');
const BaseConstant = require('../util/baseConstant');
require('winston-daily-rotate-file');
require('date-utils');

var loggerOption = 
{
    //로그레벨 error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5
    level: 'info', // 최소 레벨 
    // 파일저장
    transports: [
        new winston.transports.DailyRotateFile({
            filename : 'log/system.log', // log 폴더에 system.log 이름으로 저장
            zippedArchive: true, // 압축여부
            format: winston.format.printf(
                info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
        }),
    ],
    exitOnError: false //에러시 서버 유지
};

// 상용설정이 아니면 로그가 출력되도록 옵션을 추가함
if(BaseConstant.DEV_ENV != 0)
{
    let consoleOption = new winston.transports.Console({
        format: winston.format.printf(
            info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
    })
    // 콘솔 출력
    loggerOption.transports.push(consoleOption);
}

const logger = winston.createLogger(loggerOption);
 
module.exports = logger;
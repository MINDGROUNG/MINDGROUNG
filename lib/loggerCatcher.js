'use strict';

module.exports = () => {
  return (req, res, next) => {

  //request 받은 후 로그 기록
  logger.debug(req.method + "   " + req.originalUrl);

  logger.debug("req.body = " + req.body);

  //response 던진 후 로그 기록
  res.on('finish', () => {
    logger.debug(`${req.method} ${req.originalUrl}  ${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
  });

  //response 에러 캐치
  res.on('error', (err) =>{
    logger.error(err);
  });
 
   // 미들웨어나 router 콜백에서 next 또는 response에 대한 응답을 생략하면 클라이언트가 계속 대기하게 되므로 꼭 잊지 말 것.
    next();
  }
};
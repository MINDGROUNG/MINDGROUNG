'use strict';
//======================================import======================================//
const express = require('express');
const app = express();
const commonUtil = require('../util/commonUtil');
const DataCacheManager = require('../manager/dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();
const session = require('express-session');
const config = require('../config/config.json');
const BaseConstant = require('../util/baseConstant');
//======================================import======================================//

module.exports = () => {
    return (req, res, next) => {
        let path = req.path;
                
        if(path.includes('admin'))
        {
            //******************************************** */
            //admin에 매핑 된 요청들만 admin 세션 사용
            //******************************************** */
            // app.use(
            //     session({
            //         key: config.adminSession.key,
            //         secret: config.adminSession.secret,
            //         cookie: {
            //             maxAge: 1000 * 60 * 60 * 24 * 7, // cookie expire date : 7 days
            //             domain: BaseConstant.SERVER_SUB_HOST,
            //         },
            //         store: sessionStore,
            //         resave: false,
            //         rolling: true, // If you try request everytime, session expired after last 7 days
            //         saveUninitialized: true,
            //     })
            // );

            //******************************************** */
            //  관리자페이지 권한별 페이지 인가관련 설정
            //******************************************** */
            // app.use('/', function (req, res, next) {

            //     let url = req.url;
            //     let urlFlag = true;

            //     if (url.includes('/css') || url.includes('/images') || url.includes('/img') || url.includes('/js') || url == '/login' || url == '/logout' || (url == '/protocol' && req.body.protocol == 'adminLogin')) {
            //         urlFlag = false;
            //     }

            //     if (urlFlag && !req.session.admin) {
            //         res.redirect('/admin/login');
            //     }
            //     else
            //     {
            //         next();
            //     }
            // });
        }
        else
        {
            app.use(
                session({
                    key: config.session.key,
                    secret: config.session.secret,
                    cookie: {
                        httpOnly: true,
                        secure: false,
                        maxAge: 1000 * 60 * 60 * 24 * 7, // 쿠키 유효기간 7일
                    },
                    //store: sessionStore,
                    resave: false,
                    rolling: true, // cookie 값을 요청시마다 받아감 마지막 요청 후 7일 경과되었을때 session expired
                    saveUninitialized: true,
                })
            );
        }
        
        next();
    }
    
};
const express = require('express');
const router = express.Router();
const BaseConstant = require('../util/baseConstant');
const commonUtil = require('../util/commonUtil');
const DataCacheManager = require('../manager/dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();
const config = require('../config/config.json');

// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({ accessKeyId: config.aws.accesskey, secretAccessKey: config.aws.secretAccesskey });

let func = {};

//====================================================
//  Protocol common function
//====================================================
router.post('/', (req, res, next) => {
    let jsonObject = req.body;
    let protocolName = jsonObject['protocol'];

    logger.info('protocolName = ' + protocolName);

    if (func.hasOwnProperty(protocolName) == true) 
    {
        func[protocolName](req, res, next, jsonObject);
    } 
    else 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'Please check protocol');
    }
});

func.sampleAjax = (req, res, next, jsonObject) => {
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '샘플입니다.');
};

//====================================================
//  adminLogout
//====================================================
func.adminLogout = (req, res, next, jsonObject) => {
    req.session.destroy();
    res.clearCookie('naenara_admin_secret');
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '로그아웃이 완료되었습니다.');
};

//====================================================
//  adminLogin
//====================================================
func.adminLogin = (req, res, next, jsonObject) => {
    //sendJson
    let sendJsonObject = {};

    let id = jsonObject['id'];
    let password = jsonObject['password'];

    //디바이스 아이디 쿠키 저장 필요

    let successCallBack = function(member){
        if (commonUtil.isBlankData(member)) 
        {
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '아이디 비밀번호를 확인해주세요.', sendJsonObject);
        } 
        else 
        {
            if(0 < member.memberGrade)
            {
                if (member.password == password) 
                {
                    // let member = rtnDataMember[0][0];
                    req.session.admin = member;
                    delete req.session.admin.password;
        
                    let store = req.sessionStore;
        
                    store.all(function (err, sessions) {
                        if (err) 
                        {
                            console.log(':err = ' + err);
                        }
                        for (var sid in sessions) 
                        {
                            var ses = sessions[sid];
                            if (ses.admin && ses.admin.memberUID == member.memberUID) 
                            {
                                store.destroy(sid, function (err, data) {});
                            }
                        }
    
                        req.session.save(function () {
                            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '로그인이 완료되었습니다.', sendJsonObject);
                        });
                    });
                } 
                else 
                {
                    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '로그인 정보를 확인해주세요.', sendJsonObject);
                }
            }
            else
            {
                commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '권한이 없습니다.', sendJsonObject);
            }
        }
    }

    let failedCallBack = function(){
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '로그인이 실패했습니다. 문제가 지속될 시 관리자에게 문의 해주세요.');
    };

    dataCacheManager.memberLoginCustom(id, successCallBack, failedCallBack);
};

















//====================================================
//  Notice
//====================================================
func.insertNotice = async (req, res, next, jsonObject) => {
    if (commonUtil.isBlankData(jsonObject.category) || commonUtil.isBlankData(jsonObject.title) || commonUtil.isBlankData(jsonObject.contents)) 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'please check parameter');
        return;
    }

    let result = await dataCacheManager.insertNotice(jsonObject);
    
    let resultObject = {};
    resultObject.noticeUID = result[1][0]['noticeUID'];
    resultObject.uspRtn = result[2][0]['uspRtn'];
    
    if (resultObject.uspRtn != BaseConstant.VALUE_RESULT_CODE_SUCCESS) 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '공지사항 입력을 실패했습니다.');
    }
    else
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '공지사항 입력을 완료했습니다.');
    }
};

func.updateNotice = async (req, res, next, jsonObject) => {
    if (commonUtil.isBlankData(jsonObject.noticeUID) || commonUtil.isBlankData(jsonObject.category) || commonUtil.isBlankData(jsonObject.title) || commonUtil.isBlankData(jsonObject.contents)) 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'please check parameter');
        return;
    }

    let result = await dataCacheManager.updateNotice(jsonObject);

    let resultObject = {};
    resultObject.uspRtn = result[1][0]['uspRtn'];

    if (resultObject.uspRtn != BaseConstant.VALUE_RESULT_CODE_SUCCESS) 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '공지사항 업데이트를 실패했습니다.');
    }
    else
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '공지사항 업데이트를 완료했습니다.');
    }
};

func.deleteNotice = async (req, res, next, jsonObject) => {
    let noticeUID = jsonObject.noticeUID;

    if (commonUtil.isBlankData(noticeUID)) 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'please check parameter');
        return;
    }

    let result = await dataCacheManager.deleteNotice(noticeUID);
    
    let resultObject = {};
    resultObject.uspRtn = result[1][0]['uspRtn'];

    if (resultObject.uspRtn != BaseConstant.VALUE_RESULT_CODE_SUCCESS) 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '공지사항 삭제를 실패했습니다.');
    }
    else
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '공지사항 삭제를 완료했습니다.');
    }
};

module.exports = router;

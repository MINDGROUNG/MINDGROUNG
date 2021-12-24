const express = require('express');
const router = express.Router();
const config = require('../config/config.json');
const mysql = require('mysql');
const connection = mysql.createConnection(config.database);
connection.on('error', function () {});
const moment = require('moment');
const request = require('request');
const commonUtil = require('../util/commonUtil.js');
const DataCacheManager = require('../manager/dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();
const DataCacheManagerMongo = require('../manager/dataCacheManagerMongo');
const dataCacheManagerMongo = DataCacheManagerMongo.getInstance();
const BaseConstant = require('../util/baseConstant');
const test = require('../models/test.js');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares')
const drawRing = require('../manager/drawRingManager');
const passport = require('passport');
const http = require('http');
const bcrypt = require('bcrypt');
const cryptoMod = require('crypto');
const axios = require('axios')
const queryString = require('querystring');


//==================================================
// MongoDB Object
//==================================================
//맨위에 쓰는 것! (require 모아두는 곳)
const MemberData = require('../mongoModels/memberData'); //샘플
const ClassObject = require('../mongoModels/ClassObject');
const ObjectBookmarks = require('../mongoModels/ObjectBookmarks');
const GatheringObject = require('../mongoModels/GatheringObject');
const JournalObject = require('../mongoModels/JournalObject');
const ShareObject = require('../mongoModels/ShareObject');
const EnrollClassInfo = require('../mongoModels/enrollClassInfo');
const ClassAdditionalInfo = require('../mongoModels/classAdditionalInfo');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

//==================================================
// MySQL Object
//==================================================
// 기존 { User } 주석처리 했습니다.
const User = require('../models/user');
const KgPayRequest = require('../models/kgPayRequest');
const KgPayResult = require('../models/kgPayResult');
const testPaySetting = require('../models/testPaySetting');
const classAdditionalInfo = require('../mongoModels/classAdditionalInfo');
const Following = require('../models/following');
const RefundInfo = require('../models/refundInfo');
const Statistics = require('../models/statistics');
const { getPersonalInfo } = require('../util/commonUtil.js');

router.use((req, res, next)=>{
    let user ={};
    let userSearchResult = [];
    if(req.user!=null){
        user = req.user;
        // user.userAttribute = JSON.parse(user.userAttribute);
    }

    if(req.session.userSearchResult != null) {
        userSearchResult = req.session.userSearchResult;
    }
    res.locals.user = user;
    res.locals.userSearchResult = userSearchResult;
    next();
})

router.all('/', isNotLoggedIn, async function (req, res, next) {
    let profile = {};
    getMapData()
    // 소셜 로그인 실패시 회원가입 및 session에 저장되는 socialSingUpFlag 체크
    try
    {
        if(req.session.socialSignUpFlag !== null && req.session.socialSignUpFlag !== undefined)
        {
            profile.socialSignUpFlag = req.session.socialSignUpFlag;
            req.session.socialSignUpFlag = null;

            if(req.session.socialId !== null && req.session.socialId !== undefined)
            {
                profile.socialId = req.session.socialId;
                req.session.socialId = null;
            }
            if(req.session.socialEmail !== null && req.session.socialEmail !== undefined)
            {
                profile.socialEmail = req.session.socialEmail;
                req.session.socialEmail = null;
            }
        }
    }
    catch(e) 
    {
        console.log('socialSignUpFlag null');
    }

    const thisDate = new Date();
    let statistics = {};
    try{

        let formedThisDate = commonUtil.getFormedDate(thisDate)
        statistics = await commonUtil.getStatistics(formedThisDate);

    } catch(err){
        console.log(err)
    }

    console.log(JSON.stringify(statistics) + '         ######################');

    // commonUtil.

    // index 페이지 mainRing 이미지 조회 및 클래스 관리 목록 데이터
    // mainRing 이미지를 위한 uid 조회 : mysql user findAll
    // 클래스 관리 목록 출력을 위한 classObject 조회 : mongoose classObject find
    // mysql
    User.findAll({ attributes : [ 'userUID', 'thumbNail' ],
                    where : { 
                        hostType : {
                            [Op.ne]: null
                        }
                    }
                })
    .then( (resultUserUID) => {
        console.log('userUID result = ' + JSON.stringify(resultUserUID));

        // mongoose
        ClassObject.find({dormancy: 'live'}).sort({'regedate' : -1}).lean()
        .then( (resultClassObject) => {
            // console.log('ClassObject result = ' + JSON.stringify(resultClassObject));

            let tempClassObject = {};
            let sendClassObject = {};
            
            let mindArray = [];
            let mediArray = [];
            let yogaArray = [];
            let somaArray = [];
            let actiArray = [];
            let cochArray = [];
            let otherArray = [];
            
            tempClassObject = resultClassObject;
        
            // 저널 상세보기에서 랜덤으로 판매중이며 같은 카테고리의 클래스 출력하기
            for(let i = 0; i < tempClassObject.length; i++) {
                if(tempClassObject[i].objectType == 'class') {
                    if(tempClassObject[i].classObject.mainCategory == 'Mindfulness') {
                        mindArray.push(tempClassObject[i]);
                    }
                    if(tempClassObject[i].classObject.mainCategory == 'Meditation') {
                        mediArray.push(tempClassObject[i]);
                    }
                    if(tempClassObject[i].classObject.mainCategory == 'Yoga') {
                        yogaArray.push(tempClassObject[i]);
                    }
                    if(tempClassObject[i].classObject.mainCategory == 'Somatic') {
                        somaArray.push(tempClassObject[i]);
                    }
                    if(tempClassObject[i].classObject.mainCategory == 'Movement & Activity') {
                        actiArray.push(tempClassObject[i]);
                    }
                    if(tempClassObject[i].classObject.mainCategory == 'Counseling & Coaching') {
                        cochArray.push(tempClassObject[i]);
                    }
                    if(tempClassObject[i].classObject.mainCategory == 'Others') {
                        otherArray.push(tempClassObject[i]);
                    }
                }
            }
        
            // 카테고리별 랜덤으로 3개만 출력하기 위한 작업
            if(mindArray.length > 3) {
                while(mindArray.length != 3) {
                    let tempRandom = Math.floor(Math.random() * mindArray.length);
        
                    mindArray.splice(tempRandom, 1);
                }
            }
        
            if(mediArray.length > 3) {
                while(mediArray.length != 3) {
                    let tempRandom = Math.floor(Math.random() * mediArray.length);
        
                    mediArray.splice(tempRandom, 1);
                }
            }
        
            if(yogaArray.length > 3) {
                while(yogaArray.length != 3) {
                    let tempRandom = Math.floor(Math.random() * yogaArray.length);
        
                    yogaArray.splice(tempRandom, 1);
                }
            }
        
            if(somaArray.length > 3) {
                while(somaArray.length != 3) {
                    let tempRandom = Math.floor(Math.random() * somaArray.length);
        
                    somaArray.splice(tempRandom, 1);
                }
            }
        
            if(actiArray.length > 3) {
                while(actiArray.length != 3) {
                    let tempRandom = Math.floor(Math.random() * actiArray.length);
        
                    actiArray.splice(tempRandom, 1);
                }
            }
        
            if(cochArray.length > 3) {
                while(cochArray.length != 3) {
                    let tempRandom = Math.floor(Math.random() * cochArray.length);
        
                    cochArray.splice(tempRandom, 1);
                }
            }
        
            if(otherArray.length > 3) {
                while(otherArray.length != 3) {
                    let tempRandom = Math.floor(Math.random() * otherArray.length);
        
                    otherArray.splice(tempRandom, 1);
                }
            }
        
            sendClassObject['Mindfulness'] = mindArray;
            sendClassObject['Meditation'] = mediArray;
            sendClassObject['Yoga'] = yogaArray;
            sendClassObject['Somatic'] = somaArray;
            sendClassObject['Movement_Activity'] = actiArray;
            sendClassObject['Counseling_Coaching'] = cochArray;
            sendClassObject['Others'] = otherArray;

            ClassAdditionalInfo.find({}).sort({'regedate' : -1}).lean()
            .then((additionalInfoObject)=>{
                res.render('web/view/index.html', { req: req, profile: profile, resultUserUID: resultUserUID, resultClassObject: resultClassObject, sendClassObject: sendClassObject, additionalInfoObject : additionalInfoObject, statistics : statistics });
            })
        })
        .catch( (error) => {
            console.log('ClassObject find failed' + error);

            // error가 발생하면 req와 profile, resultUserUID만 넘긴다.
            console.log('ClassObject find failed' + error);
            res.render('web/view/index.html', { req: req, profile: profile, resultUserUID: resultUserUID, statistics : statistics });
            console.log('isAuthenticated() : ' + req.isAuthenticated());
        });

    })
    .catch((error) => {
        console.log('User findAll failed : ' + error);
        
        // error가 발생하면 req와 profile만 넘긴다.
        res.render('web/view/index.html', { req: req, profile: profile });
        console.log('isAuthenticated() : ' + req.isAuthenticated());
    });

    async function getMapData(){
        let mapData = {};
        const userNum = await User.count({})
        console.log(`get user num ########### ${userNum}`)
    }


});

router.all('/paytest', async function (req, res, next) {
    res.render('web/view/paytest/paytest.html', { req: req , moment: moment});
});

router.all('/INIStdPayReturn', async function (req, res, next) {
    console.log("req.body = " + JSON.stringify(req.body))
    res.end(JSON.stringify(req.body));
});

router.all('/', isLoggedIn, async function (req, res, next) {
    res.render('web/view/index.html', { req: req });
});

router.all('/logout', async function(req, res, next){
    req.logout();
    res.redirect('/');
})

router.all('/login/facebook',
     passport.authenticate('facebook'));

router.all('/oauth/facebook/callback', 
    passport.authenticate('facebook',{
        successRedirect: '/',
        failureRedirect: '/'
      })
)

router.all('/login/google',
     passport.authenticate('google', {scope:['profile', 'email']}
     )
);

router.all('/oauth/google/callback', 
    passport.authenticate('google',{
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash : false
      })
);

router.all('/login/apple',
     passport.authenticate('apple')
);

router.all('/oauth/apple/callback', 
    passport.authenticate('apple',{
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash : false
      })
);

router.all('/afterLogin', async function (req, res, next) {
    let listClassObject = [];
    let listGatheringEventArray = [];
    let listGatheringObject = [];
    let listJournalObject = [];
    let listAllObject = [];

    // MongoDB의 ClassObject 불러오기
    ClassObject.find({dormancy: 'live'}).sort({'regedate' : -1}).limit(30).lean()
    // lean()다음 실행
    .then(function(resultClassObject){
        listAllObject = resultClassObject;
        
        for(let i = 0; i < resultClassObject.length; i++) {
            if(resultClassObject[i].objectType == 'class') {
                listClassObject.push(resultClassObject[i]);
            }

            if(resultClassObject[i].objectType == 'gathering') {
                listGatheringObject.push(resultClassObject[i]);
            }

            if(resultClassObject[i].objectType == 'journal') {
                listJournalObject.push(resultClassObject[i]);
            }
        }

        User.findAll({ attributes : ['userUID', 'userName', 'hostType']})
        .then((userList)=>{
            userList = userList.sort(()=> Math.random() - 0.5);
            if(userList.length>30){
                userList = userList.slice(0, 30);
            }

            // 업커밍 확인을 위한 인터넷 시간
            let todayeNowDate = new Date();
            let todayeNowYear = todayeNowDate.getFullYear();
            let todayeNowMonth = ('0' + (1 + todayeNowDate.getMonth())).slice(-2);
            todayeNowDate = ('0' + todayeNowDate.getDate()).slice(-2);
            let todayDate = todayeNowYear + '-' + todayeNowMonth + '-' + todayeNowDate;

            for(let i = 0; i < listGatheringObject.length; i++) {
                let tempRandom = Math.floor(Math.random() * listAllObject.length);

                // 업커밍 이벤트 최대 10개로 제한
                if(listGatheringEventArray.length == 10) {
                    break;
                }         
                
                // 하나의 게더링에서 최대 2개의 업커밍 이벤트만 담기
                let eventCount = 0;
                for(let j = 0; j < listGatheringObject[i].gatheringEvent.length; j++) {
                    if(eventCount >= 1) {
                        continue;
                    }

                    var checkInclude = false;
                    // 승인된 업커밍 이벤트만 listGatheringEventArray에 push한다.
                    for(let j = 0; j < listGatheringObject[i].gatheringMember.length; j++) {
                        if(listGatheringObject[i].gatheringMember[j].userUID == req.session.passport.user.userUID) {
                            checkInclude = true;
                            break;
                        }
                    }

                    if(checkInclude) {
                        if(listGatheringObject[i].gatheringEvent[j].gatheringApproved == 'approve') {
                            if(todayDate < listGatheringObject[i].gatheringEvent[j].gatheringEventDate) {
                                listGatheringObject[i].gatheringEvent[j]['objectType'] = 'gatheringEvent';
                                listGatheringEventArray.push(listGatheringObject[i].gatheringEvent[j]);
                                listAllObject.splice(tempRandom, 0, listGatheringObject[i].gatheringEvent[j]);
                                eventCount++;
                            }
                        }
                    }
                }
            }

            res.render('web/view/afterLogin.html', { req: req, listClassObject: listClassObject, listGatheringObject: listGatheringObject, userList: userList, listGatheringEventArray: listGatheringEventArray, listJournalObject: listJournalObject, listAllObject: listAllObject });
        })
    })
    // 에러 처리
    .catch((err)=>{
        console.log("err =  " + err);
        res.render('web/view/afterLogin.html', { req: req, listClassObject: listClassObject });
    });
});

router.all('/mypage/:userUID', async function (req, res, next) {
    const userUID = req.params.userUID;

    let myPageUserInfo = await User.findOne({ where : {userUID: userUID} });

    const userActivityInfo = await commonUtil.getUserActivityInfo(userUID);
    // MongoDB의 ClassObject 불러오기
    ClassObject.find({"objectType": "class"}).lean()
    // lean()다음 실행
    .then(function(originListClassObject){
        let listUserUID = [];
        for(let i = 0; i < originListClassObject.length; i++)
        {
            let mongoUserUID = originListClassObject[i].userUID;

            listUserUID.push(mongoUserUID);
        }
        
        // mongo의 UID로 mysql의 userUID가 일치하는 정보의 HostName을 가져온다.
        User.findAll({ where : { userUID : {[Op.in]: listUserUID} } })
        
        // Success
        .then(function(result){
            let mapUserName = {};

            for(let i = 0; i < result.length; i++)
            {
                mapUserName[result[i].userUID] = result[i].userName;
            }

            for(let i = 0; i < originListClassObject.length; i++)
            {
                let mongoUserUID = originListClassObject[i].userUID;

                originListClassObject[i].userName = mapUserName[mongoUserUID];
            }

            EnrollClassInfo.find({userUID: userUID}).sort({'regedate': -1})
            .then(function(result){
                let enrollClassInfo = [];
                let enrollGatheringInfo = [];
                for(let i = 0; i < result.length; i++) {
                    if(result[i].objectType == 'class') {
                        enrollClassInfo.push(result[i]);
                    }

                    if(result[i].objectType == 'gathering') {
                        enrollGatheringInfo.push(result[i]);
                    }
                }

                ClassAdditionalInfo.find({reviewerUID: userUID})
                .then(function(result){
                    let classAdditionalInfo = result;

                    // ===============
                    let listClassObject = [];
                    let listGatheringEventArray = [];
                    let listGatheringObject = [];
                    let listJournalObject = [];
                    let listAllObject = [];
                    let journalObject = [];

                    // MongoDB의 ClassObject 불러오기
                    ClassObject.find({dormancy: 'live', userUID: userUID}).sort({'regedate' : -1}).lean()
                    // lean()다음 실행
                    .then(function(resultClassObject){
                        listAllObject = resultClassObject;
                        
                        for(let i = 0; i < resultClassObject.length; i++) {
                            if(resultClassObject[i].objectType == 'class') {
                                listClassObject.push(resultClassObject[i]);
                            }

                            if(resultClassObject[i].objectType == 'gathering') {
                                listGatheringObject.push(resultClassObject[i]);
                            }

                            if(resultClassObject[i].objectType == 'journal') {
                                listJournalObject.push(resultClassObject[i]);

                                if(userUID == resultClassObject[i].userUID) {
                                    journalObject.push(resultClassObject[i]);
                                }
                            }
                        }

                        User.findAll({ attributes : ['userUID', 'userName', 'hostType']})
                        .then((userList)=>{
                            console.log(JSON.stringify(userList[0]));
                            userList = userList.sort(()=> Math.random() - 0.5);
                            if(userList.length>30){
                                userList = userList.slice(0, 30);
                            }

                            // 업커밍 확인을 위한 인터넷 시간
                            let todayeNowDate = new Date();
                            let todayeNowYear = todayeNowDate.getFullYear();
                            let todayeNowMonth = ('0' + (1 + todayeNowDate.getMonth())).slice(-2);
                            todayeNowDate = ('0' + todayeNowDate.getDate()).slice(-2);
                            let todayDate = todayeNowYear + '-' + todayeNowMonth + '-' + todayeNowDate;

                            for(let i = 0; i < listGatheringObject.length; i++) {
                                let tempRandom = Math.floor(Math.random() * listAllObject.length);
                
                                // 업커밍 이벤트 최대 10개로 제한
                                if(listGatheringEventArray.length == 10) {
                                    break;
                                }         
                                
                                // 하나의 게더링에서 최대 2개의 업커밍 이벤트만 담기
                                let eventCount = 0;
                                for(let j = 0; j < listGatheringObject[i].gatheringEvent.length; j++) {
                                    if(eventCount >= 1) {
                                        continue;
                                    }
                
                                    var checkInclude = false;
                                    // 승인된 업커밍 이벤트만 listGatheringEventArray에 push한다.
                                    for(let j = 0; j < listGatheringObject[i].gatheringMember.length; j++) {
                                        if(req.session.passport == null || req.session.passport == undefined ||req.session.passport == '') {
                                            break;    
                                        } else {
                                            if(listGatheringObject[i].gatheringMember[j].userUID == req.session.passport.user.userUID) {
                                                checkInclude = true;
                                                break;
                                            }
                                        }
                                    }
                
                                    if(checkInclude) {
                                        if(listGatheringObject[i].gatheringEvent[j].gatheringApproved == 'approve') {
                                            if(todayDate <= listGatheringObject[i].gatheringEvent[j].gatheringEventDate) {
                                                listGatheringObject[i].gatheringEvent[j]['objectType'] = 'gatheringEvent';
                                                listGatheringEventArray.push(listGatheringObject[i].gatheringEvent[j]);
                                                listAllObject.splice(tempRandom, 0, listGatheringObject[i].gatheringEvent[j]);
                                                eventCount++;
                                            }
                                        }
                                    }
                                }
                            }

                            res.render('web/view/mypage.html', { req: req, myPageUserInfo: myPageUserInfo, originListClassObject: originListClassObject, enrollClassInfo:enrollClassInfo, classAdditionalInfo:classAdditionalInfo, userActivityInfo: userActivityInfo, listClassObject: listClassObject, listGatheringObject: listGatheringObject, userList: userList, listGatheringEventArray: listGatheringEventArray, listJournalObject: listJournalObject, listAllObject: listAllObject, journalObject: journalObject, enrollGatheringInfo: enrollGatheringInfo });
                        })
                    })
                    // 에러 처리
                    .catch((err)=>{
                        console.log("err =  " + err);
                        res.render('web/view/mypage.html', { req: req, myPageUserInfo: myPageUserInfo, originListClassObject: originListClassObject, enrollClassInfo:enrollClassInfo, classAdditionalInfo:classAdditionalInfo, userActivityInfo: userActivityInfo, enrollGatheringInfo: enrollGatheringInfo});
                    });
        // ================
                })
            })
        })
        // Failed
        .catch(function(error){
            console.log(error);
            res.render('500.html', { req: req });
        })
    })
    // 에러 처리
    .catch((err)=>{
        console.log("err =  " + err);
        res.redirect('/');
    });
});

router.all('/setting', async function (req, res, next) {
    console.log('Setting Page router');

    if(!req.isAuthenticated()) {
        res.redirect('/');
    } 

    let userData = req.session.passport.user;

    
    res.render('web/view/setting.html', { req: req, userData: userData });
});

router.all('/privacyUpdate', async function(req, res) {
    let requestData = req.body;

    await User.update(
        { 
            myPageAccess: requestData.myPageAccess,
            myPageCommunityAccess: requestData.myPageCommunityAccess,
            myPageClassAccess: requestData.myPageClassAccess,
            myPageGatheringAccess: requestData.myPageGatheringAccess,
            myPageJournalAccess: requestData.myPageJournalAccess
        }, 
        { 
            where: { userUID: req.session.passport.user.userUID } 
        })
    .then( (success) => {
        req.session.passport.user.myPageAccess = requestData.myPageAccess;
        req.session.passport.user.myPageCommunityAccess = requestData.myPageCommunityAccess;
        req.session.passport.user.myPageClassAccess = requestData.myPageClassAccess;
        req.session.passport.user.myPageGatheringAccess = requestData.myPageGatheringAccess;
        req.session.passport.user.myPageJournalAccess = requestData.myPageJournalAccess;

        res.status(200).send();
    })
    .catch( (error) => {
        console.log('Privacy Update Failed : ' + error);

        res.status(500).send();
    });
});


router.all('/setting', async function (req, res){
    User.update(req.params.userUID, req.body, 
        { 
            new : true
        }
        , function(err, user) 
        {
            if(err) return res.status(500).send("USER SETTING 수정 실패");
            res.status(200).send(user + "USER SETTING 수정 성공");
        });
});

router.all('/classDevelopListing', async function (req, res, next) {
    res.render('web/view/classDevelopListing.html', { req: req });
});


router.all('/classMain', async function (req, res, next) {
    let listClassObject = {};
    let requestFilterType = req.query.filter ? req.query.filter : 'noFilter';
    console.log(requestFilterType);

    // mongoose
    ClassObject.find({dormancy: 'live'}).sort({'regedate' : -1}).lean()
    .then( (resultClassObject) => {
        // console.log('ClassObject result = ' + JSON.stringify(resultClassObject));

        listClassObject = resultClassObject;

        res.render('web/view/classMain.html', { req: req, listClassObject : listClassObject, requestFilterType: requestFilterType});
    })
    .catch( (error) => {
        // error
        console.log('ClassObject find failed' + error);

        res.render('web/view/500.html', { req: req });
    });
});

router.all('/classProgramListing/:classId', async function (req, res, next) {
    console.log(`get obje t : ${req.params.classId}` )
    const classObject = await ClassObject.findOne({_id: req.params.classId}).lean()
    const writer = await User.findOne({where :{userUID:classObject.userUID}});
    res.render('web/view/classProgramListing.html', { req: req, ClassObject: classObject, writer: writer, listClassObject : [] });
});

router.all('/classParticipate/:classId', async function (req, res, next) {
    console.log(JSON.stringify(req.session.passport.user.userUID))
    const classObject = await ClassObject.findOne({_id: req.params.classId})
    const writer = await User.findOne({where :{userUID:classObject.userUID}});
    const enrollClassInfo = await EnrollClassInfo.findOne({userUID:req.session.passport.user.userUID, classID: req.params.classId})
    writer.introduce=JSON.stringify(writer.introduce);
    res.render('web/view/classParticipate.html', { req: req, ClassObject: classObject, writer: writer, enrollClassInfo: enrollClassInfo, listClassObject : []} );
});

router.all('/classParticipateContents/:classId.:chapter.:content', async function (req, res, next) {
    const classObject = await ClassObject.findOne({_id: req.params.classId})
    const enrollClassInfo = await EnrollClassInfo.findOne({userUID:req.session.passport.user.userUID, classID: req.params.classId})
    res.render('web/view/classParticipateContents.html', { req: req, ClassObject: classObject, enrollClassInfo: enrollClassInfo, classId:req.params.classId, chapter:req.params.chapter, content:req.params.content});
});


router.all('/gatheringMain', async function (req, res, next) {
    let listGatheringObject = [];

    // MongoDB에서 gathering 정보를 조회한다.
    ClassObject.find({dormancy: 'live', objectType: 'gathering'}).sort({'regedate' : -1}).lean()
    .then( (resultGatheringObject) => {
        
        for(let i = 0; i < resultGatheringObject.length; i++) {
            listGatheringObject.push(resultGatheringObject[i]);
        }
        
        res.render('web/view/gatheringMain.html', { req: req, listGatheringObject: listGatheringObject });
    })
    .catch( (error) => {
        console.log('gathering Object find failed = ' + error);
        
        res.render('web/view/gatheringMain.html', { req: req, listGatheringObject: listGatheringObject });
    });
});

router.all('/gatheringDetail/:gatheringId', async function(req, res, next) {
    let gatheringObject = {};
    let gatheringWriter = {};
    let joinFlag = false;
    
    await ClassObject.findOne({_id : req.params.gatheringId}).lean()
    .then( (resultGatheringObject) => {
        gatheringObject = resultGatheringObject;
    })
    .catch( (error) => {
        res.render('web/view/500.html', { req: req });
    });

    await User.findOne({ where : { userUID : gatheringObject.userUID } })
    .then( (resultGatheringWriter) => {
        gatheringWriter = resultGatheringWriter;
    })
    .catch( (error) => {
        res.render('web/view/500.html', { req: req });
    });

    if(req.isAuthenticated())
    {
        let checkMember = req.session.passport.user.userUID;

        let joinFlag = gatheringObject.gatheringMember.findIndex( index => index.userUID === Number(checkMember));

        if(joinFlag !== -1)
        {
            after();
        }
        else
        {
            before();
        }
    }
    else
    {
        before();
    }
    
    function before() {
        return res.render('web/view/gatheringBeforeJoin.html', { req : req, gatheringObject : gatheringObject, gatheringWriter : gatheringWriter });
    }

    function after() {
        res.render('web/view/gatheringAfterJoin.html', { req : req, gatheringObject : gatheringObject, gatheringWriter : gatheringWriter });
    }
});

router.all('/gatheringJoin', async function(req, res, next) {
    let gatheringID = req.body.gatheringID;
    let userUID = req.body.userUID;
    let userName = req.body.userName;
    let hostType = req.body.hostType;

    let gatheringData = await ClassObject.findById(gatheringID);

    let userInfo = await User.findOne({ where : {userUID: userUID} });

    let joinFlag = gatheringData.gatheringMember.findIndex( index => index.userUID === Number(userUID));

    if(joinFlag === -1)
    {
        gatheringData.gatheringMember.push({"userUID" : userUID, "userName" : userName, "hostType" : hostType , "authority" : "normal"});
        gatheringData.markModified('gatheringMember');

        await gatheringData.save( (error) => {
            if(error)
            {
                console.log('save error : ' + error);

                res.status(500).json({ 'message' : '가입에 실패하였습니다.'});
            }

            let enrollClassInfo = new EnrollClassInfo;
            enrollClassInfo.userUID = userInfo.userUID;
            enrollClassInfo.userName = userInfo.userName;
            enrollClassInfo.classID = gatheringID;
            enrollClassInfo.objectType = 'gathering';
            enrollClassInfo.classInfo = gatheringData;
            
            enrollClassInfo.save( (error) => {
                if(error) {
                    console.log(error);
                    res.status(500).send();
                }
    
                res.status(200).send();
            });
        });
    }
    else
    {
        res.status(500).json({'status' : 'already', 'message' : '이미 가입되어있습니다.'});
    }
});

router.all('/gatheringLeave', async function(req, res, next) {
    let gatheringID = req.body.gatheringID;
    let userUID = req.body.userUID;

    let gatheringData = await ClassObject.findById(gatheringID);

    let userIndex = gatheringData.gatheringMember.findIndex( index => index.userUID === Number(userUID));

    if(gatheringData.gatheringMember[userIndex].authority !== 'administrator')
    {
        gatheringData.gatheringMember.splice(userIndex, 1);
        gatheringData.markModified('gatheringMember');

        await gatheringData.save( (error) => {
            if(error)
            {
                console.log('save error : ' + error);

                res.status(500).json({ 'message' : '떠나기 실패하였습니다.'});
            }

            EnrollClassInfo.deleteOne({ 
                objectType: 'gathering', 
                classID: gatheringID,
                userUID: userUID })
            .then( (success) => {
                res.status(200).send();
            })
            .catch( (error) => {
                console.log(error);
                res.status(500).send();
            });
        });
    }
    else
    {
        res.status(500).json({'message' : '개설자는 떠날 수 없습니다.'});
    }
});

router.all('/gatheringOperatorSetting', async (req, res, next) => {
    let gatheringID = req.body.gatheringID;
    let originOperator = req.body.originOperator;
    let operatorCheck = req.body.operatorCheck;

    // ※※※※※gatheringObject ID를 ClassObject ID를 넘기도록 변경하기
    let gatheringData = await ClassObject.findById(gatheringID);

    let updateGatheringMember = gatheringData.gatheringMember;

    for(let i = 0; i < updateGatheringMember.length; i++)
    {
        if(updateGatheringMember[i].authority === 'operator')
        {
            updateGatheringMember[i].authority = 'normal';
        }
    }

    if(operatorCheck.length === 0 && originOperator.length !== 0)
    {
        res.status(200).send();
    }

    for(let i = 0; i < updateGatheringMember.length; i++)
    {
        if(updateGatheringMember[i].userUID === Number(operatorCheck[0]))
        {
            updateGatheringMember[i].authority = 'operator';
        }
        
        if(operatorCheck.length > 1)
        {
            if(updateGatheringMember[i].userUID === Number(operatorCheck[1]))
            {
                updateGatheringMember[i].authority = 'operator';
            }
        }
    }

    gatheringData.gatheringMember = updateGatheringMember;

    gatheringData.markModified('gatheringMember');

    await gatheringData.save( (error) => {
        if(error)
        {
            console.log('save error : ' + error);

            res.status(500).json({ 'message' : '운영진 설정을 실패하였습니다.'});
        }
        
        res.status(200).send();
    });
});

router.all('/gathering/eventDetail/:gatheringID/:eventID', async (req, res, next) => {
    let eventData = {};
    let gatheringID = req.params.gatheringID;
    let paramEventID = req.params.eventID;

    // ※※※※※gatheringObject ID를 ClassObject ID를 넘기도록 변경하기
    const gatheringData = await ClassObject.findById(gatheringID);

    let eventIndex = gatheringData.gatheringEvent.findIndex( index => index.eventID === paramEventID);

    eventData = gatheringData.gatheringEvent[eventIndex];

    res.render('web/view/eventDetail.html', { req: req, eventData: eventData, gatheringData: gatheringData });
});

router.all('/journal/edit/:journalID', async (req, res, next) => {
    let journalID = req.params.journalID;

    // ※※※※※journalObject ID를 ClassObjectID를 넘기도록 변경하기
    const journalEditData = await ClassObject.findById(journalID);

    res.render('web/view/journalWrite.html', { req: req, journalEditData: journalEditData });
});

router.all('/eventApprove', async (req, res, next) => {
    let gatheringID = req.body.gatheringID;
    let eventID = req.body.eventID;
    let approveType = req.body.approveType;

    let gatheringData = await ClassObject.findById(gatheringID);

    let findEventIndex = gatheringData.gatheringEvent.findIndex( index => index.eventID === eventID);

    if(approveType === 'reject') {
        gatheringData.gatheringEvent[findEventIndex].gatheringApproved = 'reject';
    } else {
        gatheringData.gatheringEvent[findEventIndex].gatheringApproved = 'approve';
    }
    
    gatheringData.markModified('gatheringEvent');

    await gatheringData.save( (error) => {
        if(error) {
            res.status(500).json({'message' : '승인 및 반려에 실패하였습니다.'});
        }

        res.status(200).send();
    });

});

router.all('/eventJoin', async (req, res, next) => {
    let gatheringID = req.body.gatheringID;
    let eventID = req.body.eventID;
    let userUID = req.body.userUID;

    let userInfo = await User.findOne({ where : {userUID: userUID} });

    let gatheringData = await ClassObject.findById(gatheringID);

    let findEventIndex = gatheringData.gatheringEvent.findIndex( index => index.eventID === eventID);

    let tempArray = gatheringData.gatheringEvent[findEventIndex].eventMember;
    tempArray.push(userUID);
    gatheringData.gatheringEvent[findEventIndex].eventMember = tempArray;
    
    gatheringData.markModified('gatheringEvent');

    await gatheringData.save( (error) => {
        if(error) {
            res.status(500).json({'message' : '참여에 실패하였습니다.'});
        }

        let enrollClassInfo = new EnrollClassInfo;
        enrollClassInfo.userUID = userInfo.userUID;
        enrollClassInfo.userName = userInfo.userName;
        enrollClassInfo.classID = gatheringID;
        enrollClassInfo.eventID = eventID;
        enrollClassInfo.objectType = 'gatheringEvent';
        enrollClassInfo.classInfo = gatheringData.gatheringEvent[findEventIndex];

        enrollClassInfo.save( (error) => {
            if(error) {
                console.log(error);
                res.status(500).send();
            }

            res.status(200).send();
        });
    });
});

router.all('/eventLeave', async (req, res, next) => {
    let gatheringID = req.body.gatheringID;
    let eventID = req.body.eventID;
    let userUID = req.body.userUID;
    
    let gatheringData = await ClassObject.findById(gatheringID);

    let findEventIndex = gatheringData.gatheringEvent.findIndex( index => index.eventID === eventID);

    if(userUID !== gatheringData.gatheringEvent[findEventIndex].eventCreatorUID) {
        if(gatheringData.gatheringEvent[findEventIndex].getheringEventCohost !== null && gatheringData.gatheringEvent[findEventIndex].getheringEventCohost !== undefined && gatheringData.gatheringEvent[findEventIndex].getheringEventCohost !== '') {
            if(gatheringData.gatheringEvent[findEventIndex].getheringEventCohost.coHostUID === userUID) {
                res.status(500).json({'message' : 'co-HOST는 떠날 수 없습니다.'});
            }
        }
        let findUserUID = gatheringData.gatheringEvent[findEventIndex].eventMember.findIndex( index => gatheringData.gatheringEvent[findEventIndex].eventMember[index] === userUID);
        gatheringData.gatheringEvent[findEventIndex].eventMember.splice(findUserUID, 1);
    
        gatheringData.markModified('gatheringEvent');
    
        await gatheringData.save( (error) => {
            if(error) {
                res.status(500).json({'message' : '떠나기에 실패하였습니다.'});
            }

            EnrollClassInfo.deleteOne({ 
                objectType: 'gatheringEvent', 
                classID: gatheringID,
                eventID: eventID, 
                userUID: userUID })
            .then( (success) => {
                res.status(200).send();
            })
            .catch( (error) => {
                console.log(error);
                res.status(500).send();
            });
        });
    } else {
        res.status(500).json({'message' : '이벤트 개설자는 떠날 수 없습니다.'});
    }

    
});

router.all('/hostMain', async (req, res, next) => {
    let listUser = {};
    let listNearUser = {};
    let arrayListNearUser = [];

    try 
    {
        // 모든 호스트, 신규 등록 회원순
        listUser = await  User.findAll ({
            attributes: ['userUID', 'userName', 'hostType', 'userAttribute', 'introduce', 'hostIntroduce', 'career', 'thumbNail'],
            where : { hostType: ['teacher', 'master', 'leader', 'brand', 'creator', 'Master', 'leaders']},
            order : [['userUID','DESC']],
        });

        // 인기순(보류)

        // 가까운순, 비로그인인 경우 가까운순 출력X
        if(req.isAuthenticated())
        {
            console.log('가까운');
            listNearUser = await User.findAll ({ 
                attributes: ['userUID', 'userName', 'hostType', 'userAttribute', 'introduce', 'hostIntroduce', 'career', 'thumbNail', 'country', 'state', 'city', 'streetAddress'],
                where : { 
                    hostType: ['teacher', 'master', 'leader', 'brand', 'creator', 'Master', 'leaders'],
                    country : { [Op.ne] : null},
                    state : { [Op.ne] : null },
                    city : { [Op.ne] : null }
                },
            });

            if(req.session.passport.user)
            {
                let loginUser = req.session.passport.user;

                for(let i = 0; i < listNearUser.length; i++)
                {
                    let tempUserCity = loginUser.city.replace(/(\s*)/g, '');
                    
                    if(listNearUser[i] !== undefined)
                    {
                        let tempListCity = listNearUser[i].city.replace(/(\s*)/g, '');

                        if(tempListCity.includes(tempUserCity))
                        {
                            if(arrayListNearUser.length >= 100)
                            {
                                break;
                            }

                            arrayListNearUser.push(listNearUser[i]);
                            listNearUser.splice(i, 1);
                        }
                    }
                }

                if(arrayListNearUser.length <= 100)
                {
                    for(let i = 0; i < listNearUser.length; i++)
                    {
                        let tempUserState = loginUser.state.replace(/(\s*)/g, '');

                        if(listNearUser[i] !== undefined)
                        {
                            let tempListState = listNearUser[i].state.replace(/(\s*)/g, '');

                            if(tempUserState.includes('특별시'))
                            {
                                tempUserState = tempUserState.replace('특별시', '');
                            } 
                            else if(tempUserState.includes('특별자치시'))
                            {
                                tempUserState = tempUserState.replace('특별자치시', '');
                            }
                            else if(tempUserState.includes('특별자치도'))
                            {
                                tempUserState = tempUserState.replace('특별자치도', '');
                            }
                            else if(tempUserState.includes('광역시'))
                            {
                                tempUserState = tempUserState.replace('광역시', '');
                            }

                            if(tempListState.includes(tempUserState))
                            {
                                if(arrayListNearUser.length >= 100)
                                {
                                    break;
                                }

                                arrayListNearUser.push(listNearUser[i]);
                                listNearUser.splice(i, 1);
                            }
                        }
                    }
                }
                
                if(arrayListNearUser.length <= 100)
                {
                    for(let i = 0; i < listNearUser.length; i++)
                    {
                        let tempUserCountry = loginUser.country.replace(/(\s*)/g, '');
                        
                        if(listNearUser[i] !== undefined)
                        {
                            let tempListCountry = listNearUser[i].country.replace(/(\s*)/g, '');
                            
                            if(tempUserCountry.includes('특별시'))
                            {
                                tempUserCountry = tempUserCountry.replace('특별시', '');
                            } 
                            else if(tempUserCountry.includes('특별자치시'))
                            {
                                tempUserCountry = tempUserCountry.replace('특별자치시', '');
                            }
                            else if(tempUserCountry.includes('특별자치도'))
                            {
                                tempUserCountry = tempUserCountry.replace('특별자치도', '');
                            }
                            else if(tempUserCountry.includes('광역시'))
                            {
                                tempUserCountry = tempUserCountry.replace('광역시', '');
                            }

                            if(tempListCountry.includes(tempUserCountry))
                            {
                                if(arrayListNearUser.length >= 100)
                                {
                                    break;
                                }

                                arrayListNearUser.push(listNearUser[i]);
                                listNearUser.splice(i, 1);
                            }
                        }
                    }
                }
            }
        }

        res.render('web/view/hostMain.html', { req:req, listUser : listUser, arrayListNearUser : arrayListNearUser });
    } 
    catch (err)
    {
        console.error(err);
        next(err);
    }
});

router.all('/hostMain', async function (req, res, next) {
    res.render('web/view/hostMain.html', { req: req });
});


router.all('/hostStudio/:contents', async function (req, res, next) {
    let contents = req.params.contents
    console.log('get content : ' + contents);
    res.render('web/view/hostStudio.html', { req: req, contents : contents });
});

router.all('/hostStudio', async function (req, res, next) {
    // passport에 저장된 유저 데이터 확인
    // console.log("req.session.passport.user =  " + req.session.passport.user)
    let payInfo = {};
    let requestLangType = req.query.clang ? req.query.clang : 'ko';

    ///MySQL 유저 정보 불러오기
    User.findOne({
        where : { 
            userEmail: req.session.passport.user.userEmail }})
    //Success CallBack
    .then(
        function (users) 
        {
            console.log("commonUtil.getUserisPayment(users.paymentExpireDate) = " + commonUtil.getUserisPayment(users.paymentExpireDate))

            //ClassObject 불러오기
            ClassObject.find({userUID:users.userUID, objectType: 'class'}).lean()
            //lean()다음 실행
            .then((listClassObject)=>{
                // console.log("classObject  = " + JSON.stringify(listClassObject));
                ClassAdditionalInfo.find({writerUID:users.userUID}).lean()
                .then((additionalInfo)=>{

                    // 결제정보 불러오기
                    testPaySetting.findOne({ where : {userUID : users.userUID}})
                    .then( async (payInfoObject) => {
                        // console.log('payInfo find success : ' + JSON.stringify(payInfoObject));
                        let kgPayResult = {};
                        let payResultDistinctArray = [];
                        await KgPayResult.findAll({
                            where : {
                                goodSellerUID: users.userUID,
                                goodType: 'class',
                                resultCode: '0000'
                            },

                            order: [
                                ['createdAt', 'DESC']
                            ]
                        })
                        .then( (result) => {
                            kgPayResult = result;
                            let tempPayResult = result;

                            let tempResultObject = {};
                            for(let i = 0; i < tempPayResult.length; i++) {
                                let tempSum = 0;
                                let tempID = tempPayResult[i].goodUID;
                                for(let j = 0; j < tempPayResult.length; j++) {
                                    if(tempID == tempPayResult[j].goodUID) {
                                        tempSum = Number(tempSum) + Number(tempPayResult[j].totalPrice);
                                    }
                                }

                                tempResultObject[tempID] =  tempSum;
                            }

                            for(let key in tempResultObject) {
                                payResultDistinctArray.push(key+ '/' + tempResultObject[key]);
                            }
                        
                            res.render('web/view/hostStudio.html', { req: req, contents: 'dashBoard', listClassObject : listClassObject , isNeedPayment: commonUtil.getUserisPayment(users.paymentExpireDate), payInfo : payInfo, classAdditionalInfo:additionalInfo, kgPayResult: kgPayResult, payResultDistinctArray: payResultDistinctArray });
                        })
                        .catch( (error) => {
                            console.log('get error ' + error)
                            payInfo = payInfoObject;
                            res.render('web/view/hostStudio.html', { req: req, contents: 'dashBoard', listClassObject : listClassObject , isNeedPayment: commonUtil.getUserisPayment(users.paymentExpireDate), payInfo : payInfo, classAdditionalInfo:additionalInfo, kgPayResult: kgPayResult, payResultDistinctArray: payResultDistinctArray});
                        });
                        
                       

                    })
                    .catch( (error) => {
                        // console.log('payInfo find Failed : ' + error);
                        res.render('web/view/hostStudio.html', { req: req, contents: 'dashBoard', listClassObject : listClassObject , isNeedPayment: commonUtil.getUserisPayment(users.paymentExpireDate), payInfo : payInfo, additionalInfo:additionalInfo });
                    });
                })

            })
            //에러 처리
            .catch((err)=>{
                console.log("err =  " + err);
                res.redirect('/');
            });
        }
    )
    //Failed CallBack
    .catch(
        function (err)
        {
            console.error(err);
        }
    );
});

router.all('/classOrder/:classID', async function (req, res, next) {
    console.log(req.params.classID);
    const classObject = await ClassObject.findOne({_id: req.params.classID}).lean();
    console.log(JSON.stringify(classObject));
    res.render('web/view/classOrder.html', { req: req, classObject:classObject});
});

router.all('/classOrderConfirmation/:payResultUID.:classUID', async function (req, res, next) {

    const payResultUID = req.params.payResultUID;
    const classID = req.params.classUID;
    const classObject = await ClassObject.findById(classID).lean();
    const payResult = await KgPayResult.findOne({
        attributes : [ 'payResultUID', 'userUID', 'goodName', 'goodType', 'createdAt', 'totalPrice', 'currency', 'MOID', 'payMethod', 'applDate'],
        where : {
            payResultUID: payResultUID,
            goodType: 'class'
        },
    });
    console.log(JSON.stringify(payResult) + ' result uid')
    console.log(JSON.stringify(classObject) + ' result uid')
    payResult.orderNum = payResult.MOID;
    payResult.price = payResult.totalPrice;
    res.render('web/view/classOrderConfirmation.html', { req: req, classObject: classObject, payInfoObject : payResult, type:'view' });
});

router.all('/payReturnUrl', async function (req, res, next) {
    
    function SHA256(s) {
        var chrsz = 8;
        var hexcase = 0;

        function safe_add(x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 0xffff;
        }

        function S(X, n) {
            return X >>> n | X << 32 - n;
        }
        function R(X, n) {
            return X >>> n;
        }
        function Ch(x, y, z) {
            return x & y ^ ~x & z;
        }
        function Maj(x, y, z) {
            return x & y ^ x & z ^ y & z;
        }
        function Sigma0256(x) {
            return S(x, 2) ^ S(x, 13) ^ S(x, 22);
        }
        function Sigma1256(x) {
            return S(x, 6) ^ S(x, 11) ^ S(x, 25);
        }
        function Gamma0256(x) {
            return S(x, 7) ^ S(x, 18) ^ R(x, 3);
        }
        function Gamma1256(x) {
            return S(x, 17) ^ S(x, 19) ^ R(x, 10);
        }

        function core_sha256(m, l) {
            var K = new Array(0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0xfc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x6ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2);

            var HASH = new Array(0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19);

            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;

            m[l >> 5] |= 0x80 << 24 - l % 32;
            m[(l + 64 >> 9 << 4) + 15] = l;

            for (var i = 0; i < m.length; i += 16) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for (var j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i];else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }

                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        function str2binb(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 24 - i % 32;
            }
            return bin;
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, '\n');
            var utftext = '';

            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    utftext += String.fromCharCode(c >> 6 | 192);
                    utftext += String.fromCharCode(c & 63 | 128);
                } else {
                    utftext += String.fromCharCode(c >> 12 | 224);
                    utftext += String.fromCharCode(c >> 6 & 63 | 128);
                    utftext += String.fromCharCode(c & 63 | 128);
                }
            }

            return utftext;
        }

        function binb2hex(binarray) {
            var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
            var str = '';
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 0xf) + hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 0xf);
            }
            return str;
        }

        s = Utf8Encode(s);
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
    }
    console.log(req.body);
    let user = req.session.passport.user

    let paymentRequestResult = req.body;

    let mid = paymentRequestResult.mid;
    let timeStamp = Date.now();
    let charset = "UTF-8";
    let format = "JSON";
    let authToken = paymentRequestResult.authToken;
    let authUrl = paymentRequestResult.authUrl;
    let signatureRaw = ('authToken='+authToken+'&timestamp='+timeStamp).toString();
    let signature = cryptoMod.createHash('sha256').update(signatureRaw).digest('hex')

    let sendJsonObject = {};
    sendJsonObject['mid'] = mid;
    sendJsonObject['authToken'] = authToken;
    sendJsonObject['signature'] = signature;
    sendJsonObject['timestamp'] = timeStamp;
    sendJsonObject['charset'] = charset;
    sendJsonObject['format'] = format;

    let payInfoObject = {};
    let classObject = {};

    const sendString= queryString.stringify(sendJsonObject);
    axios
      .post(authUrl, sendString, {
        headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
    })
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res)
            let orderNumber = paymentRequestResult.orderNumber;
            console.log(`result code : ${res.data.resultCode}`)
            const resultData = res.data
            const payApproveResult = resultData.resultCode;

            if( payApproveResult =='0000'){
            KgPayRequest.findOne({where : {oid : orderNumber}})
                .then(requestObject =>{
                    let userUID = user.userUID;
                    let userName = user.userName;
                    let userType = user.hostType;
                    let goodType = requestObject.goodType;
                    let goodSellerUID = requestObject.goodSellerUID;
                    let goodSellerName = requestObject.goodSellerName;
                    let goodSellerHostType = requestObject.goodSellerHostType;
                    let goodUID = requestObject.goodUID;
                    let goodName = resultData.goodName;

                    let resultCode = paymentRequestResult.resultCode;
                    let resultMsg = paymentRequestResult.resultMsg;
                    let buyerTel = resultData.buyerTel;
                    let applDate = resultData.applDate;
                    let buyerEmail = resultData.buyerEmail;
                    let buyerName = resultData.buyerName;

                    let cardUsePoint = resultData.CARD_UsePoint;
                    let cardNum = resultData.CARD_Num;
                    let authSignature = sendString;
                    let tid = resultData.tid;

                    let eventCode = resultData.EventCode;
                    let totalPrice = resultData.TotPrice;
                    let payMethod = resultData.PayMethod;
                    let cardMemberNum = resultData.CARD_MemberNum;
                    let MOID = resultData.MOID;
                    let cardPoint = resultData.CARD_Point;
                    let currency = resultData.currency;
                    let cardPurchaseCode = resultData.CARD_PurchaseCode;
                    let cardPrtcCode = resultData.cardPrtcCode;
                    let applTime = resultData.applTime;
                    let cardCheckFlag = resultData.CARD_CheckFlag;
                    let cardCode = resultData.CARD_Code;
                    let cardBankCode = resultData.CARD_BankCode;
                    let cardTerminalNum = resultData.CAR_TerminalNum;
                    let pFnNm = resultData.P_FN_NM;
                    
                    let pSubCnt = resultData.p_SubCnt;
                    let applNum = resultData.applNum;
                    let approveResultCode = payApproveResult;
                    let approveResultMsg = resultData.resultMsg;
                    let cardInterest = resultData.CARD_Interest;
                    let cardApplPrice = resultData.CARD_ApplPrice;
                    let cardGwCode = resultData.CARD_GwCode;
                    let custEmail = resultData.custEmail;
                    let cardExpire = resultData.CARD_Expire;
                    let cardPurchaseName = resultData.CARD_PurchaseName;
                    let payDevice = resultData.payDevice;

                    KgPayResult.create({
                        userUID : userUID,
                        userName : userName,
                        userType: userType,
                        goodType : goodType,
                        orderNumber : orderNumber,
                        goodSellerUID : goodSellerUID,
                        goodSellerName : goodSellerName,
                        goodSellerHostType : goodSellerHostType,
                        goodUID : goodUID,
                        goodName : goodName,
                        resultCode : resultCode,
                        payStatus : 'success',
                        resultMsg : resultMsg,
                        buyerTel : buyerTel,
                        applDate : applDate,
                        buyerEmail : buyerEmail,
                        buyerName : buyerName,
                        cardUsePoint : cardUsePoint,
                        cardNum : cardNum,
                        authSignature : authSignature,
                        tid : tid,
                        eventCode : eventCode,
                        totalPrice : totalPrice,
                        payMethod : payMethod,
                        cardMemberNum : cardMemberNum,
                        MOID : MOID,
                        cardPoint : cardPoint,
                        currency : currency,
                        cardPurchaseCode : cardPurchaseCode,
                        cardPrtcCode : cardPrtcCode,
                        applTime : applTime,
                        cardCheckFlag : cardCheckFlag,
                        cardCode : cardCode,
                        cardBankCode : cardBankCode,
                        cardTerminalNum : cardTerminalNum,
                        pFnNm : pFnNm,
                        pSubCnt : pSubCnt,
                        applNum : applNum,
                        approveResultCode : approveResultCode,
                        approveResultMsg : approveResultMsg,
                        cardInterest : cardInterest,
                        cardApplPrice : cardApplPrice,
                        cardGwCode : cardGwCode,
                        custEmail : custEmail,
                        cardExpire : cardExpire,
                        cardPurchaseName : cardPurchaseName,
                        payDevice : payDevice
                    })
                    .then(
                            ClassObject.findOne({_id:requestObject.goodUID})
                            .then(targetClassObject=>{
                               classObject = targetClassObject;
                                payInfoObject.orderNum = MOID;
                                payInfoObject.currency = currency;
                                payInfoObject.payMethod = payMethod;
                                payInfoObject.price = totalPrice;
                                payInfoObject.payDate = applDate;
                                payInfoObject.goodType = requestObject.goodType;

                                render(classObject, payInfoObject);
                            }).catch(error => {
                                console.error(error)
                            })
                            
                            ) .catch(error => {
                                console.error(error)
                            })
                        })
                    }else{
                        
                    }
                })
                .then(()=>{
                    console.log()
                    console.log(JSON.stringify(payInfoObject))
                
            })
      .catch(error => {
        console.error(error)
      })
     const render = (classObject, payInfoObject) => (
        res.render('web/view/classOrderConfirmation.html', { req: req, classObject: classObject, payInfoObject : payInfoObject, type:'confirm'})
     )

    //   res.render('web/view/refundClass.html', { req: req });
});

router.all('/refundClass/:payResultUID.:classUID', async function (req, res, next) {

    const payResultUID = req.params.payResultUID;
    const classID = req.params.classUID;
    const classObject = await ClassObject.findById(classID).lean();
    const payResult = await KgPayResult.findOne({
        attributes : [ 'payResultUID', 'userUID', 'goodName', 'goodType', 'createdAt', 'payStatus', 'totalPrice', 'currency', 'MOID', 'payMethod', 'applDate'],
        where : {
            payResultUID: payResultUID,
            goodType: 'class'
        },
    });
    let refundInfo = '';
    if(payResult.payStatus!='success'){
        refundInfo = await RefundInfo.findOne({ where : {payResultID : payResult.payResultUID}})
    }
    console.log(JSON.stringify(payResult) + ' result uid')
    console.log(JSON.stringify(classObject) + ' result uid')
    payResult.orderNum = payResult.MOID;
    payResult.price = payResult.totalPrice;
    res.render('web/view/refundClass.html', { req: req, classObject: classObject, payInfoObject : payResult, type:'view', refundInfo:refundInfo });
});

router.all('/journalMain', async function (req, res, next) {
    let journalObject = {};
    let tempClassObject = {};
    let sendClassObject = {};
    
    let mindArray = [];
    let mediArray = [];
    let yogaArray = [];
    let somaArray = [];
    let actiArray = [];
    let cochArray = [];
    let otherArray = [];
    
    journalObject = await ClassObject.find({dormancy: 'live'}).sort({'regedate': -1}).lean();
    tempClassObject = journalObject;

    // 저널 상세보기에서 랜덤으로 판매중이며 같은 카테고리의 클래스 출력하기
    for(let i = 0; i < tempClassObject.length; i++) {
        if(tempClassObject[i].objectType == 'class') {
            if(tempClassObject[i].classObject.mainCategory == 'Mindfulness') {
                mindArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Meditation') {
                mediArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Yoga') {
                yogaArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Somatic') {
                somaArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Movement & Activity') {
                actiArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Counseling & Coaching') {
                cochArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Others') {
                otherArray.push(tempClassObject[i]);
            }
        }
    }

    // 카테고리별 랜덤으로 3개만 출력하기 위한 작업
    if(mindArray.length > 3) {
        while(mindArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * mindArray.length);

            mindArray.splice(tempRandom, 1);
        }
    }

    if(mediArray.length > 3) {
        while(mediArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * mediArray.length);

            mediArray.splice(tempRandom, 1);
        }
    }

    if(yogaArray.length > 3) {
        while(yogaArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * yogaArray.length);

            yogaArray.splice(tempRandom, 1);
        }
    }

    if(somaArray.length > 3) {
        while(somaArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * somaArray.length);

            somaArray.splice(tempRandom, 1);
        }
    }

    if(actiArray.length > 3) {
        while(actiArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * actiArray.length);

            actiArray.splice(tempRandom, 1);
        }
    }

    if(cochArray.length > 3) {
        while(cochArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * cochArray.length);

            cochArray.splice(tempRandom, 1);
        }
    }

    if(otherArray.length > 3) {
        while(otherArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * otherArray.length);

            otherArray.splice(tempRandom, 1);
        }
    }

    sendClassObject['Mindfulness'] = mindArray;
    sendClassObject['Meditation'] = mediArray;
    sendClassObject['Yoga'] = yogaArray;
    sendClassObject['Somatic'] = somaArray;
    sendClassObject['Movement_Activity'] = actiArray;
    sendClassObject['Counseling_Coaching'] = cochArray;
    sendClassObject['Others'] = otherArray;

    res.render('web/view/journalMain.html', { req: req, journalObject: journalObject, classObject: sendClassObject });
});

router.all('/journalWrite', async function (req, res, next) {
    let journalEditData = {};
    res.render('web/view/journalWrite.html', { req: req, journalEditData: journalEditData });
});

router.all('/eventDetail', async function (req, res, next) {
    res.render('web/view/eventDetail.html', { req: req });
});

router.all('/eventDetailOnline', async function (req, res, next) {
    res.render('web/view/eventDetailOnline.html', { req: req });
});

router.all('/eventDetailOffline', async function (req, res, next) {
    res.render('web/view/eventDetailOffline.html', { req: req });
});

router.all('/createEvent/:gatheringID', async function (req, res, next) {
    let gatheringID = req.params.gatheringID;
    const gatheringObject = await ClassObject.findById(gatheringID).lean();

    res.render('web/view/createEvent.html', { req: req, gatheringObject : gatheringObject });
});

router.all('/createGathering', async function (req, res, next) {
    res.render('web/view/createGathering.html', { req: req });
});

router.all('/serviceFeeModal', async function (req, res, next) {
    res.render('web/view/serviceFeeModal.html', { req: req });
});

// 업데이트 필요
router.all('/terms', async function (req, res, next) {
    res.render('web/view/terms.html', { req: req });
});

router.all('/privatePolicy', async function (req, res, next) {
    res.render('web/view/terms.html', { req: req });
});

//구매내역
router.all('/myPurchases', async function (req, res, next) {
    const payResult = await KgPayResult.findAll({
        attributes : [ 'payResultUID', 'userUID', 'goodUID', 'goodName', 'createdAt', 'totalPrice', 'currency' ],
        where : {
            userUID: req.session.passport.user.userUID,
            goodType: 'class'
        },

        order: [
            ['createdAt', 'DESC']
        ]
    });
    console.log(JSON.stringify(payResult));
    res.render('web/view/myPurchases.html', { req: req, payResult:payResult });
});

//검색결과페이지
router.all('/search/:searchValue', async function (req, res, next) {
    let searchValue = req.params.searchValue;
    let userSearchResult = [];

    if(req.session.userSearchResult != null || req.session.userSearchResult != undefined) {
        userSearchResult = req.session.userSearchResult;
    }

    if(userSearchResult.length >= 8) {
        userSearchResult.shift();
    }

    userSearchResult.push(searchValue);

    req.session.userSearchResult = userSearchResult;
    req.session.save();

    let userList = [];
    try{
        userList = await User.findAll(
        {
            attributes : [ 'userUID', 'userName', 'hostType' ],
            where : { 
                userUID: { [Op.ne]: req.session.passport.user.userUID },
                userName : { [Op.like]:`%${searchValue}%` }
            } 
        }
       );


    }catch(err){
        console.log(err)
    }
    
    let followingList =[]
    try{
        followingList = await Following.findAll({
            where : { 
                userUID : req.session.passport.user.userUID,
                targetName : {
                    [Op.like]:`%${searchValue}%`}
            }
        })

    } catch (e) {

    }

    const classList = await ClassObject.find({
        "classObject.title":{ $regex: '.*' + searchValue + '.*' }, 
        "objectType":"class"
    }).lean();

    const gatheringList = await ClassObject.find({
        "classObject.gatheringName":{ $regex: '.*' + searchValue + '.*' }, 
        "objectType":"gathering"
    }).lean();

    const journalList = await ClassObject.find({
        "classObject.journalMainText":{ $regex: '.*' + searchValue + '.*' }, 
        "objectType":"journal"
    }).lean();

    if(classList.length > 0) {
        let tempClassListComment = await ClassAdditionalInfo.find({}).lean();

        for(let i = 0; i < classList.length; i++) {
            var reviewCount = 0;
            for(let j = 0; j < tempClassListComment.length; j++) {
                if(classList[i]._id == tempClassListComment[j].classID) {
                    reviewCount++;
                }
            }

            classList[i].reviewCount = reviewCount;
        }
    }

    console.log(userList.length + ' user');
    console.log(followingList.length + ' following');
    console.log(classList.length + ' class');
    console.log(gatheringList.length +' gat');
    console.log(journalList.length + ' journal');

    console.log('get searchValue : ' + searchValue);
    let recommendList ={};
    let recommendUserList=[];
    let recommendClassList=[];
    let recommendGatheringList=[];
    let recommendJournalList=[];
    let recommendClassCommentList = [];

    try{
        if(userList.length==0){
            recommendUserList = await User.findAll({ attributes : ['userUID', 'userName', 'hostType']});
            
            let userFollwer = 'noFollow';

            if(req.session.passport.user != null && req.session.passport.user != undefined && req.session.passport.user != '') {
                userFollwer = (req.session.passport.user).following;
            }

            let userCountObject = {};
            let tempSortArray = [];
            let resultRecommendUserList = [];

            

            for(let i = 0; i < recommendUserList.length; i++) {
                if(userFollwer != null && userFollwer != undefined && userFollwer != 'noFollow'  && !userFollwer.includes(recommendUserList[i].userUID)) {
                    if(recommendUserList[i].userUID != req.session.passport.user.userUID) {
                        await ClassObject.countDocuments({userUID: recommendUserList[i].userUID})
                        .then( (count) => {
                            userCountObject[recommendUserList[i].userUID] = count;
                        })
                        .catch( (error) => {
                            console.log(error);
                        });
                    }
                } else {
                    await ClassObject.countDocuments({userUID: recommendUserList[i].userUID})
                    .then( (count) => {
                        userCountObject[recommendUserList[i].userUID] = count;
                    })
                    .catch( (error) => {
                        console.log(error);
                    });
                }
            }

            for(let key in userCountObject) {
                tempSortArray.push(key);
            }

            tempSortArray.sort( (o1, o2) => {
                return userCountObject[o2] - userCountObject[o1];
            });

            for(let i = 0; i < tempSortArray.length; i++) {
                for(let j = 0; j < recommendUserList.length; j++) {
                    if(tempSortArray[i] == recommendUserList[j].userUID) {
                        resultRecommendUserList.push(recommendUserList[j]);
                    }
                }
            }
            
            recommendUserList = resultRecommendUserList;
        }

        if(classList.length==0){
            recommendClassList = await ClassObject.find({"objectType":"class"}).lean();
            let forSortingObject = {};
            let forSortingArray = [];
            let resultRecommendClassList = [];

            for(let i = 0; i < recommendClassList.length; i++) {
                forSortingObject[recommendClassList[i]._id] = recommendClassList[i].participants.length;
            }

            for(let key in forSortingObject) {
                forSortingArray.push(key);
            }

            forSortingArray.sort( (o1, o2) => {
                if(forSortingObject[o1] == forSortingObject[o2]) {
                    let tempSortingO1 = 0;
                    let tempSortingO2 = 0;

                    ClassAdditionalInfo.countDocuments({classID: o1})
                    .then( (count) => {
                        tempSortingO1 = count;
                    })
                    .catch( (error) => {
                        console.log(error);
                    });
                    ClassAdditionalInfo.countDocuments({classID: o2})
                    .then( (count) => {
                        tempSortingO2 = count;
                    })
                    .catch( (error) => {
                        console.log(error);
                    });
                    
                    return tempSortingO2 - tempSortingO1;
                } else {
                    return forSortingObject[o2] - forSortingObject[o1];
                }
            });

            for(let i = 0; i < forSortingArray.length; i++) {
                for(let j = 0; j < recommendClassList.length; j++) {
                    if(forSortingArray[i] == recommendClassList[j]._id) {
                        resultRecommendClassList.push(recommendClassList[j]);
                        break;
                    }
                }
            }

            let tempCommendList = await ClassAdditionalInfo.find({}).lean();
            for(let i = 0; i < resultRecommendClassList.length; i++) {
                let count = 0;
                
                for(let j = 0; j < tempCommendList.length; j++) {
                    if(resultRecommendClassList[i]._id == tempCommendList[j].classID) {
                        count++;
                    }
                }

                recommendClassCommentList.push(count);
            }
            
            recommendClassList = resultRecommendClassList;
        }
        if(gatheringList.length==0){
            recommendGatheringList = await ClassObject.find({"objectType":"gathering"}).lean();
            let forSortingObject = {};
            let forSortingArray = [];
            let resultRecommendGatheringList = [];
            
            for(let i = 0; i < recommendGatheringList.length; i++) {
                let gatheringData = [];
                gatheringData.push(recommendGatheringList[i].gatheringMember.length);
                gatheringData.push(recommendGatheringList[i].gatheringEvent.length);

                forSortingObject[recommendGatheringList[i]._id] = gatheringData;
            }
            

            for(let key in forSortingObject) {
                forSortingArray.push(key);
            }

            forSortingArray.sort( (o1, o2) => {
                if(forSortingObject[o1][0] == forSortingObject[o2][0]) {
                    return forSortingObject[o2][1] - forSortingObject[o1][1];
                } else {
                    return forSortingObject[o2][0] - forSortingObject[o1][0];
                }
            });

            for(let i = 0; i < forSortingArray.length; i++) {
                for(let j = 0; j < recommendGatheringList.length; j++) {
                    if(forSortingArray[i] == recommendGatheringList[j]._id) {
                        resultRecommendGatheringList.push(recommendGatheringList[j]);
                    }
                }
            }
            recommendGatheringList = resultRecommendGatheringList;
        }
        if(journalList.length==0){
            recommendJournalList = await ClassObject.find({"objectType":"journal"}).sort({'regedate' : -1}).lean();
        }
    } catch(error) {
        console.log(error);
    }

    if(userList.length==0&&followingList.length==0&&classList.length==0&&gatheringList.length==0&&journalList.length==0){
        recommendList.result = 'null'
    }else{
        recommendList.result = 'have'
    }
    recommendList.recommendUserList = recommendUserList
    recommendList.recommendClassList = recommendClassList;
    recommendList.recommendClassCommentList = recommendClassCommentList;
    recommendList.recommendGatheringList = recommendGatheringList
    recommendList.recommendJournalList = recommendJournalList

    let journalObject = {};
    let tempClassObject = {};
    let sendClassObject = {};
    
    let mindArray = [];
    let mediArray = [];
    let yogaArray = [];
    let somaArray = [];
    let actiArray = [];
    let cochArray = [];
    let otherArray = [];
    
    journalObject = await ClassObject.find({dormancy: 'live'}).sort({'regedate': -1}).lean();
    tempClassObject = journalObject;

    // 저널 상세보기에서 랜덤으로 판매중이며 같은 카테고리의 클래스 출력하기
    for(let i = 0; i < tempClassObject.length; i++) {
        if(tempClassObject[i].objectType == 'class') {
            if(tempClassObject[i].classObject.mainCategory == 'Mindfulness') {
                mindArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Meditation') {
                mediArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Yoga') {
                yogaArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Somatic') {
                somaArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Movement & Activity') {
                actiArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Counseling & Coaching') {
                cochArray.push(tempClassObject[i]);
            }
            if(tempClassObject[i].classObject.mainCategory == 'Others') {
                otherArray.push(tempClassObject[i]);
            }
        }
    }

    // 카테고리별 랜덤으로 3개만 출력하기 위한 작업
    if(mindArray.length > 3) {
        while(mindArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * mindArray.length);

            mindArray.splice(tempRandom, 1);
        }
    }

    if(mediArray.length > 3) {
        while(mediArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * mediArray.length);

            mediArray.splice(tempRandom, 1);
        }
    }

    if(yogaArray.length > 3) {
        while(yogaArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * yogaArray.length);

            yogaArray.splice(tempRandom, 1);
        }
    }

    if(somaArray.length > 3) {
        while(somaArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * somaArray.length);

            somaArray.splice(tempRandom, 1);
        }
    }

    if(actiArray.length > 3) {
        while(actiArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * actiArray.length);

            actiArray.splice(tempRandom, 1);
        }
    }

    if(cochArray.length > 3) {
        while(cochArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * cochArray.length);

            cochArray.splice(tempRandom, 1);
        }
    }

    if(otherArray.length > 3) {
        while(otherArray.length != 3) {
            let tempRandom = Math.floor(Math.random() * otherArray.length);

            otherArray.splice(tempRandom, 1);
        }
    }

    sendClassObject['Mindfulness'] = mindArray;
    sendClassObject['Meditation'] = mediArray;
    sendClassObject['Yoga'] = yogaArray;
    sendClassObject['Somatic'] = somaArray;
    sendClassObject['Movement_Activity'] = actiArray;
    sendClassObject['Counseling_Coaching'] = cochArray;
    sendClassObject['Others'] = otherArray;

    res.render('web/view/search.html', { req: req, userList: userList, followingList : followingList, classList:classList, gatheringList : gatheringList, journalList: journalList, recommendList:recommendList, userSearchResult: userSearchResult,  classObject: sendClassObject});
});


//푸터페이지들
router.all('/footerTerms', async function (req, res, next) {
    res.render('web/view/footerTerms.html', { req: req });
});

router.all('/footerPrivacyPolicy', async function (req, res, next) {
    res.render('web/view/footerPrivacyPolicy.html', { req: req });
});

router.all('/aboutUs', async function (req, res, next) {
    res.render('web/view/aboutUs.html', { req: req });
});

router.all('/announcement', async function (req, res, next) {
    res.render('web/view/announcement.html', { req: req });
});

router.all('/careers', async function (req, res, next) {
    res.render('web/view/careers.html', { req: req });
});

router.all('/application', async function (req, res, next) {
    res.render('web/view/application.html', { req: req });
});

router.all('/footerSupport', async function (req, res, next) {
    res.render('web/view/footerSupport​.html', { req: req });
});

router.all('/403', async function (req, res, next) {
    res.render('web/view/403.html', { req: req });
});

router.all('/404', async function (req, res, next) {
    res.render('web/view/404.html', { req: req });
});

router.all('/500', async function (req, res, next) {
    res.render('web/view/500.html', { req: req });
});

router.all('/userRing/:userNum', async function (req, res, next) {
    let file = './uploads/file/userRing/'+req.params.userNum;
    res.download(file);
});

// user host 탈퇴
router.all('/userHostTypeDelete', async (req, res, next) => {
    let userUID = req.body.userUID;
    let userPassword = req.body.password;
    
    let selectUserData = await User.findOne({ where : { userUID: userUID } });
    
    // 요청받은 pwd와 DB의 pwd 비교
    const requestPwd = await bcrypt.compare(userPassword, selectUserData.pwd);

    if(requestPwd) {

        await ClassObject.updateMany({userUID: selectUserData.userUID, objectType: 'class'}, { $set: {'dormancy': 'dormancy'}}, {multi: true})
        .then( async (success) => {
            await User.update({ hostType: null }, { where: { userUID: userUID } })
            .then( (success) => {
                req.session.passport.user.hostType = null;
                
                res.status(200).send();
            })
            .catch( (error) => {
                res.status(500).send('호스트 탈퇴를 실패하였습니다.');
            });
        })
        .catch( (error) => {
            res.status(500).send('호스트 탈퇴를 실패하였습니다.');
        });
    } else {
        res.status(500).send('비밀번호가 일치하지 않습니다.');
    }
    

    res.status(500).send();
});

router.all('/journalObjectDeleteMongo', async (req, res, next) => {
    let jounalUniqueID = req.body.journalUniqueID;

    // ※※※※※journaObject ID를 ClassObject ID를 넘기도록 변경
    await ClassObject.find({_id:jounalUniqueID}).remove().exec();
    
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'deleted.');
});

// router.all('/notice/list', async function (req, res, next) {
//     let listNotice = await dataCacheManager.selectListNotice();
//     res.render('notice.html', { moment: moment, listNotice: listNotice[0] });
// });

// router.all('/notice/:num', async function (req, res, next) {
//     let notice = await dataCacheManager.noticeS(req.params.num);
//     res.render('noticeMain.html', { notice: notice[0][0], moment: moment, member: req.session.member });
// });

//admin/////////////////////
router.all('/admin', async function (req, res, next) {
    res.render('admin/index.html', { req: req });
});

router.all('/admin/notice/list', async function (req, res, next) {
    let listNotice = await dataCacheManager.selectListNotice();
    res.render('admin/listNotice.html', { req: req, listNotice: listNotice[0], moment: moment });
});
router.all('/admin/notice/create', async function (req, res, next) {
    res.render('admin/noticeRegi.html', { req: req, state: 0 });
});
router.all('/admin/notice/update/:num', async function (req, res, next) {
    let noticeUID = req.params.num;
    let result = await dataCacheManager.selectNoticeByNoticeUID(req.params.num);
    let notice = {};
    notice.noticeUID = noticeUID;
    notice.state = result[1][0]['state'];
    notice.title = result[2][0]['title'];
    notice.contents = result[3][0]['contents'];
    notice.regDate = result[4][0]['regDate'];
    notice.uptDate = result[5][0]['uptDate'];
    notice.uspRtn = result[6][0]['uspRtn'];

    res.render('admin/noticeRegi.html', { req: req, notice: notice, state: 1 });
});

//admin add
router.all('/blankPage', async function (req, res, next) {
    res.render('admin/blankPage.html', { req: req });
});
router.all('/admin/createAdmin', async function (req, res, next) {
    res.render('admin/createAdmin.html', { req: req });
});
router.all('/admin/createProject', async function (req, res, next) {
    res.render('admin/createProject.html', { req: req });
});
router.all('/admin/dataTableSample', async function (req, res, next) {
    res.render('admin/dataTableSample.html', { req: req });
});
router.all('/admin/layoutSample', async function (req, res, next) {
    res.render('admin/layoutSample.html', { req: req });
});
router.all('/admin/login', async function (req, res, next) {
    res.render('admin/login.html', { req: req });
});
router.all('/admin/testLayout', async function (req, res, next) {
    res.render('admin/testLayout.html', { req: req });
});

router.all('/userPostShare', async (req, res, next) => {
    let shareObject = {};
    let shareData = req.body;

    let shareType = shareData.shareType;
    let postID = shareData.postID;

    if(shareType == 'class') {
        shareObject = await ClassObject.findById(postID);
    }

    if(shareType == 'gathering') {
        shareObject = await GatheringObject.findById(postID);
    }

    if(shareType == 'journal') {
        shareObject = await JournalObject.findById(postID);
    }    

    res.status(500).send();
});

router.all('/userStateChange', async (req, res, next) => {
    let userState = req.body.userState;
    req.user.userState = userState;

    res.status(200).send();
});

router.all('/userSearchHistoryRemove', async (req, res, next) => {
    let userSearchResult = req.body.userSearchResult;

    req.session.userSearchResult = userSearchResult;
    req.session.save();

    res.status(200).json(req.session.userSearchResult);
});

module.exports = router;

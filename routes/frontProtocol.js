const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const BaseConstant = require('../util/baseConstant');
const commonUtil = require('../util/commonUtil');
const DataCacheManager = require('../manager/dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();
const DataCacheManagerMongo = require('../manager/dataCacheManagerMongo');
const dataCacheManagerMongo = DataCacheManagerMongo.getInstance();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const fs = require('fs');
const path = require('path');

const drawRing = require('../manager/drawRingManager');

// multer 파일업로드
const multer = require('multer');
const passport = require('passport');

//paypal 결제 검증 SDK
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');



//==================================================
// MongoDB Object
//==================================================
const ClassObject = require('../mongoModels/ClassObject');
const ObjectBookmarks = require('../mongoModels/ObjectBookmarks');
const GatheringObject = require('../mongoModels/GatheringObject');
const JournalObject = require('../mongoModels/JournalObject');
const ShareObject = require('../mongoModels/ShareObject');
const EnrollClassInfo = require('../mongoModels/enrollClassInfo')
const DiscussionList = require('../mongoModels/discussionList');
const ClassAdditionalInfo = require('../mongoModels/classAdditionalInfo');
const ChatListInfoObject = require('../mongoModels/ChatListInfoObject');

//==================================================
// MySQL Object
//==================================================
const User = require('../models/user');
const KgPayRequest = require('../models/kgPayRequest');
const KgPayResult = require('../models/kgPayResult');
const UserPurchase = require('../models/userPurchase');
const PaypalLog = require('../models/paypalLog');
const testPaySetting = require('../models/testPaySetting');
const Following = require('../models/following');
const RefundInfo = require('../models/refundInfo');
const ApplicationList = require('../models/applicationList');

let func = {};
//====================================================
//  Protocol common function
//====================================================
router.post('/', (req, res, next) => {
    let jsonObject = req.body;
    let protocolName = jsonObject['protocol'];

    console.log(`get protocol name : ${protocolName}`);

    //logger.info('protocolName = ' + protocolName);

    if (func.hasOwnProperty(protocolName) == true) 
    {
        func[protocolName](req, res, next, jsonObject);
    } 
    else 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'Please check protocol');
    }
});

router.post('/testApi', (req, res, next) => {

    console.log(req.query)
    let sendJsonObject = {};
    sendJsonObject.resultCode = 0000;
    sendJsonObject.msg = 'success'
    // sendJsonObject.msg = req.query.requestMsg;


    res.json(sendJsonObject);
});



func.serverPayTest = async (req, res, next, jsonObject) => {

    //유저 확인
    if (!req.isAuthenticated())
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '로그인이 필요합니다.');
    }

    //==================================================
    // STEP 1 : 파라미터 확인
    //==================================================
    //필수 파라미터
    const purchaseData = jsonObject.data; //주문 데이터
    const orderID = purchaseData.orderID; //주문 번호
    const pgType = jsonObject.pgType; //pgType
    const type = jsonObject.type; //결제 타입
    const purchaseInterval = jsonObject.purchaseInterval; //결제 주기
    const itemName = jsonObject.itemName; //결제 주기

    //동적 파라미터
    const subscriptionID = purchaseData.subscriptionID; //구독 아이디
    const billingToken = purchaseData.billingToken; //토큰2
    const facilitatorAccessToken = purchaseData.facilitatorAccessToken; //토큰3

    //주문번호 확인
    console.log("orderID = " + orderID)
    console.log("purchaseData = " + purchaseData);
    console.log("orderID = " + orderID);
    console.log("pgType = " + pgType);
    console.log("type = " + type);
    console.log("purchaseInterval = " + purchaseInterval);
    console.log("itemName = " + itemName);

    //필수 파라미터 검증
    if(
            commonUtil.isBlankData(purchaseData) || 
            commonUtil.isBlankData(orderID) || 
            commonUtil.isBlankData(pgType) || 
            commonUtil.isBlankData(type) || 
            commonUtil.isBlankData(purchaseInterval) || 
            commonUtil.isBlankData(itemName)
    )
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '결제 서버 에러(-1)');
        return;
    }

    //==================================================
    // STEP 2 : 주문 데이터 서버 검증
    //==================================================
    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

    //paypal 서버 검증 준비
    function environment() 
    {
        let clientId = 'AVKxdCq3ZwlpYqVLjjE8KTmFnA7z3tYEQsFApU8ojIs4RBC0NFe6vmO7vEZEUWBrlmhk2guJHKSy0yTF';
        let clientSecret = 'ELElpRIDmGtgfvWlLFWfyXEcWsPJH2HVMUkSXa7WOWj5tqUyUpisiA7LpvC4pOL-hqX_RZAjXzDMuiLG';
    
        //샌드박스 모드
        // return new checkoutNodeJssdk.core.SandboxEnvironment(
        //     clientId, clientSecret
        // );

        return new checkoutNodeJssdk.core.LiveEnvironment(
            clientId, clientSecret
        );
    }

    //검증 데이터
    let verificationData;
    let verificationResultData;

    try 
    {
        //검증 시작
        console.log("서버 검증 시작")
        verificationData = await new checkoutNodeJssdk.core.PayPalHttpClient(environment()).execute(request);

        //상태 코드가 200이면 성공
        if(verificationData.statusCode == 200)
        {
            //결과 데이터 담기
            verificationResultData = verificationData.result;
        }
        else
        {
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '결제 서버 에러(-2)');
            return;
        }
    } 
    catch (err) 
    {
        // 검증 실패
        console.error("err = " + err);
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '결제 서버 에러(-3)');
        return;
    }

    //검증 데이터 확인
    console.log("verificationData = " + JSON.stringify(verificationData));


    //==================================================
    // STEP 3 : 주문 공통 데이터 서버 입력
    //==================================================
    let user = req.session.passport.user;

    console.log("user.userUID = " + user.userUID)
    console.log("pgType = " + pgType)
    console.log("type = " + type)
    console.log("purchaseInterval = " + purchaseInterval)
    console.log("itemName = " + itemName)
    let userPurchase = new UserPurchase({
        userUID : user.userUID,
        pgType : pgType,
        type : type,
        purchaseInterval : purchaseInterval,
        itemName : itemName
    });

    //DB 저장
    await userPurchase.save();

    //==================================================
    // STEP 4 : 주문 상세 데이터 서버 입력
    //==================================================

    const intent = verificationResultData.intent;
    const status = verificationResultData.status;
    let currencyCode = 'USD';
    let value = '';
    let payerID = verificationResultData.payer.payer_id;
    let payerEmail =verificationResultData.payer.email_address;
    let verificationDataString = JSON.stringify(verificationData);


    //소모형일 경우 데이터 수집
    if(type == 'consume')
    {
        currencyCode = verificationResultData.purchase_units[0].amount.currency_code;
        value = verificationResultData.purchase_units[0].amount.value
    }

    let paypalLog = new PaypalLog({
        userUID : user.userUID,
        type : type,
        orderID : orderID,
        subscriptionID : subscriptionID,
        billingToken : billingToken,
        facilitatorAccessToken : facilitatorAccessToken,
        intent:intent,
        status:status,
        currencyCode:currencyCode,
        value:value,
        payerID:payerID,
        payerEmail:payerEmail,
        verificationData:verificationDataString
    });

    //DB 저장
    await paypalLog.save();

    //==================================================
    // STEP 5 : 클라이언트 응답 반환
    //==================================================
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '결제 정보 확인 완료');
}
//====================================================
//  imageUpload
//====================================================
const uploadFile = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/file');
        },
        filename: function (req, file, cb) {
            let fileExtension = '';
            console.log(`get original name  ${file.originalname}`)
            if (file.originalname.includes('.')) 
            {
                fileExtension = file.originalname.split('.').pop();
            }
            cb(null, new Date().valueOf() + commonUtil.makeid(5) + '.' + fileExtension);
        },
    }),
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        var notAllowExt = [
            '.js',
            '.jsp',
            '.asp',
            '.aspx',
            '.php',
            '.TW',
            '.html'
        ];

        if(notAllowExt.includes(ext)) 
        {
            req.fileValidationError = "Forbidden extension";
            return cb(null, false, req.fileValidationError);
        }
        cb(null, true)
    },
    // limits: { fileSize: 100 * 1024 * 1024 },
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/file/');
        },
        filename: function (req, file, cb) {
            let mimeType;
            switch (file.mimetype) 
            {
                case 'image/jpeg':
                    mimeType = 'jpg';
                    break;
                case 'image/png':
                    mimeType = 'png';
                    break;
                case 'image/gif':
                    mimeType = 'gif';
                    break;
                case 'image/bmp':
                    mimeType = 'bmp';
                    break;
                default:
                    mimeType = 'jpg';
                    break;
            }
            cb(null, new Date().valueOf() + commonUtil.makeid(5) + '.' + mimeType);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
});

//업로드 폴더가 존재하지 않을경우 새로 생성
function mkdir( dirPath ) {
    const isExists = fs.existsSync( dirPath );
    if( !isExists ) 
    {
        fs.mkdirSync( dirPath, { recursive: true } );
    }
}

router.post('/protocolFileUpload', uploadFile.array('uploadFile'),  async (req, res, next) => {
    
    console.log(`come check in upload file ${req.body.test}`);
    let sendJsonObject = {};
    if (req.fileValidationError) 
    {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, '업로드가 허용되지 않는 파일 유형이 존재합니다.', sendJsonObject);
        return;
    }

    let listFileInfo = [];

    let fileLength = req.files.length;

    // let uploadCount = 0;
    // let callBackList = function(isSuccess)
    // {
    //     // uploadCount += 1;

    //     // //콜백이 다 도착할때까지 대기
    //     // if(uploadCount < fileLength)
    //     // {
    //     //     return;
    //     // }        
    //     sendJsonObject.listFileInfo = listFileInfo;
    //     commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '파일 업로드가 완료되었습니다.', sendJsonObject);
    // }


    for (let i = 0; i < fileLength; i++)
    {
        let file = req.files[i];
        let filePath = '/file/' + file.filename;
        let fileInfo = {};

        fileInfo.filePath = filePath;
        fileInfo.fileType = file.mimetype;
        fileInfo.fileServerName = file.filename;
        fileInfo.fileOriginalName = file.originalname;
        fileInfo.fileSize = file.size;
        
        listFileInfo.push(fileInfo);

        // //DATABASE에 업로드
        // dataCacheManager.USP_fileList_C(fileInfo,
        //     //성공 콜백
        //     function(ret)
        //     {                
        //         callBackList(true);
        //     },
        //     function(err)
        //     {
        //         console.log("err = " + err);
        //         callBackList(false);
        //     });
    }


    sendJsonObject.listFileInfo = listFileInfo;
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '파일 업로드가 완료되었습니다.', sendJsonObject);
    //originalname
});

router.post('/ckImageUpload', upload.single('upload'), function (req, res, next) {
    let sendJsonObject = {};
    let filePath = '/image/' + req.file.filename;    
    sendJsonObject.uploaded = 1;
    sendJsonObject.fileName = req.file.originalname;
    sendJsonObject.url = filePath;

    res.json(sendJsonObject);
});


//====================================================
//  signUp
//====================================================
func.signUp = async (req, res, next, jsonObject) =>{
    const hash = await bcrypt.hash(jsonObject['pwd'], 12);
        console.log(`hash ${hash}`)
    
    let birth = jsonObject['year']+'/'+jsonObject['month']+'/'+jsonObject['day'];

    // make ground ring info
    var userAttribute ={"blue":0, "red":0, "yellow":0, "white":0, "grey":0}

    let thisDate = new Date();
    let birthSeason = getSeason(jsonObject['month'], jsonObject['day']);
    let thisSeason = getSeason(thisDate.getMonth()+1, thisDate.getDate());
    console.log( `birth season ${birthSeason}     thisSeason ${thisSeason}`);
    console.log(`month ${jsonObject['month']}     ${jsonObject['day']}`)

    makeInfo(birthSeason, 'main');
    makeInfo(thisSeason, 'sub');

    console.log(JSON.stringify(userAttribute));

    function getSeason (month, day){
        let result = '';
        if(month>11||(month==1&&day<18)||(month==11&&day>8)){
            result = 'winter';
        }else if(month>8||(month==8&&day>27)){
            result = 'autumn';          
        }else if(month>6||(month==6&&day>15)){
            result = 'midSummer';
        }else if(month>4||(month==4&&day>5)){
            result = 'summer';
        }else{
            result = 'spring';
        };
        return result;
    }

    function makeInfo(season, type){

        let main ='';
        let subLeft = '';
        let subRight = '';

        if(season == 'spring'){
            main = 'blue';
            subLeft ='red';
            subRight = 'grey';
        }else if (season == 'summer'){
            main = 'red';
            subLeft ='blue';
            subRight = 'yellow';
        }else if (season == 'midSummer'){
            main = 'yellow';
            subLeft ='red';
            subRight = 'white';
        }else if (season == 'autumn'){
            main = 'white';
            subLeft ='yellow';
            subRight = 'grey';
        }else{
            main = 'grey';
            subLeft ='white';
            subRight = 'blue';
        }

        if(type =='sub'){
            userAttribute[main] = userAttribute[main]+30;
        }else{
            userAttribute[main]=50;
            userAttribute[subRight]=10;
            userAttribute[subLeft]=10;
        }

    }
    console.log(`get location    ": ${jsonObject['location']}`)
    await User.create({
        userEmail : jsonObject['userEmail'],
        pwd : hash,
        userName: jsonObject['userName'],
        birth : birth,
        userAttribute : JSON.stringify(userAttribute),
        gender : jsonObject['gender'],
        userBio : jsonObject['userBio'],
        location : jsonObject['location'],
        region : jsonObject['region'],
        country: jsonObject['country'],
        state: jsonObject['state'],
        city: jsonObject['city'],
        streetAddress: jsonObject['streetAddress'],
        thumbNail : jsonObject['thumbNail'],
        facebookID : jsonObject['facebookID'],
        googleID : jsonObject['googleID'],
        appleID : jsonObject['appleID']
    });

    const userInfo = await User.findOne({where : {userEmail:jsonObject['userEmail']}});
    
    drawRing(userInfo, ()=>{
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'signUp Success');
    })

};

//====================================================
//  login
//====================================================
router.post('/login', (req, res, next)=>{
    let user = req.body;
    // let user = {}
    // user.userEmail=
    passport.authenticate('local', (authError, user, info)=>{
        if(authError){
            console.log(authError + 'in auth error');
            // return next(authError);
        }

        /*
        if(!user){
            commonUtil.sendResponse(res, 400, BaseConstant.VALUE_RESULT_CODE_ERROR, 'incorrectPassword');
            console.log(info.message + ' info error');
        }
        */
        // 이메일이 없을 경우
        if(user === undefined)
        {
            commonUtil.sendResponse(res, 400, BaseConstant.VALUE_RESULT_CODE_ERROR, 'noUser');
        }

        // 비밀번호가 틀렸을 경우
        if(user === false)
        {
            commonUtil.sendResponse(res, 400, BaseConstant.VALUE_RESULT_CODE_ERROR, 'incorrectPassword');
        }

        return req.logIn(user, (loginError)=>{
            if(loginError){
                commonUtil.sendResponse(res, 400, BaseConstant.VALUE_RESULT_CODE_ERROR, 'noUser');
                console.log('err' + loginError);
            }else{
                let sendJsonObject = {};
                console.log('is logined');
                return commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'loginSuccess', sendJsonObject);
            }
         
            // return res.send({test:'test'});
        })

    })(req, res, next);
})

func.sendEmail = async (req, res, next, jsonObject) =>{
    let userEmail = jsonObject.userEmail;
    let otpNum = commonUtil.getOtp(6);
    let sendJsonObject = {};
    
    console.log('sendemail check' + otpNum);
    const user = await User.findOne({where :{userEmail:userEmail}})
    User.update({
        otp : otpNum
    },
    {
        where : {
            userUID : user.userUID
        }
    });
    sendJsonObject.userUid = user.userUID;
    let html = commonUtil.sendOtpEmailHtml('test', userEmail, otpNum)
    commonUtil.sendMail(userEmail, jsonObject.purpose, html);
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, user.userUID, sendJsonObject);
}

//이메일 중복 체크
func.checkDuplicate = async (req, res, next, jsonObject) => {
    
    let userEmail = jsonObject.userEmail;
    let sendJsonObject = {};
    console.log(userEmail);
    if(await User.findOne({where :{userEmail:userEmail}})!=null){
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'impossible');
    }else{
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'possible', sendJsonObject);
    }
};

//otp 체크
func.OTPValidate = async (req, res, next, jsonObject) =>{
    let userEmail = jsonObject.userEmail;
    let otpVal = jsonObject.otpVal;
    const user = await User.findOne({where :{userEmail:userEmail}});
    if(user.otp == otpVal){
        console.log(`is okay ${otpVal}  ${user.otp}   ${user.userUID}`)
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'correct');
    }else{
        console.log(`is not okay ${otpVal}  ${user.otp}  ${user.userUID}`)
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'impossible');
    }

}
func.pwCheck = async (req, res, next, jsonObject) =>{

    let userEmail = jsonObject.userEmail;
    let currentPw = jsonObject.pwd;
    let user = await User.findOne({where :{userEmail:userEmail}});
    const hash = await bcrypt.hash(currentPw, 12);
    const result = await bcrypt.compare(currentPw, user.pwd)
    if(result){
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'correct');
    }else{
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'wrong');
    }


}


//비밀번호 변경
func.changePw = async (req, res, next, jsonObject) =>{
    let userEmail = jsonObject.userEmail;
    let newPw = jsonObject.newPw;
    const user = await User.findOne({where :{userEmail:userEmail}});
    const hash = await bcrypt.hash(newPw, 12);
    console.log('comec check in pw');
    User.update({
        pwd : hash
    },
    {
        where : {
            userUID : user.userUID
        }
    });
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'password has changed');
}

func.updateUsers = async (req, res, next, jsonObject) => {
    let sendJsonObject = {};

    User.update({
        hostType : jsonObject['hostType'],
        introduce : jsonObject['introduce'],
        brandlocation : jsonObject['brandlocation'],
        shareableSchedule : JSON.stringify(jsonObject['shareableSchedule'])
    },
    {
        where : {
            userUID : req.user.userUID
        }
    }).then((result) => {
        console.log("Update Users");
        sendJsonObject.redirectPage = '/hostStudio';
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '정보가 갱신되었습니다.', sendJsonObject);
        return;
    });
}

//////////////////////////////////////////
//채팅 로그 조회
//////////////////////////////////////////

func.getMessage = async (req, res, next, jsonObject) =>{

    let userUIDList = [];
    let targetUserInfo = {};
    let requsetUserInfo = {};
    targetUserInfo.userUID = parseInt(jsonObject.targetUID);
    targetUserInfo.userName = jsonObject.targetName;
    requsetUserInfo.userUID = req.session.passport.user.userUID;
    requsetUserInfo.userName = req.session.passport.user.userName;
    userUIDList.push(targetUserInfo);
    userUIDList.push(requsetUserInfo);
    userUIDList.sort((a,b)=> a.userUID - b.userUID);

    let chatLog = await ChatListInfoObject.find({preUserUID:userUIDList[0].userUID, nextUserUID:userUIDList[1].userUID}).exec();
    if(chatLog<1){

        const thisTime = Date.now();
        let newChatLog = new ChatListInfoObject;
        newChatLog.chatListInfoNum = thisTime;
        newChatLog.preUserUID = userUIDList[0].userUID;
        newChatLog.preUserName = userUIDList[0].userName;
        newChatLog.nextUserUID = userUIDList[1].userUID;
        newChatLog.nextUserName = userUIDList[1].userName;
        newChatLog.chatUpdateTime = thisTime;
        newChatLog.save();
        chatLog = newChatLog;
    }else{
        console.log('has' )
    }

    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'chatLog', chatLog);
}


func.hostStudioUserUpdate = async (req, res, next, jsonObject) => {
    let birth = jsonObject['birth'].split('/');

    // make ground ring info
    var userAttribute ={"blue":0, "red":0, "yellow":0, "white":0, "grey":0};

    let thisDate = new Date();
    let birthSeason = getSeason(birth[1], birth[2]);
    let thisSeason = getSeason(thisDate.getMonth()+1, thisDate.getDate());
    console.log( `birth season ${birthSeason}     thisSeason ${thisSeason}`);
    console.log(`month ${jsonObject['month']}     ${jsonObject['day']}`)

    makeInfo(birthSeason, 'main');
    makeInfo(thisSeason, 'sub');

    function getSeason (month, day){
        let result = '';
        if(month>11||(month==1&&day<18)||(month==11&&day>8)){
            result = 'winter';
        }else if(month>8||(month==8&&day>27)){
            result = 'autumn';          
        }else if(month>6||(month==6&&day>15)){
            result = 'midSummer';
        }else if(month>4||(month==4&&day>5)){
            result = 'summer';
        }else{
            result = 'spring';
        };
        return result;
    }

    function makeInfo(season, type){

        let main ='';
        let subLeft = '';
        let subRight = '';

        if(season == 'spring'){
            main = 'blue';
            subLeft ='red';
            subRight = 'grey';
        }else if (season == 'summer'){
            main = 'red';
            subLeft ='blue';
            subRight = 'yellow';
        }else if (season == 'midSummer'){
            main = 'yellow';
            subLeft ='red';
            subRight = 'white';
        }else if (season == 'autumn'){
            main = 'white';
            subLeft ='yellow';
            subRight = 'grey';
        }else{
            main = 'grey';
            subLeft ='white';
            subRight = 'blue';
        }

        if(type =='sub'){
            userAttribute[main] = userAttribute[main]+30;
        }else{
            userAttribute[main]=50;
            userAttribute[subRight]=10;
            userAttribute[subLeft]=10;
        }
    }

    User.update({
        userName : jsonObject['userName'],
        birth : jsonObject['birth'],
        userAttribute: JSON.stringify(userAttribute),
        location : jsonObject['location'],
        country : jsonObject['country'],
        state : jsonObject['state'],
        city : jsonObject['city'],
        streetAddress : jsonObject['streetAddress'],
        userBio : jsonObject['userBio']
    },
    {
        where : {
            userUID : req.user.userUID
        }
    }).then( async (result) => {
        console.log("Update Users");

        const userInfo = await User.findOne({where :{userUID:req.user.userUID}});

        req.session.passport.user = userInfo;

        drawRing(userInfo, (success) => {
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '정보가 갱신되었습니다.');
        });
    });
}

func.logout = (req, res, next, jsonObject) => {
    //sendJson
    let sendJsonObject = {};

    if (!req.session.member) 
    {
        sendJsonObject.redirectPage = '/';
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '로그인이 필요합니다.', sendJsonObject);
        return;
    }

    sendJsonObject.redirectPage = '/';

    req.session.destroy();

    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '로그아웃 되었습니다.', sendJsonObject);
};

//====================================================
//  데이터 초기값 확인 및 설정 함수
//====================================================
function setJsonDataWithCompare(json, configKey, newData, originalData) {
    if (newData == undefined) 
    {
        json[configKey] = originalData;
    } 
    else
    {
        json[configKey] = newData;
    }
}

//====================================================
//  enrollClass
//====================================================
func.enrollClass= async (req, res, next,jsonObject) => {
    let sendJsonObject = {};
    let classObject={}
    // 
    console.log('comecheck ')
    ClassObject.findOne({_id:jsonObject.classID})
    .then(
        function(classObjects){
            classObject = classObjects.classObject;
            let participantsInfo ={}
            if(classObject.audience=='Unlimited'||(classObject.currentAudience<classObject.audience&&!classObjects.participants.includes(jsonObject.userUID))){

                // console.log(classObjects.participants.includes(jsonObject.userUID) + 'is include')
                classObject.currentAudience==0?classObjects.participants=[]:'';
                participantsInfo.userUID = jsonObject.userUID;
                participantsInfo.userName = jsonObject.userName;
                participantsInfo.userHostType = jsonObject.userHostType;
                classObjects.participants.push(participantsInfo);
                classObject.currentAudience= classObjects.participants.length;
                let enrollClassInfo = new EnrollClassInfo;
                enrollClassInfo.userUID = jsonObject.userUID;
                enrollClassInfo.userName= jsonObject.userName;
                enrollClassInfo.classID = jsonObject.classID;
                enrollClassInfo.classInfo = jsonObject.classInfo;
                enrollClassInfo.classProgress = [];
                enrollClassInfo.isCompleted='';
                enrollClassInfo.objectType = 'class';
                
                enrollClassInfo.save(function(err){
                    if(err)
                    {
                        console.log(err)
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'have some error.', sendJsonObject);
                        return;
                    }
            
                    console.log('is not')
                   

                });
                async function updateClassObject() {
                    console.log(classObjects.participants.length + '     ###');
                    await ClassObject.findOneAndUpdate({_id:jsonObject.classID}, {"$set":{classObject:classObject, participants:classObjects.participants}});
                }
                updateClassObject();
                commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'enroll completed.', sendJsonObject);
            }else{
                commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'have some error.', sendJsonObject);
                return;
            }
            
        })
}


//====================================================
//  comment discussion
//====================================================
func.commentDiscussion = async (req, res, next,jsonObject) => {

    
    DiscussionList.findOne({classID:jsonObject.classId, chapterNum:jsonObject.chapterNum, contentNum:jsonObject.contentNum})
    .then(function (discussion){
        if(discussion){
            discussion.comment.push(jsonObject.comment);
            DiscussionList.findOneAndUpdate({_id:discussion._id}, {"$set":{comment:discussion.comment}})
            .then(function(err){
                if(err){
                    console.log(err)
                    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'error.');
                    return;
                }else{
                    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'commented.');
                }
            })
        }else{
            let discussionList = new DiscussionList;
            discussionList.classID = jsonObject.classId;
            discussionList.chapterNum = jsonObject.chapterNum;
            discussionList.contentNum = jsonObject.contentNum;
            discussionList.comment =jsonObject.comment;
            discussionList.save(function(err){
                if(err){
                    {
                        console.log(err)
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'error.');
                        return;
                    }; 
                }else{
                    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'commented.');
                }
            });
        }
    })
}

//====================================================
//  get discussion List
//====================================================
func.getDiscussionList = async (req, res, next,jsonObject) => {
    let sendJsonObject = {};
    await DiscussionList.findOne({classID:jsonObject.classID, chapterNum:jsonObject.chapterNum, contentNum:jsonObject.contentNum})
    .then(function (discussion){
        if(discussion){
            sendJsonObject.commentList = discussion.comment;
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'list', sendJsonObject);
        }else{
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'null');
        }
    })
}

//====================================================
//  updateClassProgressInfo
//====================================================
func.updateClassProgress = async (req, res, next,jsonObject) => {

   let enrollInfo = jsonObject.enrollClassInfo;;
    await EnrollClassInfo.findOneAndUpdate({_id:enrollInfo._id}, {"$set":{classProgress:enrollInfo.classProgress, isCompleted:jsonObject.isCompleted}})
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'progressUpdated.');
}

//====================================================
//  reviewOnClass
//====================================================
func.classAdditionalInfo= async (req, res, next,jsonObject) => {

    ClassAdditionalInfo.findOne({classID:jsonObject.classID, reviewerUID:jsonObject.reviewerUID})
    .then(function(result){
        if(result){
            console.log(JSON.stringify(result))
            console.log('is come to first ')
            result.review=jsonObject.review;
            result.save(function(err){
                if(err){
                        console.log(err)
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'error.');
                        return;
                }
            });
        }else{
        
            let classAdditionalInfo = new ClassAdditionalInfo;
            classAdditionalInfo.classID = jsonObject.classID;
            classAdditionalInfo.classTitle = jsonObject.classTitle;
            classAdditionalInfo.category = jsonObject.category;
            classAdditionalInfo.classThumbNail = jsonObject.classThumbNail;
            classAdditionalInfo.writerUID  = jsonObject.writerUID;
            classAdditionalInfo.writerName = jsonObject.writerName;
            classAdditionalInfo.reviewerUID = jsonObject.reviewerUID;
            classAdditionalInfo.reviewerName = jsonObject.reviewerName;
            classAdditionalInfo.review=jsonObject.review;
            classAdditionalInfo.bookMarks ='';
            classAdditionalInfo.save(function(err){
                if(err){
                        console.log(err)
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'error.');
                        return;
                }
            });
            
        }
    })
    .then(function(){
        ClassAdditionalInfo.find({classID:jsonObject.classID}, 'review.surveyAnswerList')
        .then(function(classAttributes){
            console.log(JSON.stringify(classAttributes) + ' result list ###############');
            let result = [0, 0, 0, 0, 0];
            classAttributes.forEach((review)=>
                {
                    result = result.map((a, i)=> a+parseInt(review.review.surveyAnswerList[i]));
                }
            )
            for(var i=0; i<5; i++){
                result[i]= (result[i]/classAttributes.length).toFixed(1)
            }
            ClassObject.findById(jsonObject.classID)
            .then(async function(classObject){
                classObject.classObject.classAttribute=result;
                classObject.markModified('classObject');
                await classObject.save((error)=>{
                })
                console.log('is saved')
            })
        })

    })
    

     commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'commented.');
 }

//====================================================
//  refundRequest
//====================================================
func.refundRequest = async (req, res, next,jsonObject) => {
    console.log(JSON.stringify(jsonObject));
    await RefundInfo.create({
        payResultID : jsonObject['payResultID'],
        refundType : jsonObject['refundType'],
        refundReason : jsonObject['refundReason'],
        refundProgress : 'request'
    }) 
    await KgPayResult.update(
        { payStatus:'refundRequest'},
        { where : {payResultUID : jsonObject['payResultID']}}
    );
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'requested.');
}
 
 

func.replyOnComment = async (req, res, next,jsonObject) => {

    console.log('comeCheck' + JSON.stringify(jsonObject));
    await ClassAdditionalInfo.findOneAndUpdate({_id:jsonObject.additionalInfoID}, {"$set":{reviewAnswer:jsonObject.reply}})
    console.log('afterInsert')
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'replied.');
}
 
func.application = async (req, res, next,jsonObject) => {

    console.log(JSON.stringify(jsonObject));
    let userUID = '';
    const attachment1 = JSON.stringify(jsonObject.attachment1);
    const attachment2 = JSON.stringify(jsonObject.attachment2);
    try{
        userUID : req.session.passport.user.userUID;
    }catch(err){
        console.log(err)
    }

    try{
        await ApplicationList.create(
            {
                userUID : userUID,
                firstName : jsonObject['firstName'],
                lastName : jsonObject['lastName'],
                birthYear: jsonObject['birthYear'],
                birthMonth: jsonObject['birthMonth'],
                birthDay : jsonObject['birthDay'],
                addressCountry : jsonObject['addressCountry'],
                addressState : jsonObject['addressState'],
                addressCity : jsonObject['addressCity'],
                addressStreetAddress: jsonObject['addressStreetAddress'],
                email : jsonObject['email'],
                phoneCode : jsonObject['phoneCode'],
                phoneNumber : jsonObject['phoneNumber'],
                applyingPosition : jsonObject['applyingPosition'],
                workAuthorization : jsonObject['workAuthorization'],
                workStartYear : jsonObject['workStartYear'],
                workStartMonth : jsonObject['workStartMonth'],
                workStartDay : jsonObject['workStartDay'],
                introduction : jsonObject['introduction'],
                attachment1 : attachment1,
                attachment2 : attachment2,
                linkWebsite : jsonObject['linkWebsite'],
                linkLinkedIn : jsonObject['linkLinkedIn'],
                linkFacebook : jsonObject['linkFacebook'],
                linkYouTube : jsonObject['linkYouTube'],
                linkOther : jsonObject['linkOther']
    
            }
        )
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'applied.');
    }catch(err){
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'fail.');
        console.log(err)
    }


}


//====================================================
//  Setting 
//====================================================

// router.put('/setting', async function (req, res){
//     User.findByIdAndUpdate(req.params.userUID, req.body, { new : true}, function(err, user) {
//         if(err) return res.status(500).send("USER SETTING 수정 실패");
//         res.status(200).send(user);
//         console.log("USER SETTING 수정 성공");
//     });
// });

func.updateSetting = async (req, res, next,jsonObject) => {
    let sendJsonObject = {};

    let birth = jsonObject['birth'].split('/');

    // make ground ring info
    var userAttribute ={"blue":0, "red":0, "yellow":0, "white":0, "grey":0};

    let thisDate = new Date();
    let birthSeason = getSeason(birth[1], birth[2]);
    let thisSeason = getSeason(thisDate.getMonth()+1, thisDate.getDate());
    console.log( `birth season ${birthSeason}     thisSeason ${thisSeason}`);
    console.log(`month ${jsonObject['month']}     ${jsonObject['day']}`)

    makeInfo(birthSeason, 'main');
    makeInfo(thisSeason, 'sub');

    function getSeason (month, day){
        let result = '';
        if(month>11||(month==1&&day<18)||(month==11&&day>8)){
            result = 'winter';
        }else if(month>8||(month==8&&day>27)){
            result = 'autumn';          
        }else if(month>6||(month==6&&day>15)){
            result = 'midSummer';
        }else if(month>4||(month==4&&day>5)){
            result = 'summer';
        }else{
            result = 'spring';
        };
        return result;
    }

    function makeInfo(season, type){

        let main ='';
        let subLeft = '';
        let subRight = '';

        if(season == 'spring'){
            main = 'blue';
            subLeft ='red';
            subRight = 'grey';
        }else if (season == 'summer'){
            main = 'red';
            subLeft ='blue';
            subRight = 'yellow';
        }else if (season == 'midSummer'){
            main = 'yellow';
            subLeft ='red';
            subRight = 'white';
        }else if (season == 'autumn'){
            main = 'white';
            subLeft ='yellow';
            subRight = 'grey';
        }else{
            main = 'grey';
            subLeft ='white';
            subRight = 'blue';
        }

        if(type =='sub'){
            userAttribute[main] = userAttribute[main]+30;
        }else{
            userAttribute[main]=50;
            userAttribute[subRight]=10;
            userAttribute[subLeft]=10;
        }

    }

    if(jsonObject.thumbNail !== undefined)
    {
        await User.update({
            userName : jsonObject['userName'],
            birth : jsonObject['birth'],
            userAttribute: JSON.stringify(userAttribute),
            gender : jsonObject['gender'],
            userBio : jsonObject['userBio'],
            region : jsonObject['region'],
            location : jsonObject['location'],
            country : jsonObject['country'],
            state : jsonObject['state'],
            city : jsonObject['city'],
            streetAddress : jsonObject['streetAddress'],
            thumbNail : jsonObject['thumbNail']
        }, 
        {
            where: {
                userUID : req.user.userUID
            }
        });
    }
    else
    {
        await User.update({
            userName : jsonObject['userName'],
            birth : jsonObject['birth'],
            userAttribute: JSON.stringify(userAttribute),
            gender : jsonObject['gender'],
            userBio : jsonObject['userBio'],
            region : jsonObject['region'],
            location : jsonObject['location'],
            country : jsonObject['country'],
            state : jsonObject['state'],
            city : jsonObject['city'],
            streetAddress : jsonObject['streetAddress'],
        }, 
        {
            where: {
                userUID : req.user.userUID
            }
        });
    }

    const userInfo = await User.findOne({where :{userUID:req.user.userUID}});
    console.log(req.user.userUID+ '   3#### ###'+ JSON.stringify(userInfo));
    req.session.passport.user = userInfo;
    sendJsonObject.redirectPage = '/setting';

    drawRing(userInfo, (success) => {
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '정보가 갱신되었습니다.', sendJsonObject);
    });
}

func.updateUsers = async (req, res, next, jsonObject) => {
    let sendJsonObject = {};
    
    User.update({
        hostType : jsonObject['hostType'],
        introduce : jsonObject['introduce'],
        brandlocation : jsonObject['brandlocation'],
        brandplace : jsonObject['brandplace'],
        brandagree : jsonObject['brandagree'],
        brandDatetime : jsonObject['brandDatetime'],
        shareableSchedule : JSON.stringify(jsonObject['shareableSchedule'])
    },
    {
        where : {
            userUID : req.user.userUID
        }
    }).then( async (result) => {
        console.log("Update Users");
        req.user.hostType = jsonObject['hostType'];
        req.user.introduce = jsonObject['introduce'];
        req.user.brandlocation = jsonObject['brandlocation'];
        req.user.brandplace = jsonObject['brandplace'];
        req.user.brandagree = jsonObject['brandagree'];
        req.user.brandDatetime = jsonObject['brandDatetime'];
        req.user.shareableSchedule = jsonObject['shareableSchedule'];

        await ClassObject.updateMany({userUID: req.user.userUID}, { $set: {'dormancy': 'live'}}, {multi: true})
        .then( (success) => {
            sendJsonObject.redirectPage = '/hostStudio';
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '정보가 갱신되었습니다.', sendJsonObject);
            return;
        })
        .catch( (error) => {
            console.log(error);
            res.status(500).send(error);
        });
        
    });
}

func.updateHostInfo = async (req, res, next, jsonObject) => {
    let sendJsonObject = {};

    User.update({
        hostType : jsonObject['hostType'],
        introduce : jsonObject['introduce'],
        brandlocation : jsonObject['brandlocation'],
        brandplace : jsonObject['brandplace'],
        brandagree : jsonObject['brandagree'],
        brandDatetime : jsonObject['brandDatetime'],
    },
    {
        where : {
            userUID : req.user.userUID
        }
    }).then( async (result) => {
        req.user.hostType = jsonObject['hostType'],
        req.user.introduce = jsonObject['introduce'];
        req.user.brandlocation = jsonObject['brandlocation'];
        req.user.brandplace = jsonObject['brandplace'];
        req.user.brandagree = jsonObject['brandagree'];
        req.user.brandDatetime = jsonObject['brandDatetime'];

        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '정보가 갱신되었습니다.', sendJsonObject);
    });
    
}



func.followUser = async (req, res, next, jsonObject) => {
    const user = req.session.passport.user
    const userUID = user.userUID;
    const userName = user.userName;
    const userHostType = user.hostType;

    const targetUID = jsonObject.targetUID
    console.log(jsonObject.targetUID)

    await Following.findOne({where : {userUID: userUID, targetUID: targetUID}})
    .then(function (result){
        if(!result){
            User.findOne({where : {userUID: userUID}})
            .then(function (result){
                let followList= [];
                console.log(result.following);
                console.log('after');
                if(result.following!=null){
                    followList = JSON.parse(result.following);
                }
                followList.push(parseInt(jsonObject.targetUID)); 
                console.log(followList);
                User.update({
                    following : followList
                },
                {
                    where: {
                        userUID : req.user.userUID
                    }
                });
                req.session.passport.user.following = followList;

                let following = new Following({  
                    userUID : userUID,
                    userName : userName,
                    userHostType : userHostType,
                    targetUID : jsonObject.targetUID,
                    targetName : jsonObject.targetName,
                    targetHostType : jsonObject.targetType,
                })
                following.save()
                .then(function (err){
                    if(err)
                    {
                        console.log(err)
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'failed.');
                        return;
                    }else{
                        req.user.following=followList;
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'added.');
                    }
                    
                })
            })
        }else{
            console.log('is else')
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'failed.');

        }

    })


}


func.removeFollow = async (req, res, next, jsonObject) => {

    let userUID = req.session.passport.user.userUID;
    let targetUID = jsonObject.targetUID

    console.log(jsonObject.targetUID)

    await Following.findOne({where : {userUID: userUID, targetUID: targetUID}})
    .then(function (result){
        if(result){
            let following = result;
            User.findOne({where : {userUID: userUID}})
            .then(function (result){
                let followList= JSON.parse(result.following);
                let targetIndex = followList.indexOf(parseInt(jsonObject.targetUID));
                followList.splice(targetIndex, 1);
                User.update({
                    following : followList
                },
                {
                    where: {
                        userUID : req.user.userUID
                    }
                });
                req.session.passport.user.following = followList;
                following.destroy()
                .then(function (err){
                    if(err)
                    {
                        console.log(err)
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'failed.');
                        return;
                    }else{
                        req.user.following=followList;
                        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'added.');
                    }
                    
                })
            })
        }else{
            commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'failed.');

        }

    })


}

func.getFollowList= async (req, res, next, jsonObject) => {
    let sendJsonObject = {};
    const following = await Following.findAll({where:{userUID:req.user.userUID}});
    if(following){
        sendJsonObject.followList = following;
    }
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'added.', sendJsonObject);
}

func.deleteAccount= async (req, res, next, jsonObject) => {
    User.destroy({
        where:{userUID:req.user.userUID}
    })
    Following.destroy({where:{userUID:req.user.userUID}})
    .then(()=>{
        Following.destroy({where:{targetUID:req.user.userUID}})
    })
    req.session.passport.user='';
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, '');
}
//======================================================================
//  hostStudioClasses Connection MongoDB and Insert, Select router
//======================================================================
router.post('/classObjectInsertMongo', async function(req, res, next){

    //파라미터
    let jsonClassObject = req.body.classObject;
    let payType = req.body.payType;

    //유저 데이터 확인
    User.findOne({where : { userEmail: req.session.passport.user.userEmail }})
    //Success CallBack
    .then(
        function (users) 
        {
            //유저 데이터 확인 및 모든게 완료되면 실행될 class 세이브 함수 (쓸곳이 많아서 함수화)
            let saveClassObject = function()
            {
                //자바처럼 생성해서 데이터를 넣어준다.
                let classObject = new ClassObject();
                console.log('comecheck1')
                //주의! _id(ObjectId 는 몽고 디비의 자동 생성 값이므로 넣지 않는다.);
                classObject.userUID = users.userUID; //mysql의 73번  (mysql 에서 가져온 유저 정보를 넣었다.)
                classObject.userName = users.userName;
                classObject.hostType = users.hostType;
                classObject.dormancy = 'live';
                classObject.objectType = 'class';
                classObject.classObject = JSON.parse(jsonClassObject);

                console.log('comecheck2')

                //mongoose 법 저장
                classObject.save(function(err){
                    //이곳이 완료 콜백
                    if(err)
                    {
                        //에러 나타냄(적절하게 처리 할 것)
                        console.error("memberData insert err = " + err);
                        res.status(500).send(error);
                        return;
                    }
                    //에러가 없으면~~~
                    res.status(200).send('class save success');
                });
            }

                    
            //바로 업데이트
            if(payType == 'pass')
            {
                saveClassObject();
            }
            else
            {
                console.log('is not paytype')
                //업데이트 될 시간
                let updateExpireDate = new Date();

                //한달
                if(payType == 'month')
                {
                    updateExpireDate.setDate(updateExpireDate.getDate() + 30);
                }
                //1년
                else if(payType == 'year')
                {
                    updateExpireDate.setDate(updateExpireDate.getDate() + 365);
                }
                //타입 에러
                else
                {
                    //서버 에러
                    res.status(500).send(error);
                    return;
                }

                //먼저 결제 상태를 업데이트 해준다.
                User.update({
                    paymentExpireDate : updateExpireDate
                },
                {
                    where : {
                        userUID : users.userUID
                    }
                }).then((result) => {
                    saveClassObject();
                });
            }
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

router.post('/classObjectUpdateMongo', async function(req, res, next){

    //파라미터
    let jsonClassObject = req.body.classObject;
    let payType = req.body.payType;
    let classId = req.body.classId;
    console.log(`get json class object :  ${jsonClassObject}`); 
    let jsonClass = JSON.parse(jsonClassObject);
    console.log(`check after parse : ${jsonClass}`)
    await ClassObject.findOneAndUpdate({_id:classId}, {classObject:jsonClass});  
    res.status(200).send('class save success');
});

//======================================================================
//  gatheringCreate Connection MongoDB and Insert, Select router
//======================================================================
router.post('/gatheringObjectInsertMongo', async function(req, res, next){
    // Parameter
    let jsonGatheringObject = req.body.gatheringObject;

    //유저 데이터 확인
    User.findOne({where : { userEmail: req.session.passport.user.userEmail }})
    //Success CallBack
    .then(
        function (users)
        {
            let gatheringObject = new ClassObject();

            gatheringObject.userUID = users.userUID;
            gatheringObject.userName = users.userName;
            gatheringObject.dormancy = 'live';
            gatheringObject.objectType = 'gathering';
            gatheringObject.classObject = JSON.parse(jsonGatheringObject);
            gatheringObject.gatheringMember = [];
            if(users.hostType !== undefined && users.hostType !== null && users.hostType !== '')
            {
                gatheringObject.gatheringMember.push({"userUID" : users.userUID, "userName" : users.userName, "hostType" : users.hostType , "authority" : "administrator"});
            }else
            {
                gatheringObject.gatheringMember.push({"userUID" : users.userUID, "userName" : users.userName, "hostType" : 'none' , "authority" : "administrator"});
            }

            gatheringObject.gatheringEvent = [];

            var gatheringObjectMainImageCheck = JSON.parse(jsonGatheringObject); 
            if(gatheringObjectMainImageCheck.mainImage == null || gatheringObjectMainImageCheck.mainImage == undefined || gatheringObjectMainImageCheck.mainImage == '' || gatheringObjectMainImageCheck.mainImage.length < 1) {
                res.status(500).send('입력 정보를 확인해주세요.');
            }

            //mongoose 법 저장
            gatheringObject.save(function(err, success){
                //이곳이 완료 콜백
                if(err)
                {
                    //에러 나타냄(적절하게 처리 할 것)
                    console.error("gatheringData insert err = " + err);
                    res.status(500).send(error);
                    return;
                }

                let enrollClassInfo = new EnrollClassInfo;
                enrollClassInfo.userUID = users.userUID;
                enrollClassInfo.userName = users.userName;
                enrollClassInfo.classID = success._id;
                enrollClassInfo.objectType = 'gathering';
                enrollClassInfo.classInfo = gatheringObject;

                enrollClassInfo.save( (error) => {
                    if(error) {
                        console.log(error);
                        res.status(500).send();
                    }

                    res.status(200).send();
                });

                //에러가 없으면~~~
                res.status(200).send('gathering save success');
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

//======================================================================
//  gatheringEvnet Connection MongoDB and insert, Select router
//======================================================================
router.post('/gatheringEventObjectInsertMongo', async function(req, res, next) {
    let jsonGatheringEventObject = req.body.gatheringEventObject;
    let parseGatheringEventObject = JSON.parse(jsonGatheringEventObject);

    // ※※※※※jsonGatheringEventObject 의 gatheringId를 classObject Id를 넘기도록 변경하기.
    let gatheringData = await ClassObject.findById(parseGatheringEventObject.gatheringId);

    let tempGatheringEvent = [];
    
    tempGatheringEvent = gatheringData.gatheringEvent;
    
    tempGatheringEvent.push(parseGatheringEventObject);
    gatheringData.gatheringEvent = tempGatheringEvent;

    gatheringData.markModified('gatheringEvent');
    
    await gatheringData.save( (error) => {
        if(error)
        {
            console.log('save error : ' + error);

            res.status(500).json({ 'message' : '이벤트 개설에 실패하였습니다.'});
        }
        
        res.status(200).send();
    });
});

//======================================================================
//  journalCreate Connection MongoDB and Insert, Select router
//======================================================================
router.post('/journalObjectInsertMongo', async function(req, res, next){
    // Parameter
    let jsonJournalObject = req.body.journalObject;

    //유저 데이터 확인
    User.findOne({where : { userEmail: req.session.passport.user.userEmail }})
    //Success CallBack
    .then(
        function (users)
        {
            let journalObject = new ClassObject();

            journalObject.userUID = users.userUID;
            journalObject.userName = users.userName;
            journalObject.dormancy = 'live';
            journalObject.objectType = 'journal';
            journalObject.classObject = JSON.parse(jsonJournalObject);
            
            if(users.hostType !== undefined && users.hostType !== null && users.hostType !== '')
            {
                journalObject.hostType = users.hostType;
            } else {
                journalObject.hostType = '';
            }

            //mongoose 법 저장
            journalObject.save(function(err){
                //이곳이 완료 콜백
                if(err)
                {
                    //에러 나타냄(적절하게 처리 할 것)
                    console.error("journalData insert err = " + err);
                    res.status(500).send(error);
                    return;
                }
                //에러가 없으면~~~
                res.status(200).send('journal save success');
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

//======================================================================
//  journal Connection MongoDB and Update
//======================================================================
router.post('/journalObjectUpdateMongo', async function(req, res, next){
    let jsonJournalObject = req.body.journalObject;
    let parseRequestData = JSON.parse(jsonJournalObject);

    // ※※※※※jsonJournalObject의 journalID를 ClassObject ID를 넘기도록 변경하기
    let journalUniqueID = parseRequestData.journalID;

    let journalData = await ClassObject.findById(journalUniqueID);
    
    journalData.classObject = parseRequestData;

    journalData.markModified('classObject');

    await journalData.save( (error) => {
        if(error)
        {
            console.log('save error : ' + error);

            res.status(500).json({ 'message' : '저널 업데이트에 실패하였습니다.'});
        }
        
        res.status(200).send();
    });
});

//======================================================================
//  deleteClass
//======================================================================

func.deleteClass= async (req, res, next, jsonObject) => {
    console.log(`${jsonObject.id}     id`);
    let sendJsonObject = {};
    // let temp = ClassObject.find
    let classObject = ClassObject.find({_id:jsonObject.id}).remove().exec();
    ClassAdditionalInfo.find({classID:jsonObject.id}).remove().exec();
    console.log(jsonObject.id + ' get id')
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'deleted.', sendJsonObject);
}

func.checkIsHost= async (req, res, next, jsonObject) => {
    console.log('is come check');
    const user = await User.findOne({where :{userEmail:jsonObject.userEmail}});
    console.log(`check type :  ${user.hostType}` )
    if(user.hostType){
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'correct');
    }else{
        commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_ERROR, 'impossible');
    }
}

//====================================================
//  payInfoSave
//====================================================
func.payInfoSave = async (req, res, next, payObject) =>{
    console.log(JSON.stringify(payObject));
    testPaySetting.findOne({ where : { userUID: payObject['userUID'] }})
    .then( (findData) => {
        console.log(findData);
        console.log(JSON.stringify(findData));
        if(findData != null) {
            testPaySetting.update({ 
                userUID : payObject['userUID'],
                cardNumberFirst : payObject['cardNumberFirst'],
                cardNumberHashing : payObject['cardNumberHashing'],
                cardDate : payObject['cardDate'],
                cardCVC : payObject['cardCVC'],
                cardType : payObject['cardType'],
                fullName : payObject['fullName'],
                address : payObject['address'],
                phoneNumber : payObject['phoneNumber'],
                calculateCurrencyType : payObject['calculateCurrencyType'],
                calculateBank : payObject['calculateBank'],
                calculateAccountNumber : payObject['calculateAccountNumber'],
                payPal : payObject['payPal'],
                idCard : JSON.stringify(payObject['idCard']),
                passBooksCover : JSON.stringify(payObject['passBooksCover']),
                businessRegistration : JSON.stringify(payObject['businessRegistration'])
            },
            {
                where : { userUID: payObject['userUID'] }
            })
            .then( (success) => {
                commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'payInfoSave Success');
            })
            .catch( (error) => {
                console.log(error);
                res.status(500).send();
            });

        } else {
            let testpaysetting = new testPaySetting({
                userUID : payObject['userUID'],
                cardNumberFirst : payObject['cardNumberFirst'],
                cardNumberHashing : payObject['cardNumberHashing'],
                cardDate : payObject['cardDate'],
                cardCVC : payObject['cardCVC'],
                cardType : payObject['cardType'],
                fullName : payObject['fullName'],
                address : payObject['address'],
                phoneNumber : payObject['phoneNumber'],
                calculateCurrencyType : payObject['calculateCurrencyType'],
                calculateBank : payObject['calculateBank'],
                calculateAccountNumber : payObject['calculateAccountNumber'],
                payPal : payObject['payPal'],
                idCard : JSON.stringify(payObject['idCard']),
                passBooksCover : JSON.stringify(payObject['passBooksCover']),
                businessRegistration : JSON.stringify(payObject['businessRegistration'])
            });
        
            //DB 저장
            testpaysetting.save()
            .then( (success) => {
                commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'payInfoSave Success');
            })
            .catch( (error) => {
                console.log('testpaysetting Save Failed : ' + error);
            });
        }
    })
    .catch( (error) => {
        console.log('testPaySetting FindOne : ' + error);
    });
};

func.kgPayRequest= async (req, res, next, jsonObject) => {
    
    let user = req.session.passport.user
    console.log(JSON.stringify(user))
    console.log(user['userUID'])
    console.log(jsonObject['acceptedMethod'])
    let requestTime = (new Date()).toString();
    await KgPayRequest.create({
        userUID : user['userUID'],
        userName : user['userName'],
        userType : user['hostType'],
        goodType: jsonObject['goodType'],
        goodSellerUID : jsonObject['goodSellerUID'],
        goodSellerName : jsonObject['goodSellerName'],
        goodSellerHostType : jsonObject['goodSellerHostType'],
        goodUID : jsonObject['goodUID'],
        goodName : jsonObject['goodName'],
        buyerName : jsonObject['buyerName'],
        buyerEmail : jsonObject['buyerEmail'],
        phoneNumber : jsonObject['phoneNumber'],
        price : jsonObject['price'],
        gopaymethod : jsonObject['gopaymethod'],
        signature : jsonObject['signature'],
        oid : jsonObject['oid'],
        timestamp : jsonObject['timeStamp'],
        version : jsonObject['version'],
        currency : jsonObject['currency'],
        acceptedMethod : jsonObject['acceptedMethod'],
        requestTime : requestTime
    });
    
    commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'inserted.');
}


module.exports = router;

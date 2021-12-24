//Constant Variable
const commonUtil = require('../util/commonUtil.js');
const config = require('../config/config.json');
const mysql = require('mysql');
const mysqlPool = mysql.createPool(config.database);
const logger = require('../lib/logger.js');
const BaseConstant = require('../util/baseConstant.js');
const DBName = config.database.database;
const drawRing = require('../manager/drawRingManager');

//==================================================
// MySQL Object
//==================================================
const User = require('../models/user');

let instance;

class DataCacheManager 
{
    constructor() 
    {
        this.listConfigDB = [];
        this.mapConfigDB = {};
    }

    static getInstance() 
    {
        if (!instance) 
        {
            instance = new DataCacheManager();
        }

        return instance;
    }

    async init() 
    {
        logger.info('DataCacheManger init Start');
        // this.initConfigDB();

        //링 테스트용
        // const userInfo = await User.findOne({where : {userEmail:'test111@test.com'}});
    
        // drawRing(userInfo, ()=>{
        //     console.log("end of drawRing")
        //     commonUtil.sendResponse(res, 200, BaseConstant.VALUE_RESULT_CODE_SUCCESS, 'signUp Success');
        // })
    }

    //==========================
    // ConfigDB
    //==========================
    // async initConfigDB() 
    // {
    //     console.log('initConfigDB START');

    //     let queryStr = `
    //         CALL ${DBName}.USP_configDB_R();
    //     `;

    //     let rtnData = await this.connectionPoolQueryPromise(queryStr);
    //     this.listConfigDB = rtnData[0];

    //     let mapData = {};
    //     for (let i = 0; i < this.listConfigDB.length; i++) 
    //     {
    //         mapData[this.listConfigDB[i].seq] = this.listConfigDB[i];
    //     }

    //     this.mapConfigDB = mapData;

    //     console.log('initConfigDB END');
    // }

    // async updateConfigDB(config) 
    // {
    //     let configUID = config.configUID;
    //     let configInt = config.configInt;
    //     let configFloat = config.configFloat;
    //     let configString = config.configString;

    //     let queryStr = `
    //         CALL ${DBName}.USP_configDB_U(
    //             ${mysql.escape(configUID)}
    //         ,   ${mysql.escape(configInt)}
    //         ,   ${mysql.escape(configFloat)}
    //         ,   ${mysql.escape(configString)}
    //         ,   @uspRtn
    //         );
    //         SELECT @uspRtn AS uspRtn;
    //     `;

    //     let result = await this.connectionPoolQueryPromise(queryStr);
    //     let uspRtn = result[1][0]['uspRtn'];

    //     return uspRtn;
    // }

    // getConfigDBStringToJson(key) 
    // {
    //     let data = this.mapConfigDB[key].configString;

    //     return JSON.parse(data);
    // }






    //==========================
    // Notice
    //==========================
    insertNotice(notice) 
    {
        let state = 0; //바로 노출

        let queryStr = `
            CALL    ${DBName}.USP_notice_C(
                ${mysql.escape(notice.category)}
            ,   ${mysql.escape(notice.state)}
            ,   ${mysql.escape(notice.title)}
            ,   ${mysql.escape(notice.contents)}
            ,   @noticeUID
            ,   @uspRtn
            );

            SELECT  @noticeUID AS noticeUID;
            SELECT  @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    selectListNotice() 
    {
        let queryStr = `
            CALL    ${DBName}.USP_listNotice_R();
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }
    
    selectListNoticeWithPaging() 
    {
        let queryStr = `
            CALL    ${DBName}.USP_listPaging_R(
                IN	$_tableName		TEXT
            ,   IN	$_startIndex	INT
            ,   IN	$_pageUnit		INT
            ,   IN	$_searchColumn	TEXT
            ,   IN	$_searchText	TEXT
            ,   IN	$_includeColumn	TEXT
            ,   IN	$_includeText	TEXT
            );
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    selectNoticeByNoticeUID(noticeUID) 
    {
        let queryStr = `
            CALL ${DBName}.USP_notice_noticeUID_R(
                ${mysql.escape(noticeUID)}
            ,   @category
            ,   @state
            ,   @title
            ,   @contents
            ,   @regDate
            ,   @uptDate
            ,   @uspRtn
            );

            SELECT @category AS category;
            SELECT @state AS state;
            SELECT @title AS title;
            SELECT @contents AS contents;
            SELECT @regDate AS regDate;
            SELECT @uptDate AS uptDate;
            SELECT @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    updateNotice(notice) 
    {
        let queryStr = `
            CALL ${DBName}.USP_notice_U(
                ${mysql.escape(notice.noticeUID)}
            ,   ${mysql.escape(notice.category)}
            ,   ${mysql.escape(notice.title)}
            ,   ${mysql.escape(notice.contents)}
            ,   @uspRtn
            );

            SELECT  @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    deleteNotice(noticeUID) 
    {
        let queryStr = `
            CALL ${DBName}.USP_notice_D(
                ${mysql.escape(noticeUID)}
            ,   @uspRtn
            );

            SELECT @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    //==========================
    // member
    //==========================
    selectMember()
    {
        let queryStr =`
            CALL ${DBName}.selectMemberList();
        `;
        
        return this.connectionPoolQueryPromise(queryStr);
    }



    insertMember(member) 
    {
        let queryStr = `
            CALL    ${DBName}.USP_member_C(
                ${commonUtil.isBlankData(member.authType) ? 'null' :mysql.escape(member.authType)}
            ,   ${mysql.escape(member.id)}
            ,   ${mysql.escape(member.name)}
            ,   ${mysql.escape(member.password)}
            ,   ${mysql.escape(member.email)}
            ,   ${mysql.escape(member.nickname)}
            ,   ${mysql.escape(member.phone)}
            ,   ${commonUtil.isBlankData(member.grade) ? 'null' :mysql.escape(member.grade)}
            ,   ${mysql.escape(member.address)}
            ,   ${commonUtil.isBlankData(member.state) ? 'null' :mysql.escape(member.state)}
            ,   ${mysql.escape(member.deviceID)}
            ,   ${commonUtil.isBlankData(member.thumbnailUID) ? 'null' :mysql.escape(member.thumbnailUID)}
            ,   ${commonUtil.isBlankData(member.term1) ? 'null' :mysql.escape(member.term1)}
            ,   ${commonUtil.isBlankData(member.term2) ? 'null' :mysql.escape(member.term2)}
            ,   @memberUID
            ,   @uspRtn
            );

            SELECT  @memberUID AS memberUID;
            SELECT  @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    selectListMember() 
    {
        let queryStr = `
            CALL    ${DBName}.USP_listMember_R();
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    selectMemberByMemberUID(memberUID) 
    {
        let queryStr = `
            CALL    ${DBName}.USP_member_memberUID_R(
                ${mysql.escape(memberUID)}
            ,   @authType
            ,   @id
            ,   @name
            ,   @password
            ,   @email
            ,   @nickname
            ,   @phone
            ,   @grade
            ,   @address
            ,   @state
            ,   @deviceID
            ,   @thumbnailUID
            ,   @term1
            ,   @term2
            ,   @regDate
            ,   @uptDate
            ,   @deleteDate
            ,   @uspRtn
            );

            SELECT @authType      AS authType;
            SELECT @id	          AS id;
            SELECT @name	      AS name;
            SELECT @password      AS password;
            SELECT @email	      AS email;
            SELECT @nickname      AS nickname;
            SELECT @phone	      AS phone;
            SELECT @grade	      AS grade;
            SELECT @address	      AS address;
            SELECT @state	      AS state;
            SELECT @deviceID      AS deviceID;
            SELECT @thumbnailUID  AS thumbnailUID;
            SELECT @term1	      AS term1;
            SELECT @term2	      AS term2;
            SELECT @regDate	      AS regDate;
            SELECT @uptDate	      AS uptDate;
            SELECT @deleteDate    AS deleteDate;
            SELECT @uspRtn	      AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    selectMemberById(id) 
    {
        let queryStr = `
            CALL    ${DBName}.USP_member_id_R(
                ${mysql.escape(id)}
            ,   @memberUID
            ,   @authType
            ,   @name
            ,   @password
            ,   @email
            ,   @nickname
            ,   @phone
            ,   @grade
            ,   @address
            ,   @state
            ,   @deviceID
            ,   @thumbnailUID
            ,   @term1
            ,   @term2
            ,   @regDate
            ,   @uptDate
            ,   @deleteDate
            ,   @uspRtn
            );

            SELECT @memberUID	  AS memberUID;
            SELECT @authType      AS authType;
            SELECT @name	      AS name;
            SELECT @password      AS password;
            SELECT @email	      AS email;
            SELECT @nickname      AS nickname;
            SELECT @phone	      AS phone;
            SELECT @grade	      AS grade;
            SELECT @address	      AS address;
            SELECT @state	      AS state;
            SELECT @deviceID      AS deviceID;
            SELECT @thumbnailUID  AS thumbnailUID;
            SELECT @term1	      AS term1;
            SELECT @term2	      AS term2;
            SELECT @regDate	      AS regDate;
            SELECT @uptDate	      AS uptDate;
            SELECT @deleteDate    AS deleteDate;
            SELECT @uspRtn	      AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    updateMember(member) 
    {
        let queryStr = `
            CALL    ${DBName}.USP_member_U(
                ${mysql.escape(member.memberUID)}
            ,   ${commonUtil.isBlankData(member.authType) ? 'null' :mysql.escape(member.authType)}
            ,   ${mysql.escape(member.id)}
            ,   ${mysql.escape(member.name)}
            ,   ${mysql.escape(member.password)}
            ,   ${mysql.escape(member.email)}
            ,   ${mysql.escape(member.nickname)}
            ,   ${mysql.escape(member.phone)}
            ,   ${commonUtil.isBlankData(member.grade) ? 'null' :mysql.escape(member.grade)}
            ,   ${mysql.escape(member.address)}
            ,   ${commonUtil.isBlankData(member.state) ? 'null' :mysql.escape(member.state)}
            ,   ${mysql.escape(member.deviceID)}
            ,   ${commonUtil.isBlankData(member.thumbnailUID) ? 'null' :mysql.escape(member.thumbnailUID)}
            ,   ${commonUtil.isBlankData(member.term1) ? 'null' :mysql.escape(member.term1)}
            ,   ${commonUtil.isBlankData(member.term2) ? 'null' :mysql.escape(member.term2)}
            ,   @uspRtn
            );

            SELECT  @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }

    deleteMember(memberUID) 
    {
        let queryStr = `
            CALL ${DBName}.USP_member_D(
                ${mysql.escape(memberUID)}
            ,   @uspRtn
            );

            SELECT @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
    }


    //==========================
    // file
    //==========================
    async USP_fileList_C(fileInfo, successCallBack, failedCallBack)
    {
        let fileOriginalName = fileInfo.fileOriginalName;
        let fileServerName = fileInfo.fileServerName;
        let filePath = fileInfo.filePath;
        let fileSize = fileInfo.fileSize;

        mysqlPool.getConnection(async function (err, conn) 
        {
            if (!err) 
            {
                let queryStr = `
                    CALL ${DBName}.USP_file_C(
                        ?
                    ,   ?
                    ,   ?
                    ,   ?
                    ,   @fileListUID
                    ,   @uspRtn
                    );
                    SELECT @fileListUID AS fileListUID;
                    SELECT @uspRtn AS uspRtn;
                `;

                //연결 성공
                conn.query(queryStr,[fileOriginalName,fileServerName,filePath,fileSize], 
                    //성공 콜백
                    function (err, result) 
                    {
                        if(err)
                        {
                            failedCallBack(err);
                            return;
                        }
                        fileInfo.fileListUID = result[1][0]['fileListUID'];                        
                        fileInfo.uspRtn = result[2][0]['uspRtn'];
                        successCallBack(fileInfo);
                    }
                );
            } 
            else 
            {
                failedCallBack(err);
            }

            conn.release();
        });
    }

    async USP_fileList_R(fileListUID)
    {
        let queryStr = `
            CALL ${DBName}.USP_file_fileUID_R(
                ${mysql.escape(fileListUID)}
            ,   @fileName
            ,   @fileRealName
            ,   @filePath
            ,   @regdate
            ,   @uspRtn
            );
            SELECT @fileName AS fileName;
            SELECT @fileRealName AS fileRealName;
            SELECT @filePath AS filePath;
            SELECT @regdate AS regdate;
            SELECT @uspRtn AS uspRtn;
        `;

        return this.connectionPoolQueryPromise(queryStr);
        // let fileInfo = {};
        // fileInfo.fileListUID = fileListUID;
        // fileInfo.fileName = result[1][0]['fileName'];
        // fileInfo.fileRealName = result[2][0]['fileRealName'];
        // fileInfo.filePath = result[3][0]['filePath'];
        // fileInfo.regdate = result[4][0]['regdate'];
        // fileInfo.uspRtn = result[5][0]['uspRtn'];
    }









    /*******************************************************/
    /*******************************************************/
    /*****************      ADMIN      *********************/
    /*******************************************************/
    /*******************************************************/
    //==========================
    // UV Log
    //==========================
    setUVLog(path)
    {
        // const options = {
        //     uri:'url', 
        //     method: 'POST',
        //     form: 
        //     {
        //         'key': 'value'
        //     }
        // }

        // request.post(options, function(err, httpResponse, body){
        //     if(err)
        //     {
        //         console.log(err);
        //         return;
        //     }
        //     let parseBody = JSON.parse(body);
        // });
    }

    //==========================
    // PV Log
    //==========================
    setPVLog(path)
    {
        // const options = {
        //     uri:'url', 
        //     method: 'POST',
        //     form: 
        //     {
        //         'key': 'value'
        //     }
        // }

        // request.post(options, function(err, httpResponse, body){
        //     if(err)
        //     {
        //         console.log(err);
        //         return;
        //     }
        //     let parseBody = JSON.parse(body);
        // });
    }

    connectionPoolQueryPromise(queryStr) 
    {
        return new Promise(function (resolve, reject) {
            mysqlPool.getConnection(function (err, conn) 
            {
                if (!err) 
                {
                    conn.query(queryStr,[], function (err, result) {
                        if(err)
                        {
                            console.log(err);
                            reject();
                        }
                        else
                        {
                            resolve(result);
                        }
                    });

                    conn.release();
                } 
                else 
                {
                    console.log(err);
                    conn.release();
                    reject();
                }
            });
        });
    }
}

module.exports = DataCacheManager;
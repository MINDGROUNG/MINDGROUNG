const BaseConstant = require('./baseConstant');
const crypto = require('crypto');
const iconv = require('iconv-lite');

//mail
const nodemailer = require('nodemailer');
const nodeoutlook = require('nodejs-nodemailer-outlook');

//mysql Object
const Statistics = require('../models/statistics');
const User = require('../models/user');
const Following = require('../models/following');

//mongo Object
const ClassObject = require('../mongoModels/ClassObject');

let self = (module.exports = {
    //=========================================================
    //  프로젝트 공통 유틸 함수
    //=========================================================
    arrayContains: function (needle, arrhaystack) 
    {
        return arrhaystack.indexOf(needle) > -1;
    },

    replaceAll: function (str, searchStr, replaceStr) 
    {
        if (str == undefined) return str;
        return str.split(searchStr).join(replaceStr);
    },

    replaceDatetime: function (str) 
    {
        let newStr = this.replaceAll(str, '-', '');
        newStr = this.replaceAll(newStr, ':', '');
        newStr = this.replaceAll(newStr, ' ', '');
        return newStr;
    },

    removeHTMLTag: function (str) 
    {
        if (str === null || str === '') return false;
        else str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    },

    makeid: function (length) 
    {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    randomPassword: function (length) 
    {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    getAuthCode: function (length) 
    {
        let text = '';
        let possible = '0123456789';
        for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    getFormatDate: function (date) 
    {
        let newDate = new Date(date);
        let year = newDate.getFullYear(); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? month : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? day : '0' + day; //day 두자리로 저장

        let hour = newDate.getHours(); //d
        hour = hour >= 10 ? hour : '0' + hour; //hour 두자리로 저장

        let minute = newDate.getMinutes(); //d
        minute = minute >= 10 ? minute : '0' + minute; //minute 두자리로 저장

        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    },

    getFormatDateYYToSS: function (date) 
    {
        let newDate = new Date(date);
        let year = newDate.getFullYear(); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? month : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? day : '0' + day; //day 두자리로 저장

        let hour = newDate.getHours(); //d
        hour = hour >= 10 ? hour : '0' + hour; //hour 두자리로 저장

        let minute = newDate.getMinutes(); //d
        minute = minute >= 10 ? minute : '0' + minute; //minute 두자리로 저장

        let seconds = newDate.getSeconds(); //d
        seconds = seconds >= 10 ? seconds : '0' + seconds; //minute 두자리로 저장

        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
    },

    getFormatDateNumber: function (date) 
    {
        let newDate = new Date(date);
        let year = String(newDate.getFullYear()); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? String(month) : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? String(day) : '0' + day; //day 두자리로 저장

        let hour = newDate.getHours(); //d
        let hour12 = hour >= 12 ? hour - 12 : hour;
        hour12 = hour12 >= 10 ? String(hour12) : '0' + hour12;
        hour = hour >= 10 ? String(hour) : '0' + hour; //hour 두자리로 저장

        let minute = newDate.getMinutes(); //d
        minute = minute >= 10 ? String(minute) : '0' + minute; //minute 두자리로 저장

        return year + month + day + hour + minute + hour12;
    },

    getFormatDateNumberKorean: function (date) 
    {
        let newDate = new Date(date);
        let year = newDate.getFullYear(); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? month : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? day : '0' + day; //day 두자리로 저장

        return year + '년 ' + month + '월 ' + day + '일 ';
    },

    getFormatDateNumberTimeKorean: function (date) 
    {
        let newDate = new Date(date);
        let year = newDate.getFullYear(); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? month : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? day : '0' + day; //day 두자리로 저장

        let hour = newDate.getHours(); //d
        let hour12 = hour >= 12 ? hour - 12 : hour;
        hour12 = hour12 >= 10 ? hour12 : '0' + hour12;
        hour = hour >= 10 ? hour : '0' + hour; //hour 두자리로 저장

        let minute = newDate.getMinutes(); //d
        minute = minute >= 10 ? minute : '0' + minute; //minute 두자리로 저장

        return year + '년 ' + month + '월 ' + day + '일 ' + hour + '시' + minute + '분';
    },

    getFormatDate24Hour: function (date) 
    {
        let newDate = new Date(date);
        let currentDate = new Date().getTime();
        let compareDate = newDate.getTime();

        let time = currentDate - compareDate;

        let dayMs = 60 * 60 * 24 * 1000;
        let minuteMs = 60 * 1000;

        if (time >= dayMs) 
        {
            let month = 1 + newDate.getMonth(); //M
            month = month >= 10 ? month : '0' + month; //month 두자리로 저장
            let day = newDate.getDate(); //d
            day = day >= 10 ? day : '0' + day; //day 두자리로 저장

            let hour = newDate.getHours(); //d
            hour = hour >= 10 ? hour : '0' + hour; //hour 두자리로 저장

            let minute = newDate.getMinutes(); //d
            minute = minute >= 10 ? minute : '0' + minute; //minute 두자리로 저장

            return month + '월 ' + day + '일';
        } 
        else 
        {
            let min = Math.floor(time / minuteMs) + 1;
            let hour = Math.floor(min / 60);

            if (hour == 0) 
            {
                return min + '분 전';
            } 
            else 
            {
                min = min - hour * 60;
                return hour + '시간 전';
            }
        }
    },

    getFormatDateYYYYMMDD: function (date) 
    {
        let newDate = new Date(date);
        let year = newDate.getFullYear(); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? month : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? day : '0' + day; //day 두자리로 저장

        return year + '-' + month + '-' + day;
    },

    getMovieFormatDateYYYYMMDD: function (date) 
    {
        let newDate = new Date(date);
        let year = newDate.getFullYear(); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? month : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? day : '0' + day; //day 두자리로 저장

        return year + '.' + month + '.' + day;
    },

    getFormatDateTime: function (date) 
    {
        let newDate = new Date(date);
        let hour = newDate.getHours(); //d
        hour = hour >= 10 ? hour : '0' + hour; //hour 두자리로 저장

        let minute = newDate.getMinutes(); //d
        minute = minute >= 10 ? minute : '0' + minute; //minute 두자리로 저장

        let seconds = newDate.getSeconds(); //d
        seconds = seconds >= 10 ? seconds : '0' + seconds; //minute 두자리로 저장

        return hour + ':' + minute + ':' + seconds;
    },

    getFormatDateYYYYMMDDNumber: function (date) 
    {
        let newDate = new Date(date);
        let year = String(newDate.getFullYear()); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? String(month) : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? String(day) : '0' + day; //day 두자리로 저장

        return Number(year + month + day);
    },

    getFormatDateYYYYMMDDHHMMNumber: function (date) 
    {
        let newDate = new Date(date);
        let year = String(newDate.getFullYear()); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? String(month) : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? String(day) : '0' + day; //day 두자리로 저장
        let hour = newDate.getHours();
        hour = hour >= 10 ? String(hour) : '0' + hour;
        let minute = newDate.getMinutes();
        minute = minute >= 10 ? String(minute) : '0' + minute;

        let milliseconds = String(newDate.getMilliseconds());

        return Number(year + month + day + hour + minute + milliseconds);
    },

    getFormatDateYYYYMMDDHHMMSSNumber: function (date) 
    {
        let newDate = new Date(date);
        let year = String(newDate.getFullYear()); //yyyy
        let month = 1 + newDate.getMonth(); //M
        month = month >= 10 ? String(month) : '0' + month; //month 두자리로 저장
        let day = newDate.getDate(); //d
        day = day >= 10 ? String(day) : '0' + day; //day 두자리로 저장
        let hour = newDate.getHours();
        hour = hour >= 10 ? String(hour) : '0' + hour;
        let minute = newDate.getMinutes();
        minute = minute >= 10 ? String(minute) : '0' + minute;

        let seconds = newDate.getSeconds(); //d
        seconds = seconds >= 10 ? String(seconds) : '0' + seconds; //minute 두자리로 저장

        return Number(year + month + day + hour + minute + seconds);
    },

    getDateDayDifferent: function (date1, date2) 
    {
        let comDate1 = new Date(date1);
        let comDate2 = new Date(date2);
        let betweenDay = (comDate1.getTime() - comDate2.getTime()) / 1000 / 60 / 60 / 24;

        return betweenDay;
    },

    getTimeStamp: function () 
    {
        let d = new Date();
        let s =
            this.leadingZeros(d.getFullYear(), 4) +
            '-' +
            this.leadingZeros(d.getMonth() + 1, 2) +
            '-' +
            this.leadingZeros(d.getDate(), 2) +
            ' ' +
            this.leadingZeros(d.getHours(), 2) +
            ':' +
            this.leadingZeros(d.getMinutes(), 2) +
            ':' +
            this.leadingZeros(d.getSeconds(), 2);

        return s;
    },

    getDate: function () 
    {
        let d = new Date();
        let s = this.leadingZeros(d.getFullYear(), 4) + '-' + this.leadingZeros(d.getMonth() + 1, 2) + '-' + this.leadingZeros(d.getDate(), 2);

        return s;
    },

    getMonth: function () 
    {
        let d = new Date();
        return this.leadingZeros(d.getMonth() + 1, 2);
    },

    getDay: function () 
    {
        let d = new Date();
        return this.leadingZeros(d.getDate(), 2);
    },

    leadingZeros: function (n, digits) 
    {
        let zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (let i = 0; i < digits - n.length; i++) zero += '0';
        }
        return zero + n;
    },

    getIPAddress: function () 
    {
        let interfaces = require('os').networkInterfaces();
        for (let devName in interfaces) 
        {
            let iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) 
            {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) return alias.address;
            }
        }
        return '0.0.0.0';
    },

    insertTextToIndex: function (text, index, char) 
    {
        return text.substr(0, index) + char + text.substr(index);
    },

    addCommas: function (num) 
    {
        let str = num.toString().split('.');
        if (str[0].length >= 4) 
        {
            //add comma every 3 digits befor decimal
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        /* Optional formating for decimal places
        if (str[1] && str[1].length >= 4) {
            //add space every 3 digits after decimal
            str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }*/
        return str.join('.');
    },

    randomRange: function (n1, n2) 
    {
        return Math.floor(Math.random() * (n2 - n1 + 1) + n1);
    },

    clone: function (obj) 
    {
        if (obj === null || typeof obj !== 'object') return obj;

        let copy = obj.constructor();
        for (let attr in obj) 
        {
            if (obj.hasOwnProperty(attr)) 
            {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    },

    getMillisecondsToMMSS: function (ms) 
    {
        // 1- Convert to seconds:
        let seconds = ms / 1000;
        // 2- Extract hours:
        let hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;

        return minutes + ':' + Math.floor(seconds);
    },

    sendResponse: function (res, status, resultCode, message, jsonObject = {})
    {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');

        jsonObject['resultCode'] = resultCode;
        jsonObject['message'] = message;

        //logger.info(JSON.stringify(jsonObject));

        res.status(status).json(jsonObject);
    },

    isBlankData: function (text) 
    {
        if (!text || text == null || text.lengh < 1 || text == '' || text == 'null' || text == 'NULL') 
        {
            return true;
        }

        return false;
    },

    getRequestNum: function () 
    {
        let startNum = 0;
        let endNum = 999999;
        let reqDate = this.getRequsetDate();

        let reqNum = reqDate + Math.floor(Math.random() * (endNum - startNum + 1) + startNum);

        return reqNum;
    },

    getRequsetDate: function () 
    {
        let newDate = new Date();
        let date = newDate.getDate();
        let mon = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        let hour = newDate.getHours();
        let min = newDate.getMinutes();
        let sec = newDate.getSeconds();

        let month = mon < 10 ? `0${mon}` : `${mon}`;

        let reqDate = year + month + date + hour + min + sec;

        return reqDate;
    },

    getCinemaImage: function (type) 
    {
        if (type == BaseConstant.CINEMA_TYPE_MEGABOX) 
        {
            return '/img/cinema/m.png';
        } 
        else if (type == BaseConstant.CINEMA_TYPE_LOTTECINEMA) 
        {
            return '/img/cinema/l.png';
        } 
        else if (type == BaseConstant.CINEMA_TYPE_CGV) 
        {
            return '/img/cinema/c.png';
        }
    },

    encryptAES256: function (value, key) 
    {
        let cipher = crypto.createCipheriv('aes-256-ecb', key, null);
        let encryptedSecret = cipher.update(value, 'utf8', 'base64') + cipher.final('base64');
        return encryptedSecret;
    },

    decryptAES256: function (value, key)
    {
        let decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
        let decryptedSecret = decipher.update(value, 'base64', 'utf8') + decipher.final('utf8');
        return decryptedSecret;
    },

    encryptAES128: function (value, key, iv) 
    {
        let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        cipher.setAutoPadding(true);
        let encryptedSecret = cipher.update(value, 'utf8', 'base64') + cipher.final('base64');
        return encryptedSecret;
    },

    decryptAES128: function (value, key, iv) 
    {
        let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(true);
        let decryptedSecret = decipher.update(value, 'base64', 'utf8') + decipher.final('utf8');
        return decryptedSecret;
    },

    urlencodeEuckr: function (value) 
    {
        let buf = iconv.encode(value, 'euc-kr');
        let encodeStr = '';
        for (let i = 0; i < buf.length; i++) {
            encodeStr += '%' + buf[i].toString('16');
        }
        encodeStr = encodeStr.toUpperCase();
        return encodeStr;
    },

    changeXssString: function (value) 
    {
        return value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/$/g, '&#36;');
    },

    sendMail: function(email, subject, html) {
        if(this.isBlankData(email))
        {
            console.log('send mail failure: email is null');
            return;
        }

        //메일서버, 계정 정보로 수정 필요
        // let mailServerOption;
 
        //     mailServerOption = 
        //     {
        //         service: 'Gmail',
        //         host: 'smtp.gmail.com',
        //         auth: 
        //         {
        //             user: 'mindground.co@gmail.com',
        //             pass: 'M1ndgr0und!'
        //         }
        //     };
        

        
        // let mailOpt = 
        // {
        //     from: mailServerOption.user,
        //     to: email,
        //     subject: subject,
        //     html: html
        // };
        // console.log('come before')
        // let smtpTransport = nodemailer.createTransport(mailServerOption);
        // console.log('afteer')
        //전송
        // smtpTransport.sendMail(mailOpt, function (err, res) {
        //     if (err) 
        //     {
        //         console.log(err);
        //     }
        //     console.log('mail send success');
        //     console.log(res);
        //     smtpTransport.close();
        // });

        // let nodeoutlook = re
        console.log('coemc ehck')
        nodeoutlook.sendEmail({
            auth:{
                user:"support@mindground.co",
                pass:"M1nd2021**" 
            },
            from:"support@mindground.co",
            to:email,
            subject:subject,
            html:html,
            replyTo:"support@mindground.co",
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        })
        console.log(`check afet`)







    },

    sendOtpEmailHtml : function (userName, userEmail, otpNum)
    {
        let html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
            +' <html xmlns="http://www.w3.org/1999/xhtml">'
            +'<head>'
            +'    <title>MIND GROUND</title>'
            +'        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
            +'        <meta name="viewport" content="width=750, initial-scale=1, viewport-fit=cover" />'
            +'        <style>'
            +'            body {'
            +'                width: 100% !important;'
            +'                height: 100%;'
            +'                padding: 0;'
            +'                margin: 0;'
            +'                background-color: #202020;'
            +'            }'
            +''
            +'            #container {'
            +'                padding: 30px 0 30px 0;'
            +'                background-color: #e6e6e6;'
            +'                box-sizing: border-box;'
            +'            }'
            +''
            +'            img,'
            +'            a,'
            +'            button {'
            +'                border: 0;'
            +'                outline: none;'
            +'                text-decoration: none;'
            +'            }'
            +''
            +'            h1,'
            +'            h2,'
            +'            h3,'
            +'            h4,'
            +'            p,'
            +'            span,'
            +'            strong,'
            +'            strike {'
            +'                padding: 0;'
            +'                margin: 0;'
            +'                font-size: 14px;'
            +'                font-weight: 400;'
            +'            }'
            +''
            +'            table,'
            +'            td {'
            +'                border-collapse: collapse;'
            +'            }'
            +'            table,'
            +'            td {'
            +'                /* mso는 microsoft outlook의 약자입니다. */'
            +'                /* outlook 2007 이상에서 강제로 추가하는 테이블 주위의 간격을 제거 해줍니다. */'
            +'                mso-table-lspace: 0pt;'
            +'                mso-table-rspace: 0pt;'
            +'            }'
            +''
            +'            img {'
            +'                /* IE에서 크기가 조정된 이미지를 렌더링 하는 방식을 수정합니다. */'
            +'                -ms-interpolation-mode: bicubic;'
            +'                display: block;'
            +'            }'
            +''
            +'            body,'
            +'            table,'
            +'            td,'
            +'            p,'
            +'            a,'
            +'            li,'
            +'            blockquote {'
            +'                /* IE와 Safari에서 텍스트 크기 및 내부 데이터 크기를 자동으로 줄여서 텍스트가 빠져나가지 않도록 크기를 잡아주는 설정입니다. */'
            +'                -ms-text-size-adjust: 100%;'
            +'                -webkit-text-size-adjust: auto;'
            +'            }'
            +'        </style>'
            +'    </head>'
            +'    <body>'
            +'        <table border="0" cellpadding="0" cellspacing="0" width="542" style="margin: 100px auto; background-color: #2e2e34; border-radius: 10px">'
            +'            <tbody>'
            +'                <tr>'
            +'                    <td>'
            +'                        <table border="0" cellpadding="0" cellspacing="0" width="542">'
            +'                            <tbody>'
            +'                                <tr height="24"></tr>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td style="text-align: center">'
            +'                                        <a rel="noopener noreferrer" href="#" style="display: inline; color: #ffffff; font-size: 13px; text-decoration: none" target="_blank">'
            +'                                            <img width="156" src="https://www.mindground.co/web/img/header/logo.png" />'
            +'                                        </a>'
            +'                                    </td>'
            +'                                </tr>'
            +'                            </tbody>'
            +'                        </table>'
            +'                    </td>'
            +'                </tr>'
            +'                <tr height="60"></tr>'
            +'                <tr>'
            +'                    <td>'
            +'                        <table>'
            +'                            <tbody>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td'
            +'                                        width="542"'
            +'                                        style="'
            +'                                            font-family: NotoSans;'
            +'                                            font-size: 20px;'
            +'                                            font-weight: bold;'
            +'                                            font-stretch: normal;'
            +'                                            font-style: normal;'
            +'                                            line-height: 1;'
            +'                                            letter-spacing: normal;'
            +'                                            color: #aeacff;'
            +'                                        "'
            +'                                    >'
            +'                                        안녕하세요 '+userName+' 님,'
            +'                                    </td>'
            +'                                </tr>'
            +'                            </tbody>'
            +'                        </table>'
            +'                    </td>'
            +'                </tr>'
            +'                <tr height="20"></tr>'
            +'                <tr>'
            +'                    <td>'
            +'                        <table>'
            +'                            <tbody>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td'
            +'                                        width="450"'
            +'                                        style="'
            +'                                            font-family: NotoSans;'
            +'                                            font-size: 14px;'
            +'                                            font-weight: normal;'
            +'                                            font-stretch: normal;'
            +'                                            font-style: normal;'
            +'                                            line-height: 1.57;'
            +'                                            letter-spacing: normal;'
            +'                                            text-align: left;'
            +'                                            color: #fff;'
            +'                                        "'
            +'                                    >'
            +'                                        회원님의 Mind Ground 비밀번호 재설정 요청을 받았습니다.'
            +'                                    </td>'
            +'                                </tr>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td'
            +'                                        width="450"'
            +'                                        style="'
            +'                                            font-family: NotoSans;'
            +'                                            font-size: 14px;'
            +'                                            font-weight: normal;'
            +'                                            font-stretch: normal;'
            +'                                            font-style: normal;'
            +'                                            line-height: 1.57;'
            +'                                            letter-spacing: normal;'
            +'                                            text-align: left;'
            +'                                            color: #fff;'
            +'                                        "'
            +'                                    >'
            +'                                        비밀번호 재설정을 위해 인증번호를 입력하세요.'
            +'                                    </td>'
            +'                                </tr>'
            +'                            </tbody>'
            +'                        </table>'
            +'                    </td>'
            +'                </tr>'
            +'                <tr height="30"></tr>'
            +'                <tr>'
            +'                    <td>'
            +'                        <table>'
            +'                            <tbody>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td width="482">'
            +'                                        <table style="background-color: #45454f; border-radius: 10px">'
            +'                                            <tbody>'
            +'                                                <tr height="25"></tr>'
            +'                                                <tr>'
            +'                                                    <td width="95"></td>'
            +'                                                    <td'
            +'                                                        width="387"'
            +'                                                        style="'
            +'                                                            font-family: NotoSans;'
            +'                                                            font-size: 50px;'
            +'                                                            font-weight: bold;'
            +'                                                            font-stretch: normal;'
            +'                                                            font-style: normal;'
            +'                                                            line-height: 1;'
            +'                                                            letter-spacing: 25px;'
            +'                                                            color: #fff;'
            +'                                                        "'
            +'                                                    >'
            +'                                                        '+otpNum+''
            +'                                                    </td>'
            +'                                                </tr>'
            +'                                                <tr height="25"></tr>'
            +'                                            </tbody>'
            +'                                        </table>'
            +'                                    </td>'
            +'                                    <td width="30"></td>'
            +'                                </tr>'
            +'                            </tbody>'
            +'                        </table>'
            +'                    </td>'
            +'                </tr>'
            +'                <tr height="30"></tr>'
            +'                <tr>'
            +'                    <td>'
            +'                        <table>'
            +'                            <tbody>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td'
            +'                                        width="487"'
            +'                                        style="'
            +'                                            font-family: NotoSans;'
            +'                                            font-size: 12px;'
            +'                                            font-weight: normal;'
            +'                                            font-stretch: normal;'
            +'                                            font-style: normal;'
            +'                                            line-height: 1.67;'
            +'                                            letter-spacing: normal;'
            +'                                            text-align: left;'
            +'                                            color: #fff;'
            +'                                        "'
            +'                                    >'
            +'                                        *비밀번호를 재설정 하려면 인증번호가 필요합니다. 이 이메일이 없으면 누구도 귀하의 계정에 접속할 수 없습니다.'
            +'                                    </td>'
            +'                                    <td width="30"></td>'
            +'                                </tr>'
            +'                                <tr height="20"></tr>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td'
            +'                                        width="487"'
            +'                                        style="'
            +'                                            font-family: NotoSans;'
            +'                                            font-size: 12px;'
            +'                                            font-weight: normal;'
            +'                                            font-stretch: normal;'
            +'                                            font-style: normal;'
            +'                                            line-height: 1.67;'
            +'                                            letter-spacing: normal;'
            +'                                            text-align: left;'
            +'                                            color: #fff;'
            +'                                        "'
            +'                                    >'
            +'                                        *인증번호를 받으려고 한 게 아니라면 Mind Ground 비밀번호를 변경해주세요. 계정 보안을 유지 하기 위해 이메일 비밀번호도 변경하시는 것이 좋습니다. '
            +'                                    </td>'
            +'                                    <td width="30"></td>'
            +'                                </tr>'
            +'                            </tbody>'
            +'                        </table>'
            +'                    </td>'
            +'                </tr>'
            +'                <tr height="50"></tr>'
            +'                <tr>'
            +'                    <td>'
            +'                        <table>'
            +'                            <tbody>'
            +'                                <tr>'
            +'                                    <td width="30"></td>'
            +'                                    <td'
            +'                                        width="380"'
            +'                                        style="'
            +'                                            font-family: NotoSans;'
            +'                                            font-size: 12px;'
            +'                                            font-weight: normal;'
            +'                                            font-stretch: normal;'
            +'                                            font-style: normal;'
            +'                                            line-height: 1;'
            +'                                            letter-spacing: normal;'
            +'                                            text-align: left;'
            +'                                            color: #999;'
            +'                                        "'
            +'                                    >'
            +'                                        이 메일은 회원님의 요청에 따라 '+userEmail+' 에 전송되었습니다.'
            +'                                    </td>'
            +'                                </tr>'
            +'                            </tbody>'
            +'                        </table>'
            +'                    </td>'
            +'                </tr>'
            +'                <tr height="60"></tr>'
            +'            </tbody>'
            +'        </table>'
            +'    </body>'
            +'</html>'
            return html;
    },

    getOtp : function(length)
    {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    testFunction: function (rawDate) 
    {
        let year = rawDate.getFullYear();
        let month = rawDate.getMonth();
        let date = rawDate.getDate();
        return `${year}.${month}.${date}`
    },

    getUserActivityInfo : async function (userUID){

        let userActivityInfo = {};
        followerNum = await Following.findAll({
            attributes: ['userUID', 'userName', 'userHostType', 'targetUID','targetName', 'targetHostType'],
            where:{
                targetUID : userUID
            }
        })

        let followingNum = await Following.findAll({
            attributes: ['userUID', 'userName', 'userHostType', 'targetUID','targetName', 'targetHostType'],
            where:{
                userUID : userUID
            }
        })

        let classNum = await ClassObject.countDocuments({ objectType : 'class', userUID : userUID})
        let gatheringNum = await ClassObject.countDocuments({ objectType : 'gathering', userUID : userUID})
        let journalNum = await ClassObject.countDocuments({ objectType : 'journal', userUID : userUID})


        userActivityInfo.followerNum = followerNum;
        userActivityInfo.followingNum = followingNum;
        userActivityInfo.classnum = classNum;
        userActivityInfo.gatheringNum = gatheringNum;
        userActivityInfo.journalNum = journalNum;
        
        console.log(JSON.stringify(userActivityInfo))
        return userActivityInfo;

    },

    getStatistics : async function(thisDay) {

        let statistics = await Statistics.findOne({where :{thisDate:thisDay}});
        const userSum = await User.count({})
        const classSum = await ClassObject.countDocuments({ objectType : 'class'}).exec();
        const gatheringSum = await ClassObject.countDocuments({ objectType : 'gathering'}).exec();
        const journalSum = await ClassObject.countDocuments({ objectType : 'journal'}).exec();
        statistics.userSum = userSum;
        statistics.classSum = classSum;
        statistics.gatheringSum = gatheringSum;
        statistics.journalSum = journalSum;
        
        return statistics;
    },

    getFormedDate : function(rawDate){
        let year = rawDate.getFullYear();
        let month = rawDate.getMonth();
        let date = rawDate.getDate();
        return `${year}.${month}.${date}`
    },



    //=========================================================
    //  프로젝트 유틸 함수
    //=========================================================
    
    //---------------------------------------------------------
    // 유저의 결제 상태를 가져오는 함수
    // 0 : 결제 필요 없음 상태
    // 1 : 결제 필요 상태
    //---------------------------------------------------------
    getUserisPayment: function (userPaymentExpireDate) 
    {
        let isNeedPayment = 1; //결제 필요 상태

        //만료 날짜가 없다면... 
        if(!userPaymentExpireDate)
        {
            return isNeedPayment;
        }

        console.log("userPaymentExpireDate = " + userPaymentExpireDate);
        let paymentExpireDate = new Date(userPaymentExpireDate);
        let nowDate = new Date();

        console.log("nowDate.getTime() = " + nowDate.getTime());
        console.log("paymentExpireDate.getTime() = " + paymentExpireDate.getTime());
        //필요 없음 (결제 만료 날짜가 현재보다 미래일 때)
        if(nowDate.getTime() < paymentExpireDate.getTime())
        {
            isNeedPayment = 0; 
        }
        
        return isNeedPayment;
    }
});

class BaseConstant 
{
    //===================================
    // SERVER PORT
    //===================================
    static get SERVER_PORT_NUMBER() 
    {
        return 8080;//'PORT_NUMBER';
    }

    //===================================
    // SERVER PORT
    //===================================
    static get DEV_ENV() {
        let REAL = 0;
        let DEV = 1;
        let LOCAL = 2;

        let env = LOCAL; //<<<----여기를 변경하면 됨

        return env;
    }

    //===================================
    // DATABASE CONFIG
    //===================================
    static get GET_DATABASE_CONFIG() 
    {
        const config = require('../config/config.json');
        let databaseConfig = null;

        databaseConfig = config.database;

        console.log(JSON.stringify(databaseConfig));
        return databaseConfig;
    }

    //===================================
    // PlatForm Code
    //===================================
    static get PLATFORM_CODE_PC() 
    {
        return 0;
    }
    static get PLATFORM_CODE_AOS() 
    {
        return 1;
    }
    static get PLATFORM_CODE_IOS() 
    {
        return 2;
    }

    //===================================
    // Acount Type
    //===================================
    static get ACCOUNT_TYPE_DEVICE() 
    {
        return 0;
    }
    static get ACCOUNT_TYPE_GOOGLE() 
    {
        return 1;
    }
    static get ACCOUNT_TYPE_FACEBOOK() 
    {
        return 2;
    }
    static get ACCOUNT_TYPE_KAKAO() 
    {
        return 3;
    }

    //===================================
    // HTTP CONST
    //===================================
    static get VALUE_RESULT_CODE_SUCCESS() 
    {
        return 0;
    }
    static get VALUE_RESULT_CODE_ERROR() 
    {
        return 1;
    }
    static get VALUE_RESULT_CODE_NEED_UPDATE() 
    {
        return 2;
    }

    

    //===================================
    // 프로젝트의 상수
    //===================================
}

module.exports = BaseConstant;

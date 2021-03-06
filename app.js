//================================================import================================================//
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');
const config = require('./config/config.json');
const passport = require('passport');
const passportConfig = require('./passport');
const requestIp = require('request-ip');
const frontPage = require('./routes/frontPage');
const frontProtocol = require('./routes/frontProtocol');
const adminPage = require('./routes/adminPage.js');
const adminProtocol = require('./routes/adminProtocol.js');
const Scheduler = require('./manager/schedulerManager');
const DataCacheManager = require('./manager/dataCacheManager');
const socketManager = require('./manager/socketManager');
const http = require('http');
const BaseConstant = require('./util/baseConstant');
const commonUtil  = require('./util/commonUtil');
const cookieSession = require('cookie-session');
const i18n = require("i18n-express");
const wsModule = require('ws');

//session
// const session = require('./lib/session');
const session = require('express-session');

//uvpv
const uvpv = require('./lib/uvpv');
//Logger Setting
const loggerCatcher = require('./lib/loggerCatcher');
// const sequelize = require('sequelize');
const { sequelize } = require('./models');
const DataCacheManagerMongo = require('./manager/dataCacheManagerMongo');
global.logger = require('./lib/logger');
//node scheduler start
const scheduler = Scheduler.getInstance();
scheduler.init();
//DataCacheManager init
const dataCacheManager = DataCacheManager.getInstance();
dataCacheManager.init();
const app = express();

//statistics
const Statistics = require('./models/statistics');


//================================================import================================================//

//================================================serverSetting================================================//
//???????????? ?????? ?????? ??????
const portSetting = false;

let port;

if (portSetting == false) 
{
    process.title = '[' + BaseConstant.SERVER_PORT_NUMBER + ']' + BaseConstant.PROJECT_NAME;
    port = normalizePort(process.env.PORT || BaseConstant.SERVER_PORT_NUMBER);
    app.set('port', port);
} 
else 
{
    process.title = '[' + process.argv[2] + ']' + BaseConstant.PROJECT_NAME;
    port = normalizePort(process.env.PORT || process.argv[2]);
    app.set('port', port);
}

const server = http.createServer(app);

//SocketIOManager.getInstance().init(io);
//SocketIOManager.getInstance().serverPort = process.argv[2];

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//==================================================
// ?????? ?????? ??????
//==================================================
function normalizePort(val) 
{
    const port = parseInt(val, 10);

    if (isNaN(port)) 
    {
        // named pipe
        return val;
    }

    if (port >= 0) 
    {
        // port number
        return port;
    }

    return false;
}

//==================================================
// ?????? ?????????
//==================================================
function onError(error) 
{
    if (error.syscall !== 'listen') 
    {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) 
    {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

//==================================================
// Database conection by sequelize
//==================================================
sequelize.sync({ force : false })
    .then(()=>{
        console.log('database connection established')
    })
    .catch((err)=>{
        console.error(err);
    })

//==================================================
// Database conection by mongoose
//==================================================
DataCacheManagerMongo.getInstance().init();


//==================================================
// ?????? ????????? ????????????
//==================================================
function onListening()
{
    //?????? ?????? ??? uploads, file ?????? ?????? ??? ????????????
    if(!fs.existsSync('./uploads'))
    {
        fs.mkdirSync('./uploads');
    }
    if(!fs.existsSync('./uploads/file'))
    {
        fs.mkdirSync('./uploads/file');
    }
    
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('START SERVER [' + addr.port + ']');
}
//================================================serverSetting================================================//


//================================================middleWare================================================//
//==================================================
// ip?????? ??????
// NginX?????? ??? X-Forwarded-For?????? req.clientIp ??? ?????????
//==================================================
app.use(requestIp.mw());

//==================================================
// ????????? ?????? ??? ?????? ??????
//==================================================
app.use(loggerCatcher());

//==================================================
// UV, PV ??????
//==================================================
//app.use(uvpv());


//==================================================
// ????????? ??????
//==================================================
app.use(cookieParser());

//==================================================
// ????????????
//==================================================
// app.use(session());
app.use(cookieSession({
    name: 'MyAppName',
    keys: ['very secret key'],
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days
}));

app.use(
    session({
        key: config.session.key,
        secret: config.session.secret,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7, // ?????? ???????????? 7???
        },
        //store: sessionStore,
        resave: true,
        rolling: true, // cookie ?????? ??????????????? ????????? ????????? ?????? ??? 7??? ?????????????????? session expired
        saveUninitialized: true,
    })
);
//==================================================
// ????????? ??????
//==================================================
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

//==================================================
// ??????????????? ??????
//==================================================
app.set('views', path.join(__dirname, './client'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//==================================================
// request body ???????????? ??????
//==================================================
app.use(bodyParser.json({ limit : "5000mb" }));
app.use(bodyParser.urlencoded({ limit:"5000mb", extended: false }));

//==================================================
// ????????????????????? ??????
//==================================================
const setDeviceID = function (req, res, next) {
    
    if(req.cookies.deviceID == undefined)
    {
        let deviceID = commonUtil.makeid(256);
        res.cookie('deviceID', deviceID, {
            httpOnly:true
        });
    }
    next();
};
app.use(setDeviceID);

//==================================================
// i18n??????
//==================================================
app.use(
    i18n({
        translationsPath: path.join(__dirname, "i18n"),
        siteLangs: ["en", "ko"],
        textsVarName: "translation",
    })
);
//==================================================
// ???????????? ?????? ??????
//==================================================
app.use('/', express.static(__dirname + '/public'));

//==================================================
// socket.IO
//==================================================

const socketManagerIO = new socketManager()
socketManagerIO.init(server)

// const { Server } = require("socket.io");

// const io = new Server(server, { 
//     });

// io.on("connection", socket => {
//   // either with send()
//   const count = io.engine.clientsCount;
//   if(count>2){
//     // io.socketsJoin("room1");
//     socket.join("room1")
//   }else{
//     socket.join("room2")
//     //   io.socketsJoin("room2");
//   }

//   // handle the event sent with socket.send()
//   socket.on("message", (data) => {
//     console.log(data + ' 123123');
//     socket.emit("chat message", data, { "ms": "jane" }, Buffer.from([4, 3, 3, 1]));
//     io.emit("chat message", data, { "ms": "jane" }, Buffer.from([4, 3, 3, 1]));
// });

//   // handle the event sent with socket.emit()
//   socket.on("room", (roomname, chatMessage, elem3) => {
//       console.log('come check' + chatMessage + '   '+ roomname)
//     // io.socketsJoin(roomname)
//     socket.join(roomname)
//     // io.to(roomname).emi('chat Message', chatMessage)
//     io.to(roomname).emit("chat message", chatMessage, { "ms": "jane" }, Buffer.from([4, 3, 3, 1]));
//   });

// });




//==================================================
// ????????? ??????
//==================================================
async function visitChecker(req, res, next){

    const dateSetting = (rawDate)=>{
        let year = rawDate.getFullYear();
        let month = rawDate.getMonth();
        let date = rawDate.getDate();
        return `${year}.${month}.${date}`
    }
    
    if(!req.cookies.visitor){
        const rawDate = new Date();
        const formedDate = dateSetting(rawDate)
        res.cookie('visitor', formedDate,{maxAge:6200000, httpOnly:true});
        let statisticsInfo = await Statistics.findOne({ where : { thisDate : formedDate }});
        if(statisticsInfo==null){
            await Statistics.create({
                thisDate : formedDate,
                visitorNum : 1
            })
        }else{
            statisticsInfo.visitorNum +=1
            await statisticsInfo.save()
        }
    }



    return next();
}
app.use(visitChecker)

//==================================================
// URL ?????? ?????????
//==================================================
app.use('/admin/', adminPage);
app.use('/admin/protocol', adminProtocol);
app.use('/', frontPage);
app.use('/protocol', frontProtocol);

//==================================================
// ???????????? ?????? ?????? ??????
//==================================================
app.use(function (req, res, next) {
    var requestPath = decodeURI(path.join(__dirname, './client', req.path));
    if (fs.existsSync(requestPath)) 
    {
        // console.log(req.path+" >>> "+requestPath+" >>> O" );
        res.sendFile(requestPath);
        return;
    } 
    else 
    {
        //client ???????????? ???????????? ?????? uploads ???????????? ???????????? ??????
        requestPath = decodeURI(path.join(__dirname, './uploads', req.path));
        if (fs.existsSync(requestPath)) 
        {
            res.sendFile(requestPath);
            return;
        } 
        else 
        {
            console.log(req.path + ' >>> ' + requestPath + ' >>> X');
            res.status(404).send('404 not found');
        }
    }
});

//==================================================
// ?????? ?????? ?????? ??????
//==================================================
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
    });
});

//==================================================
// ?????????????????? ?????? ?????? ????????? ?????? ?????? ?????? ??????
//==================================================
process.on('uncaughtException', (err) => {
    try 
    {
        console.log('There was an uncaught error : ' + err.message);
    } 
    catch (error) 
    {
        console.log('There was an uncaught error (logger was dead) : ' + error.message);
    }
    //process.exit(1);
});
//================================================middleWare================================================//

module.exports = app;

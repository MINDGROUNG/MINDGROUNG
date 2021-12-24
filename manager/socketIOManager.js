//Constant Variable
const DataCacheManager = require('../scheduler/dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();

let instance;

class SocketIOManager 
{
    constructor() 
    {
        this.mapRoomKey = {}; //소켓 방
        this.io = {};
    }

    static getInstance() 
    {
        if (!instance) 
        {
            instance = new SocketIOManager();
        }

        return instance;
    }

    init(server) {

        let io = require('socket.io')(server);
        this.io = io;

        logger.info('SocketIOManager init Start');

        //=========================================
        // 소켓이 연결되면~
        //=========================================
        io.on('connection', (socket) => {

            //=========================================
            // 소켓 접속 로그인
            //=========================================
            socket.on('protocolC2SLogin', (roomKey,userData) => {
                socket.join(roomKey);

                if(!this.mapRoomKey.hasOwnProperty(roomKey))
                {
                    this.mapRoomKey[roomKey] = roomKey;
                }

                //요청한 사람에게만 로그인 완료 전달
                io.to(socket.id).emit('protocolS2CLogin');
            });

            //=========================================
            // 소켓 접속 끊김
            //=========================================
            socket.on('disconnect', () => {
                var socketId = socket.id;
                socket.leaveAll();
                socket.disconnect(true);
            });

            //=========================================
            // 유저가 채팅 보냄
            //=========================================
            socket.on('protocolC2SSendChat', (roomKey,userData,chat) => {
                let data = {};
                data.roomKey = roomKey;
                data.chat = chat;
                data.userData = userData;

                //채팅 로그 저장
                // 여기서 저장

                //채팅 전송 (방, 데이터)
                io.to(roomKey).emit('protocolS2CSendChat',data);
            });

            //=========================================
            // 채팅 히스토리 요청
            //=========================================
            socket.on('protocolS2SChatHistory', (roomKey) => {
                
                //히스토리 리스트 (여기에 데이터 담아서 전송)
                let listHistory = [];
                
                //요청했던 서버에게만 전송
                io.to(roomKey).emit('protocolS2CChatHistory',listHistory);
            });
        });
    }
}

module.exports = SocketIOManager;

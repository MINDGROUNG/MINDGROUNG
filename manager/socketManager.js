const { Server } = require("socket.io");

let instance;

class SocketManager 
{
    constructor() 
    {
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
                  
        const io = new Server(server, { 
        });

        //=========================================
        // 소켓이 연결되면~
        //=========================================


        io.on("connection", socket => {
            // either with send()
            const count = io.engine.clientsCount;
            if(count>2){
              // io.socketsJoin("room1");
              socket.join("room1")
            }else{
              socket.join("room2")
              //   io.socketsJoin("room2");
            }
          
            // handle the event sent with socket.send()
            socket.on("message", (data) => {
              console.log(data + ' 123123');
              socket.emit("chat message", data, { "ms": "jane" }, Buffer.from([4, 3, 3, 1]));
              io.emit("chat message", data, { "ms": "jane" }, Buffer.from([4, 3, 3, 1]));
            });
          
            // handle the event sent with socket.emit()
            socket.on("room", (roomname, chatMessage, elem3) => {
                console.log('come check' + chatMessage + '   '+ roomname)
              socket.join(roomname)
              io.to(roomname).emit("chat message", chatMessage, { "ms": "jane" }, Buffer.from([4, 3, 3, 1]));
            });
          
          });



            //=========================================
            // 소켓 접속 로그인
            //=========================================

            //=========================================
            // 소켓 접속 끊김
            //=========================================

            //=========================================
            // 유저가 채팅 보냄
            //=========================================

            //=========================================
            // 채팅 히스토리 요청
            //=========================================

    }
}

module.exports = SocketManager;

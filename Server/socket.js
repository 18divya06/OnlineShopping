let io;

module.exports={
    init: server=>{
       io= require('socket.io')(server,{
        cors: {
          origin: "*",
          methods: ["GET", "PATCH", "DELETE", "POST","PUT","OPTIONS"]
        }
      });
       return io;
    },
    getSocket:()=>{
        return io;
    }
};
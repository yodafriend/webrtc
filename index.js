var PORT = process.env.PORT||3000;
var express = require("express");
var app = express();

var http = require('http');
var server = http.Server(app);
var socket = require("socket.io");

console.log("success")
server.listen(PORT,function(){
  console.log('Server running')
})
//서버시작
app.use(express.static("public"));

let io = socket(server);

//클라이언트 조인.

io.on("connection", function (socket) {
  console.log("User Connected :" + socket.id);

  //peer가 조인누를시

  socket.on("join", function (roomName) {
    let rooms = io.sockets.adapter.rooms;
    let room = rooms.get(roomName);

    //room 이름으로 들어가기.
    if (room == undefined) {
      socket.join(roomName);
      socket.emit("created");
    } else if (room.size == 1) {
      //room.size == 1 when one person is inside the room.
      socket.join(roomName);
      socket.emit("joined");
    } else {
      //두명이상시
      socket.emit("full");
    }
    console.log(rooms);
  });

  
  socket.on("ready", function (roomName) {
    socket.broadcast.to(roomName).emit("ready"); 
  });

  socket.on("candidate", function (candidate, roomName) {
    console.log(candidate);
    socket.broadcast.to(roomName).emit("candidate", candidate); 
  });



  socket.on("offer", function (offer, roomName) {
    socket.broadcast.to(roomName).emit("offer", offer);
  });

  socket.on("answer", function (answer, roomName) {
    socket.broadcast.to(roomName).emit("answer", answer); 
  });
    socket.on("leave",function(roomName){
    socket.leave(roomName);
    socket.broadcast.to(roomName).emit("leave");
})
});

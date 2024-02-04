//const store=require("../src/store")
const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
//解析application/x-www-form-urlencoded数据
app.use(express.urlencoded({ extended: false }));
//在路由之前封装res.cc函数,中间件处理函数处理响应
app.use((req, res, next) => {
  res.cc = function (resData, status = 1) {
    res.send({
      status,
      message: resData instanceof Error ? resData.message : resData, //resData的值可能是一个错误对象也可能是一个描述字符串
    });
  };
  next();
});

//解析token的中间件
//api开头的接口都不需要进行token解析，配置成功了express-jwt这个中间件，可以把解析出来的用户信息挂载到req.user上
const expressJWT = require("express-jwt");
const config = require("./config");
app.use(
  expressJWT({
    secret: config.jwtSecrectKey,
    algorithms: ["HS256"],
  }).unless({ path: [/^\/api\//] })
);

//导入用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);
//导入并使用用户信息模块
const userInfoRouter = require("./router/userInfo");
app.use("/my", userInfoRouter);
//错误中间件
app.use(function (err, req, res, next) {
  //数据验证失败
  if (err instanceof Joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError")
    return res.send({ status: 1, message: "登录已过期，请重新登录" });
  //未知错误
  res.cc(err);
});
const { createServer } = require("http");
//const { on } = require("events");
const server = createServer(app);
const { Server } = require("socket.io");
const socketIO = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
    }
});
let onlineUsers = {} //存储在线用户的对象
//let onlineCount = 0;
let user = "";
socketIO.on("connection", function (socket) {
  console.log(`⚡: ${socket.id} 用户已连接!`);
  socket.emit("open");
  let toUser = "";
  let fromUser = "";
  let date = "";
  socket.on("addUser", function ({username,socketID}) {
    // eslint-disable-next-line no-prototype-builtins
    if (!onlineUsers[username]) {
      //onlineCount += 1;
      onlineUsers[username] = socketID;
    }
    socketIO.emit('newUserResponse', Array.from(onlineUsers));
    console.log(onlineUsers[username]);
    console.log("onlineCount", Object.keys(onlineUsers).length);
  });
  socket.on("message", (obj) => {
    console.log('message',obj);
    (toUser = obj.toUser), (fromUser = obj.fromUser);
    date = obj.date;
    if (Object.keys(onlineUsers).includes(toUser)) {
      //接收方
      socketIO.emit(toUser, obj); //两边都显示信息
      socketIO.emit(fromUser, obj);
    } else {
      socketIO.emit(fromUser, obj);
      console.log(toUser + "不在线");
    }
  });
  socket.on("sendPost", (obj) => {
    console.log(obj,'obj')
    // console.log(obj);
    // for (let username in onlineUsers) {
    //   // console.log(username);
    socketIO.emit('post',obj);
    // }
  });
  socket.on('sendComments', (obj) => {
    console.log(obj, 'comments')
    socketIO.emit('updateComments',obj)
  })
  socket.on("disconnect", () => {
    console.log(`${socket.id}断开连接`);
    for(let [key,val] in Object.entries(onlineUsers)){
      if(val === socket.id){
        delete onlineUsers[key]
      }
    }
        // console.log(users);
        
        // 发送用户列表到客户端
        socketIO.emit('newUserResponse', Array.from(onlineUsers));
        socket.disconnect();
    // delete onlineUsers[fromUser];
  });
});

server.listen(4000, () => {
  console.log("run in http://127.0.0.1:4000");
});
// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const cors = require('cors');
// const { Server } = require("socket.io");

// const PORT = 4000
// app.use(cors());
// let users = [];

// const socketIO = new Server(server, {
//     cors: {
//         origin: "http://127.0.0.1:5173",
//     }
// });

// app.get('/api', (req, res) => {
//     res.json({
//       message: 'Hello world',
//     });
// });

// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} 用户已连接!`);
//     socket.on('connect_error', (error) => {
//       console.log(socket.connected); // false
//       console.log(error); // 连接错误信息
//     });
//     // 监听和在控制台打印消息
//     socket.on('message', (data) => {
//         console.log(data);
//         socketIO.emit('messageResponse', data);
//     });

//     socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));


//     // 监听新用户的加入
//     socket.on('newUser', (data) => {
//         // 添加新用户到 users 中
//         users.push(data);
//         // console.log(users);

//         // 发送用户列表到客户端
//         socketIO.emit('newUserResponse', users);
//     });

//     socket.on('disconnect', () => {
//         console.log('🔥: 一个用户已断开连接');
//         // 当用户下线的时候更新用户列表
//         users = users.filter((user) => user.socketID !== socket.id);
//         // console.log(users);
        
//         // 发送用户列表到客户端
//         socketIO.emit('newUserResponse', users);
//         socket.disconnect();
//     });
// });

// server.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });
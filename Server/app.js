//const store=require("../src/store")
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express();
const Joi = require("joi");
app.use(cors());
//解析application/x-www-form-urlencoded数据
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.json())
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
  }).unless({
    path: [/^\/api\//]
  })
);

//导入用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);
//导入并使用用户信息模块
const userInfoRouter = require("./router/userInfo");
const postRouter = require('./router/post');
app.use("/my", userInfoRouter);
app.use('/my', postRouter)
//错误中间件
app.use(function (err, req, res, next) {
  //数据验证失败
  if (err instanceof Joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError")
    return res.send({
      status: 1,
      message: "登录已过期，请重新登录"
    });
  //未知错误
  res.cc(err);
});
const {
  createServer
} = require("http");
//const { on } = require("events");
const server = createServer(app);
const {
  Server
} = require("socket.io");
const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    //origin: 'http://120.26.132.172'
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
  socket.on("addUser", function ({
    username,
    socketID
  }) {
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
    console.log('message', obj);
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
  socket.on("sendPost", ({
    user_id,
    title,
    content,
    created_at
  }) => {
    console.log(user_id, title, content, created_at, 'obj')
    socketIO.emit('updatePost', {
      user_id,
      title,
      content,
      created_at
    });
  });
  //帖子点赞
  socket.on('sendLikes', ({
    likes,
    id
  }) => {
    console.log(likes, 'likes', id, 'id')
    socketIO.emit('updateLikes', {
      likes,
      id
    })
  })
  //评论点赞
  socket.on('sendCommentLikes', ({
    likes,
    comment_id
  }) => {
    socketIO.emit('updateCommentLikes', {
      likes,
      comment_id
    })
  })
  socket.on('addComment', (obj) => {
    const {
      post_id
    } = obj
    socketIO.emit(`${post_id}`, obj)
    console.log(obj, 'updateComment')
  })
  socket.on('addReply', (obj) => {
    console.log(obj, 'addReply')
    const {
      post_id
    } = obj
    socketIO.emit(`reply${post_id}`, obj)
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id}断开连接`);
    for (let [key, val] in Object.entries(onlineUsers)) {
      if (val === socket.id) {
        delete onlineUsers[key]
      }
    }
    // 发送用户列表到客户端
    socketIO.emit('newUserResponse', Array.from(onlineUsers));
    socket.disconnect();
    // delete onlineUsers[fromUser];
  });
});

server.listen(5000, () => {
  console.log("run in http://127.0.0.1:5000");
});
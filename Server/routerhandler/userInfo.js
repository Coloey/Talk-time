const db = require("../db/index");
const bcrypt = require("bcryptjs");
const emojiRegex = require('emoji-regex');
const regex = emojiRegex()
exports.userInfo = (req, res) => {
  const sql = "select name,avatar, user_id from users where name=?";
  db.query(sql, [req.user.name], (err, result) => {
    if (err) return res.cc(err);
    if (result.length !== 1) return res.rcc("获取用户信息失败");
    res.send({ status: 200, data: result[0] });
  });
};
exports.allUsers = (req, res) => {
  const sql = "select * from users";
  db.query(sql, [], (err, result) => {
    if (err) return res.cc(err);
    console.log(result);
    res.send({ status: 200, data: result });
  });
};
exports.updateUserInfo = (req, res) => {
  const userInfo = req.body;
  const sql = "update users set ? where name=?";
  db.query(sql, [userInfo, userInfo.name], (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return res.cc("更新用户信息失败");
    res.send({ status: 0, message: "更新用户信息成功", data: result[0] });
  });
};
exports.updatePassword = (req, res) => {
  //const userInfo=req.body
  //根据id查询用户是否存在
  const sql = "select * from users where name= ?";
  db.query(sql, req.user.name, (err, result) => {
    if (err) return res.cc(err);
    //检查指定id的用户是否存在
    if (result.length !== 1) return res.cc("用户不存在,请注册账号");
    //判断提交的旧密码是否正确
    if (!bcrypt.compareSync(req.body.oldPassword, result[0].password)) {
      return res.cc("旧密码错误");
    }
    //旧密码验证成功后更新密码
    //对新密码进行加密处理
    const newPassword = bcrypt.hashSync(req.body.newPassword, 10);
    const sql = "update users set password=? where id= ?";
    db.query(sql, [newPassword, req.user.id], (err, result) => {
      if (err) return res.cc(err);
      if (result.affectedRows !== 1) return res.cc("更新用户密码失败");
      res.send({ status: 0, message: "更新用户密码成功", data: result[0] });
    });
  });
};
exports.storeMessages = (req, res) => {
  let { fromUser, toUser, text, timestamp, readStatus } = req.body;
  text = text.replace(regex, (p) => `emoji(${p.codePointAt(0)})`)
  const sql =
    "insert into chat_messages(fromUser, toUser, text, timestamp,readStatus) values (?,?,?,?,?)";
  db.query(sql, [fromUser, toUser, text, timestamp, readStatus], (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return res.cc("聊天信息存储失败");
    // console.log(result, "store");
    res.send({ status: 0, data: result[0] });
  });
};
exports.getMessages = (req, res) => {
  const sql = "select * from chat_messages";
  db.query(sql, (err, result) => {
    if (err) return res.cc(err);
    //console.log(result, "message");
    res.send({ status: 0, data: result });
  });
};
exports.storePost = (req, res) => {
  const { content, updated_at, user_id, title, name, likes, commentCount, haveLiked} = req.body;
  // console.log(content,'content',user_id, 'user_id')
  const sql = 'insert into posts(content, updated_at, user_id, title, name, likes, commentCount, haveLiked) values (?,?,?,?,?,?,?,?)';
  db.query(sql,[content, updated_at, user_id, title, name, likes, commentCount, haveLiked], (err, result) => {
    if(err)return res.cc(err)
    if(result.affectedRows !== 1)return res.cc('帖子发表失败');
    console.log(result, 'storePostContent')
    res.send({status: 0, message: '帖子发表成功!'})
  })
}
exports.storeComment = (req,res) => {
  const {post_id, user_id, comment_text, timestamp,fromUser,toUser} = req.body;
  const sql = 'insert into comments(post_id, user_id, comment_text, timestamp,fromUser,toUser) values (?,?,?,?,?,?)';
  db.query(sql, [post_id, user_id, comment_text, timestamp,fromUser,toUser], (err, result) => {
    if(err){
      return res.cc(err)
    }
    if(result.affectedRows !== 1) {
      return res.cc('评论发表失败');
    }
    console.log(result, 'storeComment')
    res.send({status: 0 })
  })
}
exports.getPosts = (req,res) => {
  const sql = 'select * from posts';
  db.query(sql, (err, result) => {
    if(err)return res.cc(err);
    console.log(result, 'getPosts')
    res.send({status: 0, data: result})
  })
}
exports.updatePost = (req,res) => {
  const {likes,  post_id} = req.body;
  console.log(likes, post_id,'likes','post_id')
  const sql = 'update posts set likes=? where post_id=?';
  db.query(sql, [likes,post_id],(err,result) => {
    if(err)return res.cc(err);
    if(result.affectedRows !== 1)return res.cc('点赞失败');
    console.log(result,'updatePost')
    res.send({status: 0, data: result})
  })
}
exports.updateLikes = (req, res) => {
  const {user_id, post_id, like_date} = req.body;
  if(!user_id) {
    return res.cc(err)
  }
  const sql = 'select * from likes where user_id=? and post_id=?'
  db.query(sql, [user_id, post_id], (err, result) => {
    if(err)return res.cc(err)
    if(result.length>0){
        return res.cc('已经点赞过了!')
    }
    const sql = 'insert into likes(user_id, post_id, like_date) values (?,?,?)'
    db.query(sql, [user_id, post_id, like_date],(err,result) => {
      if(err)return res.cc(err)
      if(result.affectedRows !== 1)return res.cc('点赞失败')
      const sql = 'select * from likes where post_id=?'
      db.query(sql,[post_id],(err,result)=>{
        if(err)return res.cc(err)
        res.send({status: 0, data: result})
      })
    })
  })
}
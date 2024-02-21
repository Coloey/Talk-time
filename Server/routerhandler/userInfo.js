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
exports.getCommentWithReplies = async(req,res) => {
  // fromUser作为reply中的toUser
  const {fromUser} = req.body;
  let sql = 'select * from comments';
  try{
    const commentsResult = await new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    //保证每个comment的replies查询到后然后放到comment里面，并且保证所有都查询完毕才返回结果给前端
    const commentsWithReplies = await Promise.all(commentsResult.map(async(comment) => {
      sql = 'select * from replies where comment_id=?';
      const repliesResult = await new Promise((resolve, reject) => {
        db.query(sql, [comment.comment_id], (err,result) => {
          if(err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
      comment.replies=repliesResult
      return comment
    }))
    res.send({status: 0, data: commentsWithReplies})
  }catch(error){
    res.cc(error)
  }
}
exports.getComments = (req,res) => {
  const sql='select * from comments';
  db.query(sql,(err,result) => {
    if(err){
      return res.cc(err)
    }
    res.send({status: 0, data: result})
  })
}
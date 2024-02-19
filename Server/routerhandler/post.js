const db = require("../db/index");
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
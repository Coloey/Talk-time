const db = require("../db/index");
exports.storePost = (req, res) => {
  const {
    content,
    updated_at,
    user_id,
    title,
    name,
    likes,
    commentCount,
    haveLiked
  } = req.body;
  // console.log(content,'content',user_id, 'user_id')
  const sql = 'insert into posts(content, updated_at, user_id, title, name, likes, commentCount, haveLiked) values (?,?,?,?,?,?,?,?)';
  db.query(sql, [content, updated_at, user_id, title, name, likes, commentCount, haveLiked], (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('帖子发表失败');
    //console.log(result, 'storePostContent')
    res.send({
      status: 0,
      message: '帖子发表成功!'
    })
  })
}
exports.favoritePosts = (req, res) => {
  const {
    user_id,
    post_id
  } = req.body;
  console.log(user_id, post_id, 'collect')
  let sql = 'select * from favorites where user_id=? and post_id=?'
  db.query(sql, [user_id, post_id], (err, result) => {
    if (err) return res.cc(err)
    if (result.length > 0) {
      return res.cc('已经收藏过了!')
    }
    sql = 'insert into favorites(user_id, post_id) values (?,?)';
    db.query(sql, [user_id, post_id], (err, result) => {
      if (err) return res.cc(err);
      if (result.affectedRows !== 1) return res.cc('帖子收藏失败');
      res.send({
        status: 0,
        message: '已收藏'
      })
    })
  })
}
exports.getFavoritePosts = (req, res) => {
  const
    user_id = req.query.user_id;
  let sql = 'select * from posts where post_id in (select post_id from favorites where user_id=? )';
  db.query(sql, [user_id], (err, result) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      data: result
    })
  })
}
exports.getPosts = (req, res) => {
  let sql = 'select * from posts';
  db.query(sql, (err, result) => {
    if (err) return res.cc(err);
    //console.log(result, 'getPosts')
    res.send({
      status: 0,
      data: result
    })
  })
}
exports.updatePost = (req, res) => {
  const {
    likes,
    post_id,
    haveLiked
  } = req.body;
  //console.log(likes, post_id, 'likes', 'post_id')
  const sql = 'update posts set likes=?, haveLiked=? where post_id=?';
  db.query(sql, [likes, haveLiked, post_id], (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return res.cc('点赞失败');
    //console.log(result, 'updatePost')
    res.send({
      status: 0,
      data: result
    })
  })
}
exports.updatePostCommentCount = (req, res) => {
  const sql = 'UPDATE posts SET count = (SELECT COUNT(*)FROM comments WHERE comments.post_id = posts.post_id)'
  db.query(sql, (err, result) => {
    if (err) return res.cc(err);
    res.send({
      status: 0
    })
  })
}
exports.updateLikes = (req, res) => {
  const {
    user_id,
    post_id,
    like_date
  } = req.body;
  if (!user_id) {
    return res.cc(err)
  }
  const sql = 'select * from likes where user_id=? and post_id=?'
  db.query(sql, [user_id, post_id], (err, result) => {
    if (err) return res.cc(err)
    if (result.length > 0) {
      return res.cc('已经点赞过了!')
    }
    const sql = 'insert into likes(user_id, post_id, like_date) values (?,?,?)'
    db.query(sql, [user_id, post_id, like_date], (err, result) => {
      if (err) return res.cc(err)
      if (result.affectedRows !== 1) return res.cc('点赞失败')
      const sql = 'select * from likes where post_id=?'
      db.query(sql, [post_id], (err, result) => {
        if (err) return res.cc(err)
        res.send({
          status: 0,
          data: result
        })
      })
    })
  })
}
exports.updateCommentLikes = (req, res) => {
  const {
    user_id,
    comment_id,
    like_date
  } = req.body;
  if (!user_id) {
    return res.cc(err)
  }
  const sql = 'select * from comment_likes where user_id=? and comment_id=?'
  db.query(sql, [user_id, comment_id, like_date], (err, result) => {
    if (err) return res.cc(err)
    if (result.length > 0) {
      return res.cc('已经点赞过!')
    }
    const sql = 'insert into comment_likes(user_id,comment_id,like_date) values(?,?,?)'
    db.query(sql, [user_id, comment_id, like_date], (err, result) => {
      if (err) return res.cc(err)
      if (result.affectedRows !== 1) return res.cc('点赞失败')
      //获取赞数
      const sql = 'select * from comment_likes where comment_id=?'
      db.query(sql, [comment_id], (err, result) => {
        if (err) return res.cc(err)
        res.send({
          status: 0,
          data: result
        })
      })
    })
  })
}
exports.updateComments = (req, res) => {
  const {
    likes,
    comment_id
  } = req.body;
  const sql = 'update comments set likes=? where comment_id=?'
  db.query(sql, [likes, comment_id], (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('点赞失败');
    console.log(result, 'updateCommets')
    res.send({
      status: 0
    })
  })

}
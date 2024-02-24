import styled from 'styled-components'
import './singleComment.styl'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { updateCommentLikes, updateComments } from '../../../../../../utils/api'
export default function SingleComment({ comment, index, onReplyAdd, socket, handleCommentLikes
}) {
    const [visible, setVisible] = useState(false)
    //console.log(comment.likes)
    //const [likes, setLikes] = useState(comment.likes)
    const handleLikeComment = async (comment_id) => {
        //onLikesChange(index)
        let res = await updateCommentLikes({
            user_id: JSON.parse(localStorage.getItem('userInfo'))?.user_id,
            comment_id,
            like_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        })
        console.log(res, 'comment like')
        if (res && res.data.status === 0) {
            const likes = res.data.data.length;
            handleCommentLikes(likes, comment_id)
            //setLikes(likes)
            res = await updateComments({
                likes,
                comment_id
            })
            console.log(res, 'updateComments')
            socket.emit('sendCommentLikes', { likes, comment_id })
        }
    }
    useEffect(() => {
        socket.on('updateCommentLikes', ({ likes, comment_id }) => {
            handleCommentLikes(likes, comment_id)
        })
    }, [socket])
    const sendAddReply = (index, val, id) => {
        //console.log(index, val)
        onReplyAdd(index, val, id)
    }

    return (
        <div className="commentContainer">
            <div className="avatar"></div>
            <div className='commentContent'>
                <span>{comment.fromUser}回复{comment.toUser}</span>
                <p>
                    {comment.comment_text}
                    <span>
                        <button onClick={() => handleLikeComment(comment.comment_id)} className='btn'>
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-a-44tubiao-208"></use>
                            </svg>
                            {comment.likes}
                        </button>
                    </span>
                    <button onClick={() => setVisible(!visible)} className='btn'>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-a-44tubiao-168"></use>
                        </svg>
                        回复
                    </button>
                </p>
                <input
                    className={visible ? 'commentIpt' : 'hidden'}
                    type="text"
                    placeholder="请输入回复"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            sendAddReply(comment.fromUser, event.target.value, comment.comment_id)
                            event.target.value = ''
                        }
                    }}
                />
            </div>
        </div>
    )
}
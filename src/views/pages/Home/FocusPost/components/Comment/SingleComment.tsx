import styled from 'styled-components'
import './singleComment.styl'
import { useState, useEffect } from 'react'
import { updateCommentLikes } from '../../../../../../utils/api'
export default function SingleComment({ comment, index, onReplyAdd }) {
    const [visible, setVisible] = useState(false)
    const handleLikeComment = async (comment_id) => {
        //onLikesChange(index)
        let res = await updateCommentLikes({
            user_id: JSON.parse(localStorage.getItem('userInfo'))?.user_id,
            comment_id,
            like_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        })
        if (res && res.data.status === 0) {
            const like = res.data.data.length;

        }
    }
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
                        <button onClick={() => handleLikeComment(comment_id) className='btn'>
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
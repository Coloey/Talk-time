import styled from 'styled-components'
import './singleComment.styl'
import { useState, useEffect } from 'react'
export default function SingleComment({ comment, index, onLikesChange, onReplyAdd }) {
    const [visible, setVisible] = useState(false)
    const sendLikeComment = (index) => {
        onLikesChange(index)
    }
    const sendAddReply = (index, val) => {
        //console.log(index, val)
        onReplyAdd(index, val)
    }

    return (
        <div className="commentContainer">
            <div className="avatar">头像</div>
            <div className='commentContent'>
                <span>李相夷</span>
                <p>
                    {comment.text}
                    <span>
                        <button onClick={() => sendLikeComment(index)} className='btn'>
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
                            sendAddReply(index, event.target.value)
                            event.target.value = ''
                        }
                    }}
                />
            </div>
        </div>
    )
}
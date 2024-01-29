import './style.styl'
import { Comment, Avatar } from 'antd'
import Icon from '@ant-design/icons';
import { useState, useEffect } from 'react'
import moment from 'moment'
import SingleComment from './SingleComment';
export default function MyComment({ show, onCommentsCount }) {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    // const [commentCount, setCommentCount] = useState(0)
    const [answer, setAnswer] = useState(false)
    const handleInputChange = (event) => {
        setNewComment(event.target.value)
    }
    // const countComments = () => {
    //     return comments.length + comments[0]?.replies.length || 0
    // }
    const handleAddComment = (name) => {
        if (newComment !== '') {
            const newComments = [...comments, { id: name, text: newComment, likes: 0, replies: [] }]
            setComments(newComments)
            setNewComment('')
        }
    }
    const handleLikeComment = (index) => {
        const updatedComments = [...comments];
        console.log(updatedComments)
        updatedComments[index].likes += 1
        setComments(updatedComments)
    }
    const handleAddReply = (index, replyText) => {
        const updatedComments = [...comments]
        // console.log(index, updatedComments[index])
        // if (!updatedComments[index].replies) {
        //     updatedComments[index].replies = []
        // }
        updatedComments[0].replies.push({ text: replyText, likes: 0, replies: [] })
        setComments(updatedComments)
        console.log(comments)
    }
    // const handleAnswer = (val) => {
    //     setAnswer(val)
    // }
    useEffect(() => {
        //console.log(comments.flat(Infinity).length)
        onCommentsCount(comments.length + comments[0]?.replies?.length || 0)
    }, [comments.length + comments[0]?.replies?.length])

    return (
        // <div className={!show ? 'hidden' : ''}>comment</div>
        <div className={!show ? 'hidden' : ''}>
            <div className="commentIptDiv">
                <input
                    className="commentIpt"
                    type="text"
                    value={newComment}
                    onChange={handleInputChange}
                    placeholder="请输入评论"
                />
                <button className='addBtn' onClick={handleAddComment}>添加评论</button>
            </div>
            <div className='commentContainers'>
                {
                    comments.map((comment, index) => (
                        // <div className="commentContainer" key={index}>
                        //     <div className="avatar">头像</div>
                        //     <div key={index} className='commentContent'>
                        //         <span>李相夷</span>
                        //         <p>
                        //             {comment.text}
                        //             <span>
                        //                 <button onClick={() => handleLikeComment(index)} className='btn'>
                        //                     <svg className="icon" aria-hidden="true">
                        //                         <use xlinkHref="#icon-a-44tubiao-208"></use>
                        //                     </svg>
                        //                     {comment.likes}
                        //                 </button>
                        //             </span>
                        //             <button onClick={() => setAnswer(!answer)} className='btn'>
                        //                 <svg className="icon" aria-hidden="true">
                        //                     <use xlinkHref="#icon-a-44tubiao-168"></use>
                        //                 </svg>
                        //                 回复
                        //             </button>
                        //         </p>
                        //         <input
                        //             className='commentIpt'
                        //             type="text"
                        //             placeholder="请输入回复"
                        //             onKeyDown={(event) => {
                        //                 if (event.key === 'Enter') {
                        //                     handleAddReply(index, event.target.value)
                        //                     event.target.value = ''
                        //                 }
                        //             }}
                        //         />
                        // <div className={answer ? '' : 'hidden'}>
                        //     {comment.replies && comment.replies.length > 0 && (
                        //         <ul>
                        //             {comment.replies.map((reply, replyIndex) => (
                        //                 <div key={replyIndex}>
                        //                     <span>李相夷</span>
                        //                     <p>
                        //                         {reply.text}
                        //                         <span>
                        //                             <button onClick={() => handleLikeComment(replyIndex)} className='btn'>
                        //                                 <svg className="icon" aria-hidden="true">
                        //                                     <use xlinkHref="#icon-a-44tubiao-208"></use>
                        //                                 </svg>
                        //                                 {reply.likes}
                        //                             </button>
                        //                         </span>
                        //                         <button onClick={() => setAnswer(!answer)} className='btn'>
                        //                             <svg className="icon" aria-hidden="true">
                        //                                 <use xlinkHref="#icon-a-44tubiao-168"></use>
                        //                             </svg>
                        //                             回复
                        //                         </button>
                        //                     </p>
                        //                 </div>
                        //             ))}
                        //         </ul>
                        //     )}
                        // </div>
                        //     </div>
                        // </div>
                        <>
                            <SingleComment
                                comment={comment}
                                index={index}
                                key={index}
                                onLikesChange={handleLikeComment}
                                onReplyAdd={handleAddReply}
                            ></SingleComment>
                            <div>
                                {comment.replies && comment.replies.length > 0 && (
                                    <ul>
                                        {comment.replies.map((reply, replyIndex) => (
                                            <SingleComment
                                                key={replyIndex}
                                                comment={reply}
                                                index={replyIndex}
                                                onLikesChange={handleLikeComment}
                                                onReplyAdd={handleAddReply}
                                            ></SingleComment>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>

                    ))
                }
            </div>
        </div>
    )
}
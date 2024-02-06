import './style.styl'
import { Comment, Avatar } from 'antd'
import Icon from '@ant-design/icons';
import { useState, useEffect } from 'react'
import moment from 'moment'
import SingleComment from './SingleComment';
export default function MyComment({ show, onCommentsCount, socket }) {
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
        socket.emit('sendComments', { updatedComments })
        //console.log(comments)
    }
    useEffect(() => {
        socket.on('post', (data) => {
            console.log(data, 'postContent')
        })
        socket.on('updateComments', (data) => {
            console.log(data, 'updateComments')
        })
    }, [])
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
                        <>
                            <div key={index}>
                                <SingleComment
                                    comment={comment}
                                    index={index}
                                    onLikesChange={handleLikeComment}
                                    onReplyAdd={handleAddReply}
                                ></SingleComment>
                            </div>
                            <div>
                                {comment.replies && comment.replies.length > 0 && (
                                    <ul>
                                        {comment.replies.map((reply, replyIndex) => (
                                            <div key={replyIndex}>
                                                <SingleComment
                                                    comment={reply}
                                                    index={replyIndex}
                                                    onLikesChange={handleLikeComment}
                                                    onReplyAdd={handleAddReply}
                                                ></SingleComment>
                                            </div>
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
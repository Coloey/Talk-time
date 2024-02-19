import './style.styl'
import { Comment, Avatar } from 'antd'
import Icon from '@ant-design/icons';
import { useState, useEffect } from 'react'
import moment from 'moment'
import SingleComment from './SingleComment';
import { storeComment, getComments, storeReply } from '../../../../../../utils/api';
export default function MyComment({ show, onCommentsCount, socket, author, post_id }) {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [hasBorder, setHasBorder] = useState(false)
    //const [commentInfo, setCommentInfo] = useState([])
    // const [commentCount, setCommentCount] = useState(0)
    const [answer, setAnswer] = useState(false)
    const handleInputChange = (event) => {
        setNewComment(event.target.value)
    }
    const [name, setName] = useState('')
    const fromUser = localStorage.getItem('userName');
    const handleAddComment = async (name) => {
        if (newComment !== '') {
            const timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            socket.emit('addComment', {
                fromUser,
                toUser: author,
                comment_text: newComment,
                replies: [],
                post_id,
                timestamp
            })
            // 储存评论
            const res = await storeComment({
                post_id,
                user_id: JSON.parse(localStorage.getItem('userInfo'))?.user_id,
                comment_text: newComment,
                timestamp,
                fromUser,
                toUser: author
            })
            console.log(res, 'storeComment')
            // setComments(newComments)
            setNewComment('')
        }
    }
    // useEffect(() => {
    //     const getMyComment = async () => {
    //         const res = await getComment({ fromUser })
    //         console.log(res, 'getMyComment');
    //     }
    // }, [])
    const handleLikeComment = (index) => {
        // const updatedComments = [...comments];
        // console.log(updatedComments)
        // updatedComments[index].likes += 1
        // setComments(updatedComments)
    }
    const handleAddReply = async (toUser, replyText, comment_id) => {

        //const updatedComments = [...comments]
        //updatedComments[0].replies.push({ comment_text: replyText, likes: 0, replies: [] })

        if (replyText !== '') {
            const timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            socket.emit('addReply', {
                fromUser,
                toUser,
                comment_text: replyText,
                replies: [],
                post_id,
                timestamp
            })
            const res = await storeReply({
                comment_id,
                user_id: JSON.parse(localStorage.getItem('userInfo'))?.user_id,
                comment_text: replyText,
                fromUser,
                toUser,
                created_at: timestamp
            })
            console.log(res, 'storeReply')
        }
        //console.log(comments)
    }
    useEffect(() => {
        // console.log(`${post_id}`)
        socket.on(`${post_id}`, (data) => {
            console.log(data, 'updateComment')
            console.log(comments, 'preComments')
            setComments((preComments) => {
                if (preComments.indexOf(data) === -1) {
                    return [...preComments, data]
                }
                return preComments
            })
        })
        socket.on(`reply${post_id}`, (data) => {
            setComments((preComments) => {
                const updateComments = [...preComments]
                if (preComments[0].replies.indexOf(data) === -1) {
                    updateComments[0].replies.push(data);
                }
                return updateComments;
            })
            //console.log(data, 'updateReply')
        })
    }, [socket])
    useEffect(() => {
        const getMyComment = async () => {
            const res = await getComments()
            if (res && res.data.status === 0) {
                setComments((preComments) => {
                    const updatedComments = res.data.data;
                    return updatedComments;
                })
            }
        }
        getMyComment()
    }, [])
    // useEffect(() => {
    //     console.log(comments, 'comments')
    // }, [comments])
    useEffect(() => {
        onCommentsCount(comments.length + comments[0]?.replies?.length || 0, comments[0]?.post_id)
        if (comments.length > 0) {
            setHasBorder(true)
        } else {
            setHasBorder(false)
        }
    }, [comments.length + comments[0]?.replies?.length])

    return (
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
            <div className={`commentContainers ${hasBorder ? 'border' : ''}`}>
                {
                    comments.map((comment, index) => (
                        <>
                            <div key={index}>
                                {comment.post_id === post_id &&
                                    <SingleComment
                                        comment={comment}
                                        index={index}
                                        onLikesChange={handleLikeComment}
                                        onReplyAdd={handleAddReply}

                                    ></SingleComment>
                                }
                            </div>
                            <div>
                                {comment.replies && comment.replies.length > 0 && (
                                    <ul>
                                        {comment.replies.map((reply, replyIndex) => (
                                            <div key={replyIndex}>
                                                {reply.post_id === post_id &&
                                                    <SingleComment
                                                        comment={reply}
                                                        index={replyIndex}
                                                        onLikesChange={handleLikeComment}
                                                        onReplyAdd={handleAddReply}

                                                    ></SingleComment>
                                                }
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
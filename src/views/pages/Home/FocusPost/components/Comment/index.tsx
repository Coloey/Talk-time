import './style.styl'
import { useState, useEffect } from 'react'
import moment from 'moment'
import SingleComment from './SingleComment';
import { storeComment, getComments, updatePostCommentCount } from '../../../../../../utils/api';
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
    const updateCommentCount = async () => {
        await updatePostCommentCount();
    }
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
            if (res.data.status === 0) {
                updateCommentCount();
                onCommentsCount(true)
            }
            setNewComment('')
        }
    }

    const handleAddReply = async (toUser, replyText, comment_id) => {

        if (replyText !== '') {
            const timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            socket.emit('addReply', {
                fromUser,
                toUser,
                comment_text: replyText,
                post_id,
                timestamp,
            })
            const res = await storeComment({
                comment_id,
                user_id: JSON.parse(localStorage.getItem('userInfo'))?.user_id,
                comment_text: replyText,
                fromUser,
                toUser,
                created_at: timestamp,
                post_id,
            })
            if (res.data.status === 0) {
                updateCommentCount();
                onCommentsCount(true)
            }
        }
    }
    useEffect(() => {
        // console.log(`${post_id}`)
        socket.on(`${post_id}`, (data) => {
            // console.log(data, 'updateComment')
            // console.log(comments, 'preComments')
            setComments((preComments) => {
                if (preComments.indexOf(data) === -1) {
                    return [...preComments, data]
                }
                return preComments
            })
        })
        socket.on(`reply${post_id}`, (data) => {
            setComments((preComments) => {
                if (preComments.indexOf(data) === -1) {
                    return [...preComments, data]
                }
                return preComments
            })
            console.log(comments, 'updatedComments')
        })
    }, [socket])
    useEffect(() => {
        const getMyComment = async () => {
            const res = await getComments()
            if (res && res.data.status === 0) {
                setComments((preComments) => {
                    const updatedComments = res.data.data;
                    //console.log(updatedComments)
                    return updatedComments;
                })
            }
        }
        getMyComment()
    }, [])
    useEffect(() => {
        if (comments.filter(comment => comment.post_id === post_id).length) {
            setHasBorder(true)
        } else {
            setHasBorder(false)
        }
    }, [comments.length])
    const handleCommentLikes = (likes, comment_id) => {
        //console.log(comment_id, likes, post_id)
        setComments(preComments => {
            //console.log(preComments, 'preComments')
            const updatedComments = preComments.map(comment => {
                if (comment.comment_id === comment_id) {
                    comment.likes = likes;
                }
                return comment;
            })
            return updatedComments;
        })
    }
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
                                        onReplyAdd={handleAddReply}
                                        socket={socket}
                                        handleCommentLikes={handleCommentLikes}
                                    ></SingleComment>
                                }
                            </div>
                        </>
                    ))
                }
            </div>
        </div>
    )
}
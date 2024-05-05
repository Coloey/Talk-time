import React, { useState, useEffect, useRef, useCallback } from 'react'
//import PostContent from '../FocusPost/components/PostContent'
import MyComment from '../Comment'
import { getPosts, getComments, collectPosts } from '../../../../utils/api'
import { message } from 'antd'
import { PostItems } from '../../../../types/app'
import { updateLikes, updatePost } from '../../../../utils/api'
import moment from 'moment'
import './index.styl'
export default function Community({ socket }) {
    const [showComment, setShowComment] = useState([])
    const [commentCount, setCommentCount] = useState(0)
    const [likes, setLikes] = useState(0)
    const [postItems, setPostItems] = useState<PostItems[]>([])
    const [content, setContent] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    //const [isFavorite, setIsFavorite] = useState(false);
    const fromUser = localStorage.getItem('userName');
    const myUserInfo = JSON.parse(localStorage.getItem('userInfo'))
    const getPostsContent = async () => {
        const res = await getPosts();
        setPostItems(res?.data?.data);
        // console.log(res.data.data, 'res')
    }

    useEffect(() => {
        getPostsContent()
        //getMyComment()
    }, [])
    useEffect(() => {
        socket.on('updateLikes', ({ likes, id }) => {
            // 属于宏任务
            //console.log(postItems, 'old postItems', likes, 'likes', id, 'id')
            //在状态更新完成后执行某些操作，可以使用setState()的回调函数形式
            setPostItems(prevPostItems => {
                const updatedPostItems = prevPostItems.map((item) => {
                    if (item.post_id === id) {
                        item.likes = likes;
                    }
                    return item;
                });
                return updatedPostItems;
            });
            //console.log(postItems, 'socket后的postItems')
        })
    }, [socket])
    const handleComment = (index: number) => {
        // console.log(index, 'index', showComment)
        const newShowComment = [...showComment]
        newShowComment[index] = !newShowComment[index]
        setShowComment(newShowComment)
        // console.log(showComment, 'newcomment')
    }
    const handleCommentCount = async (val) => {
        if (val) {
            getPostsContent()
        }
    }
    const handleLikes = async (item, id) => {
        let res = await updateLikes({
            user_id: JSON.parse(localStorage.getItem('userInfo'))?.user_id,
            post_id: id,
            like_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        })
        //console.log(res, 'updateLikes likes');
        if (res && res.data.status === 0) {
            const likes = res.data.data.length;
            res = await updatePost({
                likes,
                post_id: id,
            })
            setLikes(likes);
            // 每个页面都需要更新
            socket.emit('sendLikes', { likes, id });
        }
    }
    const handleSave = async (id: number) => {
        console.log(id, 'post_id');
        const res = await collectPosts({ user_id: myUserInfo.user_id, post_id: id });
        console.log(res, ' collect');
    }
    useEffect(() => {
        postItems && setShowComment(new Array(postItems.length).fill(true))
    }, [postItems?.length])
    return (
        <>
            {postItems && postItems.map((postItem, index) => (
                <div
                    className="post-container"
                    key={postItem.post_id}
                >
                    <div className="authorInfo">
                        {/* <span className="avatar">
                        </span> */}
                        <div className="authorInfo-content">
                            <span className="authorInfo-head">{postItem.name}</span>
                            <span className="authorInfo-detail">{new Date(postItem.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                    <h2 className="title" dangerouslySetInnerHTML={{ __html: postItem.title }}></h2>
                    <div className="richContent" dangerouslySetInnerHTML={{ __html: postItem.content }}>
                    </div>
                    <div className="footer">
                        <span>
                            <button className='btn' onClick={() => handleLikes(postItem.likes, postItem.post_id)}>
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-a-44tubiao-208"></use>
                                </svg>
                                赞同{postItem.likes ? postItem.likes : 0}
                            </button>
                        </span>
                        <button className='btn' onClick={() => handleComment(index)}>
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-a-44tubiao-168"></use>
                            </svg>
                            {!showComment[index]
                                ? (<span>{postItem.count + '条'}评论</span>)
                                : (<span>收起评论</span>)
                            }
                        </button>
                        <button className='btn' onClick={() => handleSave(postItem.post_id)}>
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-a-44tubiao-242"></use>
                            </svg>
                            收藏
                        </button>
                        <button className='btn'>
                            <span>收起</span>
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-jiantou_liebiaoshouqi"></use>
                            </svg>
                        </button>
                    </div>
                    <MyComment
                        show={showComment[index]}
                        onCommentsCount={handleCommentCount}
                        socket={socket}
                        author={postItem.name}
                        post_id={postItem.post_id}
                    >
                    </MyComment>
                </div>
            ))}
        </>
    )
}
import React, { useState, useEffect, useRef, useCallback } from 'react'
//import PostContent from '../FocusPost/components/PostContent'
import MyComment from '../FocusPost/components/Comment'
export default function Community({ socket }) {
    const [showComment, setShowComment] = useState(false)
    const [commentCount, setCommentCount] = useState(0)
    const [likes, setLikes] = useState(0)
    const [content, setContent] = useState('')
    const contentRef = useRef(null)
    useEffect(() => {
        //const dom = document.querySelector('.richContent')
        //console.log(contentRef.current, 'dom')
        socket.on('post', ({ data }) => {
            //console.log(data)
            setContent(data)
            console.log(content, 'content1')
        })
        // console.log(content)
        // if (content) {
        //     dom.innerHTML = content;
        // }
        //console.log(content, 'content2')
    }, [])
    const handleComment = () => {
        setShowComment(!showComment)
        //console.log(showComment)
    }
    const handleCommentCount = (val) => {
        //console.log(val)
        setCommentCount(val)
    }
    return (
        <div className="post-container">
            <div className="authorInfo">
                <span className="avatar"></span>
                <div className="authorInfo-content">
                    <span className="authorInfo-head">小李飞刀</span>
                    <span className="authorInfo-detail">武功高手</span>
                </div>
            </div>
            <h2 className="title">记忆、睡眠、情绪和大脑有什么关系？</h2>
            <div className="richContent" ref={contentRef} id='richContent'>
                {content}
            </div>
            <div className="footer">
                <span>
                    <button className='btn' onClick={() => setLikes(likes + 1)}>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-a-44tubiao-208"></use>
                        </svg>
                        赞同{likes}
                    </button>
                </span>
                <button className='btn' onClick={handleComment}>
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-a-44tubiao-168"></use>
                    </svg>
                    {!showComment
                        ? (<span>{commentCount}条评论</span>)
                        : (<span>收起评论</span>)
                    }
                </button>
                <button className='btn'>
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
            <MyComment show={showComment} onCommentsCount={handleCommentCount} socket={socket}></MyComment>
        </div>
    )
}
import './index.styl'
import { useState, useEffect } from 'react'
import Comment from '../Comment/index'
export default function PostContent() {
    const [showComment, setShowComment] = useState(false)
    const handleComment = () => {
        setShowComment(!showComment)
        console.log(showComment)
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
            <div className="richContent">
                <p>斯坦福医学院神经学教授Andrew Huberman有个很红的播客叫Huberman Lab, 他请过几个当红睡眠科学家包括写Why We Sleep的Matthew Walker上他的节目。
                    如果你每天都是同一个时间入睡，入睡前90分钟，大脑神经元会同步收缩和扩张，这样就会形成一个泵，把大脑里的废物和毒素泵出来。
                </p>
            </div>
            <div className="footer">
                <span>
                    <button className='btn'>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-a-44tubiao-208"></use>
                        </svg>
                        赞同100
                    </button>
                </span>
                <button className='btn' onClick={handleComment}>
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-a-44tubiao-168"></use>
                    </svg>
                    {!showComment
                        ? (<span>18条评论</span>)
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
            <Comment show={showComment}></Comment>
        </div>

    )
}
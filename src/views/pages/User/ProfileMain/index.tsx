import './index.styl'
import { getFavoritePosts } from '../../../../utils/api'
import { useEffect, useState } from 'react';
import './index.styl';
export default function FavoritePosts() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [favoritePost, setFavoritePost] = useState([]);
    const getPosts = async () => {
        const res = await getFavoritePosts({ user_id: userInfo.user_id });
        if (res && res?.data?.status === 0) {
            setFavoritePost(res?.data?.data);
        }
    }
    useEffect(() => {
        getPosts()
    }, [])
    return (
        <div className="profile-main">
            <div className="profile-main-header">
                收藏
            </div>
            <div className="list">
                {favoritePost && favoritePost.map((postItem) => (
                    <div
                        className="post-container"
                        key={postItem.post_id}
                    >
                        <div className="authorInfo">
                            <div className="authorInfo-content">
                                <span className="authorInfo-head">{postItem.name}</span>
                                <span className="authorInfo-detail">{new Date(postItem.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                        <h2 className="title" dangerouslySetInnerHTML={{ __html: postItem.title }}></h2>
                        <div className="richContent" dangerouslySetInnerHTML={{ __html: postItem.content }}></div>
                        <div className="footer">
                            <span>
                                <button className='btn'>
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-a-44tubiao-208"></use>
                                    </svg>
                                    赞同{postItem.likes ? postItem.likes : 0}
                                </button>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
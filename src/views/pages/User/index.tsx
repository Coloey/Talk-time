import React, { useEffect, useState } from 'react'
import ProfileHeader from './ProfileHeader/index'
import { updateUserInfo } from '../../../utils/api'
import getBase64 from '../../../utils/getBase64'
import { message } from 'antd'
import FavoritePosts from './ProfileMain/index'
import './index.styl'
export default function User() {
    const [backgroundImage, setBackgroundImage] = useState('https://ts1.cn.mm.bing.net/th/id/R-C.503d978a89292089a60f555b093bdeeb?rik=JlV8Z9qWjt0wWQ&riu=http%3a%2f%2fwww.mobanjing.com%2fdown%2fjpg%2f53f98ad8fa4054aa9e9be8a27d605d89.jpg&ehk=Pe8NnV4AKIMzXxuJ4ASOICyZxa2bYRJpxJVYbSQEx8I%3d&risl=&pid=ImgRaw&r=0')
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        getBase64(file)
            .then(async (url) => {
                setBackgroundImage(url);
                localStorage.setItem('backgroundImage', JSON.stringify(url))
                const res = await updateUserInfo({
                    avatar: JSON.stringify(url),
                    name: localStorage.getItem('userName')
                })
            }).catch(err => {
                console.error(err)
            })
    }
    useEffect(() => {
        const myUserInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (myUserInfo) {
            setBackgroundImage(myUserInfo?.backgroundImage || JSON.parse(localStorage.getItem('backgroundImage')))
        } else {
            message.error('请重新登录')
        }
    }, [])
    return (
        <div className="main">
            <div className="Card">
                <div className="UserCoverEditor">
                    <label className="UploadePicture-wrapper" htmlFor='image_uploads'>
                        编辑封面
                    </label>
                    <input
                        type="file"
                        id='image_uploads'
                        accept="image/png,image/jpeg"
                        className='UploadPicture-input'
                        onChange={handleImageUpload}
                    />
                    {backgroundImage
                        && <img src={backgroundImage} alt="用户封面" loading='lazy' className='UserCover' />}
                </div>
                <ProfileHeader backgroundImage={backgroundImage}></ProfileHeader>
                <FavoritePosts></FavoritePosts>
            </div>
        </div>
    )
}
import React, { useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import { updateUserInfo } from '../../../../utils/api'
import './index.styl'
export default function ProfileHeader({ backgroundImage }) {
    // const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarImage, setAvatarImage] = useState('')
    const [isHovering, setIsHovering] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setAvatarImage(reader.result)
                setUserInfo((preUserInfo) => ({
                    ...preUserInfo,
                    avatar: reader.result
                }))
            }
        }
        // console.log(file, 'file')
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    const editProfile = () => {
        setEditMode(!editMode)
    }
    const saveProfile = async () => {
        const res = await updateUserInfo({
            ...userInfo
        })
        console.log(res, 'profile')
    }
    const handleUserInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((preUserInfo) => ({
            ...preUserInfo,
            [name]: value
        }))
    }
    useEffect(() => {
        const myUserInfo = localStorage.getItem('userInfo')
        if (myUserInfo) {
            setUserInfo(JSON.parse(myUserInfo))
            setAvatarImage(userInfo?.avatar)
            setUserInfo((preUserInfo) => ({
                ...preUserInfo,
                backgroundImage
            }))
        } else {
            message.error('请重新登录')
        }
    }, [])
    return (
        <div className="content">
            <div
                className="head"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="avatar" style={{ backgroundImage: `url(${avatarImage})` }}>
                    <input
                        id='uploader'
                        name='avatar'
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {
                        isHovering &&
                        <label
                            htmlFor='uploader'
                            className='avatar-uploader'
                        >点击上传</label>
                    }
                </div>
            </div>
            <div className="body">
                <h3 className='name'>{userInfo.name}</h3>
                <div className="item">
                    <span className='item-title'>居住地</span>
                    {editMode
                        ? <input
                            name='area'
                            className='inputText'
                            placeholder='Enter your area'
                            value={userInfo.area}
                            onChange={handleUserInfo}
                        />
                        : userInfo?.area}
                </div>
                <div className="item">
                    <span className='item-title'>职业</span>
                    {editMode
                        ? <input
                            placeholder='Enter your job'
                            name='job'
                            className='inputText'
                            onChange={handleUserInfo}
                            type="text" />
                        : userInfo?.job
                    }
                </div>
                <div className="footer">
                    <button className='editBtn' onClick={editProfile}>
                        {editMode ? '返回个人主页' : '编辑个人资料'}
                    </button>
                    {editMode && <button className='saveBtn' onClick={saveProfile}>
                        保存
                    </button>}
                </div>
            </div>
        </div>
    )
}
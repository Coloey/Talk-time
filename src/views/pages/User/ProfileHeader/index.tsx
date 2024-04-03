import React, { useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import getBase64 from '../../../../utils/getBase64'
import { updateUserInfo, getUserInfo } from '../../../../utils/api'
import './index.styl'
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function ProfileHeader({ backgroundImage }) {
    const [avatarImage, setAvatarImage] = useState('https://tse1-mm.cn.bing.net/th/id/OIP-C.qebt1PBL2zYXGXsHVMPTXAAAAA?rs=1&pid=ImgDetMain')
    const [isHovering, setIsHovering] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        getBase64(file)
            .then(async (url) => {
                setAvatarImage(url)
                localStorage.setItem('avatar', JSON.stringify(url))
                const res = await updateUserInfo({
                    avatar: JSON.stringify(url),
                    name: userInfo.name
                })

            }).catch(err => {
                console.error(err)
            })
    }
    const editProfile = () => {
        setEditMode(!editMode)
    }
    const saveProfile = async () => {
        console.log(userInfo, 'userInfo2')
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        const res = await updateUserInfo({
            ...userInfo
        })
        res.data.status === 0 && setEditMode(false)
    }
    const handleUserInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((preUserInfo) => ({
            ...preUserInfo,
            [name]: value
        }))
    }
    useEffect(() => {
        const myUserInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (myUserInfo) {
            setUserInfo(myUserInfo)
            setAvatarImage(myUserInfo?.avatar || JSON.parse(localStorage.getItem('avatar')))
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
                <h3 className='name'>{userInfo.name || localStorage.getItem('userName')}</h3>
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
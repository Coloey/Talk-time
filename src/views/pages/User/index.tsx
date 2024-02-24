import * as React from 'react'
import ProfileHeader from './ProfileHeader/index'
import './index.styl'
export default function User() {
    return (
        <div className="main">
            <div className="Card">
                <div className="UserCoverEditor">
                    <label className="UploadePicture-wrapper" for='image_uploads'>
                        编辑封面
                        <input
                            type="file"
                            id='image_uploads'
                            accept="image/png,image/jpeg"
                            className='UploadPicture-input'
                        />
                    </label>
                    <div className="UserCover">
                        <img src="" alt="用户封面" loading='lazy' />
                    </div>
                </div>
                <ProfileHeader></ProfileHeader>
            </div>
        </div>
    )
}
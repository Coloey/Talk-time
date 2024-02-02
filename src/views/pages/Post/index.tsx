import * as React from 'react'
import MyEditor from '../../components/MyEditor/index'
export default function Post({socket}) {
    return (
        <div>
            <MyEditor
                socket={socket}
                imageUploadConfig={{ action: "https://mockbin.org/bin/af08b9f3-59b3-4e6c-b4a2-29275e7e1f68" }}
            />
        </div>
    )
}
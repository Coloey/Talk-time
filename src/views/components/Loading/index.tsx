import React, { useEffect } from 'react';
import { message } from 'antd';

const Loading: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        messageApi
            .open({
                type: 'loading',
                content: 'Loading...',
                duration: 2.5
            })
    }, [])
    return (
        <>
            {contextHolder}
        </>
    );
};

export default Loading;
import React, { useState, useEffect } from 'react';
import './index.styl'
const ChatBar = ({ socket, sendName, users, messages, handleReadedMessages }) => {
    // const [users, setUsers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [myMessages, setMyMessages] = useState(messages)
    // useEffect(() => {
    //     socket.on('newUserResponse', (data) => setUsers(data));
    //     console.log(users)
    // }, [socket, users]);

    const handleClick = (name, index) => {
        sendName(name)
        setActiveIndex(index)
        handleReadedMessages(name)
    }
    return (
        <div className="chat_sidebar">
            <div>
                {/* <h4 className="chat_header">全部消息</h4> */}
                <div className="chat_users">
                    {users && users.map((user, index) => (
                        <div
                            onClick={() => handleClick(user.name, index)}
                            key={user.name}
                            className={`user ${activeIndex === index ? 'active' : ''}`}
                        >
                            {user.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatBar;
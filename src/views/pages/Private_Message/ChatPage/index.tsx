import React, { useEffect, useState, useRef } from 'react';
import ChatBar from '../ChatBar/index';
import ChatBody from '../ChatBody/index';
import ChatFooter from '../ChatFooter/index';
import './index.styl'
import { getAllUsers, getMessages } from '../../../../utils/api';
const ChatPage = ({ socket }) => {
    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');
    const lastMessageRef = useRef(null);
    const [toUser, setToUser] = useState('')
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const getUsers = async () => {
            const res = await getAllUsers();
            console.log(res, 'users')
            setUsers(res.data.data)
        }
        getUsers()
        const getMessage = async () => {
            const res = await getMessages()
            console.log(res.data.data, 'getMessage')
            setMessages(res.data.data)
        }
        getMessage()
    }, [])
    useEffect(() => {
        socket.on(localStorage.getItem('userName'), (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    useEffect(() => {
        // 👇️ 每当消息文字变动，都会往下滚动
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // useEffect(() => {

    // }, [])

    useEffect(() => {
        console.log(socket)
        socket.on('typingResponse', (data) => setTypingStatus(data));
        socket.on(socket.id, (data) => {
            console.log(data, 'data')
            setMessages(data)
        })
    }, [socket]);

    const receiveName = (val) => {
        setToUser(val)
    }
    return (
        <div className="chat">
            <ChatBar socket={socket} sendName={receiveName} users={users} />
            <div className="chat_main">
                <ChatBody
                    messages={messages}
                    typingStatus={typingStatus}
                    lastMessageRef={lastMessageRef}
                    toUser={toUser}
                />
                <ChatFooter socket={socket} toUser={toUser} />
            </div>
        </div>
    );
};

export default ChatPage;
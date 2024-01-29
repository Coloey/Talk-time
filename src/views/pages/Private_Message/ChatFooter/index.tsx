import React, { useState } from 'react';
import { storeMessages } from '../../../../utils/api';
import moment from 'moment'
import Emoji from '../Emoji/index';
import './index.styl'
const ChatFooter = ({ socket, toUser }) => {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false)
    const fromUser = localStorage.getItem('userName')
    const handleTyping = () =>{
        socket.emit('typing', `${fromUser} 正在输入`);
    }
    const chooseEmoji = (item) => {
        setMessage(message+item+'')
    }
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() && fromUser) {
            socket.emit('message', {
                text: message,
                fromUser: fromUser,
                toUser: toUser,
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
            });
        }
        setMessage('');
        if (message.trim() && fromUser) {
            const res = await storeMessages(
                {
                    fromUser,
                    toUser,
                    text: message,
                    timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }
            )
            console.log(res, 'client store')
        }
    };
    
    return (
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="请输入..."
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}

                />
                <button className="sendBtn">发送</button>
                <svg className="icon" aria-hidden="true" onClick={() => setVisible(!visible)}>
                    <use xlinkHref="#icon-xiaolian"></use>
                </svg>
                <div className="emoji-container"  className={`emoji-container ${visible ? '' : 'hidden'}`}>
                    <Emoji chooseEmoji={chooseEmoji}></Emoji>
                </div>
            </form>
        </div>
    );
};

export default ChatFooter;
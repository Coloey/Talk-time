import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.styl'
const ChatBody = ({ messages, lastMessageRef, typingStatus, toUser }) => {
    const navigate = useNavigate();
    const [myMessages, setMyMessages] = useState(messages)
    const handleLeaveChat = () => {
        localStorage.removeItem('userName');
        navigate('/');
        //window.location.reload();
    };
    useEffect(() => {
        const newMessage = (messages || []).map((item) => {
            console.log(item)
            const emojiDecodeRegex = /emoji\(\d+\)/g
            console.log(item.text)
            if (item && item?.text) {
                let fmt_str = item.text;
                item.text = fmt_str.replace(emojiDecodeRegex, p => {
                    const filterP = p.replace(/[^\d]/g, '')
                    return String.fromCodePoint(filterP)
                })
            }
            return item
        })
        setMyMessages(newMessage)
        console.log(myMessages, 'myMessages')
    }, [messages])
    return (
        <>
            <div className="message_container">
                {myMessages.map((message) =>
                    message.fromUser === localStorage.getItem('userName') && message.toUser === toUser ? (
                        <div className="message_chats" key={message.id}>
                            <p className="sender_name">{message.fromUser}</p>
                            <div className="message_sender">
                                <p className='text'>{message.text}</p>
                            </div>
                        </div>
                    ) : (
                        message.fromUser === toUser && message.toUser === localStorage.getItem('userName')
                            ?
                            (<div className="message_chats" key={message.id}>
                                <p>{toUser}</p>
                                <div className="message_recipient">
                                    <p>{message.text}</p>
                                </div>
                            </div>)
                            : ('')
                    )
                )}

                <div className="message_status">
                    <p>{typingStatus}</p>
                </div>
                <div ref={lastMessageRef} />
            </div>
        </>
    );
};

export default ChatBody;
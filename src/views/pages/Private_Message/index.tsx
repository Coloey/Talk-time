import React, { useEffect } from 'react';
//import { io } from 'socket.io-client';
import ChatPage from './ChatPage/index';
import { RouteIndex } from '../../../types/app';
import { useNavigate } from 'react-router-dom';
export default function Private_Message({ socket }) {
    useEffect(() => {

    }, []);
    return (
        <ChatPage socket={socket}></ChatPage>
    )
}
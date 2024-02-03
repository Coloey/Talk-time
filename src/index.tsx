import React, { useEffect } from 'react'
import * as ReactDOM from 'react-dom/client'
import './polyfill'
import Header from './views/components/Header/index';
import Home from './views/pages/Home/index';
import Post from './views/pages/Post/index';
import Message from './views/pages/Message/index';
import PrivateMessage from './views/pages/Private_Message/ChatPage';
import FocusPost from './views/pages/Home/FocusPost/index';
import Community from './views/pages/Home/Community/index';
import Login from './views/pages/login/index';
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import { RouteIndex } from './types/app';
import ErrorPage from './views/pages/error-page';
import { store } from './app/store';
import './index.css'
import socketIO from 'socket.io-client';
import { Provider } from 'react-redux';
const socket = socketIO.connect('http://127.0.0.1:4000')
// import { io } from "socket.io-client";
// const socket = io("http://127.0.0.1:4000");
socket.on('open', () => {
  console.log('已连接')
})
const router = createBrowserRouter([
  {
    path: RouteIndex.HOME,
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: RouteIndex.HOME,
        element: <Home />,
        children: [
          {
            path: RouteIndex.FOCUS_POST,
            element: <FocusPost socket={socket} />
          },
          {
            path: RouteIndex.COMMUNITY,
            element: <Community socket={socket} />
          }
        ]
      },
      {
        path: RouteIndex.COMMUNITY_NEW_POST,
        element: <Post socket={socket} />
      },
      {
        path: RouteIndex.MESSAGE,
        element: <Message />,
      },
      {
        path: RouteIndex.PRIVATE_MESSAGE,
        element: <PrivateMessage socket={socket} />,
      }
    ],
  },
  {
    path: RouteIndex.SIGNIN,
    element: <Login socket={socket} />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>,
)

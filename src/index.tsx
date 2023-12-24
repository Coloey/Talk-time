import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Header from './views/components/Header/index';
import Home from './views/pages/Home/index';
import Post from './views/pages/Post/index';
import Message from './views/pages/Message/index';
import PrivateMessage from './views/pages/Private_Message/index';
import FocusPost from './views/pages/Home/FocusPost/index';
import Community from './views/pages/Home/Community/index';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouteIndex } from './types/app';
import ErrorPage from './views/pages/error-page';
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: RouteIndex.HOME,
        element: <Home />,
        children: [
          {
            path: RouteIndex.FOCUS_POST,
            element: <FocusPost />
          },
          {
            path: RouteIndex.COMMUNITY,
            element: <Community />
          }
        ]
      },
      {
        path: RouteIndex.COMMUNITY_NEW_POST,
        element: <Post />
      },
      {
        path: RouteIndex.MESSAGE,
        element: <Message />,
      },
      {
        path: RouteIndex.PRIVATE_MESSAGE,
        element: <PrivateMessage />,
      }
    ]
  },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)

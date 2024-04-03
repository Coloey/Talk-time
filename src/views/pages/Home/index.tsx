import React, { useEffect } from 'react'
import { RouteIndex } from '../../../types/app'
import Community from './Community/index'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import './index.styl'
export default function Home({ socket }) {
    return (
        <div className="page">
            <div className="container">
                <div className="left">
                    <Community socket={socket}></Community>
                </div>
            </div>
        </div>
    )
}
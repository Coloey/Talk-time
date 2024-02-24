import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RouteIndex } from '../../../types/app'
import { Outlet } from 'react-router-dom'
import Login from '../../pages/login/index'
import './index.styl'
import Search from '../Search/index'
import { message } from 'antd'
import { useSelector } from 'react-redux'
//import { logout } from '../../../utils/api'
export default function Header({ isAuthenticated }) {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage()
    const logout = () => {
        localStorage.getItem('userInfo') && localStorage.removeItem('userInfo')
        localStorage.getItem('userName') && localStorage.removeItem('userName')
        localStorage.getItem('token') && localStorage.removeItem('token')
        messageApi.open({
            type: 'success',
            content: '退出登录成功'
        })
        navigate(RouteIndex.SIGNIN)
    }
    useEffect(() => {
        const isAuthenticated = window.localStorage.getItem('token') || false
        // isAuthenticated || navigate(RouteIndex.SIGNIN)
    }, [])
    const messageCount = useSelector((state) => state.messageCount);
    return (
        <>
            <header>
                <div className="icon">
                    <Link to={RouteIndex.HOME}>icon</Link>
                </div>
                <div className="tabs">
                    <NavLink to={RouteIndex.HOME}
                        className={
                            ({ isActive }) =>
                                isActive
                                    ? 'tab tab-active'
                                    : 'tab'
                        }>首页</NavLink>
                    <NavLink to={RouteIndex.COMMUNITY_NEW_POST}
                        className={
                            ({ isActive }) =>
                                isActive
                                    ? 'tab tab-active'
                                    : 'tab'
                        }>
                        发布
                    </NavLink>
                    <NavLink to={RouteIndex.PRIVATE_MESSAGE}
                        className={
                            ({ isActive }) =>
                                isActive
                                    ? 'tab tab-active'
                                    : 'tab'
                        }>
                        私信
                    </NavLink>
                    <div className={messageCount === 0 ? '' : 'messageCount'}>{messageCount >= 100 ? '99+' : (messageCount !== 0 ? messageCount : '')}</div>
                    <NavLink to={RouteIndex.MySelf}
                        className={
                            ({ isActive }) =>
                                isActive
                                    ? 'tab tab-active'
                                    : 'tab'
                        }>
                        我的
                    </NavLink>
                    <Search className='search'></Search>
                    <button className='btn' onClick={logout}>退出</button>
                </div>
            </header>
            <Outlet />
        </>
    )
}
import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RouteIndex } from '../../../types/app'
import { Outlet } from 'react-router-dom'
import './index.styl'
import Search from '../Search/index'
export default function Header() {
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
                        发表动态
                    </NavLink>
                    <NavLink to={RouteIndex.MESSAGE}
                        className={
                            ({ isActive }) =>
                                isActive
                                    ? 'tab tab-active'
                                    : 'tab'
                        }>
                        消息
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
                    <Search className='search'></Search>
                </div>
            </header>
            <Outlet />
        </>
    )
}
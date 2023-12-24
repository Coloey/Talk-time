import * as React from 'react'
import { RouteIndex } from '../../../types/app'
import { Link, NavLink, Outlet } from 'react-router-dom'
import './index.styl'
export default function Home() {
    return (
        <div className="page">
            <div className="container">
                <div className="left">
                    <div className="tabs">
                        <NavLink to={RouteIndex.FOCUS_POST}
                            className={
                                ({ isActive }) =>
                                    isActive
                                        ? 'tab tab-active'
                                        : 'tab'
                            }>关注</NavLink>
                        <NavLink to={RouteIndex.COMMUNITY}
                            className={
                                ({ isActive }) =>
                                    isActive
                                        ? 'tab tab-active'
                                        : 'tab'
                            }>
                            社区
                        </NavLink>
                    </div>
                    <Outlet />
                </div>
                <div className="right">

                </div>
            </div>
        </div>
    )
}
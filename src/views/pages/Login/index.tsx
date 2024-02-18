import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from '../../../types/app';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from '@ant-design/icons'
import { Input } from 'antd';
import { login, getUserInfo, register } from '../../../utils/api';
import './index.styl'
const Login = ({ socket }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassWord] = useState('')
    const [title, setTitle] = useState('登录账号')
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ name: userName, password: password })
        } catch (e) {
            setTitle('注册账号')
            let res = await register({ name: userName, password: password })
            //console.log(res)
        }
        navigate(RouteIndex.HOME)
        const res = await getUserInfo()
        console.log(JSON.stringify(res.data.data), 'userInfo')
        //console.log(res, 'userInfo')
        localStorage.setItem('userName', userName);
        localStorage.setItem('userInfo', JSON.stringify(res.data.data))
        socket.emit("addUser", { username: localStorage.getItem('userName'), socketID: socket.id });
        navigate(RouteIndex.HOME)
    };
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
        <form className="home_container" onSubmit={handleSubmit}>
            <h2 className="home_header">{title}</h2>
            <Input
                size="large"
                style={{ width: 500 }}
                placeholder="Enter your username"
                prefix={<UserOutlined />}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <Input.Password
                size="large"
                style={{ width: 500 }}
                //value={password}
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                placeholder="Enter your password"
                prefix={<LockOutlined />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            <button className="home_cta">登录</button>
        </form>
    );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from '../../../types/app';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from '@ant-design/icons'
import { Input } from 'antd';
import { message } from 'antd';
import { login, getUserInfo, register } from '../../../utils/api';
import './index.styl'
const Login = ({ socket }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassWord] = useState('')
    const [title, setTitle] = useState('登录账号')
    const handleLogin = async () => {
        const loginRes = await login({ name: userName, password: password });
        if (loginRes && loginRes.data.status === 0) {
            navigate(RouteIndex.HOME);
            await handleUserInfo();
        } else {
            throw new Error('Login failed');
        }
    }
    const handleUserInfo = async () => {
        const userInfoRes = await getUserInfo();
        //console.log(JSON.stringify(userInfoRes.data.data), 'userInfo');
        localStorage.setItem('userName', userName);
        localStorage.setItem('userInfo', JSON.stringify(userInfoRes.data.data));
        socket.emit("addUser", { username: localStorage.getItem('userName'), socketID: socket.id });
        navigate(RouteIndex.HOME);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin();
        } catch (e) {
            console.log(e, 'error');
            setTitle('注册账号');
            const registerRes = await register({ name: userName, password: password });
            if (registerRes.data.status === 200) {
                await handleUserInfo();
            }
        }

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
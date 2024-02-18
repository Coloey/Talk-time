//import { JsonWebTokenError } from "jsonwebtoken"
import axios from "./request"
import qs from "qs"
export const login = (data) => {
    //data=JSON.stringify(data)
    return axios({
        url: '/api/login',
        method: 'post',
        data: qs.stringify(data),

    })
}
export const register = (data) => {
    return axios({
        url: '/api/register',
        method: 'post',
        data: qs.stringify(data)
    })
}
export const logout = () => {
    return axios({
        url: '/api/logout',
        method: 'post',
    })
}
export const getUserInfo = () => {
    return axios({
        url: '/my/getUserInfo',
        method: 'get',
    })
}
export const updatePassword = (data) => {
    return axios({
        url: '/my/updatePassword',
        method: 'post',
        data: qs.stringify(data)
    })
}
export const getAllUsers = () => {
    return axios({
        url: '/my/getAllUsers ',
        method: 'get'
    })
}
export const storeMessages = (data) => {
    return axios({
        url: '/my/storeMessages',
        method: 'post',
        data: qs.stringify(data)
    })
}
export const getMessages = () => {
    return axios({
        url: '/my/getMessages',
        method: 'get'
    })
}
export const storePostContent = (data) => {
    return axios({
        url: '/my/storePostContent',
        method: 'post',
        data: qs.stringify(data)
    })
}
export const getPosts = (data) => {
    return axios({
        url: '/my/getPosts',
        method: 'get'
    })
}
export const updatePost = (data) => {
    return axios({
        url: '/my/updatePost',
        method: 'post',
        data: qs.stringify(data)
    })
}
export const updateLikes = (data) => {
    return axios({
        url: '/my/updateLikes',
        method: 'post',
        data: qs.stringify(data)
    })
}
export const storeComment = (data) => {
    return axios({
        url: '/my/storeComment',
        method: 'post',
        data: qs.stringify(data)
    })
}
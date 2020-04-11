import { SET_LOGIN, SET_USERID, SET_USERINFO_AVATAR, SET_USERINFO_NAME, SET_USERINFO_INTRODUCTION } from './actionTypes'

export function setLogin(isLogin) {
    return {
        type: SET_LOGIN,
        isLogin
    }
}

export function setUserID(name) {
    return {
        type: SET_USERID,
        name
    }
}

export function setUserInfoAvatar(avatar) {
    return {
        type: SET_USERINFO_AVATAR,
        avatar
    }
}

export function setUserInfoName(username) {
    return {
        type: SET_USERINFO_NAME,
        username
    }
}

export function setUserIntroduction(introduction) {
    return {
        type: SET_USERINFO_INTRODUCTION,
        introduction
    }
}
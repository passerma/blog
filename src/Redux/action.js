import {
    SET_LOGIN, SET_USERID, SET_USERINFO_AVATAR, SET_USERINFO_NAME, SET_USERINFO_INTRODUCTION,
    SET_USER_MESSAGE_NUM
} from './actionTypes'

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

//#region 导航个人中心相关
export function setUserMessageNum(num) {
    return {
        type: SET_USER_MESSAGE_NUM,
        num
    }
}
//#endregion
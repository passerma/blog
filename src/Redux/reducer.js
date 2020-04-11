import { SET_LOGIN, SET_USERID, SET_USERINFO_AVATAR, SET_USERINFO_NAME, SET_USERINFO_INTRODUCTION } from './actionTypes'
import dotProp from 'dot-prop-immutable';

const initializeState = {
    isLogin: false,
    username: '',
    userInfo: {
        avatar: '',
        username: '',
        introduction: ''
    }
}

export function setLogin(state = initializeState, action) {
    switch (action.type) {
        case SET_LOGIN:
            return { isLogin: action.isLogin };
        default:
            return state;
    }
}

export function setUserID(state = initializeState, action) {
    switch (action.type) {
        case SET_USERID:
            return { userid: action.name };
        default:
            return state;
    }
}

export function setUserInfo(state = initializeState.userInfo, action) {
    switch (action.type) {
        case SET_USERINFO_AVATAR:
            return dotProp.set(state, 'avatar', action.avatar);
        case SET_USERINFO_NAME:
            return dotProp.set(state, 'username', action.username);
        case SET_USERINFO_INTRODUCTION:
            return dotProp.set(state, 'introduction', action.introduction)
        default:
            return state;
    }
}
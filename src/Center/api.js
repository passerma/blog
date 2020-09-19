import { FetchData } from '../CommonData/api'

//#region center-info
/** 
 * 修改用户个人简介
*/
export function postLoginInfo(data, callBack) {
    let params = {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    let url = `/user/allInfo`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/** 
 * 获取用户信息
*/
export function getAllInfo(callBack) {
    let params = {
        method: "GET",
    }
    let url = `/user/allInfo`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}
//#endregion

//#region center-view
/** 
 * 获取评论
*/
export const getComments = (callBack) => {
    let params = {
        method: "GET",
    }
    let url = `/user/allComments`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}
/** 
 * 删除评论
*/
export function delComments(id, callBack) {
    let params = {
        method: "POST",
    }
    let url = `/blog/detail/delcomments?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/** 
 * 获取点赞
*/
export const getLikesData = (callBack) => {
    let params = {
        method: "GET",
    }
    let url = `/user/allLikes`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}
//#endregion

//#region center-set
/** 
 * 修改密码
*/
export function changePassword(data, callBack) {
    let params = {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    let url = `/user/changePassword`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}
//#endregion
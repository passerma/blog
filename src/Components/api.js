import { FetchData } from '../CommonData/api'

//#region 歌曲相关
/** 
 * 查询歌曲
*/
export function searchMusci(name, offset, limit, callBack) {
    let params = {
        method: "GET",
    }
    let url = `/tool/music/search?name=${name}&offset=${offset}&limit=${limit}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/** 
 * 查询歌曲url
*/
export function searchMusciUrl(id, callBack) {
    let params = {
        method: "GET",
    }
    let url = `/tool/music/url?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/** 
 * 查询歌曲u详情
*/
export function searchMusciDetail(id, callBack) {
    let params = {
        method: "GET",
    }
    let url = `/tool/music/detail?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

//#endregion

//#region 个人中心相关
/** lock
 * 获取签到信息
*/
export function getClock(callBack) {
    let params = {
        method: "GET",
    }
    let url = `/user/getclock`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/**
 * 设置签到
 */
export function setClockTime(callBack) {
    let params = {
        method: "POST",
    }
    let url = `/user/setclock`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/**
 * 获取未读消息
 */
export function getUnreadNumData(callBack) {
    let params = {
        method: "GET",
    }
    let url = `/message/unreaadnum`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/**
 * 清除未读消息弹窗
 */
export function getClearMessagePopupData(callBack) {
    let params = {
        method: "GET",
    }
    let url = `/message/clearPopup`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}
//#endregion
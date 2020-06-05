import { FetchData } from '../CommonData/api'

//#region right
/** 
 * get unread
*/
export function getUnreadData(callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/message/unread`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}

/** 
 * get all
*/
export function getAllData(callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/message/all`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}

/** 
 * get read
*/
export function getReadData(callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/message/read`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}


/** 
 * get content
*/
export function getContentData(id, callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/message/content?id=${id}`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}

/** 
 * del message
*/
export function delMessage(id, callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/message/delMessage?id=${id}`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}
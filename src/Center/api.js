import { FetchData } from '../CommonData/api'

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
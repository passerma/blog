import { FetchData } from '../../CommonData/api'

//#region right
export function getNewListData(callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/tool/newList`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}

export function getFootballData(type, league, callBack) {
    let params = {
        method: "GET",
    }
    let url = ''
    if (type === 'jf') {
        url = `/tool/football/points?league=${league}`
    }
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

export function getBaiduyunData(url, callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/tool/other/baiduyunpassword?url=${url}`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}

export function getIpInfo(value, callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/tool/ipsearch?value=${value}`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}
//#endregion

//#region left
export function getHomeArticle(callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/blog/listBeauti`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}
//#endregion
import { FetchData } from '../../CommonData/api'

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

export function getWeiBoTop(callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/crawler/weiboTop`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}

export function getHomeArticle(callBack) {
    let params = {
        method: "GET",
    }
    let getUrl = `/blog/listBeauti`
    FetchData(getUrl, params, (res) => {
        callBack(res)
    })
}
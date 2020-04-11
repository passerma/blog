import { FetchData } from '../CommonData/api'

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
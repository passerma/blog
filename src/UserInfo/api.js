import { FetchData } from '../CommonData/api'

export function getInfoData(id, callBack) {
    let params = {
        method: "GET",
    }
    let url = `/user/infoData?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}
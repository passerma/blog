import { FetchData } from '../../CommonData/api'

export function getData(callBack) {
    let params = {
		method: "GET",
	}
	FetchData('/importance/epidemic', params, (res) => {
        callBack(res)
	})
}
let commonUrl = ''
if (process.env.NODE_ENV === "development") {
    // 开发环境
    commonUrl = "http://localhost:7010/api";
} else {
    // 生产环境
    commonUrl = 'https://www.passerma.com/api'
}

export const COMMON_URL = commonUrl

export function FetchData(urlResult, params, callBack) {
    let url = `${COMMON_URL}${urlResult}`; // 全局配置
    // let url = `.${urlResult}`;   // 代理配置
    let opts = {
        ...params,
        credentials: "include",
    };
    fetch(url, opts)
        .catch((err) => {
            console.log(err);
            callBack();
        })
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            callBack(myJson);
        });
}

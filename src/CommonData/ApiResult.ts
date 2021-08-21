import axios, { AxiosRequestConfig } from 'axios';

// 返回结果类型
interface resType<T> {
    ErrCode: number,
    ErrMsg: string,
    data?: T,
    [key: string]: any;
}

let commonUrl = ''
if (process.env.NODE_ENV === "development") {
    // 开发环境
    commonUrl = "http://localhost:7956/api/go";
} else {
    // 生产环境
    commonUrl = 'https://www.passerma.com/api/go'
}

export function fetchGo<T>(path: string, fetchObj: AxiosRequestConfig) {
    let {
        method = 'GET' as 'GET',
        params = {},
        data = {},
        timeout = 10000
    } = fetchObj;
    return new Promise<resType<T> | null>((resolve) => {
        let obj = {
            url: commonUrl + path,
            method: method,
            params: params,
            data: data,
            timeout: timeout,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('Authorization')
            },
            withCredentials: true
        };
        axios(obj).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            console.error(error);
            resolve(null);
        });
    });
}

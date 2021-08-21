import { fetchGo } from './ApiResult'
import { message } from 'antd';

let keepLoginTimer: any

/**
 * 创建token保活定时器
 */
export function createKeepLoginTimer() {
    clearInterval(keepLoginTimer)
    keepLoginTimer = null
    keepLoginTimer = setInterval(() => {
        fetchGo<{ Authorization: string }>('/bloger/user/keepLogin', { method: 'post' }).then(res => {
            if (res && res.ErrCode === 0 && res.data && res.data.Authorization) {
                sessionStorage.setItem('Authorization', res.data.Authorization)
            } else {
                message.error("获取Authorization失败，请重新登录")
            }
        })
    }, 1000 * 60 * 4.5) // 4分30秒续期
}

/**
 * 清除token保活定时器
 */
export function clearKeepLoginTimer() {
    clearInterval(keepLoginTimer)
    keepLoginTimer = null
}
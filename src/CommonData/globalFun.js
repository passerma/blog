import moment from 'moment'
const storage = window.localStorage;

//#region local storage相关
function serialize(val) {
    return JSON.stringify(val);
}

function deserialize(val) {
    if (typeof val !== 'string') {
        return undefined;
    }
    try {
        return JSON.parse(val);
    } catch (e) {
        return val || undefined;
    }
}

/** 
 * 设置storage
 * @param {String} key key
 * @param {String} val val
*/
export function setStorage(key, val) {
    if (val === undefined) {
        return;
    }
    storage.setItem(key, serialize(val));
}

/** 
 * 获取storage
 * @param {String} key key
 * @param {String} def 不存在key返回的值
*/
export function getStorage(key, def) {
    const val = deserialize(storage.getItem(key));
    return val === undefined ? def : val;
}

/** 
 * 移除storage
 * @param {String} key key
*/
export function removeStorage(key) {
    storage.removeItem(key);
}

/** 
 * 清除storage
*/
export function clearStorage() {
    storage.clear();
}
//#endregion

//#region 替换相关
/** 
 * XSS替换 
 */
export function translateXSSText(value) {
    let newValue = value.replace(/&lt;/g, '<');
    newValue = newValue.replace(/&gt;/g, '>');
    return newValue
}

/** 
     * 转换日期格式为年月日小时分例：2000-01-01 20:00
    */
export function translateDateYMDHM(createtime) {
    let date = new Date(createtime);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let newDate = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    return `${year}-${month}-${newDate} ${h}:${m}`
}

/** 
 * 转换链接格式
 */
export function addLinkHttps(url) {
    if (url) {
        var http = /^http:\/\/.*/i.test(url);
        var https = /^https:\/\/.*/i.test(url);
        if (!http && !https) {
            url = 'https://' + url;
        }
    }
    return url
}
//#endregion

//#region 日期相关
/** 
 * 返回周几
*/
export function getTimeDay(time) {
    let week = moment(time).day()
    switch (week) {
        case 1:
            return '周一'
        case 2:
            return '周二'
        case 3:
            return '周三'
        case 4:
            return '周四'
        case 5:
            return '周五'
        case 6:
            return '周六'
        case 0:
            return '周日'
        default:
            return '错误'
    }
}
//#endregion

//#region 小工具
export function getURLParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//#endregion
import { COMMON_URL, FetchData } from '../../CommonData/api'

/** 
 * 获取博客列表
*/
export function getList(keyword, classAll, order, callBack) {
    let params = {
        method: "GET",
    }
    let url = `/blog/list?keyword=${keyword}&classAll=${classAll}&order=${order}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/** 
 * 获取博客详情
*/
export function getDatail(id, callBack) {
    let url = `/blog/detail?id=${id}`
    let opts = {
        method: "GET"
    }
    FetchData(url, opts, (res) => {
        callBack(res)
    })
}


/** 
 * 获取置顶博客
*/
export function getTopArticle(callBack) {
    let url = '/blog/toparticle'
    let opts = {
        method: "GET"
    }
    FetchData(url, opts, (res) => {
        callBack(res)
    })
}

/** 
 * 获取评论详情
*/
export function getComments(id, callBack) {
    let url = `${COMMON_URL}/blog/detail/comments?id=${id}`
    let opts = {
        method: "GET",
        credentials: 'include'
    }
    fetch(url, opts)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            if (myJson.ErrCode !== 0) {
                console.error('错误')
                return
            }
            if (callBack && typeof (callBack) === "function") {
                callBack(myJson);
            }
        });
}


/** 
 * 新建评论
*/
export function newComment(id, formdata, callBack) {
    let url = `/blog/detail/newComment?id=${id}`
    // let comments = data.comments
    // let user = data.user
    let opts = {
        method: 'POST',
        body: formdata
    }
    FetchData(url, opts, (res) => {
        callBack(res)
    })
}

/**
 * 上传评论图片
 */
export function postCommentImgData(formData, callBack) {
    let url = `/file/post/commentImg`
    let opts = {
        method: 'POST',
        credentials: 'include',
        body: formData,
    }
    FetchData(url, opts, (res) => {
        callBack(res)
    })
}

/** 
 * 删除评论
*/
export function delComments(id, callBack) {
    let params = {
        method: "POST",
    }
    let url = `/blog/detail/delcomments?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/** 
 * 修改评论
*/
export function modifyComments(id, formdata, callBack) {
    let params = {
        method: "POST",
        body: formdata
    }
    let url = `/blog/detail/modifycomments?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

/** 
 * 新建评论 旧
*/
export function replayComments(id, data, callBack) {
    let url = `/blog/detail/replaycomments?id=${id}`
    let opts = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            ...data
        })
    }
    FetchData(url, opts, (res) => {
        callBack(res)
    })
}

/** 
 * 回复评论
*/
export function replayComment(id, data, callBack) {
    let url = `/blog/detail/replaycomment?id=${id}`
    let opts = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            ...data
        })
    }
    FetchData(url, opts, (res) => {
        callBack(res)
    })
}

/** 
 * 回复二级评论
*/
export function repliedComment(id, data, callBack) {
    let url = `/blog/detail/repliedComment?id=${id}`
    let opts = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            ...data
        })
    }
    FetchData(url, opts, (res) => {
        callBack(res)
    })
}

/** 
 * 获取分类
*/
export function getClassData(callBack) {
    let params = {
        method: "GET",
    }
    let url = `/blog/class`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

//#region 点赞
export function getlikeData(id, callBack) {
    let params = {
        method: "GET",
    }
    let url = `/blog/detail/likeData?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}

export function postlikeData(id, callBack) {
    let params = {
        method: "POST",
    }
    let url = `/blog/detail/likeData?id=${id}`
    FetchData(url, params, (res) => {
        callBack(res)
    })
}
//#endregion
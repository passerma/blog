import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import hljs from 'highlight.js';
import { getDatail, getlikeData, postlikeData, postCollectData } from '../api/api'
import { Skeleton, Empty, message, Tag, Anchor, Statistic, Icon } from 'antd';
import './Detail.less';
import './AddComments'
import DetailComments from './DetailComments'
import AddComment from './AddComment'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1910007_ojt6gfzurem.js', // 在 iconfont.cn 上生成
});

const MyIconV2 = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2649850_oxm3rvcnv.js', // 在 iconfont.cn 上生成
});

class FooGuardTestForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            title: '',
            createTime: '',
            updateTime: '',
            noneArticle: false,
            articleVisible: true,
            look: 0,
            blogClass: '',
            loadingAnchor: true,
            AnchorLink: null,
            commentsLength: 0,
            likeNum: 0,
            collectNum: 0,
            isLike: false,
            isCanLike: false,
            isCollect: false
        };
        this.blogText = '';
        this.minLinkNum = 5;
        this.isLikeLoading = false
    }
    componentDidMount() {
        let id = this.props.match.params.id
        let that = this
        getDatail(id, (res) => {
            if (res.ErrCode === 0) {
                let data = res.data
                document.title = data.title
                this.setState({
                    loading: false,
                    title: data.title,
                    createTime: data.createtime,
                    updateTime: data.updatetime,
                    look: data.look,
                    blogClass: data.class,
                    blogText: data.text,
                    noneArticle: false,
                    commentsLength: data.commentNum,
                    likeNum: data.likeNum,
                    collectNum: data.collectNum
                }, () => {
                    this.refs.detail.innerHTML = data.content
                    let allPre = document.querySelectorAll('.detail-content pre')
                    for (let i = 0; i < allPre.length; i++) {
                        let newchild = document.createElement("div");
                        newchild.innerHTML = "复制";
                        let innerText = allPre[i].innerText
                        newchild.onclick = function () { that.clickcCopy(innerText) };
                        allPre[i].appendChild(newchild);
                    }
                    this.highlightCallBack();
                    this.addAnchor()
                })
            } else {
                if (res.ErrCode === 1004) {
                    message.info(res.ErrMsg)
                    this.setState({
                        noneArticle: true,
                        articleVisible: false,
                        loading: false,
                    })
                } else {
                    message.error(res.ErrMsg)
                    this.setState({
                        noneArticle: true,
                        loading: false,
                    })
                }
            }
        })
        getlikeData(id).then(res => {
            if (res && res.ErrCode === 0) {
                this.setState({
                    isLike: res.data.isLike,
                    isCanLike: true,
                    isCollect: res.data.isCollect,
                })
            }
        })
    }

    //#region 工具函数
    /** 
     * 转换日期
    */
    _translateDate = (createtime) => {
        let date = new Date(createtime);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let newDate = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        return `${year}-${month}-${newDate} ${h}:${m}`
    }

    /** 
     * 调用子组件评论成功
     */
    addCommentsSus = () => {
        this.detailCommentsRef.addCommentsSus()
    }
    /**
     * 生成评论ref
     */
    onRef = (ref) => {
        this.detailCommentsRef = ref
    }

    /** 
     * 复制到剪贴板
    */
    clickcCopy = (str) => {
        let save = function (e) {
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        };
        document.addEventListener('copy', save);
        document.execCommand('copy');
        document.removeEventListener('copy', save);
        message.success('复制成功')
    }

    /**
     * 代码高亮
     */
    highlightCallBack = () => {
        document.querySelectorAll("pre code").forEach(block => {
            try {
                hljs.highlightBlock(block);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    //#endregion

    //#region 锚点
    /** 
     * 添加锚点
    */
    addAnchor = () => {
        let linkAllTitle = []
        let { blogText } = this.state
        blogText = blogText.replace(/&nbsp;/g, "")
        blogText = blogText.replace(/\s/g, "")
        this.blogText = blogText
        let allH1 = document.querySelectorAll('.detail-content h1')
        let allH2 = document.querySelectorAll('.detail-content h2')
        let allH3 = document.querySelectorAll('.detail-content h3')
        let allH4 = document.querySelectorAll('.detail-content h4')
        let allH5 = document.querySelectorAll('.detail-content h5')
        linkAllTitle.push(...this.setId(allH1, 1))
        linkAllTitle.push(...this.setId(allH2, 2))
        linkAllTitle.push(...this.setId(allH3, 3))
        linkAllTitle.push(...this.setId(allH4, 4))
        linkAllTitle.push(...this.setId(allH5, 5))
        linkAllTitle.sort(this.sortLink)
        let AnchorLink = null
        if (linkAllTitle.length === 0) {
            AnchorLink = <div style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>该文章无目录</div>
        } else {
            AnchorLink = <Anchor getContainer={() => document.querySelector('.detail')} onClick={e => e.preventDefault()}>
                {
                    linkAllTitle.map((element, index) =>
                        <Anchor.Link className={`detail-anchor-${element.h + 1 - this.minLinkNum}`} key={index} href={`#${element.href}`}
                            title={element.title} />
                    )
                }
            </Anchor >
        }
        this.setState({
            AnchorLink
        })
    }

    /** 
     * 设置h的锚点
     */
    setId = (allH, h) => {
        let linkTitle = []
        for (let i = 0; i < allH.length; i++) {
            allH[i].setAttribute('id', allH[i].innerText);
            let title = allH[i].innerText.replace(/\s/g, '')
            linkTitle.push({ h, title, href: allH[i].innerText })
        }
        if (linkTitle.length !== 0) {
            (h < this.minLinkNum) && (this.minLinkNum = h)
        }
        return linkTitle
    }

    /** 
     * 排序标题
     */
    sortLink = (a, b) => {
        return this.blogText.indexOf(a.title) - this.blogText.indexOf(b.title)
    }
    //#endregion

    //#region 底部功能
    /**
     * 设置点赞
     */
    postLike = () => {
        if (!this.state.isCanLike) {
            message.info('请登录后进行操作')
        } else {
            if (this.isLikeLoading) return
            let id = this.props.match.params.id
            this.isLikeLoading = true
            postlikeData(id, res => {
                this.isLikeLoading = false
                if (res && res.ErrCode === 0) {
                    this.setState({
                        isLike: res.data.isLike,
                        likeNum: res.data.likeNum
                    })
                } else {
                    res && message.error(res.ErrMsg)
                }
            })
        }
    }

    postCollect = () => {
        if (!this.state.isCanLike) {
            message.info('请登录后进行操作')
        } else {
            if (this.isLikeLoading) return
            let id = this.props.match.params.id
            this.isLikeLoading = true
            postCollectData(id).then(res => {
                this.isLikeLoading = false
                if (res && res.ErrCode === 0) {
                    this.setState({
                        isCollect: res.data.isCollect,
                        collectNum: res.data.collectNum
                    })
                } else {
                    res && message.error(res.ErrMsg)
                }
            })
        }
    }

    /**
     * 添加功能锚点
     */
    _createAnchorLinkTitle = () => {
        return <Anchor
            getContainer={() => document.querySelector('.detail')}
            affix
            onClick={e => e.preventDefault()}
            showInkInFixed={false}>
            <Anchor.Link title="查看文章" href="#detailTitle" />
            <Anchor.Link title="点赞收藏" href="#detailBtn" />
            <Anchor.Link title="查看评论" href="#detaiComments" />
            <Anchor.Link title="发表评论" href="#detailAddComments" />
        </Anchor>
    }
    //#endregion
    render() {
        let { loading, title, createTime, updateTime, commentsLength, noneArticle, articleVisible, look,
            blogClass, AnchorLink, likeNum, isLike, collectNum, isCollect } = this.state

        let { isLogin, userInfo } = this.props

        return (
            <div className="detail">
                <Skeleton active loading={loading}>
                    {
                        noneArticle ? <Empty style={{ marginTop: '20px' }} description={articleVisible ? '对应文章不存在' : '文章已被删除!!'} /> :
                            <div className="detail-main">
                                <div className="detail-title" id="detailTitle">
                                    <h1>{title}</h1>
                                </div>
                                <div className="detail-title-more">
                                    <Icon type="edit" />
                                    <span style={{ marginLeft: '5px', marginRight: '20px' }}>{this._translateDate(updateTime)}</span>
                                    <Icon type="eye" />
                                    <span style={{ marginLeft: '5px', marginRight: '20px' }}>{look}</span>
                                    <Icon type="message" />
                                    <span style={{ marginLeft: '5px', marginRight: '20px' }}>{commentsLength}</span>
                                </div>
                                <div ref="detail" className="detail-content"></div>
                                <div className="detail-msg">
                                    <Tag color="magenta" style={{ float: 'left', marginTop: '2px' }}>{blogClass || '未分类'}</Tag>
                                    <span className="detail-msg-createTime">创建 {this._translateDate(createTime)}</span>
                                    <span className="detail-msg-updateTime">最后更新 {this._translateDate(updateTime)}</span>
                                    <span className="detail-msg-updateTime">阅读({look})</span>
                                    <span className="detail-msg-commentsNum">评论 ({commentsLength})</span>
                                </div>
                                <div className="detail-btn" id="detailBtn">
                                    <div className="detail-btn-title"><Icon type="database" theme="twoTone"
                                        twoToneColor="#52c41a" style={{ marginRight: '10px' }} />点赞收藏</div>
                                    <span onClick={this.postLike} title={isLike ? '取消点赞' : '点赞'} className="detail-btn-like">
                                        <Statistic value={likeNum}
                                            prefix={isLike ? <Icon type="like" theme="filled" style={{ color: "#1890FF" }} /> :
                                                <MyIcon type="icon-weizan" />} />
                                    </span>
                                    <span onClick={this.postCollect} title={isCollect ? '取消收藏' : '收藏'} className="detail-btn-heart">
                                        <Statistic value={collectNum}
                                            prefix={isCollect ? <MyIconV2 type="icon-blog_webxihuan" /> :
                                                <MyIconV2 type="icon-blog_webshoucang" />} />
                                    </span>
                                </div>
                                <DetailComments onRef={this.onRef} />
                                {/* <AddComments addCommentsSus={this.addCommentsSus}></AddComments> */}
                                <AddComment addCommentsSus={this.addCommentsSus} isLogin={isLogin} userInfo={userInfo} />
                            </div>
                    }
                </Skeleton>
                {
                    (!loading && !noneArticle) && <div className="detail-anchor">
                        <span className="detail-anchor-title">目录</span>
                        {
                            AnchorLink && AnchorLink
                        }
                    </div>
                }
                {
                    (!loading && !noneArticle) && <div className="detail-anchor-atn">
                        {this._createAnchorLinkTitle()}
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { isLogin } = state.setLogin
    return {
        isLogin,
        userInfo: state.setUserInfo
    }
}

export default connect(mapStateToProps)(withRouter(FooGuardTestForm));


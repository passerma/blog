import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import marked from 'marked'
import './DetailComments.less'
import { getComments, delComments, modifyComments, replayComment, repliedComment } from '../api/api'
import { Skeleton, Empty, Input, Form, Button, Modal, message, Tag, Popover, Icon } from 'antd';
import { translateXSSText, translateDateYMDHM } from '../../CommonData/globalFun'
import { COMMON_URL } from '../../CommonData/api'
import InfoDetail from '../../Base/InfoDetail/InfoDetail'
import Editor from 'for-editor'

const { TextArea } = Input;
const { confirm } = Modal;

marked.setOptions({ // marked 设置
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
})


class DetailCommentsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentsNum: 0,
            oldComment: '',
            dataReplay: {},
            allComments: {},
            commentsLoading: true,
            replayBtnLoading: false,
            replayRealName: '',
            replayToUser: ''
        };
        this.props.onRef(this)
    }

    componentDidMount() {
        let id = this.props.match.params.id
        getComments(id, (res) => {
            let data = res.data
            this._dealComments(data)
            this.setState({
                commentsNum: data.length,
                commentsLoading: false
            })
        })
    }

    //#region 工具函数
    /** 
     * 处理评论
     */
    _dealComments = (data) => {
        let newFirstData = []
        let dataReplay = {}
        let allComments = {}
        for (let i = 0; i < data.length; i++) {
            allComments[data[i].id] = data[i]
            if (!dataReplay[data[i].id]) {
                dataReplay[data[i].id] = []
            }
            if (data[i].touser === '') {
                newFirstData.push(data[i])
            } else {
                if (!dataReplay[data[i].touser]) {
                    dataReplay[data[i].touser] = []
                }
                dataReplay[data[i].touser].unshift(data[i])
            }
        }
        this.setState({
            comments: newFirstData,
            dataReplay,
            allComments
        })
    }

    /** 
     * 设置用户标签
     * @param {Number} type 加数
    */
    setTag = (type) => {
        let tag = null;
        switch (type) {
            case 0:
                tag = <Tag color="#108ee9">博主</Tag>
                break;
            case 2:
                tag = <Tag color="#87d068">未登录用户</Tag>
                break;
            case 1:
                tag = <Tag color="#2db7f5">登录用户</Tag>
                break;
            default:
                tag = <Tag color="#87d068">未登录用户</Tag>
                break;
        }
        return tag
    }

    /** 
     * 评论成功
     */
    addCommentsSus = () => {
        let id = this.props.match.params.id
        this.setState({
            commentsLoading: true,
        })
        getComments(id, (res) => {
            let data = res.data
            this._dealComments(data)
            this.setState({
                commentsLoading: false
            })
        })
    }

    /** 
     * 得到markdown文本
    */
    getMarkDown = (content) => {
        let htmlContent = translateXSSText(content)
        let strHtml = marked(htmlContent)
        return strHtml
    }
    //#endregion

    //#region 回复相关
    /** 
     * 打开关闭回复面板
    */
    replayOpen = (visible, value) => {
        if (visible) {
            this.setState({
                replayRealName: value.user,
                replayToUser: value.id
            })
        } else {
            this.props.form.setFieldsValue({
                replayComments: ''
            })
        }
    }

    /** 
     * 提交回复
     */
    replaySubmit = (e, type) => {
        e.preventDefault();
        this.props.form.validateFields(['replayComments'], (err, values) => {
            if (!err) {
                this.setState({
                    replayBtnLoading: true
                })
                let comments = values.replayComments
                // 如果回复
                if (type === 'replay') {
                    let data = {
                        comments,
                        touser: this.state.replayToUser
                    }
                    replayComment(this.props.match.params.id, data, (res) => {
                        if (res && res.ErrCode === 0) {
                            message.success('回复成功')
                            let id = this.props.match.params.id
                            this.setState({
                                commentsLoading: true,
                                replayBtnLoading: false
                            })
                            getComments(id, (res) => {
                                let data = res.data
                                this._dealComments(data)
                                this.setState({
                                    commentsLoading: false
                                })
                            })
                        } else {
                            res && message.error(res.ErrMsg)
                        }
                    })
                } else {
                    let data = {
                        comments,
                        touser: this.state.replayToUser,
                        parent: this.state.replayParents,
                    }
                    repliedComment(this.props.match.params.id, data, (res) => {
                        if (!res) {
                            return
                        }
                        if (res.ErrCode === 0) {
                            message.success('回复成功')
                            let id = this.props.match.params.id
                            this.setState({
                                commentsLoading: true,
                                replayBtnLoading: false
                            })
                            getComments(id, (res) => {
                                let data = res.data
                                this._dealComments(data)
                                this.setState({
                                    commentsLoading: false
                                })
                            })
                        } else {
                            message.error(res.ErrMsg)
                        }
                    })
                }
            }
        });
    };

    /** 
     * 二级回复
    */
    replaySecOpen = (visible, value, replayValue) => {
        if (visible) {
            this.setState({
                replayRealName: replayValue.user,
                replayToUser: value.id,
                replayParents: replayValue.id
            })
        } else {
            this.props.form.setFieldsValue({
                replayComments: ''
            })
        }
    }
    //#endregion

    //#region 删除修改
    /** 
     * 删除评论
     */
    toDel = (id) => {
        let that = this
        confirm({
            title: '确认删除吗？之后不可恢复',
            okText: '确定',
            cancelText: '取消',
            centered: true,
            onOk() {
                delComments(id, (res) => {
                    if (res.ErrCode === 0) {
                        message.success('删除成功')
                        let id = that.props.match.params.id
                        that.setState({
                            commentsLoading: true,
                        })
                        getComments(id, (res) => {
                            let data = res.data
                            that._dealComments(data)
                            that.setState({
                                commentsLoading: false
                            })
                        })
                    } else {
                        if (res && res.ErrCode === 2009) {
                            message.info(res.ErrMsg)
                        }
                        if (res && res.ErrCode !== 2009) {
                            message.error(res.ErrMsg)
                        }
                    }
                })
            },
            onCancel() { },
        });
    }
    /** 
     * 取消修改
    */
    cancelModify = () => {
        this.setState({
            isModify: false,
            modifyId: ''
        })
    }

    /** 
     * 修改评论
    */
    modifyComments = (id, text) => {
        this.setState({
            isModify: true,
            modifyId: id,
            oldComment: text
        })
    }

    /**
     * 输入框改变
     */
    handleChange = (value) => {
        this.setState({
            oldComment: value
        })
    }


    /** 
     * 提交修改评论
    */
    handleSubmit = e => {
        e.preventDefault();
        let { oldComment } = this.state
        if (oldComment.trim() !== '') {
            this.setState({
                btnLoading: true
            })
            modifyComments(this.state.modifyId, oldComment, (res) => {
                if (!res) {
                    return
                }
                if (res.ErrCode === 0) {
                    message.success('修改成功')
                    let id = this.props.match.params.id
                    this.setState({
                        commentsLoading: true,
                        isModify: false,
                        modifyId: '',
                        btnLoading: false
                    })
                    getComments(id, (res) => {
                        let data = res.data
                        this._dealComments(data)
                        this.setState({
                            commentsLoading: false
                        })
                    })
                } else {
                    message.error(res.ErrMsg)
                }
            })
        } else {
            message.info('请输入评论内容！')
        }
    };
    //#endregion

    render() {
        let { commentsLoading, comments, dataReplay, allComments, replayBtnLoading, replayRealName,
            isModify, modifyId, btnLoading, commentsNum, oldComment } = this.state
        let { userid, isLogin } = this.props
        const { getFieldDecorator } = this.props.form;

        //#region 回复弹窗
        const content = (
            <div>
                <Form onSubmit={(e) => this.replaySubmit(e, 'replay')}>
                    <Form.Item style={{ textAlign: 'left', marginBottom: '10px' }}>
                        {getFieldDecorator('replayComments', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入回复内容'
                                }
                            ]
                        })(
                            <TextArea style={{ width: '400px' }} rows={4} placeholder="回复内容" />,
                        )}
                    </Form.Item>
                    <Form.Item style={{
                        textAlign: 'right', display: 'inline-block', marginBottom: '0',
                        width: '100%'
                    }}>
                        <Button type="primary" htmlType="submit" loading={replayBtnLoading}>回复</Button>
                    </Form.Item>
                </Form>
            </div>
        );

        const secContent = <div>
            <Form onSubmit={(e) => this.replaySubmit(e, 'replied')}>
                <Form.Item style={{ textAlign: 'left', marginBottom: '10px' }}>
                    {getFieldDecorator('replayComments', {
                        rules: [
                            {
                                required: true,
                                message: '请输入回复内容'
                            }
                        ]
                    })(
                        <TextArea style={{ width: '400px' }} rows={4} placeholder="回复内容" />,
                    )}
                </Form.Item>
                <Form.Item style={{
                    textAlign: 'right', display: 'inline-block', marginBottom: '0',
                    width: '100%'
                }}>
                    <Button type="primary" htmlType="submit" loading={replayBtnLoading}>回复</Button>
                </Form.Item>
            </Form>
        </div>
        //#endregion

        return <div className="detail-comments">
            <div className="detail-comments-spin"><Icon type="message" theme="twoTone"
                twoToneColor="#52c41a" style={{ marginRight: '10px' }} />
                {commentsNum} 条评论</div>
            {
                comments.length === 0 ? <Empty description="暂无评论，快抢个沙发吧"></Empty> :
                    <Skeleton active loading={commentsLoading}>
                        {
                            comments.map((value, index) => <div key={index} className="detail-comments-item">
                                <div className="detail-comments-title">
                                    {
                                        value.type !== 2 ?
                                            <InfoDetail id={value.userid}>
                                                <img className="detail-comments-img" alt="用户头像"
                                                    src={value.img ? `${COMMON_URL}/file/get/avatar?avatar=${value.img}` :
                                                        `${COMMON_URL}/file/get/avatar`} />
                                                <span className="detail-comments-title-user"
                                                    style={{ cursor: 'pointer' }}>{translateXSSText(value.user)}</span>
                                            </InfoDetail> :
                                            <i className="iconfont detail-comments-icon">&#xe67b;</i>
                                    }
                                    {
                                        value.type === 2 &&
                                        <span className="detail-comments-title-user">{translateXSSText(value.user)}</span>
                                    }
                                    <span className="detail-comments-title-time">{translateDateYMDHM(value.createtime)}</span>
                                    {
                                        this.setTag(value.type)
                                    }
                                    {
                                        userid === value.userid && <Fragment>
                                            <span
                                                className="detail-comments-title-del"
                                                onClick={() => { this.toDel(value.id) }}>
                                                删除</span>
                                            <span className="detail-comments-title-modify"
                                                onClick={
                                                    () => this.modifyComments(value.id, translateXSSText(value.comments))
                                                }>修改</span>
                                        </Fragment>
                                    }
                                    {
                                        isLogin ? <Popover
                                            title={<div>回复:
                                                <span style={{ color: 'blue', marginLeft: '10px' }}>{replayRealName}</span>
                                            </div>}
                                            content={content}
                                            autoAdjustOverflow
                                            arrowPointAtCenter
                                            onVisibleChange={(visible) => this.replayOpen(visible, value)}
                                            trigger="click">
                                            <span className="detail-comments-title-reply">回复</span>
                                        </Popover> :
                                            <span className="detail-comments-title-reply" onClick={() => {
                                                message.warn('只有登录用户才可以回复噢')
                                            }}>回复</span>
                                    }
                                </div>
                                {/* 修改评论 */}
                                {
                                    <div className="detail-comments-form"
                                        style={isModify && modifyId === value.id ? { display: 'block' } : { display: 'none' }}>
                                        <div style={{ margin: '10px 0 20px 0', textAlign: 'left' }}>
                                            <Editor
                                                placeholder="你的评论，支持markdown..."
                                                value={oldComment}
                                                onChange={this.handleChange}
                                                height="300px"
                                                toolbar={{
                                                    h1: true, // h1
                                                    h2: true, // h2
                                                    h3: true, // h3
                                                    h4: true, // h4
                                                    img: true, // 图片
                                                    link: true, // 链接
                                                    code: true, // 代码块
                                                    preview: true, // 预览
                                                    undo: true, // 撤销
                                                    redo: true, // 重做
                                                    subfield: true, // 单双栏模式
                                                }}
                                            />
                                        </div>
                                        <div style={{
                                            textAlign: 'right', display: 'inline-block', marginBottom: '10px',
                                            width: '100%'
                                        }}>
                                            <Button type="primary" onClick={this.handleSubmit} loading={btnLoading}>
                                                修改
                                            </Button>
                                            <Button style={{ marginLeft: '10px' }}
                                                onClick={this.cancelModify}
                                                loading={btnLoading}
                                            >
                                                取消
                                            </Button>
                                        </div>
                                    </div>
                                }
                                <div className="detail-comments-text"
                                    style={isModify && modifyId === value.id ? { display: 'none' } : { display: 'block' }}
                                    dangerouslySetInnerHTML={{ __html: this.getMarkDown(value.comments) }}
                                ></div>
                                {
                                    dataReplay[value.id].length > 0 &&
                                    <div className="detail-comments-replay-mun">
                                        <span>共{dataReplay[value.id].length}条回复</span>
                                    </div>
                                }
                                {
                                    dataReplay[value.id].length > 0 && <div className="detail-comments-replay-wrap">
                                        {
                                            dataReplay[value.id].map((replayValue, replayIndex) =>
                                                <div className="detail-comments-replay" key={replayIndex}>
                                                    <div className="detail-comments-title">
                                                        {
                                                            <InfoDetail id={replayValue.userid}>
                                                                <img className="detail-comments-img" alt="用户头像"
                                                                    src={value.img ?
                                                                        `${COMMON_URL}/file/get/avatar?avatar=${replayValue.img}` :
                                                                        `${COMMON_URL}/file/get/avatar`} />
                                                                <span className="detail-comments-title-user">
                                                                    {translateXSSText(replayValue.user)}
                                                                </span>
                                                            </InfoDetail>
                                                        }
                                                        <span className="detail-comments-title-time">
                                                            {translateDateYMDHM(replayValue.createtime)}
                                                        </span>
                                                        {
                                                            this.setTag(replayValue.type)
                                                        }
                                                        {
                                                            userid === replayValue.userid && <Fragment>
                                                                <span
                                                                    className="detail-comments-title-del"
                                                                    onClick={() => { this.toDel(replayValue.id) }}>
                                                                    删除</span>
                                                            </Fragment>
                                                        }
                                                        {
                                                            isLogin ? <Popover
                                                                title={<div>回复:
                                                                    <span style={{ color: 'blue', marginLeft: '10px' }}>
                                                                        {replayRealName}
                                                                    </span>
                                                                </div>}
                                                                content={secContent}
                                                                autoAdjustOverflow
                                                                arrowPointAtCenter
                                                                onVisibleChange={(visible) =>
                                                                    this.replaySecOpen(visible, value, replayValue)}
                                                                trigger="click">
                                                                <span className="detail-comments-title-reply">回复</span>
                                                            </Popover> :
                                                                <span className="detail-comments-title-reply" onClick={() => {
                                                                    message.warn('只有登录用户才可以回复噢')
                                                                }}>回复</span>
                                                        }
                                                    </div>
                                                    {
                                                        (replayValue.parent === value.id) ?
                                                            <div className="detail-comments-text">
                                                                {translateXSSText(replayValue.comments)}
                                                            </div> :
                                                            <div className="detail-comments-text">
                                                                {translateXSSText(replayValue.comments)}
                                                                {
                                                                    allComments[replayValue.parent] && <Fragment>
                                                                        <div style={{ color: 'blue', margin: '5px 0' }}>
                                                                            回复给：@{allComments[replayValue.parent].user}：
                                                                                </div>
                                                                        {translateXSSText(allComments[replayValue.parent].comments)}
                                                                    </Fragment>
                                                                }
                                                            </div>
                                                    }
                                                </div>)
                                        }
                                    </div>
                                }
                            </div>)
                        }
                    </Skeleton>
            }
        </div>
    }
}

const DetailComments = Form.create()(DetailCommentsForm);

function mapStateToProps(state) {
    let { userid } = state.setUserID
    let { isLogin } = state.setLogin
    return {
        userid,
        isLogin
    }
}

export default connect(mapStateToProps)(withRouter(DetailComments))
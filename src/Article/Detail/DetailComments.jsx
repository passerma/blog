import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getComments, delComments, modifyComments, replayComments } from '../api/api'
import { Skeleton, Empty, Input, Form, Button, Modal, message, Tag, Popover } from 'antd';
import { translateXSSText, translateDateYMDHM } from '../../CommonData/globalFun'
import { COMMON_URL } from '../../CommonData/api'
import InfoDetail from '../../Base/InfoDetail/InfoDetail'

const { TextArea } = Input;
const { confirm } = Modal;

class DetailCommentsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentsLoading: true,
            comments: [],
            isModify: false,
            btnLoading: false,
            replayBtnLoading: false,
            dataReplay: {},
            replayParents: ''
        };
        this.props.onRef(this)
    }
    componentDidMount() {
        let id = this.props.match.params.id
        getComments(id, (res) => {
            let data = res.data
            this._dealComments(data)
            this.setState({
                commentsLoading: false
            })
        })
    }

    //#region 工具函数
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
            allComments,
            commentsLength: data.length
        })
    }
    //#endregion

    //#region 删除修改相关
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
                        message.error(res.ErrMsg)
                    }
                })
            },
            onCancel() { },
        });
    }

    /** 
     * 修改评论
    */
    modifyComments = (id, text) => {
        this.props.form.setFieldsValue({
            modifyComments: text
        })
        this.setState({
            isModify: true,
            modifyId: id
        })
    }

    /** 
     * 提交修改评论
    */
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(['modifyComments'], (err, values) => {
            if (!err) {
                this.setState({
                    btnLoading: true
                })
                modifyComments(this.state.modifyId, values.modifyComments, (res) => {
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
            }
        });
    };

    /** 
     * 取消修改
    */
    cancelModify = () => {
        this.setState({
            isModify: false,
            modifyId: ''
        })
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
                replayToUser: value.id,
                replayParents: value.id
            })
        } else {
            this.props.form.setFieldsValue({
                replayComments: ''
            })
        }
    }

    /** 
     * 二级评论
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

    /** 
     * 提交回复
     */
    replaySubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(['replayComments'], (err, values) => {
            if (!err) {
                this.setState({
                    replayBtnLoading: true
                })
                let comments = values.replayComments
                let data = {
                    comments,
                    touser: this.state.replayToUser,
                    parent: this.state.replayParents,
                }
                replayComments(this.props.match.params.id, data, (res) => {
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
        });
    };
    //#endregion

    render() {
        let { commentsLoading, comments, isModify, modifyId, btnLoading,
            replayRealName, replayBtnLoading, dataReplay, allComments } = this.state
        let { userid, isLogin } = this.props
        const { getFieldDecorator } = this.props.form;
        const content = (
            <div>
                <Form onSubmit={this.replaySubmit}>
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
        return (
            <div className="detail-comments">
                <div className="detail-comments-spin">评论列表</div>
                {
                    comments.length === 0 ? <Empty description="暂无评论，快抢个沙发吧"></Empty> : <Skeleton active loading={commentsLoading}>
                        {
                            comments.map((value, index) => <div key={index} className="detail-comments-item">
                                <div className="detail-comments-title">
                                    {
                                        value.type !== 2 ?
                                            <InfoDetail id={value.userid}>
                                                <img className="detail-comments-img" alt="用户头像"
                                                    src={value.img ? `${COMMON_URL}/file/get/avatar?avatar=${value.img}` :
                                                        `${COMMON_URL}/file/get/avatar`} />
                                            </InfoDetail> :
                                            <i className="iconfont detail-comments-icon">&#xe67b;</i>
                                    }
                                    <span className="detail-comments-title-user">{translateXSSText(value.user)}</span>
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
                                <div className="detail-comments-text">{translateXSSText(value.comments)}</div>
                                {
                                    <Form key={index} className="detail-comments-form" onSubmit={this.handleSubmit}
                                        style={isModify && modifyId === value.id ? { display: 'block' } : { display: 'none' }}>
                                        <Form.Item style={{ textAlign: 'left', marginBottom: '10px' }}>
                                            {getFieldDecorator('modifyComments', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入评论'
                                                    }
                                                ]
                                            })(
                                                <TextArea key={index} rows={4} placeholder="评论" />,
                                            )}
                                        </Form.Item>
                                        <Form.Item style={{
                                            textAlign: 'right', display: 'inline-block', marginBottom: '10px',
                                            width: '100%'
                                        }}>
                                            <Button type="primary" htmlType="submit" loading={btnLoading}>
                                                修改
                                                        </Button>
                                            <Button style={{ marginLeft: '10px' }} onClick={this.cancelModify} loading={btnLoading}>
                                                取消
                                                        </Button>
                                        </Form.Item>
                                    </Form>
                                }
                                {
                                    dataReplay[value.id].length > 0 &&
                                    <div className="detail-comments-replay-mun">
                                        <span>共{dataReplay[value.id].length}条回复</span>
                                    </div>
                                }
                                {
                                    dataReplay[value.id].length > 0 && <div className="detail-comments-replay-wrap">
                                        {
                                            dataReplay[value.id].map((replayValue, replayIndex) => <div className="detail-comments-replay" key={replayIndex}>
                                                <div className="detail-comments-title">
                                                    {
                                                        <InfoDetail id={replayValue.userid}>
                                                            <img className="detail-comments-img" alt="用户头像"
                                                                src={replayValue.img ? `${COMMON_URL}/file/get/avatar?avatar=${replayValue.img}` :
                                                                    `${COMMON_URL}/file/get/avatar`} />
                                                        </InfoDetail>
                                                    }
                                                    <span className="detail-comments-title-user">{translateXSSText(replayValue.user)}</span>
                                                    <span className="detail-comments-title-time">{translateDateYMDHM(replayValue.createtime)}</span>
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
                                                                            <span style={{ color: 'blue', marginLeft: '10px' }}>{replayRealName}</span>
                                                            </div>}
                                                            content={content}
                                                            autoAdjustOverflow
                                                            arrowPointAtCenter
                                                            onVisibleChange={(visible) => this.replaySecOpen(visible, value, replayValue)}
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
                                                        <div className="detail-comments-text">{translateXSSText(replayValue.comments)}</div> :
                                                        <div className="detail-comments-text">
                                                            {translateXSSText(replayValue.comments)}
                                                            {
                                                                allComments[replayValue.parent] && <Fragment>
                                                                    <div style={{ color: 'blue', marginTop: '5px' }}>
                                                                        @{allComments[replayValue.parent].user}：
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
        )
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

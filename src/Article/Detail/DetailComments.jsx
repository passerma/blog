import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './DetailComments.less'
import { getComments, delComments, modifyComments, replayComment, repliedComment } from '../api/api'
import { Skeleton, Empty, Input, Form, Button, Modal, message, Tag, Popover, Icon, Upload } from 'antd';
import { translateXSSText, translateDateYMDHM } from '../../CommonData/globalFun'
import { createFile } from '../../CommonData/imageFun'
import { COMMON_URL } from '../../CommonData/api'
import InfoDetail from '../../Base/InfoDetail/InfoDetail'
import ImageView from '../../Components/ImageView/ImageView'
import _ from 'lodash'

const { TextArea } = Input;
const { confirm } = Modal;

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
            replayToUser: '',
            imageViewVisible: false,
            images: [],
            imagesIndex: 0,
            fileList: [] // 图片数组
        };
        this.props.onRef(this)
        this.formdataArr = []
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
            if (!data[i].touser) {
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
        return translateXSSText(content)
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
    modifyComments = (id, text, images) => {
        const imgArr = images ? images.split('-') : []
        let fileList = []
        for (let i = 0; i < imgArr.length; i++) {
            const element = imgArr[i];
            if (element) {
                fileList.push(`${COMMON_URL}/file/commentImg?img=${element}`)
            }
        }
        this.formdataArr = _.cloneDeep(fileList)
        this.setState({
            isModify: true,
            modifyId: id,
            oldComment: text,
            fileList
        })
    }

    /**
     * 输入框改变
     */
    handleChange = (e) => {
        this.setState({
            oldComment: e.target.value
        })
    }

    /** 
     * 提交修改评论
    */
    handleSubmit = e => {
        e.preventDefault();
        let { oldComment } = this.state
        if (oldComment.trim() !== '') {
            confirm({
                title: '确认修改吗？图片删除后不可恢复噢！',
                okText: '确定',
                cancelText: '取消',
                centered: true,
                onOk: () => {
                    this.setState({
                        btnLoading: true
                    })
                    let formdata = new FormData();
                    if (this.formdataArr.length === 0) {
                        formdata.append('imgData', '')
                        formdata.append('hasImg', '0')
                        formdata.append('comments', oldComment)
                        modifyComments(this.state.modifyId, formdata, (res) => {
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
                        formdata.append('hasImg', '1')
                        let newFile = 0
                        const getFileData = () => {
                            if (typeof this.formdataArr[newFile] === 'string') {
                                createFile(this.formdataArr[newFile], (file) => {
                                    if (file === null) {
                                        message.error('上传图片出错，请重试！')
                                        this.setState({
                                            btnLoading: false
                                        })
                                        return
                                    }
                                    formdata.append('imgData', file)
                                    newFile += 1
                                    if (newFile <= this.formdataArr.length - 1) {
                                        getFileData()
                                    } else {
                                        formdata.append('comments', oldComment)
                                        modifyComments(this.state.modifyId, formdata, (res) => {
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
                                })
                            } else { // 正常file类型
                                formdata.append('imgData', this.formdataArr[newFile])
                                newFile += 1
                                if (newFile <= this.formdataArr.length - 1) {
                                    getFileData()
                                } else {
                                    formdata.append('comments', oldComment)
                                    modifyComments(this.state.modifyId, formdata, (res) => {
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
                            }
                        }
                        getFileData()
                    }
                },
                onCancel() { }
            })
        } else {
            message.info('请输入评论内容！')
        }
    };
    //#endregion

    //#region 界面相关
    /**
     * 生成图片
     */
    _createImgs = (imgs) => {
        const imgArr = imgs ? imgs.split('-') : []
        let imgsDiv = []
        for (let i = 0; i < imgArr.length; i++) {
            const element = imgArr[i];
            if (element) {
                imgsDiv.push(
                    <div className="detail-comments-img-div" key={i}>
                        <img src={`${COMMON_URL}/file/commentImg?img=${element}`} alt=''
                            onClick={() => { this._setImageView(imgArr, i) }} />
                    </div>
                )
            }
        }
        return imgsDiv
    }

    _setImageView = (images, index) => {
        let imagesUrl = []
        for (let i = 0; i < images.length; i++) {
            const element = images[i];
            if (element) {
                imagesUrl.push(`${COMMON_URL}/file/commentImg?img=${element}`)
            }
        }
        if (imagesUrl.length > 0) {
            this.setState({
                images: imagesUrl,
                imagesIndex: index,
                imageViewVisible: true
            })
        }
    }
    //#endregion

    //#region 修改相关
    _beforeUpload = (file) => {
        let { fileList } = this.state
        if (this.formdataArr.length > 8) {
            message.error('仅支持上传8张图片图片！');
        }
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('仅支持jpg，png格式图片！');
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('图片大小不能超过5MB！');
        }
        if (isJpgOrPng && isLt2M && this.formdataArr.length <= 8) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgFile = e.target?.result;
                fileList.push(imgFile)
                this.formdataArr.push(file)
                this.setState({
                    fileList
                })
            };
            reader.readAsDataURL(file);
        }
        return false
    }
    _delImage = (index) => {
        let { fileList } = this.state
        fileList.splice(index, 1)
        this.formdataArr.splice(index, 1)
        this.setState({
            fileList
        })
    }
    //#endregion

    render() {
        let { commentsLoading, comments, dataReplay, allComments, replayBtnLoading, replayRealName,
            isModify, modifyId, btnLoading, commentsNum, oldComment, imageViewVisible, images,
            imagesIndex, fileList } = this.state
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

        return <div className="detail-comments" id="detaiComments">
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
                                                    () => this.modifyComments(value.id, translateXSSText(value.comments), value.commentImg)
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
                                            placement="topRight"
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
                                        <div style={{ margin: '10px 0 s0 0', textAlign: 'left' }}>
                                            <Input.TextArea value={oldComment} rows={3}
                                                onChange={this.handleChange} style={{ marginBottom: '10px' }} />
                                            <Upload beforeUpload={this._beforeUpload} showUploadList={false}>
                                                <Button disabled={fileList.length >= 8}>
                                                    <Icon type="upload" /> 上传图片
                                                </Button>
                                                <span className="detail-addComment-upload-tip">最多上传8张图片，仅支持jpg，png格式图片，大小5MB以内！</span>
                                            </Upload>
                                            {
                                                fileList.length > 0 && <div style={{ textAlign: 'left' }}>
                                                    {
                                                        fileList.map((element, index) =>
                                                            <div className="detail-addComment-img" key={index}>
                                                                <img src={element} alt="" />
                                                                <div className="detail-addComment-img-del" onClick={() => this._delImage(index)} >
                                                                    <Icon type="delete" />
                                                                </div>
                                                            </div>)
                                                    }
                                                </div>
                                            }
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
                                >
                                    {translateXSSText(value.comments)}
                                </div>
                                <div className="detail-comments-img"
                                    style={isModify && modifyId === value.id ? { display: 'none' } : { display: 'block' }}>
                                    {
                                        this._createImgs(value.commentImg)
                                    }
                                </div>
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
                                                                    src={replayValue.img ?
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
                                                                placement="topRight"
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
            <ImageView visible={imageViewVisible} images={images} index={imagesIndex}
                onClose={() => this.setState({ imageViewVisible: false })} />
        </div >
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
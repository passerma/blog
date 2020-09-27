import React, { useState, useEffect } from "react";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { newComment, postCommentImgData } from '../api/api'
import { Button, Input, Icon, Tooltip, Modal, message, Upload } from "antd";
import _ from 'lodash'
import { UploadFile } from 'antd/lib/upload/interface'
import './AddComment.less'

const { confirm } = Modal;
const { TextArea } = Input;

//#region 类型定义文件
//路由参数泛型
interface params {
    id: string
}

// form表单值
interface fromValues {
    user: string
}

// props泛型
interface AddCommentFormProps extends FormComponentProps<fromValues>, RouteComponentProps<params> {
    /**
     * 评论成功
     */
    addCommentsSus: () => void,
    isLogin: boolean,
    userInfo: {
        username: string
    }
}

// 请求的接口
interface getData {
    ErrCode: number,
    ErrMsg: string
}

//#endregion

let formdataArr: (string | Blob)[] = []

const AddCommentForm: React.FC<AddCommentFormProps> = (props) => {
    const { getFieldDecorator } = props.form

    const [value, setvalue] = useState<string>('')
    const [fileList, setfileList] = useState<{ url: any }[]>([])

    /**
     * 提交
     */
    const _handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let id = props.match.params.id
        props.form.validateFields((err, values) => {
            if (!err && value.trim() !== '') {
                let user = values.user
                let formdata = new FormData();
                if (formdataArr.length === 0) {
                    formdata.append('imgData', '')
                    formdata.append('hasImg', '0')
                } else {
                    formdata.append('hasImg', '1')
                    for (let i = 0; i < formdataArr.length; i++) {
                        formdata.append('imgData', formdataArr[i])
                    }
                }
                formdata.append('comments', value)
                formdata.append('user', user)
                if (props.isLogin) {
                    newComment(id, formdata, (res: getData) => {
                        if (res && res.ErrCode === 0) {
                            message.success('评论成功')
                            formdataArr = []
                            setfileList([])
                            setvalue('')
                            props.addCommentsSus()
                        } else {
                            res && message.error(res.ErrMsg)
                        }
                    })
                    return
                }
                confirm({
                    title: `确定以${values.user}评论嘛?`,
                    content: <div>
                        <span style={{ fontSize: '14px' }}>
                            由于您是未登录用户，所以不支持修改和删除以及收到回复通知的功能，您可以选择登录后再评论即可开启这些功能
                        </span>
                    </div>,
                    okText: '确定',
                    cancelText: '取消',
                    centered: true,
                    onOk() {
                        newComment(id, formdata, (res: getData) => {
                            if (res && res.ErrCode === 0) {
                                message.success('评论成功')
                                formdataArr = []
                                setfileList([])
                                setvalue('')
                                props.addCommentsSus()
                                props.form.resetFields()
                            } else {
                                res && message.error(res.ErrMsg)
                            }
                        })
                    },
                    onCancel() {
                        message.info('取消了')
                    },
                });
            } else if (value.trim() === '') {
                message.info('请输入评论内容！')
            }
        });
    }

    /**
     * 上传图片
     */
    const _beforeUpload = (file: UploadFile & Blob) => {
        if (!props.isLogin) {
            message.info('登录用户才可以上传图片噢！')
            return false
        }
        if (formdataArr.length > 8) {
            message.error('仅支持上传8张图片图片！');
        }
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('仅支持jpg，png格式图片！');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB！');
        }
        if (isJpgOrPng && isLt2M && formdataArr.length <= 8) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgFile = e.target?.result;
                let fileListData = _.cloneDeep(fileList)
                fileListData.push({
                    url: imgFile
                })
                formdataArr.push(file)
                setfileList(fileListData)
            };
            reader.readAsDataURL(file);
        }
        return false
    }

    /**
     * 删除图片
     */
    const _delImage = (index: number) => {
        let fileListData = _.cloneDeep(fileList)
        fileListData.splice(index, 1)
        formdataArr.splice(index, 1)
        setfileList(fileListData)
    }

    useEffect(() => {
        formdataArr = []
    }, [])

    return (
        <div className="detail-addComment" id="detailAddComments">
            <div className="detail-addComment-title">发表评论</div>
            <div className="detail-addComment-submit">
                <div className="detail-addComment-editor" style={{ textAlign: 'left' }}>
                    <TextArea rows={3} value={value} onChange={(e) => { setvalue(e.target.value) }} />
                    <Upload beforeUpload={_beforeUpload} showUploadList={false}>
                        <Button disabled={fileList.length >= 8}>
                            <Icon type="upload" /> 上传图片
                        </Button>
                        <span className="detail-addComment-upload-tip">最多上传8张图片，仅支持jpg，png格式图片，大小2MB以内！</span>
                    </Upload>
                </div>
                {
                    fileList.length > 0 && <div style={{ textAlign: 'left' }}>
                        {
                            fileList.map((element, index) =>
                                <div className="detail-addComment-img" key={index}>
                                    <img src={element.url} />
                                    <div className="detail-addComment-img-del" onClick={() => _delImage(index)} >
                                        <Icon type="delete" />
                                    </div>
                                </div>)
                        }
                    </div>
                }
                <Form onSubmit={_handleSubmit} style={{ marginTop: '5px' }}>
                    <span style={{ float: 'left', height: '32px', lineHeight: '40px', marginRight: '10px' }}>用户名:</span>
                    <Form.Item style={{ float: 'left', marginRight: '20px', textAlign: 'left' }}>
                        {getFieldDecorator('user', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名'
                                },
                                {
                                    max: 10,
                                    message: '最大不能超过10个字符'
                                }
                            ],
                            initialValue: props.userInfo.username
                        })(
                            <Input
                                style={{ width: '300px' }}
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                disabled={props.isLogin}
                            />,
                        )}
                        {
                            !props.isLogin && <Tooltip title="登录用户可以拥有修改、删除和回复通知的功能">
                                <Link className="detail-addComment-login-btn" to={{ pathname: '/login' }}>
                                    或者去登录后发表评论
                                </Link>
                            </Tooltip>
                        }
                    </Form.Item>
                    <Form.Item style={{ display: 'inline-block' }}>
                        <Button type="primary" htmlType="submit">
                            评论
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const AddCommentFormRouter = withRouter(AddCommentForm)

const AddComment = Form.create<AddCommentFormProps>()(AddCommentFormRouter);

export default AddComment
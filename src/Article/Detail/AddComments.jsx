import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Editor from 'for-editor'
import { Input, Form, Icon, Button, Modal, message, Tooltip } from 'antd';
import { newComment } from '../api/api'
import './AddComments.less'

const { confirm } = Modal;

class AddCommentsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    /** 
     * 提交评论
    */
    handleSubmit = e => {
        e.preventDefault();
        let that = this;
        let { value } = this.state
        let id = this.props.match.params.id
        this.props.form.validateFields((err, values) => {
            if (!err && value.trim() !== '') {
                let user = values.user
                let data = {
                    comments: value,
                    user,
                }
                if (that.props.isLogin) {
                    newComment(id, data, (res) => {
                        if (res && res.ErrCode === 0) {
                            message.success('评论成功')
                            that.props.addCommentsSus()
                            that.props.form.resetFields()
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
                        newComment(id, data, (res) => {
                            if (res && res.ErrCode === 0) {
                                message.success('评论成功')
                                that.props.addCommentsSus()
                                that.props.form.resetFields()
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
    };

    /**
     * 输入框改变
     */
    handleChange = (value) => {
        this.setState({
            value
        })
    }

    render() {
        let { value } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="detail-addComments" id="detailAddComments">
                <div className="detail-addComments-title">发表评论</div>
                <div className="detail-addComments-submit">
                    <div className="detail-addComments-editor" style={{ textAlign: 'left' }}>
                        <Editor
                            placeholder="你的评论，支持markdown..."
                            value={value}
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
                    <Form onSubmit={this.handleSubmit}>
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
                                initialValue: this.props.userInfo.username
                            })(
                                <Input
                                    style={{ width: '300px' }}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    disabled={this.props.isLogin}
                                />,
                            )}
                            {
                                !this.props.isLogin && <Tooltip title="登录用户可以拥有修改、删除和回复通知的功能">
                                    <Link className="detail-addComments-login-btn" to={{ pathname: '/login' }}>
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
}

const AddComments = Form.create()(AddCommentsForm);

function mapStateToProps(state) {
    let { isLogin } = state.setLogin
    return {
        isLogin,
        userInfo: state.setUserInfo
    }
}

export default connect(mapStateToProps)(withRouter(AddComments));
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Input, Form, Icon, Button, Modal, message, Tooltip } from 'antd';
import { newComments } from '../api/api'
import './AddComments.less'

const { TextArea } = Input;
const { confirm } = Modal;

class AddCommentsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAvatar: false
        };
        this.randomImg = Math.random()
    }

    /** 
     * 提交评论
    */
    handleSubmit = e => {
        e.preventDefault();
        let that = this;
        let id = this.props.match.params.id
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let comments = values.comments
                let user = values.user
                let touser = ''
                let data = {
                    comments,
                    user,
                    touser
                }
                if (that.props.isLogin) {
                    newComments(id, data, (res) => {
                        if (res.ErrCode === 0) {
                            message.success(res.ErrMsg)
                            that.props.addCommentsSus()
                            that.props.form.resetFields()
                        } else {
                            message.error(res.ErrMsg)
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
                        newComments(id, data, (res) => {
                            if (res.ErrCode === 0) {
                                message.success(res.ErrMsg)
                                that.props.addCommentsSus()
                                that.props.form.resetFields()
                            } else {
                                message.error(res.ErrMsg)
                            }
                        })
                    },
                    onCancel() {
                        message.info('取消了')
                    },
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="detail-addComments">
                <div className="detail-addComments-title">发表评论</div>
                <div className="detail-addComments-submit">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item style={{ textAlign: 'left' }}>
                            {getFieldDecorator('comments', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入评论'
                                    }
                                ],
                            })(
                                <TextArea rows={4} placeholder="评论" />,
                            )}
                        </Form.Item>
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
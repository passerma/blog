import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Input, Form, Button, message } from 'antd';
import './CenterSet.less'
import { changePassword } from './api'
import { setLogin, setUserInfoAvatar, setUserInfoName, setUserID, setUserIntroduction } from '../Redux/action';
import { connect } from 'react-redux';

class CenterSetForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordPlace: false
        };
    }

    //#region 密码相关
    passwordFocus = () => {
        this.setState({
            passwordPlace: true,
            loading: false
        })
    }
    passwordBrul = () => {
        this.props.form.resetFields()
        this.setState({
            passwordPlace: false
        })
    }
    handleSubmitPassword = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                let oldPassword = values.oldPassword
                let newPassword = values.newPassword
                let data = {
                    oldPassword,
                    newPassword
                }
                changePassword(data, (res) => {
                    if (res && res.ErrCode === 0) {
                        this.setState({
                            loading: false
                        }, () => {
                            message.success('密码修改成功, 重新登录')
                            this.props.dispatch(setLogin(false))
                            this.props.dispatch(setUserInfoName(''))
                            this.props.dispatch(setUserInfoAvatar(''))
                            this.props.dispatch(setUserIntroduction(''))
                            this.props.dispatch(setUserID(''))
                            this.props.history.push("/login")
                        })
                    } else {
                        res && message.error(res.ErrMsg)
                        this.setState({
                            loading: false
                        })
                    }
                })
            }
        });
    };
    //#endregion

    render() {
        let { getFieldDecorator } = this.props.form
        let { passwordPlace, loading } = this.state
        return (
            <div className="centerSet-main">
                <div className="centerSet-password">
                    <span className="password-title">密码</span>
                    <Form onSubmit={this.handleSubmitPassword}>
                        <Form.Item>
                            {getFieldDecorator('oldPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入当前密码',
                                    },
                                ],
                            })(<Input.Password visibilityToggle={false} placeholder={passwordPlace ? '当前密码' : '********'}
                                onFocus={this.passwordFocus} />)}
                        </Form.Item>
                        {
                            passwordPlace && <Fragment>
                                <Form.Item>
                                    {getFieldDecorator('newPassword', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入新密码!'
                                            },
                                            {
                                                pattern: /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/,
                                                message: '密码至少包含数字和字母!'
                                            },
                                            {
                                                min: 6,
                                                message: '密码长度需在6-20位!'
                                            },
                                            {
                                                max: 20,
                                                message: '密码长度需在6-20位!'
                                            }
                                        ],
                                    })(<Input.Password placeholder={'新密码'}
                                        onFocus={this.PasswordFocus} />)}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('replyPassword', {
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (value === this.props.form.getFieldValue('newPassword')) {
                                                        callback()
                                                    } else {
                                                        callback('两次密码输入不一样!')
                                                    }
                                                }
                                            }
                                        ],
                                    })(<Input.Password placeholder='确认新密码'
                                        onFocus={this.PasswordFocus} />)}
                                </Form.Item>
                                <Form.Item>
                                    <Button loading={loading} type="primary" htmlType="submit">
                                        确定
                                    </Button>
                                    <Button style={{ marginLeft: '10px' }} onClick={this.passwordBrul}>
                                        取消
                                    </Button>
                                    <Button type="link" style={{ marginLeft: '10px' }}>
                                        <Link to={{ pathname: '/forgot', state: { needBack: true } }} >忘记密码</Link>
                                    </Button>
                                </Form.Item>
                            </Fragment>
                        }
                    </Form>
                </div>
            </div>
        );
    }
}
const CenterSet = Form.create({})(CenterSetForm);
export default connect()(withRouter(CenterSet));
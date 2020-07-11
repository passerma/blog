import React, { Fragment } from 'react';
import './Login.less';
import { withRouter, Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox, message, Row, Col, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { COMMON_URL } from '../CommonData/api';
import { setLogin, setUserInfoAvatar, setUserInfoName, setUserID, setUserIntroduction } from '../Redux/action';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blogData: [],
            commentsNum: {},
            showLogin: true,
            loading: false,
            btnText: '获取验证码',
            canRealname: false
        };
        this.codeTime = null
    }

    componentDidMount() {
        if (this.props.location.state) {
            let state = this.props.location.state
            if (state.showLogin) {
                this.setState({
                    showLogin: true
                })
            } else {
                this.setState({
                    showLogin: false
                })
            }
        } else {
            this.setState({
                showLogin: true
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.time)
        this.setState = (state, callback) => {
            return
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        let { showLogin } = this.state;
        if (showLogin) {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.setState({
                        loading: true
                    })
                    let url = `${COMMON_URL}/user/login`
                    let username = values.username
                    let password = values.password
                    let opts = {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                    fetch(url, opts)
                        .then((response) => {
                            this.setState({
                                loading: false
                            })
                            return response.json();
                        })
                        .catch((err) => {
                            message.error(err)
                            this.setState({
                                loading: false
                            })
                        })
                        .then((myJson) => {
                            if (myJson.ErrCode !== 0) {
                                message.error(myJson.ErrMsg)
                                return
                            }
                            message.success(`欢迎回来，${myJson.data.realname}`)
                            this.props.dispatch(setLogin(true))
                            this.props.dispatch(setUserInfoName(myJson.data.realname))
                            this.props.dispatch(setUserInfoAvatar(myJson.data.avatar))
                            this.props.dispatch(setUserID(myJson.data.userid))
                            this.props.dispatch(setUserIntroduction(myJson.data.introduction))
                            this.props.history.push("/center")
                        });
                }
            });
        } else {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    if (!this.state.canRealname) {
                        message.warning('用户名已被使用')
                        return
                    }
                    this.setState({
                        loading: true
                    })
                    let url = `${COMMON_URL}/user/register`
                    let username = values.usernameReg
                    let password = values.passwordReg
                    let realname = values.realnameReg
                    let code = parseInt(values.code)
                    let opts = {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            password,
                            realname,
                            code
                        })
                    }
                    fetch(url, opts)
                        .then((response) => {
                            this.setState({
                                loading: false
                            })
                            return response.json();
                        })
                        .catch((err) => {
                            message.error(err)
                            this.setState({
                                loading: false
                            })
                        })
                        .then((myJson) => {
                            if (myJson.ErrCode !== 0) {
                                message.error(myJson.ErrMsg)
                                return
                            }
                            clearInterval(this.time)
                            this.codeTime = null
                            message.success(`${myJson.data.realname},注册成功，欢迎您！`)
                            this.setState({
                                showLogin: true,
                                btnText: '获取验证码'
                            })
                        });
                }
            });
        }
    };

    /** 
     *获取验证码
    */
    getCode = () => {
        if (this.codeTime !== null) {
            return
        }
        this.props.form.validateFields(['usernameReg'], (err, values) => {
            if (!err) {
                this.codeTime = 60
                let url = `${COMMON_URL}/user/code`
                let username = values.usernameReg
                let opts = {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        username
                    })
                }
                fetch(url, opts)
                    .then((response) => {
                        return response.json();
                    })
                    .catch((err) => {
                        message.error(err)
                        this.codeTime = null
                    })
                    .then((myJson) => {
                        if (myJson.ErrCode !== 0) {
                            message.error(myJson.ErrMsg)
                            this.codeTime = null
                            this.setState({
                                btnText: '获取验证码'
                            })
                            return
                        }
                        this.setState({
                            btnText: this.codeTime
                        })
                        this.time = setInterval(() => {
                            if (this.codeTime === 0) {
                                clearInterval(this.time)
                                this.codeTime = null
                                this.setState({
                                    btnText: '获取验证码'
                                })
                            } else {
                                this.codeTime -= 1;
                                this.setState({
                                    btnText: this.codeTime
                                })
                            }
                        }, 1000)
                        message.success(`验证码已发送，请查收`)
                    });
            }
        });
    }

    /** 
     * 登录注册改变
    */
    change = () => {
        let { showLogin, loading } = this.state
        if (loading) {
            return
        }
        this.setState({
            showLogin: !showLogin
        }, () => {
            if (this.state.showLogin) {
                document.title = '登录'
            } else {
                document.title = '注册'
            }
        })
    }

    /** 
     * 判断用户名是否存在
     */
    getRealname = () => {
        this.props.form.validateFields(['realnameReg'], (err, values) => {
            if (!err) {
                let realnameReg = values.realnameReg
                let url = `${COMMON_URL}/user/realname?realname=${realnameReg}`
                let opts = {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json'
                    },
                }
                fetch(url, opts)
                    .catch((err) => {
                        console.log(err)
                    })
                    .then((response) => {
                        return response.json();
                    })
                    .then((myJson) => {
                        if (myJson.ErrCode !== 0) {
                            this.setState({
                                canRealname: false
                            })
                        } else {
                            this.setState({
                                canRealname: true
                            })
                        }
                    });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { showLogin, loading, btnText, canRealname } = this.state
        return (
            <div className="login">
                {
                    showLogin && <Fragment>
                        <div className="login-register-title">登录到「PASSERMA」博客</div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {
                                    getFieldDecorator('username', {
                                        rules: [{
                                            required: true,
                                            message: '请输入邮箱!'
                                        }],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="邮箱"
                                        />,
                                    )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        message: '请输入密码!'
                                    }],
                                })(
                                    <Input.Password
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                    values: true
                                })(<Checkbox disabled>记住密码</Checkbox>)}
                                <Link className="login-form-forgot" to={{ pathname: '/forgot', state: { needBack: true } }} >忘记密码</Link>
                                <Button type="primary" loading={loading} htmlType="submit" className="login-form-button">登录</Button>
                                <span onClick={this.change} className="login-register" href=''>没有账号，去注册</span>
                            </Form.Item>
                        </Form>
                    </Fragment>
                }
                {/* 注册 */}
                {
                    !showLogin && <Fragment>
                        <div className="login-register-title">欢迎您注册「PASSERMA」博客</div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item className="login-form-realname">
                                {
                                    getFieldDecorator('realnameReg', {
                                        rules: [{
                                            required: true,
                                            message: '请输入用户名!'
                                        },
                                        {
                                            max: 10,
                                            message: '最大不能超过10个字符!'
                                        },
                                        {
                                            pattern: /^((?!^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$).)*$/,
                                            message: '用户名不能是邮箱!'
                                        }],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="用户名"
                                            onBlur={this.getRealname}
                                            addonAfter={canRealname ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                                                : <Icon title="用户名已被使用" type="close-circle" theme="twoTone" twoToneColor="red" />}
                                        />,
                                    )}
                                {
                                }
                            </Form.Item>
                            <span className="login-from-realname-tip">
                                <Tooltip title="用户名设置后无法修改噢">
                                    <Icon type="warning" theme="twoTone" />
                                </Tooltip>
                            </span>
                            <Form.Item>
                                {
                                    getFieldDecorator('usernameReg', {
                                        rules: [{
                                            required: true,
                                            message: '请输入邮箱!'
                                        },
                                        {
                                            pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                                            message: '请输入正确的邮箱!'
                                        }],
                                    })(
                                        <Input
                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="邮箱"
                                        />,
                                    )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('passwordReg', {
                                    rules: [{
                                        required: true,
                                        message: '请输入密码!'
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
                                    }],
                                })(
                                    <Input.Password
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                        visibilityToggle
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('passwordRegCom', {
                                    rules: [{
                                        validator: (rule, value, callback) => {
                                            if (value === this.props.form.getFieldValue('passwordReg')) {
                                                callback()
                                            } else {
                                                callback('两次密码输入不一样!')
                                            }
                                        }
                                    }],
                                })(
                                    <Input.Password
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="再次输入密码"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Row>
                                    <Col span={12}>
                                        {getFieldDecorator('code', {
                                            rules: [{
                                                required: true,
                                                message: '请输入验证码!'
                                            }],
                                        })(<Input
                                            prefix={<Icon type="safety" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="验证码"
                                        />)}
                                    </Col>
                                    <Col span={12}>
                                        <Button disabled={this.codeTime === null ? false : true} onClick={this.getCode}>{btnText}</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button loading={loading}
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button">注册</Button>
                                <span onClick={this.change} className="login-register">已有账号，去登录</span>
                            </Form.Item>
                        </Form>
                    </Fragment>
                }
            </div>
        );
    }
}

const Login = Form.create({})(LoginForm);

export default connect()(withRouter(Login));
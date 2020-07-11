import React, { Fragment } from 'react';
import './Register.less';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button, message, Row, Col, Tooltip, Card } from 'antd';
import { connect } from 'react-redux';
import { COMMON_URL } from '../CommonData/api';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blogData: [],
            commentsNum: {},
            loading: false,
            btnText: '获取验证码',
            canRealname: false,
            successRe: false,
        };
        this.codeTime = null
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        clearInterval(this.time)
        this.setState = (state, callback) => {
            return
        }
    }
    handleSubmit = e => {
        e.preventDefault();
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
                    .catch((err) => {
                        console.error(err)
                        this.setState({
                            loading: false
                        })
                    })
                    .then((response) => {
                        this.setState({
                            loading: false
                        })
                        return response.json();
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
                            successRe: true,
                            btnText: '获取验证码'
                        })
                    });
            }
        });

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
                    .catch((err) => {
                        console.error(err)
                        this.codeTime = null
                    })
                    .then((response) => {
                        return response.json();
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
        const { loading, btnText, canRealname, successRe } = this.state
        return (
            <div className="login-regi">
                {
                    successRe ? <Fragment>
                        <Card className="regi-suss" title="注册成功" bordered={false} style={{ width: 300 }}>
                            <p><a href="https://www.passerma.com/center">前往个人中心</a></p>
                            <p><a href="https://www.passerma.com">前往PASSERMA博客</a></p>
                            <p><a href="https://go.passerma.com">前往PM极简导航</a></p>
                            <Button type="primary" onClick={() => {
                                window.opener = null;
                                window.open('', '_self');
                                window.close()
                            }}>关闭当前页</Button>
                        </Card>
                    </Fragment> : <Fragment>
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
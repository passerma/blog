import React from 'react';
import { connect } from 'react-redux';
import './CenterInfo.less';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { translateXSSText } from '../CommonData/globalFun'
import { setUserIntroduction } from '../Redux/action';
import { postLoginInfo, getAllInfo } from './api'

const { TextArea } = Input;

class CenterInfoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        getAllInfo((res) => {
            if (!res) {
                this.setState({
                    loadAll: false
                })
            }
            if (res.ErrCode === 0) {
                this.props.form.setFieldsValue({
                    qq: res.data.qq,
                    showqq: res.data.showqq ? true : false,
                    blog: res.data.blog,
                    showblog: res.data.showblog ? true : false
                })
                this.setState({
                    loadAll: false
                })
            } else {
                message.error(res.ErrMsg)
                this.setState({
                    loadAll: false
                })
            }
        })
    }

    /** 
     * 提交更新
    */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                let body = {
                    introduction: values.userInfo,
                    qq: values.qq,
                    showqq: values.showqq ? 1 : 0,
                    blog: values.blog,
                    showblog: values.showblog ? 1 : 0

                }
                postLoginInfo(body, (res) => {
                    if (!res) {
                        this.setState({
                            loading: false
                        })
                        return
                    }
                    if (res.ErrCode === 0) {
                        message.success('修改成功')
                        this.props.dispatch(setUserIntroduction(values.userInfo))
                        this.setState({
                            loading: false
                        })
                    } else {
                        message.error(res.ErrMsg)
                        this.setState({
                            loading: false
                        })
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { introduction } = this.props.userInfo
        let { loading } = this.state
        return (
            <div className="centerInfo-main">
                <Form onSubmit={this.handleSubmit} className="locenterInfo-form">
                    <div className="form-title">用户名</div>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true,
                                message: '请输入用户名'
                            }],
                            initialValue: this.props.userInfo.username
                        })(
                            <Input
                                placeholder="用户名"
                                disabled
                            />,
                        )}
                    </Form.Item>
                    <div className="form-title">个人简介</div>
                    <Form.Item>
                        {getFieldDecorator('userInfo', {
                            initialValue: translateXSSText(introduction)
                        })(
                            <TextArea
                                placeholder="该用户什么都没留下"
                            />,
                        )}
                    </Form.Item>
                    <div className="form-title">QQ</div>
                    <Form.Item className="from-inline from-input">
                        {getFieldDecorator('qq', {
                            rules: [
                                {
                                    pattern: /[1-9][0-9]{4,}/,
                                    message: '请输入正确的QQ号'
                                }],
                        })(
                            <Input
                                placeholder="QQ"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className="from-inline from-checked">
                        {getFieldDecorator('showqq', {
                            valuePropName: 'checked',
                            initialValue: false,
                        })(
                            <Checkbox>在主页展示</Checkbox>,
                        )}
                    </Form.Item>
                    <div className="form-title">个人博客</div>
                    <Form.Item className="from-inline from-input">
                        {getFieldDecorator('blog', {
                            rules: [
                                {
                                    pattern: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/,
                                    message: '请输入正确的网址'
                                }],
                        })(
                            <Input
                                placeholder="个人博客"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item className="from-inline from-checked">
                        {getFieldDecorator('showblog', {
                            valuePropName: 'checked',
                            initialValue: false,
                        })(
                            <Checkbox>在主页展示</Checkbox>,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="login-form-button">更新</Button>
                    </Form.Item>
                </Form>
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        userInfo: state.setUserInfo
    }
}

const CenterInfo = Form.create({})(CenterInfoForm);

export default connect(mapStateToProps)(CenterInfo);
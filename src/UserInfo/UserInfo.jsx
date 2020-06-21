import React, { Fragment } from 'react';
import { Card, message, Spin, Empty, Divider } from 'antd';
import { COMMON_URL } from '../CommonData/api'
import { translateXSSText, addLinkHttps } from '../CommonData/globalFun'
import './UserInfo.less'
import { withRouter } from 'react-router';
import { getInfoData } from './api'

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {
                name: '加载中...',
                blog: '加载中...',
                avatar: '加载中...',
                introduction: '加载中...',
                qq: '加载中...'
            },
            loading: true,
            hasUser: true
        };
    }

    componentDidMount() {
        let id = this.props.match.params.id
        getInfoData(id, (res) => {
            if (res && res.ErrCode === 0) {
                document.title = `${res.data.name}的主页`
                this.setState({
                    info: {
                        ...res.data
                    },
                    loading: false
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    loading: false,
                    hasUser: false
                })
            }

        })
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        let { info, loading, hasUser } = this.state
        return (
            <div className="UserInfo">
                {
                    (hasUser && !loading) && <Divider>{info.name} 的主页</Divider>
                }
                <div className="UserInfo-main">
                    {
                        !hasUser ? <Empty style={{ paddingTop: '100px' }} description="用户不存在!" /> : <Fragment>
                            <div className="UserInfo-card">
                                <Spin spinning={loading} tip="加载用户资料中...">
                                    <Card
                                        className="UserInfo-card-main"
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={
                                            <div className="UserInfo-card-img">
                                                <img alt="头像" src={
                                                    info.avatar ? `${COMMON_URL}/file/get/avatar?avatar=${info.avatar}` :
                                                        `${COMMON_URL}/file/get/avatar`} />
                                            </div>
                                        }
                                    >
                                        <div className="UserInfo-card-box">
                                            <h2 className="UserInfo-card-name">{info.name}</h2>
                                            <div className="UserInfo-card-descrip">
                                                {info.introduction !== '' ? translateXSSText(info.introduction) : '该用户什么都没留下'}
                                            </div>
                                        </div>
                                    </Card>
                                </Spin>
                            </div>
                            <div className="UserInfo-card">
                                <div className="userInfo-all-box">
                                    <div className="userInfo-all-title">基本信息</div>
                                    <div className="userInfo-all-main">
                                        <div className="userInfo-all-item">
                                            <span className="userInfo-all-name">用户名：</span>
                                            <span className="userInfo-all-text">{info.name}</span>
                                        </div>
                                        <div className="userInfo-all-item">
                                            <span className="userInfo-all-name">个人博客：</span>
                                            <span className="userInfo-all-text">
                                                {info.blog !== '' ? <a href={addLinkHttps(info.blog)}
                                                    rel="noopener noreferrer" target="_blank">{info.blog}</a> :
                                                    '该项被用户隐藏起来了'}
                                            </span>
                                        </div>
                                        <div className="userInfo-all-item">
                                            <span className="userInfo-all-name">个人简介：</span>
                                            <span className="userInfo-all-text">
                                                {info.introduction !== '' ? translateXSSText(info.introduction) : '该用户什么都没留下'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="userInfo-all-box">
                                    <div className="userInfo-all-title">联系信息</div>
                                    <div className="userInfo-all-main">
                                        <div className="userInfo-all-item">
                                            <span className="userInfo-all-name">QQ：</span>
                                            <span className="userInfo-all-text">
                                                {info.qq !== '' ? info.qq : '该项被用户隐藏起来了'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default (withRouter(UserInfo))
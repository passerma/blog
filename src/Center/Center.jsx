import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, message, Card, Tabs, Icon, Divider } from 'antd';
import './Center.less';
import { COMMON_URL } from '../CommonData/api'
import { translateXSSText } from '../CommonData/globalFun'
import { setLogin, setUserInfoAvatar, setUserInfoName, setUserID, setUserIntroduction } from '../Redux/action';
import AvatarImg from './AvatarImg'
import CenterView from './CenterView'
import CenterInfo from './CenterInfo'
import CenterSet from './CenterSet'
import { clearKeepLoginTimer } from '../CommonData/keepLogin';

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1692441_hiyv2tk0c8h.js', // 在 iconfont.cn 上生成
});

const { TabPane } = Tabs;

class Center extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAvatar: false
        };
    }

    loginOut = () => {
        let url = `${COMMON_URL}/user/loginout`
        let opts = {
            method: 'PUT',
            credentials: 'include',
        }
        fetch(url, opts)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                if (myJson.ErrCode !== 0) {
                    message.error(myJson.ErrMsg)
                    return
                }
                message.success(myJson.ErrMsg)
                sessionStorage.removeItem("Authorization")
                clearKeepLoginTimer()
                this.props.dispatch(setLogin(false))
                this.props.dispatch(setUserInfoName(''))
                this.props.dispatch(setUserInfoAvatar(''))
                this.props.dispatch(setUserIntroduction(''))
                this.props.dispatch(setUserID(''))
                this.props.history.push("/login")
            });
    }

    showAvatarModel = () => {
        this.setState({
            showAvatar: true
        })
    }

    onAvatarCancel = () => {
        this.setState({
            showAvatar: false
        })
    }

    onAvatarOk = (avatar) => {
        this.props.dispatch(setUserInfoAvatar(avatar))
        this.setState({
            showAvatar: false
        })
    }

    render() {
        const { username, userInfo, userid } = this.props
        let { avatar, introduction } = userInfo
        let { showAvatar } = this.state
        return (
            <div className="center">
                <div className="center-card-main">
                    <Card
                        className="center-card-main"
                        hoverable
                        style={{ width: 240 }}
                        cover={
                            <div className="center-card-img">
                                <img alt="头像" src={
                                    avatar ? `${COMMON_URL}/file/get/avatar?avatar=${avatar}` :
                                        `${COMMON_URL}/file/get/avatar`} />
                                <div className="center-card-hover" onClick={this.showAvatarModel}>更换头像</div>
                            </div>
                        }
                    >
                        <div className="center-card-box">
                            <h2 className="center-card-name">{username}</h2>
                            <div className="center-card-descrip">{introduction ? translateXSSText(introduction) : '该用户什么都没留下'}</div>
                            <Button className="center-btn" onClick={this.loginOut} type="danger">退出登录</Button>
                        </div>
                    </Card>
                    <Divider style={{ margin: '10px 0' }}>点击前往</Divider>
                    <div className='center-card-link'>
                        <Button>
                            <Link to="/message">消息中心</Link>
                        </Button>
                        <div style={{ height: '10px' }}></div>
                        <Button>
                            <Link to={`/info/${userid}`}>自己主页</Link>
                        </Button>
                    </div>
                </div>
                <Tabs defaultActiveKey="1" className="center-tabs-main">
                    <TabPane tab={
                        <span style={{ fontSize: '16px' }}><MyIcon type="icon-xiangmugailan" />个人概览</span>
                    } key="1">
                        <CenterView userInfo={userInfo} />
                    </TabPane>
                    <TabPane tab={
                        <span style={{ fontSize: '16px' }}><MyIcon type="icon-gerenxinxi" />个人信息</span>
                    } key="2">
                        <CenterInfo />
                    </TabPane>
                    <TabPane tab={
                        <span style={{ fontSize: '16px' }}><MyIcon type="icon-gerenshezhi" />个人设置</span>
                    } key="3">
                        <CenterSet />
                    </TabPane>
                </Tabs>
                <AvatarImg onCancel={this.onAvatarCancel} onOk={this.onAvatarOk} needShow={showAvatar} avatar={avatar}></AvatarImg>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { username } = state.setUserInfo
    let { userid } = state.setUserID
    return {
        username,
        userInfo: state.setUserInfo,
        userid
    }
}

export default connect(mapStateToProps)(withRouter(Center));
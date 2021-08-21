import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import { connect } from 'react-redux';
import Routers from './routerMap';
import Navbar from '../Components/Navbar/Navbar';
import { setLogin, setUserInfoName, setUserInfoAvatar, setUserID, setUserIntroduction } from '../Redux/action';
import PrivateRoute from './PrivateRoute'
import { COMMON_URL } from '../CommonData/api'
import Footer from '../Components/Footer/Footer'
// import MusicPlay from '../Components/MusicPlay/MusicPlay'
import MusicPlay from '../Components/MusicPlay/MusicPlayNew'
import LightDark from '../Components/LightDark/LightDark'
import Ribbon from '../Components/Ribbon/Ribbon'
import { Modal } from 'antd';
import imgURL from '../imgs/passerma-wechat.png';
import { createKeepLoginTimer } from '../CommonData/keepLogin';

class router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        let url = `${COMMON_URL}/user/islogin`
        let opts = {
            method: "GET",
            credentials: 'include'
        }
        fetch(url, opts)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                if (myJson.ErrCode !== 0) {
                    return
                }
                sessionStorage.setItem("Authorization", myJson.data.Authorization)
                createKeepLoginTimer()
                // 已登录
                this.props.dispatch(setLogin(true))
                this.props.dispatch(setUserInfoName(myJson.data.realname))
                this.props.dispatch(setUserInfoAvatar(myJson.data.avatar))
                this.props.dispatch(setUserID(myJson.data.userid))
                this.props.dispatch(setUserIntroduction(myJson.data.introduction))
            })
        if (!(this.os().isPc)) {
            // message.info('由于本站未适配移动端，推荐PC端访问')
            Modal.info({
                title: '由于本站未适配移动端，推荐PC端访问，或者前往passerma微信小程序版',
                icon: null,
                maskClosable: true,
                okText: '确定',
                content: (
                    <div>
                        <img style={{ width: '100%', marginTop: '16px' }} src={imgURL} alt="微信搜索passerma" />
                    </div>
                ),
                onOk() { },
            });
        }
    }
    os = () => {
        let ua = navigator.userAgent,
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid: isAndroid,
            isPc: isPc
        };
    }
    render() {
        return (
            <Router>
                <Ribbon />
                <Navbar />
                <Switch>
                    {
                        Routers.map((item, index) => {
                            if (item.login) {
                                return <PrivateRoute
                                    key={index}
                                    login={item.login}
                                    path={item.path}
                                    exact={item.exact}
                                    component={item.component}
                                    none={item.none}
                                    needLogin={item.needLogin}
                                ></PrivateRoute>
                            } else {
                                return <Route
                                    key={index}
                                    path={item.path}
                                    exact={item.exact}
                                    render={() => <item.component />}
                                />
                            }
                        })
                    }
                    <Redirect from="*" to="/" />
                </Switch>
                <MusicPlay />
                <LightDark />
                <Footer></Footer>
            </Router>
        )
    }
}

export default connect()(router);

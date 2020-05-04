import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Navbar.less';
import tittlePng from '../../imgs/passerma.png';
import { connect } from 'react-redux';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        if (this.props.location.pathname === '/') {
            this._updateTitle('PASSERMA', '100%')
        } else if (this.props.location.pathname === '/plugins') {
            this._updateTitle('插件中心', '200%')
        } else if (this.props.location.pathname === '/article' || this.props.location.pathname.indexOf('/article') !== -1) {
            this._updateTitle('文章', '200%')
        } else if (this.props.location.pathname === '/login') {
            this._updateTitle('登录', '300%')
        } else if (this.props.location.pathname === '/center') {
            this._updateTitle('个人中心', '300%')
        } else if (this.props.location.pathname === '/register') {
            this._updateTitle('注册', '300%')
        } else if (this.props.location.pathname === '/forgot') {
            this._updateTitle('找回密码', '300%')
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname === '/') {
            this._updateTitle('PASSERMA', '100%')
        } else if (nextProps.location.pathname === '/plugins') {
            this._updateTitle('插件中心', '200%')
        } else if (nextProps.location.pathname === '/article' || nextProps.location.pathname.indexOf('/article') !== -1) {
            this._updateTitle('文章', '200%')
        } else if (nextProps.location.pathname === '/login') {
            this._updateTitle('登录', '300%')
        } else if (nextProps.location.pathname === '/center') {
            this._updateTitle('个人中心', '300%')
        } else if (nextProps.location.pathname === '/register') {
            this._updateTitle('注册', '300%')
        } else if (nextProps.location.pathname === '/forgot') {
            this._updateTitle('找回密码', '300%')
        }
    }

    /** 
     * 更新当前显示的导航
     * @param {String} title 导航标题
     * @param {String} num 导航位移
    */
    _updateTitle = (title, num) => {
        this.refs.nowTitle.style.transform = `translateX(${num})`;
        document.title = title
    }

    render() {
        const { isLogin, username } = this.props
        return (
            <div className="nav-bar">
                <div className="nav-bar-item">
                    <img alt="passerma" src={tittlePng}></img>
                    <div className="nowIcon" ref="nowTitle"></div>
                </div>
                <div className="nav-bar-item">
                    <Link className="link" to="/">
                        <i className="iconfont">&#xe603;</i>
                        <i className="web-font">首页</i>
                    </Link>
                </div>
                {/* <div className="nav-bar-item">
                    <Link className="link" to="/plugins">
                        <i className="iconfont">&#xe646;</i>
                        <i className="web-font">插件中心</i>
                    </Link>
                </div> */}
                <div className="nav-bar-item">
                    <Link className="link" to="/article">
                        <i className="iconfont">&#xe602;</i>
                        <i className="web-font">文章</i>
                    </Link>
                </div>
                {
                    isLogin ? <div className="nav-bar-item">
                        <Link className="link link-login" to="/center">
                            <i className="iconfont">&#xe6e0;</i>
                            <span className="name-font">{username}</span>
                        </Link>
                    </div> : <div className="nav-bar-item">
                            <Link className="link link-login" to={{ pathname: '/login', state: { showLogin: true } }}>
                                <i className="iconfont">&#xe6e0;</i>
                                <i className="web-font">登录</i>
                            </Link>
                            <Link className="link link-login" to={{ pathname: '/login', state: { showLogin: false } }}>
                                <i className="iconfont">&#xe63f;</i>
                                <i className="web-font">注册</i>
                            </Link>
                        </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { isLogin } = state.setLogin
    let { username } = state.setUserInfo
    return {
        isLogin,
        username
    }
}

export default connect(mapStateToProps)(withRouter(Navbar));
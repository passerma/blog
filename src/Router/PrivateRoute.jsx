import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }

    componentDidMount() {
        let { isLogin } = this.props
        this.nextRoute(isLogin)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        let { isLogin } = nextProps
        this.nextRoute(isLogin)
    }

    nextRoute = (isLogin) => {
        let { needLogin } = this.props
        if (needLogin) {
            // 未登录
            if (!isLogin) {
                this.props.history.push(this.props.none)
                return
            }
            // 已登录
            this.setState({
                isShow: true
            })
        } else {
            // 不需要登录的已登录跳转
            // 未登录
            if (!isLogin) {
                this.setState({
                    isShow: true
                })
                return
            }
            // 已登录
            this.props.history.push(this.props.none)
        }
    }


    render() {
        let { component: Component, ...rest } = this.props
        return (
            this.state.isShow && <Route {...rest} render={() => <Component />} />
        )
    }
}

function mapStateToProps(state) {
    let { isLogin } = state.setLogin
    return {
        isLogin,
    }
}

export default connect(mapStateToProps)(withRouter(PrivateRoute));
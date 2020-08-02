import React from 'react';
import './Footer.less'
import { withRouter } from 'react-router-dom';
import imgURL from '../../imgs/passerma-wechat.png';
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFollow: false
        };
    }
    componentDidMount() {
        if (this.props.location.pathname === '/') {
            this.setState({
                showFollow: true
            })
        } else {
            this.setState({
                showFollow: false
            })
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname === '/') {
            this.setState({
                showFollow: true
            })
        } else {
            this.setState({
                showFollow: false
            })
        }
    }
    render() {
        let { showFollow } = this.state
        return (
            <div className="footer" style={showFollow ? { display: 'block' } : { display: 'none' }}>
                <div className="follow-me">
                    <a href="https://github.com/passerma" rel="noopener noreferrer" target="_blank">
                        <i className="web-font">GitHub: passerma</i>
                    </a>
                    <a href="https://weibo.com/u/5283669622" rel="noopener noreferrer" target="_blank">
                        <i className="web-font">微博: passerma</i>
                    </a>
                    <a href="mailto:passerma@passerma.com">
                        <i className="web-font">Mail Me: passerma@passerma.com</i>
                    </a>
                    <span className="wechat">
                        <i className="web-font">微信小程序</i>
                        <div className="wechat-div ">
                            <img style={{ width: '100%', marginTop: '16px' }} src={imgURL} alt="微信搜索passerma" />
                        </div>
                    </span>
                </div><div className="copyright">
                    <a href="https://www.passerma.com">&copy;&nbsp;PASSERMA</a>
                    <a href="http://www.beian.miit.gov.cn" rel="noopener noreferrer" target="_blank">浙ICP备18045684号-2</a>
                    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011802001747"
                        rel="noopener noreferrer" target="_blank">浙公网安备33011802001747号</a>
                    <a href="http://x.xiniubaba.com/x.php/OTVaR1/8112"
                        rel="noopener noreferrer" target="_blank">隐私政策</a>
                </div>
            </div>
        )
    }
}

export default withRouter(Footer);
import React from 'react';
import './Footer.less'
import { withRouter } from 'react-router-dom';
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
            <div className={showFollow ? 'footer' : 'footerMin'}>
                <div className="follow-me">
                    <a href="https://github.com/passerma" rel="noopener noreferrer" target="_blank">
                        <i className="web-font">GitHub: passerma</i>
                    </a>
                    <a href="https://weibo.com/u/5283669622" rel="noopener noreferrer" target="_blank">
                        <i className="web-font">微博: passerma</i>
                    </a>
                    <a href="mailto:pureazoth@gmail.com">
                        <i className="web-font">Mail Me: pureazoth@gmail.com</i>
                    </a>
                </div>
                <div className="copyright">
                    <a href="https://www.passerma.com">&copy;&nbsp;PASSERMA</a>
                    <a href="http://www.beian.miit.gov.cn" rel="noopener noreferrer" target="_blank">浙ICP备 18045684号-2</a>
                    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011802001747"
                        rel="noopener noreferrer" target="_blank">浙公网安备 33011802001747号</a>
                </div>
            </div>
        )
    }
}

export default withRouter(Footer);
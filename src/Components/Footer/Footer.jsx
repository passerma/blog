import React from 'react';
import './Footer.less'
import { withRouter } from 'react-router-dom';
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div className="footerMin">
                <div className="follow-me">
                    <a href="https://github.com/passerma" rel="noopener noreferrer" target="_blank">
                        <i className="web-font">GitHub: passerma</i>
                    </a>
                    <a href="https://weibo.com/u/5283669622" rel="noopener noreferrer" target="_blank">
                        <i className="web-font">微博: passerma</i>
                    </a>
                    <a href="mailto:admin@passerma.com">
                        <i className="web-font">Mail Me: admin@passerma.com</i>
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
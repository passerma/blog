import React from 'react';
import ViewComments from './ViewComments'
import { Icon } from 'antd';

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1838438_ekxy8b5kewf.js', // 在 iconfont.cn 上生成
});

export default class CenterView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { userInfo } = this.props
        return (
            <div className="centerView-main">
                <ViewComments MyIcon={MyIcon} userInfo={userInfo} />
            </div >
        );
    }
}
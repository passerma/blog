import React from 'react';
import ViewComments from './ViewComments'
import ViewLike from './ViewLike'
import { Icon } from 'antd';
import './CenterView.less'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1838438_nxg5sm52g3i.js', // 在 iconfont.cn 上生成
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
                <ViewLike MyIcon={MyIcon} userInfo={userInfo} />
            </div >
        );
    }
}
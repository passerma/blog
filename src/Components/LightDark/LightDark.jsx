import React from 'react';
import './LightDark.less'
import { Icon } from 'antd'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1797898_430q8swg1yu.js', // 在 iconfont.cn 上生成
});

export default class LightDark extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLight: true
        };
    }
    handelChange = () => {
        let { isLight } = this.state;
        if (isLight) {
            document.querySelector('html').classList.add("html-dark")
        } else {
            document.querySelector('html').classList.remove("html-dark")
        }
        this.setState({
            isLight: !isLight
        })
    }
    render() {
        let { isLight } = this.state
        return <div onClick={this.handelChange} className="lightDark">
            {
                isLight ? <MyIcon type="icon-baitianmoshi" /> : <MyIcon type="icon-yejianmoshi" />
            }
        </div>
    }
}
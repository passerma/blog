import React from 'react';
import './NavBarPop.less';
import { message, Tag, Tooltip, Icon, Button } from 'antd';
import { getClock, setClockTime } from '../api'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1813547_k63lwq1inc.js', // 在 iconfont.cn 上生成
});

export default class CenterView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clockDay: 0,
            isclock: false
        };
        this.clockLoad = true
    }

    componentDidMount() {
        getClock((res) => {
            this.clockLoad = false
            if (res && res.ErrCode === 0) {
                this.setState({
                    clockDay: res.data.clockday,
                    isclock: res.data.isclock
                })
            } else {
                res && message.error(res.error)
                this.setState({
                    clockDay: 0,
                    isclock: false
                })
            }
        })
    }

    setClock = () => {
        if (this.clockLoad) {
            return
        }
        this.clockLoad = true
        let { clockDay } = this.state
        setClockTime(res => {
            this.clockLoad = false
            if (res && res.ErrCode === 0) {
                message.success('签到成功，连续签到15天有小奖励噢')
                this.setState({
                    clockDay: clockDay + 1,
                    isclock: true
                })
            } else {
                res && message.error(res.error)
            }
        })
    }

    render() {
        let { clockDay, isclock } = this.state
        return (
            <div className="nav-bar-pop-main">
                {
                    isclock ?
                        <div className="nav-bar-pop-item-dk" style={{ cursor: 'default' }}>
                            <span className="nav-bar-pop-item-dk-span"><Tag color="green">今日已签到</Tag></span>
                            <span className="nav-bar-pop-item-dk-span"> 连签<Tag color="#2db7f5">{clockDay}</Tag>天</span>
                        </div> :
                        <div className="nav-bar-pop-item-dk">
                            <span className="nav-bar-pop-item-dk-span"> <Tag color="gold">今日未签到</Tag></span>
                            <Button type="primary" onClick={this.setClock}>签到</Button>
                        </div>
                }
            </div>
        );
    }
}
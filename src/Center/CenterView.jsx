import React from 'react';
import './CenterView.less';
import { message, Tag, Tooltip, Icon } from 'antd';
import { getClock, setClockTime } from './api'
import { getTimeDay } from '../CommonData/globalFun'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1692441_7jlwg8r6rjq.js', // 在 iconfont.cn 上生成
});

export default class CenterView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekDay: '',
            clockDay: 0,
            isclock: false,
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
        let weekDay = getTimeDay(new Date())
        this.setState({
            weekDay
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
                message.success('打卡成功，连续打卡15天有小奖励噢')
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
        let { weekDay, clockDay, isclock } = this.state
        return (
            <div className="centerView-main">
                <div className="centerView-item-dk">
                    <span className="centerView-item-dk-span"> 已连续打卡<Tag color="#2db7f5">{clockDay}</Tag>天</span>
                    <div className="centerView-item-dk-box">
                        <span>{weekDay}</span>
                        {
                            isclock ? <MyIcon style={{ 'cursor': 'default' }} type="icon-yidaka-yinzhang" /> :
                                <Tooltip placement="right" title="点击打卡">
                                    <MyIcon onClick={this.setClock} style={{ 'color': 'red' }} type="icon-weidaka" />
                                </Tooltip>
                        }

                    </div>
                </div>
            </div >
        );
    }
}
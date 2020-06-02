import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './NavBarPop.less';
import { message, Icon, Tag, Button, Badge, notification } from 'antd';
import { getClock, setClockTime, getUnreadNumData } from '../api'
import { setUserMessageNum } from '../../Redux/action'
import { connect } from 'react-redux';
const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1857186_zd2aotx1ht.js', // 在 iconfont.cn 上生成
});

class NavBarPop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.getUnreadNum()
    }

    //#region 签到
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
    //#endregion

    //#region 消息
    /** 
     * 获取未读数量
    */
    getUnreadNum = () => {
        let that = this
        getUnreadNumData(res => {
            if (res && res.ErrCode === 0) {
                if (res.data.num > 0) {
                    notification.open({
                        message: '消息提醒',
                        placement: 'bottomRight',
                        style: {
                            cursor: 'pointer'
                        },
                        description:
                            `您收到了 ${res.data.num} 条消息，可以前往个人中心-消息中心查看，或者点击前往查看`,
                        onClick: () => {
                            that.props.history.push('/message')
                        },
                    });
                }
                this.props.dispatch(setUserMessageNum(res.data.num))
            } else {
                res && message.error(res.ErrMsg)
            }
        })
    }
    //#endregion

    render() {
        let { clockDay, isclock } = this.state
        let { messageNum } = this.props
        return (
            <div className="nav-bar-pop-main">
                <div className="nav-bar-pop-item-message">
                    <Link className="message-link" to="/message">
                        <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                            <MyIcon type="icon-xiaoxi" />
                        消息
                        <Badge count={messageNum} style={{ backgroundColor: '#52c41a' }} />
                        </span>
                    </Link>
                </div>
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

function mapStateToProps(state) {
    let { messageNum } = state.setUserCenter
    return {
        messageNum
    }
}

export default connect(mapStateToProps)(withRouter(NavBarPop));
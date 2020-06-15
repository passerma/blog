import React, { Fragment } from 'react';
import { Popover, Spin, Button, message } from 'antd';
import './InfoDetail.less'
import { COMMON_URL, FetchData } from '../../CommonData/api'
import { translateXSSText } from '../../CommonData/globalFun'
import { Link } from 'react-router-dom';
class InfoDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.info = {}
    }
    componentDidMount() {

    }

    /** 
     * 用户信息
    */
    getUserInfo = (id, callBack) => {
        let params = {
            method: "GET",
        }
        let url = `/user/getid?id=${id}`
        FetchData(url, params, (res) => {
            callBack(res)
        })
    }
    /** 
     * 面板打开关闭回调
    */
    onChnage = (open) => {
        if (open) {
            if (this.info.realname) {
                return
            }
            this.getUserInfo(this.props.id, (res) => {
                if (!res) {
                    console.error('未知错误')
                    return
                }
                if (res.ErrCode === 0) {
                    this.info.avatar = res.data.avatar
                    this.info.realname = res.data.realname
                    this.info.introduction = res.data.introduction
                    this.info.userid = res.data.userid
                    this.setState({
                        loading: false
                    })
                } else {
                    message.error(res.ErrMsg)
                }
            })
        }
    }
    render() {
        let { loading } = this.state
        let { introduction, avatar, realname, userid } = this.info
        const content = (
            <Spin spinning={loading}>
                <div className="infoDetail-wrap">
                    {
                        !loading && <Fragment>
                            <img alt="头像" className="infoDetail-img"
                                src={avatar ? `${COMMON_URL}/file/get/avatar?avatar=${avatar}` :
                                    `${COMMON_URL}/file/get/avatar`} />
                            <span className="infoDetail-right">
                                <div className="infoDetail-name" title={realname}>{realname}</div>
                                <div className="infoDetail-text" title='该用户什么都没留下'>{introduction ? translateXSSText(introduction)
                                    : '该用户什么都没留下'}</div>
                                <Button className="infoDetail-btn"><Link to={`/info/${userid}`}>去TA主页</Link></Button>
                            </span>
                        </Fragment>
                    }
                </div>
            </Spin>
        )
        return (
            <Popover onVisibleChange={this.onChnage} placement="topLeft" content={content}>
                {this.props.children}
            </Popover>
        )
    }
}

export default InfoDetail;
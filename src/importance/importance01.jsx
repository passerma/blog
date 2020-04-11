import React, { Fragment } from 'react';
import { Icon, Spin, message } from 'antd';
import { getData } from './api/importance01'
import './importance01.less'

export default class importance01 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: true
        };
    }

    componentDidMount() {
        getData((res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                this.setState({
                    data: res.data,
                    loading: false
                })
            } else {
                message.error(res.ErrMsg)
            }
        })
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        let { data, loading } = this.state
        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

        return (
            <div className="importance01">
                <div className="importance01-title">最新疫情数据</div>
                <Spin indicator={antIcon} spinning={loading} tip="加载中...">
                    <div className="importance01-date">更新于 {data.date}</div>
                    <div className="importance01-wrap">
                        <div className="importance01-item">确诊：{data.diagnosed}</div>
                        <div className="importance01-item">疑似：{data.suspect}</div>
                        <div className="importance01-item">死亡：{data.death}</div>
                        <div className="importance01-item">治愈：{data.cured}</div>
                    </div>
                    <div className="importance01-wrap-add">
                        <div className="importance01-item">新增确诊：{data.diagnosedIncr}</div>
                        <div className="importance01-item">新增疑似：{data.suspectIncr}</div>
                        <div className="importance01-item">新增死亡：{data.deathIncr}</div>
                        <div className="importance01-item">新增治愈：{data.curedIncr}</div>
                    </div>
                    <div className="importance01-more">
                        <span>查看详细数据></span>
                    </div>
                </Spin>
            </div>
        );
    }
}
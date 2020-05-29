import React from 'react';
import './IpSearch.less';
import { getIpInfo } from '../api/api'
import { Input, Spin, Result } from 'antd';

const { Search } = Input;

export default class IpSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasIp: false,
            loading: false,
            hasTable: false,
            info: {}
        };
    }

    searhData = (value) => {
        this.setState({
            loading: true,
        })
        getIpInfo(value, (res) => {
            if (!res) {
                this.setState({
                    hasTable: true,
                    loading: false,
                    info: {},
                    hasIp: (value.trim() === '') ? true : false
                })
                return
            }
            if (res.ErrCode !== 0) {
                this.setState({
                    hasTable: true,
                    loading: false,
                    info: {},
                    hasIp: (value.trim() === '') ? true : false
                })
            } else {
                this.setState({
                    hasTable: true,
                    info: res.data,
                    loading: false,
                    hasIp: (value.trim() === '') ? true : false
                })
            }
        })
    }
    render() {
        let { hasTable, hasIp, info, loading } = this.state
        return (
            <div className="HomeRightTools-ipSearch">
                <Search placeholder="留空默认查询本机ip" onSearch={this.searhData} enterButton loading={loading} />
                {
                    hasTable && <Spin spinning={loading}>
                        {
                            info.query ? <table className="ipSearch-table">
                                <tbody>
                                    <tr>
                                        <td colSpan="2" align="center" className="title">+++查询结果+++</td>
                                    </tr>
                                    <tr>
                                        <td width="120">IP地址</td>
                                        <td><span id="resIP">{info.query}<span style={{ color: 'red' }}>{
                                            hasIp ? ' (您的IP地址)' : ''
                                        }</span></span></td>
                                    </tr>
                                    <tr>
                                        <td>国家/地区</td>
                                        <td><span id="resLoc">{info.country}</span></td>
                                    </tr>
                                    <tr>
                                        <td>省份</td>
                                        <td><span id="resProvince">{info.regionName}</span></td>
                                    </tr>
                                    <tr>
                                        <td>城市</td>
                                        <td><span id="resCity">{info.city}</span></td>
                                    </tr>
                                </tbody>
                            </table> : <Result style={{ padding: '10px' }}
                                status="warning"
                                title="查询失败，请检查您输入的ip地址是否正确，或稍后再次查询"
                                />
                        }
                    </Spin>
                }
            </div>
        );
    }
}
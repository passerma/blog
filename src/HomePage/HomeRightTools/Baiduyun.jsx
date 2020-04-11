import React from 'react';
import './Baiduyun.less';
import { getBaiduyunData } from '../api/api'
import { Input } from 'antd';

const { Search } = Input;

export default class HomeToolFootball extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '输入链接地址格式为：https://pan.baidu.com/s/XXXXXXX'
        };
    }

    searhData = (value) => {
        if (value === '') {
            return
        }
        getBaiduyunData(value, (res) => {
            if (!res) {
                return
            }
            if (res.ErrCode !== 0) {
                this.setState({
                    text: res.ErrMsg
                })
            } else {
                this.setState({
                    text: res.data
                })
            }
        })
    }

    render() {
        return (
            <div className="HomeRightTools-baiduyun">
                <Search placeholder="https://pan.baidu.com/s/XXXXXXX" onSearch={this.searhData} enterButton />
                <div className="baiduyun-text">{this.state.text}</div>
            </div >
        );
    }
}
import React from 'react';
import './WeiBo.less';
import { getWeiBoTop } from '../api/api'
import { Table, Icon, Button, message } from 'antd';


export default class WeiBo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'rank',
                key: 'rank',
                width: 50,
                align: 'center',
                render(text, record) {
                    if (record.rank === 0) {
                        return <Icon style={{ fontWeight: 800 }} type="vertical-align-top" />
                    }
                    return <span>{record.rank}</span>
                }
            },
            {
                title: '关键词',
                dataIndex: 'text',
                key: 'text',
                render(text, record) {
                    // eslint-disable-next-line no-script-url
                    return <a rel="noopener noreferrer" target="_blank" href={record.href === 'javascript:void(0);' ?
                        `https://s.weibo.com/weibo?q=${record.text}&Refer=top` :
                        record.href} className="weibo-text">{record.text}</a>
                }
            }
        ];
    }

    componentDidMount() {
        getWeiBoTop((res) => {
            if (res && res.ErrCode === 0) {
                this.setState({
                    loading: false,
                    dataSource: res.data
                })
            } else {
                if (res) {
                    message.error(res.ErrMsg)
                }
            }
        })
    }

    refresh = () => {
        this.setState({
            loading: true
        })
        getWeiBoTop((res) => {
            if (res && res.ErrCode === 0) {
                this.setState({
                    loading: false,
                    dataSource: res.data
                })
            } else {
                if (res) {
                    message.error(res.ErrMsg)
                }
            }
        })
    }

    render() {
        let { dataSource, loading } = this.state
        return (
            <div className="HomeRightTools-weibo">
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={false}
                    rowKey={record => record.rank}
                    scroll={{ y: 300 }} />
                <Button loading={loading} onClick={this.refresh} type="primary" style={{ marginTop: '10px' }}>刷新</Button>
                <a style={{ marginLeft: '20px', textDecoration: 'none', color: '#000' }}
                    href="https://s.weibo.com/top/summary?cate=realtimehot"
                    target="_blank" rel="noopener noreferrer">数据：爬取自微博头条页面</a>
            </div >
        );
    }
}
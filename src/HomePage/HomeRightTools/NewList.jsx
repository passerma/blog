import React from 'react';
import './NewList.less';
import { getNewListData } from '../api/api'
import { message, Table, Button } from 'antd';

export default class WeiBo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            dataSourceHistory: [],
            loading: true
        };
        this.columns = [
            {
                title: '',
                dataIndex: 'rank',
                key: 'rank',
                width: 30,
                align: 'center'
            },
            {
                title: <span style={{ display: 'block', width: '310px', textAlign: 'center' }}>简报</span>,
                dataIndex: 'text',
                key: 'text',
                render(text, record) {
                    return <a rel="noopener noreferrer" target="_blank" href={record.href} className="weibo-text">{record.text}</a>
                }
            }
        ];
        this.columnsHistory = [
            {
                title: <span style={{ display: 'block', width: '375.6px', textAlign: 'center' }}>历史的今天</span>,
                dataIndex: 'event',
                key: 'event',
                align: 'left',
                render(text, record) {
                    return <a rel="noopener noreferrer" target="_blank"
                        href={`https://www.baidu.com/s?wd=${record.event}`} className="weibo-text-history">{record.event}</a>
                }
            }
        ];
    }

    componentDidMount() {
        this.getNewList()
    }

    refresh = () => {
        this.setState({
            loading: true
        })
        this.getNewList()
    }

    getNewList = () => {
        getNewListData((res) => {
            if (res && res.ErrCode === 0) {
                let dataSource = []
                for (let i = 0; i < res.data.newsList.length; i++) {
                    dataSource.push({
                        rank: i + 1,
                        text: res.data.newsList[i].title,
                        href: res.data.newsList[i].url
                    })
                }
                this.setState({
                    loading: false,
                    dataSource,
                    dataSourceHistory: res.data.historyList
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    loading: false,
                })
            }
        })
    }

    render() {
        let { dataSource, dataSourceHistory, loading } = this.state
        return (
            <div className="HomeRightTools-newList">
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={false}
                    rowKey={record => record.rank}
                    scroll={{ y: 300 }} />
                <Table
                    loading={loading}
                    dataSource={dataSourceHistory}
                    columns={this.columnsHistory}
                    pagination={false}
                    rowKey={record => record.event} />
                <Button loading={loading} onClick={this.refresh} type="primary" style={{ marginTop: '10px' }}>刷新</Button>
            </div >
        );
    }
}
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './Message.less'
import { Menu, Table, message, Badge, Skeleton, Divider } from 'antd';
import { setUserMessageNum } from '../Redux/action';
import { translateDateYMDHM } from '../CommonData/globalFun'
import { getUnreadData, getAllData, getReadData, getContentData } from './api'


class Messsage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openKey: '2',
            tableHeight: '0',
            allDataSource: [],
            allDataSourceLoading: true,
            unreadDataSource: [],
            unreadDataSourceLoading: true,
            readDataSource: [],
            readDataSourceLoading: true,
            contentOpen: false,
            contentLoading: true
        };
        this.columns = [
            {
                title: '标题内容',
                dataIndex: 'title',
                key: 'title',
                ellipsis: true,
                render: (text, record) => {
                    if (record.isread === 0) {
                        return <span onClick={() => this.getComment(record)}
                            className="message-title-link" title={record.title}><Badge color='purple' />{record.title}</span>
                    }
                    return <span onClick={() => this.getComment(record)} className="message-title-link">{record.title}</span>
                }
            },
            {
                title: '提交时间',
                dataIndex: 'time',
                key: 'time',
                width: 150,
                render(text, record) {
                    return <span>{translateDateYMDHM(record.time)}</span>
                }
            }
        ];
        this.unReadNum = undefined
    }

    componentDidMount() {
        let tableHeight = this.refs.messageTable.clientHeight - 100
        this.setState({
            tableHeight
        })
        this.getUnread()
    }

    //#region 页面控制
    handleClick = e => {
        e.key === '1' && this.getAll()
        e.key === '2' && this.getUnread()
        e.key === '3' && this.getRead()
        this.setState({
            openKey: e.key,
            contentOpen: false
        })
    };

    /** 
     * get comment
    */
    getComment = (record) => {
        this.setState({
            contentOpen: true,
            contentLoading: true
        })
        getContentData(record.id, (res) => {
            if (res && res.ErrCode === 0) {
                this.setState({
                    contentLoading: false,
                    contentData: res.data.content,
                    contentTitle: res.data.title,
                    contentTime: res.data.time
                }, () => {
                    if (record.isread === 0) {
                        this.unReadNum -= 1
                        this.props.dispatch(setUserMessageNum(this.unReadNum))
                    }
                    this.refs.contentText.innerHTML = res.data.content
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    contentLoading: false
                })
            }
        })
    }
    //#endregion

    //#region 所有信息
    /** 
     * 选择改变
    */
    allRowSelection = (selectedRowKeys, selectedRows) => {
    }

    /**
     * 获取未读消息
     */
    getAll = () => {
        this.setState({
            allDataSourceLoading: true
        })
        getAllData((res) => {
            if (res && res.ErrCode === 0) {
                this.setState({
                    allDataSource: res.data,
                    allDataSourceLoading: false
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    allDataSourceLoading: false
                })
            }
        })
    }
    //#endregion

    //#region 未读信息
    /** 
     * 选择改变
    */
    unreadRowSelection = (selectedRowKeys, selectedRows) => {
    }

    /**
     * 获取未读消息
     */
    getUnread = () => {
        this.setState({
            unreadDataSourceLoading: true
        })
        getUnreadData((res) => {
            if (res && res.ErrCode === 0) {
                (this.unReadNum === undefined) && (this.unReadNum = res.data.length)
                let unreadDataSource = [];
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    unreadDataSource.push({
                        id: element.id,
                        title: element.title,
                        time: element.time,
                        isread: 0
                    })
                }
                this.setState({
                    unreadDataSource,
                    unreadDataSourceLoading: false
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    unreadDataSourceLoading: false
                })
            }
        })
    }
    //#endregion

    //#region 已读信息
    /** 
     * 选择改变
    */
    readRowSelection = (selectedRowKeys, selectedRows) => {
    }

    /**
     * 获取已读消息
     */
    getRead = () => {
        this.setState({
            readDataSourceLoading: true
        })
        getReadData((res) => {
            if (res && res.ErrCode === 0) {
                this.setState({
                    readDataSource: res.data,
                    readDataSourceLoading: false
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    readDataSourceLoading: false
                })
            }
        })
    }
    //#endregion

    render() {
        const { openKey, tableHeight, contentOpen, unreadDataSource, unreadDataSourceLoading, allDataSource, allDataSourceLoading,
            readDataSource, readDataSourceLoading, contentLoading, contentData, contentTitle, contentTime } = this.state

        const allRowSelection = {
            onChange: this.allRowSelection
        };

        const unreadRowSelection = {
            onChange: this.unreadRowSelection
        };

        const readRowSelection = {
            onChange: this.readRowSelection
        };

        return (
            <div className="message-main">
                <div className="message-title">消息中心</div>
                <Menu
                    onClick={this.handleClick}
                    style={{ width: 180 }}
                    defaultSelectedKeys={['2']}
                    mode="inline"
                >
                    <Menu.Item key="1">全部消息</Menu.Item>
                    <Menu.Item key="2">未读消息</Menu.Item>
                    <Menu.Item key="3">已读消息</Menu.Item>
                </Menu>
                <div className="message-box">
                    {(openKey === '1' && !contentOpen) && <div>
                        <div className="message-box-title">全部消息</div>
                        {/* <div className="message-box-btn">
                            <Button disabled={allDataSourceLoading}>删除</Button>
                            <Button disabled={allDataSourceLoading} style={{ marginLeft: '10px' }}>标为已读</Button>
                            <Button disabled={allDataSourceLoading} style={{ marginLeft: '10px' }}>全部已读</Button>
                            <Button disabled={allDataSourceLoading} style={{ marginLeft: '10px' }}>全部删除</Button>
                        </div> */}
                        <div className="message-box-table">
                            <Table scroll={{ y: tableHeight }} dataSource={allDataSource} columns={this.columns}
                                rowSelection={allRowSelection} rowKey={record => record.id} loading={allDataSourceLoading}
                                locale={{ emptyText: allDataSourceLoading ? '加载中...' : '无任何消息' }} />
                        </div>
                    </div>
                    }
                    {(openKey === '2' && !contentOpen) && <div>
                        <div className="message-box-title">未读消息</div>
                        {/* <div className="message-box-btn">
                            <Button disabled={unreadDataSourceLoading}>删除</Button>
                            <Button disabled={unreadDataSourceLoading} style={{ marginLeft: '10px' }}>标为已读</Button>
                            <Button disabled={unreadDataSourceLoading} style={{ marginLeft: '10px' }}>全部已读</Button>
                            <Button disabled={unreadDataSourceLoading} style={{ marginLeft: '10px' }}>全部删除</Button>
                        </div> */}
                        <div className="message-box-table" ref="messageTable">
                            <Table scroll={{ y: tableHeight }} dataSource={unreadDataSource} columns={this.columns}
                                rowSelection={unreadRowSelection} rowKey={record => record.id} loading={unreadDataSourceLoading}
                                locale={{ emptyText: unreadDataSourceLoading ? '加载中...' : '无未读消息' }} />
                        </div>
                    </div>
                    }
                    {(openKey === '3' && !contentOpen) && <div>
                        <div className="message-box-title">已读消息</div>
                        {/* <div className="message-box-btn">
                            <Button disabled={readDataSourceLoading}>删除</Button>
                            <Button disabled={readDataSourceLoading} style={{ marginLeft: '10px' }}>全部删除</Button>
                        </div> */}
                        <div className="message-box-table">
                            <Table scroll={{ y: tableHeight }} dataSource={readDataSource} columns={this.columns}
                                rowSelection={readRowSelection} rowKey={record => record.id} loading={readDataSourceLoading}
                                locale={{ emptyText: readDataSourceLoading ? '加载中...' : '无已读消息' }} />
                        </div>
                    </div>
                    }
                    {
                        contentOpen && <Fragment>
                            <div className="message-box-title">消息详情</div>
                            <div className="message-box-content">
                                <Skeleton loading={contentLoading}>
                                    <div className="message-box-content-title">{contentTitle}</div>
                                    <div className="message-box-content-time">{translateDateYMDHM(contentTime)}</div>
                                    <Divider />
                                    <div ref='contentText' className="message-box-content-text"></div>
                                </Skeleton>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default connect()(Messsage);
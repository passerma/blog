import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import './Message.less'
import { Menu, Table, message, Badge, Skeleton, Divider, Button, Modal } from 'antd';
import { setUserMessageNum } from '../Redux/action';
import { translateDateYMDHM, getURLParam } from '../CommonData/globalFun'
import { getUnreadData, getAllData, getReadData, getContentData, delMessage } from './api'
import MessageSet from './MessageSet'

const { confirm } = Modal;
const { SubMenu } = Menu;

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
            },
            {
                title: '操作',
                dataIndex: 'oprate',
                key: 'oprate',
                width: 90,
                align: 'center',
                render: (text, record) => {
                    return <Button title={record.isread === 0 ? '只可以删除已读消息噢' : '删除'} disabled={record.isread === 0}
                        style={{ height: '25px' }} type="danger" onClick={() => this.delMessage(record)}>删除</Button>
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
        let messageSet = getURLParam('messageSet')
        if (messageSet !== null) {
            if (messageSet === 'basic') {
                this.setState({
                    openKey: '4'
                })
            }
        }
        this.getUnread()
    }

    //#region 页面控制
    /**
     * menu click
     */
    handleClick = e => {
        if (this.dataLoading) {
            return
        }
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

    /** 
     * del message
     */
    delMessage = (record) => {
        confirm({
            title: '确定删除这条消息嘛，删除后不可恢复？',
            onOk: () => {
                this.dataLoading = true
                this.state.openKey === '1' && this.setState({ allDataSourceLoading: true })
                this.state.openKey === '2' && this.setState({ unreadDataSourceLoading: true })
                this.state.openKey === '3' && this.setState({ readDataSourceLoading: true })
                delMessage(record.id, (res) => {
                    this.dataLoading = false
                    if (res && res.ErrCode === 0) {
                        message.success('删除成功')
                        this.state.openKey === '1' && this.getAll()
                        this.state.openKey === '2' && this.getUnread()
                        this.state.openKey === '3' && this.getRead()
                    } else {
                        res && message.error(res.ErrMsg)
                        this.state.openKey === '1' && this.setState({ allDataSourceLoading: false })
                        this.state.openKey === '2' && this.setState({ unreadDataSourceLoading: false })
                        this.state.openKey === '3' && this.setState({ readDataSourceLoading: false })
                    }
                })
            },
            okText: '确定',
            cancelText: '取消'
        });
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
            readDataSource, readDataSourceLoading, contentLoading, contentTitle, contentTime } = this.state

        // const allRowSelection = {
        //     onChange: this.allRowSelection
        // };

        // const unreadRowSelection = {
        //     onChange: this.unreadRowSelection
        // };

        // const readRowSelection = {
        //     onChange: this.readRowSelection
        // };

        return (
            <div className="message-main">
                <div className="message-title">消息中心</div>
                <Menu
                    onClick={this.handleClick}
                    style={{ width: 180 }}
                    defaultOpenKeys={['sub1', 'sub2']}
                    selectedKeys={openKey}
                    mode="inline"
                >
                    <SubMenu
                        key="sub1"
                        title="站内消息"
                    >
                        <Menu.Item key="1">全部消息</Menu.Item>
                        <Menu.Item key="2">未读消息</Menu.Item>
                        <Menu.Item key="3">已读消息</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title="消息接收管理"
                    >
                        <Menu.Item key="4">基本接收管理</Menu.Item>
                    </SubMenu>
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
                                rowKey={record => record.id} loading={allDataSourceLoading}
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
                                rowKey={record => record.id} loading={unreadDataSourceLoading}
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
                                rowKey={record => record.id} loading={readDataSourceLoading}
                                locale={{ emptyText: readDataSourceLoading ? '加载中...' : '无已读消息' }} />
                        </div>
                    </div>
                    }
                    {(openKey === '4' && !contentOpen) && <div>
                        <div className="message-box-title">基本接收管理</div>
                        <div className="message-box-table">
                            <MessageSet />
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
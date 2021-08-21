import React from 'react';
import { Empty, Spin, message, Table, Button, Modal } from 'antd';
import { Link } from "react-router-dom"
import './ViewComments.less'
import marked from 'marked'
import { getComments, delComments } from './api'
import { translateXSSText } from '../CommonData//globalFun'
const { confirm } = Modal;

export default class ViewComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataSource: []
        };
        this.columns = [
            {
                title: '文章标题',
                dataIndex: 'name',
                key: 'name',
                width: 200,
                ellipsis: true
            },
            {
                title: '评论内容',
                dataIndex: 'content',
                key: 'content',
                ellipsis: true,
                render: (text) => <div className="ellipsis" title={text}>{text}</div>
                // render: (text, record) => <Popover content={
                //     <div dangerouslySetInnerHTML={{ __html: record.contentMark }}
                //         className="view-comments-table-content-mark">
                //     </div>
                // }
                //     overlayClassName="view-comments-table-content-mark-pop">
                //     <div dangerouslySetInnerHTML={{ __html: text }}
                //         className="view-comments-table-content">
                //     </div>
                // </Popover>
            },
            {
                title: '操作',
                dataIndex: 'oprate',
                key: 'oprate',
                align: 'center',
                width: 200,
                render: (text, record) => <div>
                    <Link to={`/article/${record.blogid}`}>
                        <Button type="primary" className="oprate">查看</Button>
                    </Link>
                    <Button type="danger" onClick={() => this.showDeleteConfirm(record)} className="oprate">删除</Button>
                </div>
            },
        ];
    }

    componentDidMount() {
        this.getTable()
    }

    getTable = () => {
        getComments((res) => {
            if (res && res.ErrCode === 0) {
                let dataSource = []
                for (let i = 0; i < res.data.length; i++) {
                    let dataS = {}
                    let temp = res.data[i]
                    dataS.key = temp.id
                    dataS.name = temp.title
                    dataS.content = this.getMarkDownText(temp.comments)
                    dataS.contentMark = this.getMarkDown(temp.comments)
                    dataS.blogid = temp.blogid
                    dataSource.push(dataS)
                }
                this.setState({
                    loading: false,
                    dataSource
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    loading: false
                })
            }
        })
    }

    /**
     * 删除评论
     */
    showDeleteConfirm = (record) => {
        let that = this
        confirm({
            title: '确定要删除该评论嘛？',
            content: '删除后不可回复！',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                that.delCommmentOk(record)
            },
            onCancel() { },
        });
    }

    /**
     * 执行删除
     */
    delCommmentOk = (record) => {
        this.setState({
            loading: true
        })
        delComments(record.key, (res) => {
            if (res && res.ErrCode === 0) {
                message.success('删除成功')
                this.getTable()
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    loading: false
                })
            }
        })
    }

    /** 
     * 得到markdown文本
    */
    getMarkDown = (content) => {
        let htmlContent = translateXSSText(content)
        let strHtml = marked(htmlContent)
        return strHtml
    }

    /** 
     * 得到纯文本
    */
    getMarkDownText = (content) => {
        let htmlContent = translateXSSText(content)
        let strHtml = marked(htmlContent)
        let re = new RegExp('<[^<>]+>', 'g');
        strHtml = strHtml.replace(re, "");
        return strHtml
    }

    render() {
        let { MyIcon } = this.props
        let { loading, dataSource } = this.state
        return (
            <div className="view-comments">
                <div className="view-comments-title"><MyIcon type="icon-pinglun" />我的评论：</div>
                <Spin tip="获取中..." spinning={loading}>
                    {
                        dataSource.length === 0 ? <Empty description={loading ? '获取中' : '还没有评论噢'} /> :
                            <Table rowClassName="view-comments-table" dataSource={dataSource} columns={this.columns} pagination={false}
                                scroll={{ y: 300 }} />
                    }
                </Spin>
            </div >
        );
    }
}
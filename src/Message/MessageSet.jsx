import React, { useState, useEffect } from 'react'
import { Table, Switch, message } from 'antd'
import { getMessageData, postMessageData } from './api'
import './MessageSet.less'

function useMessageSet() {
    //#region 初始数据
    const [dataSource, setDataSource] = useState([{ title: '博客评论收到回复通知', key: '1', message: 0, Email: 0 }])
    const [loading, setLoading] = useState(true)
    const columns = [
        {
            title: '消息类型',
            dataIndex: 'title',
            key: 'title',
            width: 250,
            ellipsis: true,
        },
        {
            title: '站内信',
            dataIndex: 'message',
            key: 'message',
            width: 150,
            align: 'center',
            render: (text, record) => <Switch checkedChildren="开" unCheckedChildren="关"
                checked={!!record.message} onClick={setMessage} loading={loading} />
        },
        {
            title: '邮箱',
            dataIndex: 'Email',
            key: 'Email',
            width: 150,
            align: 'center',
            render: (text, record) => <Switch checkedChildren="开" unCheckedChildren="关"
                checked={!!record.Email} onClick={setEmail} loading={loading} />
        },
        {
            title: '',
            dataIndex: 'other',
            key: 'other',
            align: 'center'
        }
    ];
    //#endregion

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //#region 初始
    const getData = () => {
        getMessageData((res) => {
            if (res && res.ErrCode === 0) {
                dataSource[0].message = res.data.replayMessage
                dataSource[0].Email = res.data.replayEmail
                setDataSource(dataSource)
                setLoading(false)
            } else {
                res && message.error(res.ErrMsg)
                setLoading(false)
            }
        })
    }
    //#endregion

    //#region 设置
    const setMessage = (checked) => {
        setLoading(true)
        let data = {
            replayMessage: checked ? 1 : 0,
            replayEmail: dataSource[0].Email
        }
        postMessageData(data, (res) => {
            if (res && res.ErrCode === 0) {
                dataSource[0].message = checked ? 1 : 0
                setDataSource(dataSource)
                setLoading(false)
            } else {
                res && message.error(res.ErrMsg)
                setLoading(false)
            }
        })
    }
    const setEmail = (checked) => {
        setLoading(true)
        let data = {
            replayEmail: checked ? 1 : 0,
            replayMessage: dataSource[0].message
        }
        postMessageData(data, (res) => {
            if (res && res.ErrCode === 0) {
                dataSource[0].Email = checked ? 1 : 0
                setDataSource(dataSource)
                setLoading(false)
            } else {
                res && message.error(res.ErrMsg)
                setLoading(false)
            }
        })
    }
    //#endregion

    return (
        <div className="MessageSet">
            <Table className="MessageSet-table" columns={columns}
                dataSource={dataSource} pagination={false} loading={loading} />
        </div>
    )
}

export default useMessageSet

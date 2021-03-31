import React from 'react';
import './Football.less';
import { getFootballData } from '../api/api'
import { Table, message } from 'antd';

export default class HomeToolFootball extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            footballSelect: 'yc',
            dataSource: [],
            loading: true
        };
        this.columns = [
            {
                title: '',
                dataIndex: 'rank',
                key: 'rank',
                width: 20
            },
            {
                title: '',
                dataIndex: 'img',
                key: 'img',
                render(text, record) {
                    return <img alt="球队图标" className="team-img" referrerPolicy="no-referrer" src={record.img} />
                },
                width: 22
            },
            {
                title: '球队',
                dataIndex: 'team',
                key: 'team',
                width: 110,
            },
            {
                title: '场次',
                dataIndex: 'matchNum',
                key: 'matchNum',
            },
            {
                title: '胜',
                dataIndex: 'winNum',
                key: 'winNum',
            },
            {
                title: '平',
                dataIndex: 'drawNum',
                key: 'drawNum',
            },
            {
                title: '负',
                dataIndex: 'loseNum',
                key: 'loseNum',
            },
            {
                title: '积分',
                dataIndex: 'score',
                key: 'score',
            },
        ];
    }

    componentDidMount() {
        this.searchData('英超')
    }

    searchData = (type) => {
        this.setState({
            loading: true
        })
        getFootballData('jf', type, (res) => {
            this.setState({
                loading: false
            })
            if (!res) {
                return
            }
            if (res.ErrCode === 0) {
                this.setState({
                    dataSource: res.data
                })
            } else {
                message.error(res.ErrMsg)
            }
        })
    }

    render() {
        let { footballSelect, dataSource, loading } = this.state
        return (
            <div className="HomeRightTools-football">
                <div className="football-title">
                    <span onClick={() => {
                        if (footballSelect === 'yc') return
                        this.setState({ footballSelect: 'yc' })
                        this.searchData('英超')
                    }} className={footballSelect === 'yc' ? 'footballSelect' : ''}>英超</span>
                    <span onClick={() => {
                        if (footballSelect === 'xj') return
                        this.setState({ footballSelect: 'xj' })
                        this.searchData('西甲')
                    }} className={footballSelect === 'xj' ? 'footballSelect' : ''}>西甲</span>
                    <span onClick={() => {
                        if (footballSelect === 'yj') return
                        this.setState({ footballSelect: 'yj' })
                        this.searchData('意甲')
                    }} className={footballSelect === 'yj' ? 'footballSelect' : ''}>意甲</span>
                    <span onClick={() => {
                        if (footballSelect === 'dj') return
                        this.setState({ footballSelect: 'dj' })
                        this.searchData('德甲')
                    }} className={footballSelect === 'dj' ? 'footballSelect' : ''}>德甲</span>
                    <span onClick={() => {
                        if (footballSelect === 'fj') return
                        this.setState({ footballSelect: 'fj' })
                        this.searchData('法甲')
                    }} className={footballSelect === 'fj' ? 'footballSelect' : ''}>法甲</span>
                    {/* <span onClick={() => {
                        if (footballSelect === 'zc') return
                        this.setState({ footballSelect: 'zc' })
                        this.searchData('中超')
                    }} className={footballSelect === 'zc' ? 'footballSelect' : ''}>中超</span> */}
                </div>
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={this.columns}
                    pagination={false}
                    rowKey={record => record.team}
                    scroll={{ y: 300 }} />
            </div >
        );
    }
}
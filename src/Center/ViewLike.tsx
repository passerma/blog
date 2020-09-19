import React from 'react';
import { Spin, Statistic, Empty, message } from 'antd';
import { Link } from "react-router-dom"
import { getLikesData } from './api'
import Icon from 'antd/lib/icon'
import './ViewLike.less'

//#region 类型定义
interface likesData {
    title: string,
    id: number
}

interface getData {
    data: likesData[],
    ErrCode: number,
    ErrMsg: string
}

interface ViewLikeProps {
    MyIcon: typeof Icon,
    userInfo: any
}

interface ViewLikeState {
    likeLoading: boolean,
    likeData: likesData[]
}
//#endregion

export default class ViewLike extends React.Component<ViewLikeProps, ViewLikeState> {
    state: ViewLikeState = {
        likeLoading: true,
        likeData: []
    }

    componentDidMount() {
        this.getAllLikes()
    }

    getAllLikes = () => {
        getLikesData((res: getData | null) => {
            if (res?.ErrCode === 0) {
                this.setState({
                    likeData: res.data,
                    likeLoading: false
                })
            } else {
                res && message.error(res.ErrMsg)
                this.setState({
                    likeLoading: false
                })
            }
        })
    }

    render() {

        const { likeLoading, likeData } = this.state
        const { MyIcon } = this.props

        return (
            <div className="view-like">
                <div className="view-like-title"><MyIcon type="icon-shoucang" />我的收藏：</div>
                <div className="view-like-box">
                    <div className="view-like-box-item">
                        <div className="view-like-box-title"><MyIcon type="icon-zan" />点赞
                                    <Statistic value={likeData.length} />
                        </div>
                        <Spin spinning={likeLoading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                            <div className="view-like-box-data">
                                {
                                    likeData.length > 0 ? <ul>{
                                        likeData.map((element, index) =>
                                            <Link key={index} to={`/article/${element.id}`}>
                                                <li title={element.title}>{element.title}</li>
                                            </Link>)
                                    }</ul> :
                                        <Empty description="快去点赞吧！" />
                                }
                            </div>
                        </Spin>
                    </div>
                    <div className="view-like-box-item">
                        <div className="view-like-box-title"><MyIcon type="icon-shoucang1" />收藏
                                    <Statistic value={0} />
                        </div>
                        <Spin spinning={false} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                            <div className="view-like-box-data">
                                <Empty description="快去收藏吧！" />
                            </div>
                        </Spin>
                    </div>
                </div>
            </div >
        );
    }
}
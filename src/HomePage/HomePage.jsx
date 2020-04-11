import React from 'react';
import './HomePage.less';
import HomeTitle from './HomeTitle';
import HomeRight from './HomeRight';
import HomeArticle from './HomeArticle'
import { getHomeArticle } from './api/api'
import { message, Spin, BackTop } from 'antd';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        getHomeArticle((res) => {
            if (!res || res.ErrCode !== 0) {
                this.setState({
                    loading: false,
                    allArticle: [],
                })
                if (res) {
                    message.error(res.ErrMsg)
                }
            } else if (res.ErrCode === 0) {
                this.setState({
                    allArticle: res.data,
                    loading: false
                })
            }
        })
    }

    /** 
     * 展示首页文章
    */
    showArticle = () => {
        let { allArticle } = this.state
        let articleGroup = []
        let articleDom = []
        for (let i = 0; i < allArticle.length; i++) {
            articleGroup.push(allArticle[i])
            if (articleGroup.length === 2) {
                articleDom.push(articleGroup)
                articleGroup = []
            }
        }
        if (articleGroup.length > 0) {
            articleDom.push(articleGroup)
        }
        let returnDom = articleDom.map((elements, indexs) => {
            return (<div className="HomePage-article-box" key={indexs}>
                {
                    elements.map((element, index) => <HomeArticle
                        key={index}
                        imgUrl={element.bgurl}
                        title={element.title}
                        text={element.text}
                        time={element.createtime}
                        id={element.id}
                        blogClass={element.class}
                    />)
                }
            </div>)
        })
        return returnDom
    }


    render() {
        let { loading, } = this.state
        return (
            <div className="home-box" ref="homeBox">
                <HomeTitle></HomeTitle>
                <div className="HomePage-box">
                    <HomeRight></HomeRight>
                    <div className="HomePage-article">
                        {
                            loading ? <Spin style={{ marginTop: '40px' }} /> : this.showArticle()
                        }
                    </div>
                </div>
                <BackTop target={() => document.querySelector('.home-box')} />
            </div>
        );
    }
}

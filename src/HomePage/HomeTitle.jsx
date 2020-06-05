import React, { Fragment } from 'react';
import './HomeTitle.less';
import { Icon } from 'antd'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1748160_vdh2fdfe08.js', // 在 iconfont.cn 上生成
});

export default class HomeTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            country: '',
            next: {},
            nextMore: {},
            wea: '',
            minWea: '',
            maxWea: '',
            weaIcon: null
        };
    }

    componentDidMount() {
        this.getDate()
        this.getWea()
    }
    getDate = () => {
        let a = new Date();
        this.year = a.getFullYear();
        this.month = a.getMonth();
        this.data = a.getDate();
        this.day = a.getDay();
        switch (this.day) {
            case 0:
                this.day = "日";
                break;
            case 1: this.day = "一";
                break;
            case 2:
                this.day = "二";
                break;
            case 3: this.day = "三";
                break;
            case 4:
                this.day = "四";
                break;
            case 5: this.day = "五";
                break;
            case 6:
                this.day = "六"
                break;
            default:
                this.day = "-"
        }
        this.forceUpdate()
    }
    getWea = () => {
        fetch("https://www.tianqiapi.com/api/?version=v1&appid=70528913&appsecret=nXnpSf8k")
            .catch((err) => { console.error("Error:", err) })
            .then((data) => { return data ? data.json() : '' })
            .then((myJson) => {
                if (myJson && myJson.city) {
                    this.createIcon(myJson.data[0].wea_img)
                    this.setState({
                        city: myJson.city,
                        country: myJson.country,
                        wea: myJson.data[0].wea,
                        minWea: myJson.data[0].tem2,
                        maxWea: myJson.data[0].tem1,
                        next: {
                            day: myJson.data[1].day,
                            wea: myJson.data[1].wea,
                            minWea: myJson.data[1].tem2,
                            maxWea: myJson.data[1].tem1,
                        },
                        nextMore: {
                            day: myJson.data[2].day,
                            wea: myJson.data[2].wea,
                            minWea: myJson.data[2].tem2,
                            maxWea: myJson.data[2].tem1,
                        }
                    })
                } else {
                    console.error('错误')
                }
            })
    }

    createIcon = (type) => {
        let weaIcon = null
        switch (type) {
            case "qing":
                weaIcon = <MyIcon type="icon-qingtian" />
                break;
            case "yin":
                weaIcon = <MyIcon type="icon-yintian" />
                break;
            case "yun":
                weaIcon = <MyIcon type="icon-duoyun" />
                break;
            case "xiaoyu":
                weaIcon = <MyIcon type="icon-xiaoyu" />
                break;
            case "yu":
            case "zhongyu":
                weaIcon = <MyIcon type="icon-zhongyu" />
                break;
            case "dayu":
                weaIcon = <MyIcon type="icon-dayu" />
                break;
            case "leizhenyu":
                weaIcon = <MyIcon type="icon-leizhenyu" />
                break;
            case "xue":
                weaIcon = <MyIcon type="icon-zhongxue" />
                break;
            case "yujiaxue":
                weaIcon = <MyIcon type="icon-yujiaxue" />
                break;
            case "wu":
                weaIcon = <MyIcon type="icon-wu" />
                break;
            case "mai":
                weaIcon = <MyIcon type="icon-zhongduwumai" />
                break;
            case "shachen":
                weaIcon = <MyIcon type="icon-shachen" />
                break;
            case "lei":
                weaIcon = <MyIcon type="icon-qiangduiliu" />
                break;
            default:
                weaIcon = <MyIcon type="icon-tianqiyubao" />
                break;
        }
        this.setState({
            weaIcon
        })
    }

    render() {
        let { city, country, wea, minWea, maxWea, next, nextMore, weaIcon } = this.state
        return (
            <div className="homeTitle-box">
                <div className="homeTitle-day">
                    <div className="homeTitle-title">今日，</div>
                    <div className="homeTitle-text">
                        {`${this.year}年${this.month + 1}月${this.data}日星期${this.day}，欢迎您来到PASSERMA的博客。`}
                    </div>
                </div>
                <div className="homeTitle-wea">
                    {
                        wea && <Fragment>
                            <div className="homeTitle-title">
                                天气，
                        <span className="wea-addr">{country}{city}</span>
                                <i className="iconfont">
                                    {weaIcon}
                                    <span>{wea} {minWea}~{maxWea}</span>
                                </i>
                            </div>
                            <div className="homeTitle-text">
                                未来：
                                <span>{next.day}：{next.wea} {next.minWea}~{next.maxWea}</span>
                                <span className="wea-next">{nextMore.day}：{nextMore.wea} {nextMore.minWea}~{nextMore.maxWea}</span>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}
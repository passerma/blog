import React from 'react';
import { Link } from "react-router-dom"
import './HomeAritcle.less';

export default class HomeArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    _translateDate = (createtime, need) => {
        let date = new Date(createtime);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let newDate = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        if (need) {
            let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
            return `${year}-${month}-${newDate} ${h}:${m}`
        }
        return `${year}-${month}-${newDate}`
    }
    _translateText = (text) => {
        return text.replace(/&nbsp;/gi, '')
    }

    render() {
        let { imgUrl, title, time, id, blogClass } = this.props
        return (
            <div className="HomeArticle">
                <div className="HomeArticle-time">
                    <span className="HomeArticle-class">{blogClass}</span>
                    <span>{this._translateDate(time)}</span>
                </div>
                <Link to={`/article/${id}`}>
                    <div className="HomeArticle-title" title={title}>{title}</div>
                </Link>
                <Link to={`/article/${id}`}>
                    <div className="HomeArticle-img">
                        <img alt="文章封面" src={imgUrl} />
                    </div>
                </Link>
            </div>
        );
    }
}

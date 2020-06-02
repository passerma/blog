import React from 'react';
import { Link } from "react-router-dom"
import { Button, Skeleton, message, Input, Empty, Tag, Select, Badge, Icon, Divider } from 'antd';
import { getList, getTopArticle } from './api/api';
import './Ariticle.less';

const { Search } = Input;
const { Option } = Select;

export default class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blogData: [],
            loading: true,
            showSearch: false,
            hasSearch: false,
            showClass: false,
            openSelect: false,
            hasClass: false,
            classValue: '',
            classValueNum: 0,
            searchValue: '',
            showOrder: false,
            openOrderSelect: false,
            hasOrder: false,
            orderValue: '',
            fixed: false,
            // 值联动
            searchChangeValue: '',
            classChangeValue: [],
            orderChangeValue: 'moren',
            topArticle: undefined
        };
    }
    componentDidMount() {
        this.refs.article.addEventListener('scroll', this.articleScroll)
        getList('', '', '', (res) => {
            if (res.ErrCode === 0) {
                this.setState({
                    blogData: res.data,
                    loading: false
                })
            } else {
                res && message.error(res.ErrMsg)
            }
        })
        getTopArticle((res) => {
            if (res && res.ErrCode === 0) {
                this.setState({
                    topArticle: res.data,
                })
            }
        })
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    //#region 工具函数
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
        return `${year}年${month}月${newDate}日`
    }
    _translateText = (text) => {
        return text.replace(/&nbsp;/gi, '')
    }

    /** 
     * 界面滚动
     */
    articleScroll = (e) => {
        if (this.refs.article.scrollTop >= 20) {
            this.setState({
                fixed: true
            })
        } else {
            this.setState({
                fixed: false
            })
        }
    }

    recoverAll = () => {
        let { searchValue, classValue, orderValue } = this.state
        if (searchValue === '' && classValue === '' && orderValue === '') {
            return
        }
        this.setState({
            loading: true,
            hasSearch: false,
            searchValue: '',
            hasClass: false,
            classValue: '',
            classValueNum: 0,
            hasOrder: false,
            orderValue: '',
            orderChangeValue: 'moren',
            searchChangeValue: '',
            classChangeValue: []
        })
        getList('', '', '', (res) => {
            if (res.ErrCode === 0) {
                this.setState({
                    blogData: res.data,
                    loading: false
                })
            } else {
                message.error(res.ErrMsg)
            }
        })
    }
    //#endregion

    //#region 搜索相关
    /** 
     * 显示关闭搜索框
    */
    showSearch = () => {
        this.setState({
            showSearch: true
        })
        const input = this.refs.searchInput
        input.focus();
    }

    /**
     * 面板开关回调
     */
    openSearch = (type) => {
        this.setState({
            showSearch: type
        })
    }

    /** 
     * 搜索数据
    */
    searchData = (value) => {
        this.setState({
            loading: true,
            hasSearch: value ? true : false,
            searchValue: value
        })
        getList(value, this.state.classValue, this.state.orderValue, (res) => {
            if (res.ErrCode === 0) {
                this.setState({
                    blogData: res.data,
                    loading: false
                })
            } else {
                message.error(res.ErrMsg)
            }
        })
    }

    /** 
     * 搜索改变回调
    */
    searchOnChange = (event) => {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                searchChangeValue: value
            })
        }
    }
    //#endregion

    //#region 分类相关
    /** 
     * 展示框
    */
    showClass = () => {
        this.setState({
            showClass: true
        })
        const input = this.refs.classInput
        input.focus();
    }

    /** 
     * 开关面板
     */
    openSelect = (type) => {
        this.setState({
            openSelect: type,
            showClass: type
        })
    }

    /** 
     * 选择回调
    */
    selectClassChange = (value) => {
        let allClass = value.join('_')
        this.setState({
            loading: true,
            hasClass: value.length > 0 ? true : false,
            classValue: allClass,
            classValueNum: value.length,
            classChangeValue: value
        })
        getList(this.state.searchValue, allClass, this.state.orderValue, (res) => {
            if (res.ErrCode === 0) {
                this.setState({
                    blogData: res.data,
                    loading: false
                })
            } else {
                message.error(res.ErrMsg)
            }
        })
    }
    //#endregion

    //#region 排序相关
    showOrder = () => {
        this.setState({
            showOrder: true
        })
        const input = this.refs.orderInput
        input.focus();
    }

    /** 
     * 开关面板
     */
    openOrder = (type) => {
        this.setState({
            openOrderSelect: type,
            showOrder: type
        })
    }

    /** 
     * 排序选择回调
    */
    selectOrderChange = (value) => {
        let orderValue = (value === 'moren' ? '' : value)
        this.setState({
            loading: true,
            hasOrder: value !== 'moren' ? true : false,
            orderValue: value === 'moren' ? '' : value,
            orderChangeValue: value
        })
        getList(this.state.searchValue, this.state.classValue, orderValue, (res) => {
            if (res.ErrCode === 0) {
                this.setState({
                    blogData: res.data,
                    loading: false
                })
            } else {
                message.error(res.ErrMsg)
            }
        })
    }

    //#endregion

    render() {
        let { blogData, loading, showSearch, hasSearch, showClass, openSelect, hasClass, classValueNum,
            showOrder, openOrderSelect, hasOrder, fixed, orderChangeValue, classChangeValue, searchChangeValue,
            topArticle } = this.state
        let searchBtnClass = hasSearch ? 'article-oprate-search has' : 'article-oprate-search'
        let searchClass = showSearch ? 'article-oprate-search-input show' : 'article-oprate-search-input'

        let classBtnClass = hasClass ? 'article-oprate-class has' : 'article-oprate-class'
        let classClass = showClass ? 'article-oprate-search-input show' : 'article-oprate-search-input'

        let orderBtnClass = hasOrder ? 'article-oprate-order has' : 'article-oprate-order'
        let orderClass = showOrder ? 'article-oprate-search-input show' : 'article-oprate-search-input'

        let oprateClass = fixed ? 'article-oprate fixed' : 'article-oprate'
        return (
            <div className="article" ref="article">
                <div className="article-main">
                    <div className={oprateClass}>
                        <div className="article-oprate-box">
                            <span className={orderBtnClass} onClick={this.showOrder}>
                                <Badge offset={[5, 5]} dot={hasOrder}>排序</Badge>
                            </span>
                            <span className={classBtnClass} onClick={this.showClass}>
                                <Badge offset={[5, 5]} count={classValueNum}>分类</Badge>
                            </span>
                            <span className={searchBtnClass} onClick={this.showSearch}>
                                <Badge offset={[5, 5]} dot={hasSearch}>搜索</Badge>
                            </span>
                            <span className="article-oprate-recover" onClick={this.recoverAll}>清空</span>
                            <div className={searchClass}>
                                <Search
                                    loading={loading}
                                    placeholder="搜索"
                                    ref="searchInput"
                                    allowClear
                                    onFocus={() => this.openSearch(true)}
                                    onBlur={() => this.openSearch(false)}
                                    onSearch={this.searchData}
                                    onChange={this.searchOnChange}
                                    value={searchChangeValue}
                                />
                            </div>
                            <div className={classClass}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="分类"
                                    maxTagCount={2}
                                    ref="classInput"
                                    onFocus={() => this.openSelect(true)}
                                    onBlur={() => this.openSelect(false)}
                                    open={openSelect}
                                    onChange={this.selectClassChange}
                                    loading={loading}
                                    value={classChangeValue}
                                >
                                    <Option key={'树莓派'}>树莓派</Option>
                                    <Option key={'nodejs'}>nodejs</Option>
                                    <Option key={'插件'}>插件</Option>
                                    <Option key={'关于'}>关于</Option>
                                </Select>
                            </div>
                            <div className={orderClass}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="排序"
                                    defaultValue="moren"
                                    ref="orderInput"
                                    showArrow={false}
                                    onFocus={() => this.openOrder(true)}
                                    onBlur={() => this.openOrder(false)}
                                    open={openOrderSelect}
                                    onChange={this.selectOrderChange}
                                    loading={loading}
                                    value={orderChangeValue}
                                    dropdownClassName="article-select"
                                >
                                    <Option value="moren">默认</Option>
                                    <Option value="createtime desc">创建时间 新-旧</Option>
                                    <Option value="createtime">创建时间 旧-新</Option>
                                    <Option value="updatetime desc">更新时间 新-旧</Option>
                                    <Option value="updatetime">更新时间 旧-新</Option>
                                    <Option value="look desc">阅读数量 多-少</Option>
                                    <Option value="look">阅读数量 少-多</Option>
                                    <Option value="commentNum desc">评论数量 多-少</Option>
                                    <Option value="commentNum">评论数量 少-多</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {
                        topArticle && <div className="article-stick" style={fixed ? { paddingTop: '90px' } : {}}>
                            <div className="article-stick-top">
                                <span>置顶</span>
                                <span>
                                    <Icon type="pushpin" />
                                </span>
                            </div>
                            <div className="article-stick-title">
                                <Link className="article-stick-link" to={`/article/${topArticle.id}`}>
                                    {topArticle.title}
                                </Link>
                            </div>
                            <Link className="article-stick-text-link" to={`/article/${topArticle.id}`}>
                                <div className="article-stick-text">
                                    {topArticle.text}
                                </div>
                            </Link>
                            <Divider />
                        </div>
                    }

                    <ul className="article-main-box">
                        <Skeleton loading={loading} active>
                            {
                                blogData.length > 0 ? blogData.map((value, index) => <li className="article-main-list" key={index}>
                                    <p className="article-time">{this._translateDate(value.createtime, false)}</p>
                                    <div className="article-title">
                                        <Link className="article-title-span" to={`/article/${value.id}`}>{value.title}</Link>
                                    </div>
                                    <div className="article-content">
                                        <span className="article-content-little">摘要：{this._translateText(value.text)}</span>
                                        <Button>
                                            <Link to={`/article/${value.id}`}>查看全文</Link>
                                        </Button>
                                    </div>
                                    <div className="article-msg">
                                        <Tag color="magenta" style={{ float: 'left' }}>{value.class ? value.class : '未分类'}</Tag>
                                        <span className="article-msg-update">最后更新：{this._translateDate(value.updatetime, true)}</span>
                                        <span className="article-msg-update">阅读 ({value.look})</span>
                                        <span>评论 ({value.commentNum})</span>
                                    </div>
                                </li>) : <Empty description="未找到相关文章" />
                            }
                        </Skeleton>
                    </ul>
                </div>
            </div>
        )
    }
}
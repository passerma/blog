import React from 'react';
import './MusicPlayNew.less';
import { Icon, Input, Skeleton, Empty, message, Button } from 'antd'
import { searchMusci, searchMusciUrl } from '../api'
import { setStorage, getStorage } from '../../CommonData/globalFun'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1889983_shtpjzvotoc.js', // 在 iconfont.cn 上生成
});

const { Search } = Input;

export default class MusicPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMusic: false,
            nowMusicTime: '00:00',
            allMusicTime: '00:00',
            audioCanPlay: false,
            audioPlay: false,
            playProcess: 0,
            soundProcess: 50,
            listType: 'play',
            musciUrl: '',
            openListBox: false,
            searchLoading: false,
            searchData: [],
            showSearchData: false,
            musicAuthor: '王菊',
            musicName: '苦尽甘来',
            musicImg: 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
            nowId: 1409975646,
            playType: '列表循环',
            playLoop: false,
            localPlayList: [],
            songCount: 0
        };
        this.musicSound = 50;
        this.playIndex = 0;
        this.offset = 0;
        this.noneImg = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
    }

    componentDidMount() {
        this.setState({
            localPlayList: getStorage('playList', [])
        }, () => {
            let { localPlayList } = this.state
            if (localPlayList.length === 0) {
                searchMusciUrl(1409975646, (res) => {
                    if (!res) {
                        console.error('未知错误')
                        return
                    }
                    if (res.ErrCode === 0) {
                        this.setState({
                            musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                            musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg
                        })
                    } else {
                        message.error('加载歌曲失败')
                    }
                })
            } else {
                this.setState({
                    musicAuthor: localPlayList[0].author,
                    musicName: localPlayList[0].name,
                    nowId: localPlayList[0].id
                })
                searchMusciUrl(localPlayList[0].id, (res) => {
                    if (!res) {
                        console.error('未知错误')
                        return
                    }
                    if (res.ErrCode === 0) {
                        this.setState({
                            musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                            musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg
                        })
                    } else {
                        message.error('加载歌曲失败')
                    }
                })
            }
        })
        let audio = this.refs.audio
        audio.volume = this.musicSound / 100;
        audio.addEventListener('loadedmetadata', this.audioLoad)
        audio.addEventListener('timeupdate', this.audioTimeupdate)
        audio.addEventListener('ended', this.audioEnded)
    }

    //#region 初始化控制
    /** 
     * 播放音乐
    */
    musicPlay = () => {
        if (!this.state.audioCanPlay) {
            return
        }
        let audio = this.refs.audio
        if (audio.paused || audio.ended) {
            this.setState({
                audioPlay: true
            })
            audio.play();
        }
        else {
            this.setState({
                audioPlay: false
            })
            audio.pause();
        }
    }

    /**
     * 音乐加载完成
     */
    audioLoad = () => {
        this.setState({
            allMusicTime: this.timeFormat(this.refs.audio.duration),
            audioCanPlay: true
        })
    }

    /** 
     * 时间更新
     */
    audioTimeupdate = () => {
        let audio = this.refs.audio
        let currentTime = audio.currentTime;
        let duration = audio.duration;
        let percent = 100 * currentTime / duration;
        this.setState({
            nowMusicTime: this.timeFormat(currentTime),
            playProcess: percent
        })
    }

    /** 
     * 播放结束
    */
    audioEnded = () => {
        if (this.state.localPlayList.length === 0) {
            this.setState({
                audioPlay: false
            })
        } else {
            this.qiehuan()
        }
    }

    /** 
     * 替换协议
    */
    translateHttp = (url) => {
        url = url.split('://')
        let newUrl = `//${url[1]}`
        return newUrl
    }

    /** 
     * 回到初始状态
     */
    recoverPlay = () => {
        let { audioPlay } = this.state
        let audio = this.refs.audio
        this.setState({
            audioCanPlay: false,
            nowMusicTime: '00:00',
            allMusicTime: '00:00',
            playProcess: 0,
            musicAuthor: '王菊',
            musicName: '苦尽甘来',
            nowId: 1409975646,
        })
        audio.pause()
        searchMusciUrl(1409975646, (res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                if (!res.data.url) {
                    message.error('该歌曲暂不能听噢，换一首吧')
                }
                if (audioPlay) {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                }
            } else {
                message.error('加载歌曲失败')
            }
        })
    }
    //#endregion

    //#region 时间进度条
    /**
     * 转化时间
     */
    timeFormat = (seconds) => {
        let minite = Math.floor(seconds / 60);
        if (minite < 10) {
            minite = "0" + minite;
        }
        let second = Math.floor(seconds % 60);
        if (second < 10) {
            second = "0" + second;
        }
        return minite + ":" + second;
    }

    /**
    * 拖拽时间进度条
    */
    enableProgressDrag = (e) => {
        if (!this.state.audioCanPlay) {
            return
        }
        let audio = this.refs.audio
        this.clientX = e.clientX
        let left = this.refs.progress.getBoundingClientRect().left
        this.nowWidth = this.clientX - left
        let timeP = this.nowWidth / 640
        audio.currentTime = audio.duration * timeP
        this.setState({
            playProcess: timeP * 100
        })
        document.addEventListener('mousemove', this.progressMove)
        document.addEventListener('mouseup', this.progressUp)
    }

    /** 
     * 进度条移动
     */
    progressMove = (e) => {
        let audio = this.refs.audio
        let move = e.clientX - this.clientX
        let dragWidth = move + this.nowWidth
        if (dragWidth <= 0) {
            dragWidth = 0
        }
        if (dragWidth >= 640) {
            dragWidth = 640
        }
        let timeP = dragWidth / 640
        audio.currentTime = audio.duration * timeP
        this.setState({
            playProcess: timeP * 100
        })
        document.addEventListener('mouseup', this.progressUp)
    }

    /** 
     * 进度条移动结束
    */
    progressUp = (e) => {
        let audio = this.refs.audio
        let move = e.clientX - this.clientX
        let dragWidth = move + this.nowWidth
        if (dragWidth <= 0) {
            dragWidth = 0
        }
        if (dragWidth >= 640) {
            dragWidth = 640
        }
        let timeP = dragWidth / 640
        audio.currentTime = audio.duration * timeP
        this.setState({
            playProcess: timeP * 100
        })
        document.removeEventListener('mousemove', this.progressMove)
        document.removeEventListener('mouseup', this.progressUp)
    }

    //#endregion

    //#region 声音进度条相关
    /** 
     * 声音进度条
     */
    enableSoundDrag = (e) => {
        let audio = this.refs.audio
        let clientX = e.clientX
        let left = this.refs.soundProgress.getBoundingClientRect().left
        let nowWidth = clientX - left
        let soundP = nowWidth / 45
        audio.volume = soundP
        this.setState({
            soundProcess: soundP * 100
        })
        this.musicSound = soundP * 100
    }

    /** 
     * 开启静音
     */
    changeSound = (e) => {
        let audio = this.refs.audio
        if (audio.volume === 0) {
            audio.volume = this.musicSound / 100
            this.setState({
                soundProcess: this.musicSound
            })
        } else {
            audio.volume = 0
            this.setState({
                soundProcess: 0
            })
        }

    }

    //#endregion

    //#region 播放模式
    /** 
     * 切换播放状态
     */
    changePlayType = () => {
        let { playType } = this.state
        if (playType === '列表循环') {
            this.setState({
                playType: '单曲循环',
                playLoop: true
            })
        } else if (playType === '单曲循环') {
            this.setState({
                playType: '列表循环',
                playLoop: false
            })
        }
    }

    /** 
     * 切换歌曲
     */
    qiehuan = (type) => {
        let { audioPlay, localPlayList } = this.state
        if (type === 'before') {
            if (this.playIndex === 0) {
                this.playIndex = localPlayList.length - 1
            } else {
                this.playIndex -= 1
            }
        } else {
            if (this.playIndex === (localPlayList.length - 1)) {
                this.playIndex = 0
            } else {
                this.playIndex += 1
            }
        }
        let audio = this.refs.audio
        audio.pause()
        let music = localPlayList[this.playIndex]
        this.setState({
            audioCanPlay: false,
            nowMusicTime: '00:00',
            allMusicTime: '00:00',
            playProcess: 0,
            musicAuthor: music.author,
            musicName: music.name,
            nowId: music.id,
        })
        searchMusciUrl(music.id, (res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                if (!res.data.url) {
                    message.error('该歌曲暂不能听了噢，换一首吧')
                }
                if (audioPlay) {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                }
            } else {
                message.error('加载歌曲失败')
            }
        })
    }

    /** 
     * 删除歌曲
    */
    delPlayList = (index) => {
        let { localPlayList, audioPlay } = this.state
        if (index === this.playIndex) {
            localPlayList.splice(index, 1)
            this.setState({
                localPlayList
            })
            setStorage('playList', localPlayList)
            if (localPlayList.length === 0) {
                this.recoverPlay()
            } else {
                let audio = this.refs.audio
                this.playIndex = 0
                let musicPlay = localPlayList[0]
                audio.pause()
                this.setState({
                    audioCanPlay: false,
                    nowMusicTime: '00:00',
                    allMusicTime: '00:00',
                    playProcess: 0,
                    musicAuthor: musicPlay.author,
                    musicName: musicPlay.name,
                    nowId: musicPlay.id,
                })
                searchMusciUrl(musicPlay.id, (res) => {
                    if (!res) {
                        console.error('未知错误')
                        return
                    }
                    if (res.ErrCode === 0) {
                        if (!res.data.url) {
                            message.error('该歌曲暂不能听了噢，换一首吧')
                        }
                        if (audioPlay) {
                            this.setState({
                                musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                                musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                                playProcess: 0,
                            })
                            audio.play()
                        } else {
                            this.setState({
                                musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                                musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                                playProcess: 0,
                            })
                        }
                    } else {
                        message.error('加载歌曲失败')
                    }
                })
            }
        } else {
            if (index < this.playIndex) {
                this.playIndex -= 1
            }
            localPlayList.splice(index, 1)
            this.setState({
                localPlayList
            })
            setStorage('playList', localPlayList)
        }
    }

    /** 
     * 播放列表歌曲
    */
    playListMusic = (value, index) => {
        let { audioPlay, nowId } = this.state
        let audio = this.refs.audio
        if (value.id === nowId) {
            this.musicPlay()
            return
        }
        this.playIndex = index
        audio.pause()
        this.setState({
            audioCanPlay: false,
            nowMusicTime: '00:00',
            allMusicTime: '00:00',
            playProcess: 0,
            musicAuthor: value.author,
            musicName: value.name,
            nowId: value.id,
        })
        searchMusciUrl(value.id, (res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                if (!res.data.url) {
                    message.error('该歌曲暂不能听了噢，换一首吧')
                }
                if (audioPlay) {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                }
            } else {
                message.error('加载歌曲失败')
            }
        })
    }

    /** 
     * 上一曲
     */
    playBefore = () => {
        if (this.state.localPlayList.length > 1) {
            this.qiehuan('before')
        } else {
            let audio = this.refs.audio
            audio.currentTime = 0;
            this.setState({
                nowMusicTime: '00:00',
                allMusicTime: '00:00',
                playProcess: 0,
            })
        }
    }

    /** 
     * 下一曲
    */
    playNext = () => {
        if (this.state.localPlayList.length > 1) {
            this.qiehuan('next')
        } else {
            let audio = this.refs.audio
            audio.currentTime = 0;
            this.setState({
                nowMusicTime: '00:00',
                allMusicTime: '00:00',
                playProcess: 0,
            })
        }
    }
    //#endregion 

    //#region 搜索相关
    /**
     * 打开搜索面板
     */
    searchOpen = (open) => {
        if (open) {
            this.setState({
                searchOpenBox: true
            })
        } else {
            this.setState({
                searchOpenBox: false
            })
        }
    }

    /** 
     * 搜索结果
    */
    searchMusciData = (value) => {
        if (value === '') {
            return
        }
        this.searchValue = value
        this.offset = 0
        this.setState({
            searchLoading: true,
            showSearchData: true,
        })
        searchMusci(value, this.offset, 10, (res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                this.setState({
                    searchLoading: false,
                    searchData: res.data.songCount > 0 ? res.data.songs : [],
                    songCount: res.data.songCount
                })
            } else {
                message.error('加载歌曲失败')
            }
        })
    }

    /** 
     * 向前搜
    */
    searchBefore = () => {
        this.offset -= 10;
        this.setState({
            searchLoading: true,
            showSearchData: true,
        })
        searchMusci(this.searchValue, this.offset, 10, (res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                this.setState({
                    searchLoading: false,
                    searchData: res.data.songCount > 0 ? res.data.songs : []
                })
            } else {
                message.error('加载歌曲失败')
            }
        })
    }

    /** 
     * 向后搜
    */
    searchNext = () => {
        this.offset += 10;
        this.setState({
            searchLoading: true,
            showSearchData: true,
        })
        searchMusci(this.searchValue, this.offset, 10, (res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                this.setState({
                    searchLoading: false,
                    searchData: res.data.songCount > 0 ? res.data.songs : []
                })
            } else {
                message.error('加载歌曲失败')
            }
        })
    }

    /** 
     * 播放搜索歌曲
     */
    playSelect = (value) => {
        let { audioPlay, nowId, localPlayList } = this.state
        let audio = this.refs.audio

        let index = -1
        for (let i = 0; i < localPlayList.length; i++) {
            if (localPlayList[i].id === value.id) {
                index = i
            }
        }
        if (index !== -1) {
            localPlayList.splice(index, 1)
        }
        localPlayList.unshift({
            author: value.artists[0].name,
            name: value.name,
            img: value.artists[0].picUrl ? this.translateHttp(value.artists[0].picUrl) : this.translateHttp(value.artists[0].img1v1Url),
            id: value.id
        })
        this.setState({
            localPlayList
        })
        this.playIndex = 0
        setStorage('playList', localPlayList)

        if (value.id === nowId) {
            this.musicPlay()
            return
        }
        audio.pause()
        this.setState({
            audioCanPlay: false,
            nowMusicTime: '00:00',
            allMusicTime: '00:00',
            playProcess: 0,
            musicAuthor: value.artists[0].name,
            musicName: value.name,
            nowId: value.id
        })
        searchMusciUrl(value.id, (res) => {
            if (!res) {
                console.error('未知错误')
                return
            }
            if (res.ErrCode === 0) {
                if (!res.data.url) {
                    message.error('该歌曲暂不能听噢，换一首吧')
                }
                if (audioPlay) {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        musicImg: res.data.picUrl ? this.translateHttp(res.data.picUrl) : this.noneImg,
                        playProcess: 0,
                    })
                }
            } else {
                message.error('加载歌曲失败')
            }
        })
    }
    //#endregion

    //#region 面板控制
    /** 
     * 播放列表开关
     */
    playListOpen = () => {
        let { openListBox } = this.state
        if (!openListBox) {
            this.setState({
                openListBox: true
            })
        } else {
            this.setState({
                openListBox: false
            })
        }
    }

    /** 
     * 播放列表开关
     */
    playListClose = () => {
        this.setState({
            openListBox: false
        })
    }

    /** 
     * 切换面板
    */
    changeTab = (type) => {
        this.setState({
            listType: type
        })
    }
    //#endregion
    render() {
        let { nowMusicTime, allMusicTime, audioCanPlay, audioPlay, playProcess, musciUrl, openListBox, listType,
            searchLoading, showSearchData, searchData, musicName, musicAuthor, musicImg, nowId, soundProcess,
            playType, playLoop, localPlayList, songCount } = this.state

        let loop = false
        if (localPlayList.length === 0 || localPlayList.length === 1) {
            loop = true
        }

        return (
            <div className={openListBox ? 'musicPlay musicPlay-hover' : 'musicPlay'}>
                <div className="musicPlay-hover"><MyIcon spin={audioPlay} type="icon-yinle" /></div>
                <div className="musicPlay-box">
                    <div className="musicPlay-img">
                        <img alt="封面图" style={{ width: '70px', height: '70px' }} src={musicImg} />
                        <div className="musicPlay-info">
                            <div className="musicPlay-title">{musicName}</div>
                            <div className="musicPlay-text">{musicAuthor}</div>
                        </div>
                    </div>
                    <div className="musicPlay-btn">
                        <div className="musicPlay-left">
                            <MyIcon onClick={this.playBefore} className="pointer" type="icon-shangyishou" />
                        </div>
                        <div className="musicPlay-center">
                            {
                                musciUrl ? (audioCanPlay ?
                                    (audioPlay ?
                                        <MyIcon type="icon-zanting" className="pointer" title="暂停" onClick={this.musicPlay} /> :
                                        <MyIcon type="icon-bofang" className="pointer" title="播放" onClick={this.musicPlay} />) :
                                    <MyIcon type="icon-jiazai" spin />) : <MyIcon type="icon-shibai" />
                            }
                        </div>
                        <div className="musicPlay-right">
                            <MyIcon onClick={this.playNext} className="pointer" type="icon-xiayishou" />
                        </div>
                    </div>
                    <div className="musicPlay-more">
                        <div className="musicPlay-more-btn musicPlay-more-btn-shenyin">
                            {
                                soundProcess === 0 ?
                                    <MyIcon className="pointer" type="icon-jingyin" onClick={this.changeSound} /> :
                                    <MyIcon className="pointer" type="icon-shengyi" onClick={this.changeSound} />
                            }
                            <div className="music-sound-progress" ref="soundProgress" onMouseDown={this.enableSoundDrag}>
                                <div className="music-sound-progress-bar" style={{ width: `${soundProcess}%` }}></div>
                            </div>
                        </div>
                        <div className="musicPlay-more-btn" onClick={this.changePlayType} title={playType}>
                            {
                                playType === '列表循环' && <MyIcon className="pointer" type="icon-liebiaobofang" />
                            }
                            {
                                playType === '单曲循环' && <MyIcon className="pointer" type="icon-danqubofang" />
                            }
                        </div>
                        <div className="musicPlay-more-btn">
                            <MyIcon className="pointer" title="列表" type="icon-liebiao" onClick={this.playListOpen} />
                        </div>
                    </div>
                </div>
                <div className="musicPlay-timeBar">
                    <div className="musicPlay-span" ref="progress" style={{ width: `${playProcess}%` }}></div>
                    <div className="musicPlay-timeBox" onMouseDown={this.enableProgressDrag} style={{ left: `${playProcess}%` }}>
                        {nowMusicTime}/{allMusicTime}
                    </div>
                </div>
                <div className="musicPlayMask"></div>
                <div className={openListBox ? 'musicPlay-list-box' : 'musicPlay-list-box musicPlay-list-box-none'}>
                    <div className="musicPlay-list-tab">
                        <span className="musicPlay-list-all"
                            style={listType === 'play' ? { fontWeight: 700, color: '#000' } : {}}
                            onClick={() => this.changeTab('play')}
                        >播放列表</span>
                        <span className="musicPlay-list-search"
                            style={listType === 'search' ? { fontWeight: 700, color: '#000' } : {}}
                            onClick={() => this.changeTab('search')}
                        >搜索列表</span>
                        <span className="musicPlay-list-close" onClick={this.playListClose} >X</span>
                    </div>
                    {
                        listType === 'play' && <div className="music-list-div">
                            <ul className="music-list-ul">
                                {
                                    localPlayList.length > 0 ? localPlayList.map((value, index) => <li
                                        className="music-list-list"
                                        style={value.id === nowId ? { background: '#e9e9e9' } : {}}
                                        key={index}
                                        onClick={() => this.playListMusic(value, index)}>
                                        <span className="music-list-name" title={value.name}>{value.name}</span>
                                        <span className="music-list-btn" title="删除" onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            this.delPlayList(index)
                                        }}>
                                            <MyIcon type="icon-mobile" />
                                        </span>
                                        <span className="music-list-author" title={value.author}>{value.author}</span>
                                    </li>) : <Empty></Empty>
                                }
                            </ul>
                        </div>
                    }
                    {
                        listType === 'search' && <div className="music-search-div">
                            <Search placeholder="输入歌曲名"
                                onSearch={value => this.searchMusciData(value)}
                                enterButton
                                loading={searchLoading} />
                            {
                                showSearchData && <Skeleton title={false}
                                    paragraph={{ rows: 10 }}
                                    loading={searchLoading}
                                    active>
                                    <ul>
                                        {
                                            searchData.length > 0 ? searchData.map((value, index) => <li
                                                className="search-music-list"
                                                style={value.id === nowId ? { background: '#e9e9e9' } : {}}
                                                key={index}
                                                onClick={() => this.playSelect(value)}>
                                                <span className="search-music-name" title={value.name}>{value.name}</span>
                                                <span className="search-music-author" title={value.artists[0].name}>{value.artists[0].name}</span>
                                            </li>) : <Empty></Empty>
                                        }
                                    </ul>
                                    <div className="search-music-list-btn">
                                        <Button className="search-music-list-btn-before" disabled={this.offset === 0}
                                            onClick={this.searchBefore}>上一页</Button>
                                        <Button className="search-music-list-btn-next" disabled={this.offset + 10 > songCount}
                                            onClick={this.searchNext}>下一页</Button>
                                    </div>
                                </Skeleton>
                            }
                        </div>
                    }
                </div>
                <audio
                    src={musciUrl}
                    className="musicPlay-audio"
                    ref="audio"
                    loop={playLoop || loop}
                ></audio>
            </div >
        );
    }
}
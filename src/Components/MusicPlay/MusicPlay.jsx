import React from 'react';
import './MusicPlay.less'
import { Icon, Popover, Input, Skeleton, Empty, message, Button } from 'antd'
import { searchMusci, searchMusciUrl } from '../api'
import { setStorage, getStorage } from '../../CommonData/globalFun'
import bgImg from '../../imgs/music-play.jpg'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1642174_glci2r4wyxp.js', // 在 iconfont.cn 上生成
});
const { Search } = Input;

class MusicPlay extends React.Component {
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
            musciUrl: '',
            searchOpenBox: false,
            searchLoading: false,
            searchData: [],
            showSearchData: false,
            musicAuthor: '王菊',
            musicName: '苦尽甘来',
            musicImg: 'https://p2.music.126.net/2JmaVc6vt7KHu3KTvv4Hsg==/109951164553024883.jpg',
            nowId: 1409975646,
            playType: '列表循环',
            playLoop: false,
            localPlayList: [],
            songCount: 0
        };
        this.musicSound = 50;
        this.playIndex = 0;
        this.offset = 0
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
                            musciUrl: res.data.url ? this.translateHttp(res.data.url) : ''
                        })
                    } else {
                        message.error('加载歌曲失败')
                    }
                })
            } else {
                this.setState({
                    musicAuthor: localPlayList[0].author,
                    musicName: localPlayList[0].name,
                    musicImg: localPlayList[0].img,
                    nowId: localPlayList[0].id
                })
                searchMusciUrl(localPlayList[0].id, (res) => {
                    if (!res) {
                        console.error('未知错误')
                        return
                    }
                    if (res.ErrCode === 0) {
                        this.setState({
                            musciUrl: res.data.url ? this.translateHttp(res.data.url) : ''
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
            musicImg: 'https://p2.music.126.net/2JmaVc6vt7KHu3KTvv4Hsg==/109951164553024883.jpg',
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
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        playProcess: 0,
                    })
                }
            } else {
                message.error('加载歌曲失败')
            }
        })
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

    //#region 时间进度条相关
    /** 
     * 时间进度条
     */
    // updateProgress = (x) => {
    //     let progress = this.refs.progress
    //     let position = x - progress.offset().left;
    //     let percentage = 100 * position / progress.width();
    //     if (percentage > 100) {
    //         percentage = 100;
    //     }
    //     if (percentage < 0) {
    //         percentage = 0;
    //     }
    //     $('.audio-by-now').css('width', percentage + '%');
    //     audio.currentTime = audio.duration * percentage / 100;
    // }

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
        let timeP = this.nowWidth / 250
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
        if (dragWidth >= 250) {
            dragWidth = 250
        }
        let timeP = dragWidth / 250
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
        if (dragWidth >= 250) {
            dragWidth = 250
        }
        let timeP = dragWidth / 250
        audio.currentTime = audio.duration * timeP
        this.setState({
            playProcess: timeP * 100
        })
        document.removeEventListener('mousemove', this.progressMove)
        document.removeEventListener('mouseup', this.progressUp)
    }

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
            musicImg: value.artists[0].picUrl ? this.translateHttp(value.artists[0].picUrl) : this.translateHttp(value.artists[0].img1v1Url),
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
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
                        playProcess: 0,
                    })
                }
            } else {
                message.error('加载歌曲失败')
            }
        })
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
     * @param {Number} type 切换形式
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
            musicImg: music.img,
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
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
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
                    musicImg: musicPlay.img,
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
                                playProcess: 0,
                            })
                            audio.play()
                        } else {
                            this.setState({
                                musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
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
     * 播放列表开关
     */
    playListOpen = (open) => {
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
            musicImg: value.img,
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
                        playProcess: 0,
                    })
                    audio.play()
                } else {
                    this.setState({
                        musciUrl: res.data.url ? this.translateHttp(res.data.url) : '',
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
    render() {
        let { nowMusicTime, allMusicTime, audioCanPlay, audioPlay, playProcess, musciUrl, searchOpenBox,
            searchLoading, showSearchData, searchData, musicName, musicAuthor, musicImg, nowId, soundProcess,
            playType, playLoop, localPlayList, songCount } = this.state

        let musciPlayClass = ''
        if (searchOpenBox) {
            musciPlayClass = 'musicPlay muscPlayHover'
        } else {
            musciPlayClass = 'musicPlay'
        }

        let loop = false
        if (localPlayList.length === 0 || localPlayList.length === 1) {
            loop = true
        }

        const content = (
            <div className="music-search-div">
                <Search placeholder="输入歌曲名"
                    onSearch={value => this.searchMusciData(value)}
                    enterButton
                    loading={searchLoading} />
                {
                    showSearchData && <Skeleton title={false}
                        paragraph={{ rows: 10, width: [240, 240, 240, 240, 240, 240, 240, 240, 240, 240] }}
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
        );

        const playListContent = <div className="music-list-div">
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
                            <MyIcon type="icon-shanchu" />
                        </span>
                        <span className="music-list-author" title={value.author}>{value.author}</span>
                    </li>) : <Empty></Empty>
                }
            </ul>
        </div>

        return (
            <div className={musciPlayClass}>
                <div className="musicPlay-mask">
                    <MyIcon spin={audioPlay && musciUrl} type="icon-yinle" />
                </div>
                <div className="musicPlay-img">
                    <img alt="封面图" src={musicImg} />
                    <div className="music-img-before" title="上一曲" onClick={this.playBefore}><MyIcon type="icon-jiantou-copy" /></div>
                    <div className="music-img-next" title="下一曲" onClick={this.playNext}><MyIcon type="icon-jiantou-copy" /></div>
                </div>
                <div className="musicPlay-wrap">
                    <img className="musicPlay-wrap-img" alt="播放器背景图" src={bgImg} />
                    <div className="music-info" title={`${musicName}-${musicAuthor}`}>{musicName}-{musicAuthor}</div>
                    <div className="music-btn">
                        <span className="music-sound" title="音量">
                            {
                                soundProcess === 0 ? <MyIcon type="icon-jingyin" /> : <MyIcon type="icon-shengyin" />
                            }
                            <div className="music-sound-change" onClick={this.changeSound}></div>
                            <div className="music-sound-mask"></div>
                            <div className="music-sound-progress" ref="soundProgress" onMouseDown={this.enableSoundDrag}>
                                <div className="music-sound-progress-bar" style={{ width: `${soundProcess}%` }}></div>
                            </div>
                        </span>
                        <span className="music-type" onClick={this.changePlayType} title={playType}>
                            {
                                playType === '列表循环' && <MyIcon type="icon-liebiaoxunhuan" />
                            }
                            {
                                playType === '单曲循环' && <MyIcon type="icon-danquxunhuan" />
                            }
                        </span>
                        <span className="music-play" onClick={this.musicPlay} title={audioPlay ? '暂停' : '播放'}>
                            {
                                musciUrl ? (audioCanPlay ?
                                    (audioPlay ? <MyIcon type="icon-bofang" /> : <MyIcon type="icon-zanting" />) :
                                    <Icon type="loading" />) : <MyIcon type="icon-shibai" />
                            }
                        </span>
                        <Popover
                            onVisibleChange={this.playListOpen}
                            placement="top"
                            content={playListContent}
                            trigger="click"
                            overlayClassName="music-list-box">
                            <span className="music-list" title="播放列表">
                                <MyIcon type="icon-liebiao" />
                            </span>
                        </Popover>
                        <Popover
                            onVisibleChange={this.searchOpen}
                            placement="rightTop"
                            content={content}
                            trigger="click"
                            overlayClassName="music-search-box">
                            <span className="music-search" title="搜索">
                                <Icon type="search" />
                            </span>
                        </Popover>
                    </div>
                    <span className="music-time-now">{nowMusicTime}</span>
                    <span className="music-time-all">{allMusicTime}</span>
                    <div className="music-progress" ref="progress" onMouseDown={this.enableProgressDrag}>
                        <div className="music-progress-bar" style={{ width: `${playProcess}%` }}></div>
                    </div>
                </div>
                <audio
                    src={musciUrl}
                    className="musicPlay-audio"
                    ref="audio"
                    loop={playLoop || loop}
                ></audio>
            </div >
        )
    }
}

export default MusicPlay;
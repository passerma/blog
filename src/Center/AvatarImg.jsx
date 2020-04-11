import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Modal, Button, Icon, message } from 'antd';
import { COMMON_URL } from '../CommonData/api'
import './AvatarImg.less'
export default class UpImgCom extends React.Component {
    constructor(props) {
        super(props);
        let { avatar } = this.props
        this.state = {
            originImg: null,
            lookImg: `${COMMON_URL}/file/get/avatar?avatar=${avatar}`,
            scale: 1,
            rotate: 0,
            loading: false
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        let avatar = nextProps.avatar
        this.setState({
            lookImg: `${COMMON_URL}/file/get/avatar?avatar=${avatar}`,
        })
    }
    /** 
     * 确定图片
    */
    onClickSave = () => {
        this.setState({
            loading: true
        })
        if (!this.state.originImg) {
            this.setState({
                loading: false
            })
            message.success('修改成功')
            this.props.onCancel()
            return
        }
        const canvasScaled = this.refs.editor.getImageScaledToCanvas();
        canvasScaled.toBlob((file) => {
            let formData = new FormData();
            let url = `${COMMON_URL}/file/post/avatar`
            formData.append('imgfile', file);
            fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            })
                .then(response => response.json())
                .catch(error => {
                    console.error(error)
                    this.setState({
                        loading: false
                    })
                })
                .then(res => {
                    let { avatar } = this.props
                    this.setState({
                        loading: false,
                        lookImg: `${COMMON_URL}/file/get/avatar?avatar=${avatar}`,
                    })
                    if (res.ErrCode === 0) {
                        message.success('修改成功')
                        this.props.onOk(canvasScaled.toDataURL("image/png"))
                    } else {
                        message.error(res.ErrMsg)
                    }
                })
        });
    }
    /** 
     * 放大缩小图片
    */
    handleScroll = (e) => {
        if (e.deltaY > 0) {
            this.onSmall()
        } else {
            this.onBig()
        }
    }

    /** 
     * 放大图片
    */
    onBig = () => {
        if (!this.state.originImg) {
            return
        }
        this.setState({
            scale: this.state.scale + 0.2
        })
    }

    /** 
     * 缩小图片
    */
    onSmall = () => {
        if (!this.state.originImg) {
            return
        }
        this.setState({
            scale: this.state.scale - 0.1 <= 0.1 ? 0.1 : this.state.scale - 0.1
        })
    }

    /** 
     * 左旋转图片
     */
    onLeft = () => {
        if (!this.state.originImg) {
            return
        }
        let { rotate } = this.state
        this.setState({
            rotate: rotate -= 90
        })
    }

    /** 
     * 右旋转图片
     */
    onRight = () => {
        if (!this.state.originImg) {
            return
        }
        let { rotate } = this.state
        this.setState({
            rotate: rotate += 90
        })
    }

    /** 
     * 点击上传
    */
    clickInput = () => {
        this.refs.input.click()
    }

    /** 
     * 上传成功
    */
    onAvatarUpload = () => {
        let fileField = this.refs.input
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgFile = e.target.result;
            this.setState({
                originImg: imgFile,
                scale: 1,
                rotate: 0
            });
        };
        reader.readAsDataURL(fileField.files[0]);
    }
    onLook = () => {
        if (!this.state.originImg) {
            return
        }
        const canvasScaled = this.refs.editor.getImageScaledToCanvas();
        this.setState({
            lookImg: canvasScaled.toDataURL("image/png")
        })
    }
    render() {
        let { originImg, scale, rotate, lookImg, loading } = this.state
        let { needShow } = this.props
        return (
            <div>
                <Modal
                    title="更换头像"
                    visible={needShow}
                    destroyOnClose
                    onOk={this.onClickSave}
                    onCancel={this.props.onCancel}
                    className="avatarImg-model"
                    width={650}
                    okText="确定"
                    cancelText="取消"
                    centered={true}
                    confirmLoading={loading}
                >
                    <div className="avatarImg-edit">
                        <div className="avatarImg-edit-mask" style={originImg ? { display: 'none' } : {}}></div>
                        <AvatarEditor
                            ref="editor"
                            onWheel={e => this.handleScroll(e)}
                            image={originImg}
                            width={240}
                            height={240}
                            border={60}
                            color={[127, 127, 127, .8]}
                            borderRadius={120}
                            scale={parseFloat(scale)}
                            style={{ margin: '0 50px' }}
                            rotate={rotate}
                        />
                    </div>
                    <div className="avatarImg-left">
                        <input ref="input" type="file" onChange={this.onAvatarUpload} style={{ display: 'none' }}></input>
                        <Button onClick={this.clickInput} type="primary">选择图片</Button>
                        <div className="avatarImg-left-btn">
                            <Icon type="undo" onClick={this.onLeft} />
                            <Icon type="plus" onClick={this.onBig} />
                            <Icon type="minus" onClick={this.onSmall} />
                            <Icon type="redo" onClick={this.onRight} />
                        </div>
                        <div className="avatarImg-left-look">
                            <Button onClick={this.onLook}>预览</Button>
                            <img alt="预览头像" ref="img" src={lookImg} />
                            <span>100 X 100</span>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
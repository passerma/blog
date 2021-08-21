import { Modal, Icon } from 'antd';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import './ImageView.less'

interface imageView {
    visible: boolean,
    index: number,
    images: string[],
    onClose: () => void
}

interface imgChange {
    width: number,
    height: number,
    scale: number,
    left: number,
    top: number
}

const ImageView = (props: imageView) => {
    const [index, setindex] = useState(props.index)
    const [scale, setscale] = useState(1)
    const [top, settop] = useState(0)
    const [left, setleft] = useState(0)
    const [width, setwidth] = useState(0)
    const [height, setheight] = useState(0)

    const imgControl = useRef<HTMLDivElement>(null)
    const imgView = useRef<HTMLImageElement>(null)

    const mouseData = useRef({ x: 0, y: 0 })
    const imgData = useRef({ w: 0, h: 0 })

    /**
     * 重置
     */
    const _reset = () => {
        settop(0)
        setleft(0)
        setscale(1)
        setwidth(imgData.current.w)
        setheight(imgData.current.h)
    }

    /**
     * 下一张
     */
    const _nextPic = () => {
        if (index >= props.images.length - 1) {
            setindex(0)
            _reset()
        } else {
            setindex(index + 1)
            _reset()
        }
    }

    /**
     * 上一张
     */
    const _proviPic = () => {
        if (index === 0) {
            setindex(props.images.length - 1)
            _reset()
        } else {
            setindex(index - 1)
            _reset()
        }
    }

    /**
     * 鼠标移动
     */
    const _mousemove = (e: MouseEvent) => {
        let changeLeft = e.pageX - mouseData.current.x
        let changeTop = e.pageY - mouseData.current.y
        setleft(left + changeLeft)
        settop(top + changeTop)
    }

    /**
     * 鼠标抬起
     */
    const _mouseup = (e: MouseEvent) => {
        imgControl.current?.removeEventListener('mousemove', _mousemove)
        imgControl.current?.removeEventListener('mouseup', _mouseup)
    }

    /**
     * 鼠标按下
     */
    const _onMouseDown = (e: React.MouseEvent) => {
        mouseData.current.x = e.pageX
        mouseData.current.y = e.pageY
        imgControl.current?.addEventListener('mousemove', _mousemove)
        imgControl.current?.addEventListener('mouseup', _mouseup)
    }

    /**
     * 设置改变后额图片
     * @param data 数据
     */
    const setImg = (data: imgChange) => {
        setwidth(data.width)
        setheight(data.height)
        setscale(data.scale)
        setleft(data.left)
        settop(data.top)
    }

    /**
     * 滚轮事件
     */
    const _onWheel = (e: React.WheelEvent) => {
        let event = e.nativeEvent
        if (event.deltaY > 0) {
            if (scale > 0.6) {
                let mouseX = e.pageX - imgView.current!.getBoundingClientRect().left
                let mouseY = e.pageY - imgView.current!.getBoundingClientRect().top
                let changeX = mouseX * ((scale - 0.2) / scale) - mouseX
                let changeY = mouseY * ((scale - 0.2) / scale) - mouseY
                let setData: imgChange = {
                    width: 0,
                    height: 0,
                    scale: scale - 0.2,
                    left: left - changeX,
                    top: top - changeY,
                }
                if (width === 0 || height === 0) {
                    let w = imgControl.current!.offsetWidth
                    let h = imgControl.current!.offsetHeight
                    imgData.current.w = w
                    imgData.current.h = h
                    setData.width = w * ((scale - 0.2) / scale)
                    setData.height = h * ((scale - 0.2) / scale)
                    setImg(setData)
                } else {
                    setData.width = width * ((scale - 0.2) / scale)
                    setData.height = height * ((scale - 0.2) / scale)
                    setImg(setData)
                }
            }
        } else {
            if (scale < 4) {
                let mouseX = e.pageX - imgView.current!.getBoundingClientRect().left
                let mouseY = e.pageY - imgView.current!.getBoundingClientRect().top
                let changeX = mouseX * ((scale + 0.2) / scale) - mouseX
                let changeY = mouseY * ((scale + 0.2) / scale) - mouseY
                let setData: imgChange = {
                    width: 0,
                    height: 0,
                    scale: scale + 0.2,
                    left: left - changeX,
                    top: top - changeY,
                }
                if (width === 0 || height === 0) {
                    let w = imgControl.current!.offsetWidth
                    let h = imgControl.current!.offsetHeight
                    imgData.current.w = w
                    imgData.current.h = h
                    setData.width = w * ((scale + 0.2) / scale)
                    setData.height = h * ((scale + 0.2) / scale)
                    setImg(setData)
                } else {
                    setData.width = width * ((scale + 0.2) / scale)
                    setData.height = height * ((scale + 0.2) / scale)
                    setImg(setData)
                }
            }
        }
    }

    useEffect(() => {
        if (props.visible === true) {
            setindex(props.index)
            _reset()
        }
    }, [props.visible, props.index])

    const style = {
        top: `${top}px`,
        left: `${left}px`,
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
    }

    return (
        <Modal
            centered
            width="100%"
            className="imageView-modal"
            title={null}
            footer={null}
            onCancel={props.onClose}
            visible={props.visible}
        >
            {
                props.images.length > 1 && <Fragment>
                    <Icon type="right-circle" onClick={_nextPic} />
                    <Icon type="left-circle" onClick={_proviPic} />
                </Fragment>
            }
            <div className="imageView-modal-box">
                <img src={props.images[index]} style={style} alt="" ref={imgView} />
                <div className="imageView-control" onMouseDown={_onMouseDown} ref={imgControl} onWheel={_onWheel}></div>
            </div>
        </Modal>
    );
}

export default ImageView

import { Modal, Icon } from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import './ImageView.less'

interface imageView {
    visible: boolean,
    index: number,
    images: string[],
    onClose: () => void
}

const ImageView = (props: imageView) => {

    const [index, setindex] = useState(props.index)

    useEffect(() => {
        if (props.visible === true) {
            setindex(props.index)
        }
    }, [props.visible])

    const _nextPic = () => {
        if (index >= props.images.length - 1) {
            setindex(0)
        } else {
            setindex(index + 1)
        }
    }

    const _proviPic = () => {
        if (index === 0) {
            setindex(props.images.length - 1)
        } else {
            setindex(index - 1)
        }
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
                <img src={props.images[index]} alt="" />
            </div>
        </Modal>
    );
}

export default ImageView
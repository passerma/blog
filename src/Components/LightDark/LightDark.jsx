import React, { useState, useEffect } from 'react';
import './LightDark.less'
import { getStorage, setStorage } from '../../CommonData/globalFun'
import { Icon } from 'antd'

const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1797898_430q8swg1yu.js', // 在 iconfont.cn 上生成
});

export default function () {
    const [isLight, setLight] = useState(true)

    useEffect(() => {
        let lightTheme = getStorage('lightTheme', true)
        if (lightTheme) {
            document.querySelector('html').classList.remove("html-dark")
        } else {
            document.querySelector('html').classList.add("html-dark")
        }
        setLight(lightTheme)
    }, [])

    /**
     * 点击改变主题
     */
    const handelChange = () => {
        if (isLight) {
            document.querySelector('html').classList.add("html-dark")
            setStorage('lightTheme', false)
        } else {
            document.querySelector('html').classList.remove("html-dark")
            setStorage('lightTheme', true)
        }
        setLight(!isLight)
    }

    return <div onClick={handelChange} className="lightDark">
        {
            isLight ? <MyIcon type="icon-baitianmoshi" /> : <MyIcon type="icon-yejianmoshi" />
        }
    </div>
}
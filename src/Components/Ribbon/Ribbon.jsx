import React from 'react';
import './Ribbon.less'

export default class LightDark extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.ctx = null
    }
    componentDidMount() {
        this.RIBBON_WIDTH = this.props.RIBBON_WIDTH || 120
        let canvasRibbon = this.refs.ribbonCanvas
        let ctx = canvasRibbon.getContext('2d')   // 获取canvas 2d上下文
        this.ctx = ctx
        let dpr = window.devicePixelRatio || 1 // the size of one CSS pixel to the size of one physical pixel.
        this.width = canvasRibbon.offsetWidth     // 返回窗口的文档显示区的宽高
        this.height = canvasRibbon.offsetHeight
        this.r = 0
        this.PI_2 = Math.PI * 2    // 圆周率*2
        this.cos = Math.cos  // cos函数返回一个数值的余弦值（-1~1）
        this.random = Math.random  // 返回0-1随机数
        canvasRibbon.width = this.width * dpr;     // 返回实际宽高
        canvasRibbon.height = this.height * dpr;
        ctx.scale(dpr, dpr);    // 水平、竖直方向缩放
        ctx.globalAlpha = this.props.globalAlpha || 0.6;  // 图形透明度  
        this.init()
        document.addEventListener('click', this.init)
    }

    init = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);     // 擦除之前绘制内容
        this.path = [{ x: 0, y: this.height * 0.7 + this.RIBBON_WIDTH }, { x: 0, y: this.height * 0.7 - this.RIBBON_WIDTH }];
        // 路径没有填满屏幕宽度时，绘制路径
        while (this.path[1].x < this.width + this.RIBBON_WIDTH) {
            this.draw(this.path[0], this.path[1])
        }
    }

    draw = (start, end) => {
        let ctx = this.ctx
        let cos = this.cos
        ctx.beginPath();    // 创建一个新的路径
        ctx.moveTo(start.x, start.y);   // path起点
        ctx.lineTo(end.x, end.y);   // path终点
        let nextX = end.x + (this.random() * 2 - 0.25) * this.RIBBON_WIDTH
        let nextY = this.geneY(end.y);
        ctx.lineTo(nextX, nextY);
        ctx.closePath();

        this.r -= this.PI_2 / -50;
        // 随机生成并设置canvas路径16进制颜色
        // eslint-disable-next-line no-mixed-operators
        ctx.fillStyle = '#' + (cos(this.r) * 127 + 128 << 16 | cos(this.r + this.PI_2 / 3) * 127 + 128 << 8 | cos(this.r + this.PI_2 / 3 * 2) * 127 + 128).toString(16);
        ctx.fill();     // 根据当前样式填充路径
        this.path[0] = this.path[1];    // 起点更新为当前终点
        this.path[1] = { x: nextX, y: nextY }     // 更新终点
    }

    geneY = (y) => {
        let temp = y + (this.random() * 2 - 1.1) * this.RIBBON_WIDTH;
        return (temp > this.height || temp < 0) ? this.geneY(y) : temp;
    }

    render() {
        return <canvas ref="ribbonCanvas" className="ribbon" onClick={this.init}></canvas>
    }
}
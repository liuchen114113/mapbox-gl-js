// @flow
/*
 * @Description:  图层控件
 * @Author: liuchen@hiynn.com
 * @Date: 2018-06-28 13:40:12
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-07-06 18:32:34
 */

import {extend} from '../../util/util';

const defaultProps = {
    pattern: 'v',
    position: 'top-right',
    size: 30,
    check: true
};

class LayerControl {
    /**
     * 初始化
     * @param {Object} options 参数
     * @param {String} [options.pattern='v'] 排列方式 默认为垂直('v','h')
     * @param {String} [options.position='top-right] 位置 默认右上, 当排列方式为水平时, 自动居中.左右不产生实际效果
     * @param {Number} [options.size='50'] 图标尺寸
     * @param {Boolean} [options.check=true] 勾选框 默认显示
     */
    constructor(props) {

        props = extend({}, defaultProps, props);
        const {pattern, position, size, check} = props;
        this.pattern = pattern;
        this.position = position;
        this.size = size;
        this.check = check;
        this._container = document.createElement('div');
        this._container.className = 'curvemapgl-ctrl';
        this._container.addEventListener('contextmenu', (e) => e.preventDefault());
        this.btn = document.createElement('ul');
        this.btn.className = 'curvemapgl-ctrl-ul';
        this._container.appendChild(this.btn);
        this.btn.addEventListener('click', (e) => {

            let target = e.target;
            if (target.tagName.toLowerCase() === "input") {
                if (target.checked) {
                    target.checked = false;
                } else {
                    target.checked = true;
                }
            }
            while (1 == 1) {
                if (target.tagName.toLowerCase() === 'li') {
                    break;
                }
                target = target.parentNode;
            }
            const checkNode = target.childNodes[0];
            const id = target.dataset.layerId;
            if (checkNode.checked) {

                this._map.setLayoutProperty(id, 'visibility', 'none');
                this._map.getLayer(`${id}-hover`) && this._map.setLayoutProperty(`${id}-hover`, 'visibility', 'visible');
                checkNode.checked = false;

            } else {

                this._map.setLayoutProperty(id, 'visibility', 'visible');
                this._map.getLayer(`${id}-hover`) && this._map.setLayoutProperty(`${id}-hover`, 'visibility', 'visible');
                checkNode.checked = true;

            }

        });

    }


    /**
     * 添加
     * @private
     * @param {*} map
     */
    onAdd(map) {

        this._map = map;
        this._map.on('addLayer', e => {

            const layer = this._map.getLayer(e.id);
            if (!layer.hasOwnProperty('source-layer') && layer.id !== 'BG' && layer.id !== 'bg') {

                const type = layer.type;
                const li = document.createElement('li');
                li.id = `li_${e.id}`;
                li.dataset.layerId = e.id;
                li.className = 'curvemapgl-ctrl-li';
                const checkbox = document.createElement('input');
                checkbox.style.display = "none";
                if (this.check) {
                    checkbox.style.display = "";
                }
                checkbox.setAttribute('type', 'checkbox');
                checkbox.checked = true;
                checkbox.id = e.id;
                const canvas = document.createElement('canvas');
                canvas.width = this.size;
                canvas.height = this.size;
                canvas.className = 'curvemapgl-ctrl-canvas';
                const label = document.createElement('span');
                label.className = 'curvemapgl-ctrl-span';
                label.innerHTML = e.name;
                li.appendChild(checkbox);
                li.appendChild(canvas);
                li.appendChild(label);
                this.btn.appendChild(li);
                const ctx = canvas.getContext('2d');

                if (type === 'circle') {

                    ctx.beginPath();
                    const border = this.size / 2;
                    ctx.arc(border, border, border, 0, 360, false);
                    let color = e.paint['circle-color'];
                    if (typeof color === 'object') {

                        color = 'aquamarine';

                    }
                    ctx.fillStyle = color;//填充颜色
                    ctx.fill();//画实心圆
                    ctx.closePath();

                } else if (type === 'symbol') {

                    const icon = e.layout['icon-image'];
                    const image = this._map.style.getImage(icon);
                    if (image) {

                        const imgData = new ImageData(new Uint8ClampedArray(image.data.data), image.data.width, image.data.height);
                        //创建临时层存放图片
                        const tmpcanvas = document.createElement('canvas');
                        tmpcanvas.width = image.data.width;
                        tmpcanvas.height = image.data.height;
                        const tctx = tmpcanvas.getContext('2d');
                        tctx.putImageData(imgData, 0, 0);
                        //创建image对象存放图片进行缩放
                        const imageObject = new Image();
                        imageObject.onload = () => {

                            //缩放后放入展示层
                            ctx.scale(this.size / image.data.width, this.size / image.data.height);
                            ctx.drawImage(imageObject, 0, 0);

                        };
                        imageObject.src = tmpcanvas.toDataURL();

                    }

                } else if (type === 'line') {
                    ctx.moveTo(0, this.size);
                    ctx.lineTo(this.size / 3, this.size / 2);
                    ctx.lineTo(2 * this.size / 3, this.size / 2);
                    ctx.lineTo(this.size, 0);
                    let color = e.paint['line-color'];
                    if (typeof color === 'object') {

                        color = 'aquamarine';

                    }
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = color;//填充颜色,默认是红色
                    ctx.stroke();
                } else if (type === 'airline') {
                    ctx.moveTo(0, 2 * this.size / 3);
                    ctx.bezierCurveTo(0, 2 * this.size / 3, this.size / 2, this.size / 3, this.size, 2 * this.size / 3);
                    let color = e.paint['airline-color'];
                    if (typeof color === 'object') {

                        color = 'aquamarine';

                    }
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = color;//填充颜色,默认是红色
                    ctx.stroke();
                } else if (type === 'fill') {

                    let color = e.paint['fill-color'];
                    if (typeof color === 'object') {

                        color = 'aquamarine';

                    }
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, this.size, this.size);
                }

            }

        });
        this._map.on('removeLayer', e => {

            const li = document.querySelector(`#li_${e.id}`);
            this.btn.removeChild(li);

        });


        if (this.pattern === 'v') {


            return this._container;

        } else {

            if (this.position.indexOf('top') > -1) {

                this._container.className += ' curvemapgl-ctrl-top-center curvemapgl-ctrl-ul-h';

            } else {

                this._container.className += ' curvemapgl-ctrl-bottom-center curvemapgl-ctrl-ul-h';

            }

            const parent = document.querySelector('.curvemapgl-control-container');
            parent.appendChild(this._container);
            return document.createElement('div');

        }

    }

    /**
     * 移除时
     * @private
     */
    onRemove() {

        this._container.parentNode.removeChild(this._container);
        this._map = undefined;

    }
}

export default LayerControl;

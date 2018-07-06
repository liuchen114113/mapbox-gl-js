/*
 * @Description:  地图样式集切换控件
 * @Author: liuchen@hiynn.com
 * @Date: 2018-06-27 10:25:04
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-07-06 18:40:30
 */
// @flow

import { extend } from '../../util/util';

const defaultProps = {
    style_image_mapping: [{
        styleUrl: 'http://192.168.1.201:8003/curvemapStyle/libs/customMap/black/style.json',
        imageUrl: 'data:image/png;base64,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'
    }]
};

class StyleToggleControl {

    constructor(props) {
        this._map = null;
        props = extend({}, defaultProps, props);
        this.style_image_mapping = props.style_image_mapping;
        this.sprite = null;
    }

    onAdd(map) {
        this._map = map;

        this._container = document.createElement('div');
        this._container.className = 'curvemapgl-ctrl';
        const styleToggle = document.createElement('div');
        styleToggle.className = 'style-toggle-container';
        this.styleToggleContainer = styleToggle;
        const curvemapStyleContainer = document.createElement('div');
        curvemapStyleContainer.className = 'curvemap-style-container';
        styleToggle.appendChild(curvemapStyleContainer);
        this._container.appendChild(styleToggle);

        const spritUrl = this._map.getStyle().sprite;
        fetch(`${spritUrl}.json`).then(response => response.json()).then(json => {
            this.sprite = json;     //读取服务器雪碧图资源 
            const onclick = e => {
                this.toogleMapStyle(e);
            };
            this.style_image_mapping.map((value) => {

                const div = document.createElement('div');
                div.className = 'child-style-container';
                div.style.backgroundImage = `url(${value.imageUrl})`;
                div.style.display = 'none';
                div.onclick = onclick;
                div.setAttribute('styleUrl', value.styleUrl);
                this.styleToggleContainer.appendChild(div);

            });
            this.styleToggleContainer.style.backgroundImage = `url(${this.style_image_mapping[0].imageUrl})`;
            this.stylesContainerChilds = this.styleToggleContainer.childNodes;
            const firstChild = this.stylesContainerChilds[1];
            firstChild.style.display = 'block';
            firstChild.className += ' container-border';

            const onmouseover = () => {
                this.showStyleContainer();
            };
            const onmouseleave = () => {
                this.hideStyleContainer();
            };
            this.styleToggleContainer.onmouseover = onmouseover;
            this.styleToggleContainer.onmouseleave = onmouseleave;

        });
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    showStyleContainer() {
        for (let i = 1; i < this.stylesContainerChilds.length; i++) {

            this.stylesContainerChilds[i].style.display = 'block';

        }
    }

    hideStyleContainer() {
        this.styleToggleContainer.childNodes.forEach(div => {

            if (div.className.indexOf('container-border') < 0) {

                div.style.display = 'none';

            }

        });
        this.styleToggleContainer.style.cursor = '';
    }

    toogleMapStyle(e) {

        const targetDiv = e.target;
        // 改变容器样式
        if (targetDiv.className.indexOf('container-border') < 0) {

            this.styleToggleContainer.childNodes.forEach(div => {

                div.className = div.className.replace(' container-border', '');

            });
            targetDiv.className += ' container-border';

            // 切换地图
            const styleUrl = targetDiv.getAttribute('styleUrl');

            const oldStyle = this._map.getStyle();
            const oldStyleObj = this._map.style;
            this._map.setStyle(styleUrl);
            this._map.once('styledata', () => {

                // 保留原有图层
                if (oldStyle) {

                    const style = this._map.getStyle();
                    const source = oldStyle.sources;
                    Object.keys(source).map(value => {
                        if (source[value].type === 'geojson') {
                            style.sources[value] = source[value];
                        }
                    });
                    const { layers } = oldStyle;

                    for (let i = 0; i < layers.length; i++) {

                        if (!layers[i].hasOwnProperty('source-layer') && layers[i].id !== 'BG' && layers[i].id !== 'bg') { // 区分图层属于底图还是业务图层

                            const layer = layers[i];
                            if (layer.type === 'symbol') {

                                const icon = layer.layout['icon-image'];
                                const image = oldStyleObj.getImage(icon);
                                if (!this.sprite.hasOwnProperty(icon)) {
                                    if (image) {
                                        this._map.addImage(icon, image.data);
                                    }
                                }
                            }
                            style.layers.push(layer);
                        }
                    }
                    this._map.setStyle(style);
                }
            });
        }
    }
}

export default StyleToggleControl;

// @flow
/*
 * @Description:  2d/3d切换控件
 * @Author: liuchen@hiynn.com 
 * @Date: 2018-06-26 18:38:17 
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-07-06 18:40:15
 */

import {hasClass, addClass, removeClass} from '../../util/cssClassInspection';

class Pitch2dControl {
    constructor() {

        this._container = document.createElement('div');
        this._container.className = 'curvemapgl-ctrl curvemapgl-ctrl-group';
        this._container.addEventListener('contextmenu', (e) => e.preventDefault());
        this.btn = document.createElement('button');
        this.btn.className = 'curvemapgl-ctrl-icon  curvemapgl-ctrl-view  curvemapgl-ctrl-view2d';
        this._container.appendChild(this.btn);

    }

    onAdd(map) {

        this._map = map;
        this._container.addEventListener('click', () => {

            if (hasClass(this.btn, 'curvemapgl-ctrl-view2d')) {

                this._map.easeTo({pitch: 45});
                removeClass(this.btn, 'curvemapgl-ctrl-view2d');
                addClass(this.btn, 'curvemapgl-ctrl-view3d');

            } else {

                addClass(this.btn, 'curvemapgl-ctrl-view2d');
                removeClass(this.btn, 'curvemapgl-ctrl-view3d');
                this._map.easeTo({pitch: 0});

            }

        });
        return this._container;

    }

    onRemove() {

        this._container.parentNode.removeChild(this._container);
        this._map = undefined;

    }
}

export default Pitch2dControl;

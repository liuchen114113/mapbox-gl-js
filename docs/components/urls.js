import {version} from '../../package.json';
import {prefixUrl} from '@mapbox/batfish/modules/prefix-url';

function url(ext, options) {
    if (options && options.local && process.env.DEPLOY_ENV === 'local') {
        return prefixUrl(`/dist/curvemap-gl.${ext}`);
    } else {
        return `https://api.tiles.curvemap.com/curvemap-gl-js/v${version}/curvemap-gl.${ext}`;
    }
}

function js(options) {
    return url('js', options);
}

function css(options) {
    return url('css', options);
}

export default {js, css};

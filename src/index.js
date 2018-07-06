// @flow

import assert from 'assert';
import supported from '@hymap/hymap-gl-supported';

import browser from './util/browser';
import { version } from '../package.json';
import Map from './ui/map';
import NavigationControl from './ui/control/navigation_control';
import GeolocateControl from './ui/control/geolocate_control';
import AttributionControl from './ui/control/attribution_control';
import ScaleControl from './ui/control/scale_control';
import FullscreenControl from './ui/control/fullscreen_control';
//lc
import Pitch2dControl from './ui/control/pitch2d_control';
import StyleToggleControl from './ui/control/styleToggle_control';
import LayerLegendControl from './ui/control/layerLegend_control';

import Popup from './ui/popup';
import Marker from './ui/marker';
import Style from './style/style';
import LngLat from './geo/lng_lat';
import LngLatBounds from './geo/lng_lat_bounds';
import Point from '@hymap/point-geometry';
import {Evented} from './util/evented';
import config from './util/config';
import {setRTLTextPlugin} from './source/rtl_text_plugin';

const exported = {
    version,
    supported,
    workerCount: Math.max(Math.floor(browser.hardwareConcurrency / 2), 1),
    setRTLTextPlugin: setRTLTextPlugin,
    Map,
    NavigationControl,
    GeolocateControl,
    AttributionControl,
    ScaleControl,
    FullscreenControl,
    Pitch2dControl,
    StyleToggleControl,
    LayerLegendControl,
    Popup,
    Marker,
    Style,
    LngLat,
    LngLatBounds,
    Point,
    Evented,
    config,

    /**
     * Gets and sets the map's [access token](https://www.curvemap.com/help/define-access-token/).
     *
     * @var {string} accessToken
     * @example
     * curvemapgl.accessToken = myAccessToken;
     * @see [Display a map](https://www.curvemap.com/curvemap-gl-js/examples/)
     */
    get accessToken() {
        return config.ACCESS_TOKEN;
    },

    set accessToken(token: string) {
        config.ACCESS_TOKEN = token;
    },

    workerUrl: ''
};

/**
 * The version of Curvemap GL JS in use as specified in `package.json`,
 * `CHANGELOG.md`, and the GitHub release.
 *
 * @var {string} version
 */

/**
 * Test whether the browser [supports Curvemap GL JS](https://www.curvemap.com/help/curvemap-browser-support/#curvemap-gl-js).
 *
 * @function supported
 * @param {Object} [options]
 * @param {boolean} [options.failIfMajorPerformanceCaveat=false] If `true`,
 *   the function will return `false` if the performance of Curvemap GL JS would
 *   be dramatically worse than expected (e.g. a software WebGL renderer would be used).
 * @return {boolean}
 * @example
 * curvemapgl.supported() // = true
 * @see [Check for browser support](https://www.curvemap.com/curvemap-gl-js/example/check-for-support/)
 */

/**
 * Sets the map's [RTL text plugin](https://www.curvemap.com/curvemap-gl-js/plugins/#curvemap-gl-rtl-text).
 * Necessary for supporting languages like Arabic and Hebrew that are written right-to-left.
 *
 * @function setRTLTextPlugin
 * @param {string} pluginURL URL pointing to the Curvemap RTL text plugin source.
 * @param {Function} callback Called with an error argument if there is an error.
 * @example
 * curvemapgl.setRTLTextPlugin('https://api.curvemap.com/curvemap-gl-js/plugins/curvemap-gl-rtl-text/v0.1.2/curvemap-gl-rtl-text.js');
 * @see [Add support for right-to-left scripts](https://www.curvemap.com/curvemap-gl-js/example/curvemap-gl-rtl-text/)
 */

export default exported;

// canary assert: used to confirm that asserts have been removed from production build
assert(true, 'canary assert');

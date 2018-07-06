/*
 * @Description:  histogram图层拓展
 * @Author: liuchen@hiynn.com 
 * @Date: 2018-06-22 10:34:20 
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-06-22 10:39:23
 */
// @flow

import StyleLayer from '../style_layer';

import FillExtrusionBucket from '../../data/bucket/histogram_bucket';
import tileDrawHelper from '../../gl/tile_draw_helper';
import { multiPolygonIntersectsMultiPolygon } from '../../util/intersection_tests';
import { translateDistance, translate } from '../query_utils';
import properties from './histogram_style_layer_properties';
import { Transitionable, Transitioning, PossiblyEvaluated } from '../properties';

import type {BucketParameters} from '../../data/bucket';
import type Point from '@hymap/point-geometry';
import type {PaintProps} from './histogram_style_layer_properties';
import type Framebuffer from '../../gl/framebuffer';
import type Transform from '../../geo/transform';

class HistogramStyleLayer extends StyleLayer {
    _transitionablePaint: Transitionable<PaintProps>;
    _transitioningPaint: Transitioning<PaintProps>;
    paint: PossiblyEvaluated<PaintProps>;
    viewportFrame: ?Framebuffer;

    constructor(layer: LayerSpecification) {
        super(layer, properties);
    }

    createBucket(parameters: BucketParameters<HistogramStyleLayer>) {
        return new FillExtrusionBucket(parameters);
    }

    queryRadius(): number {
        return translateDistance(this.paint.get('histogram-translate'));
    }

    queryIntersectsFeature(queryGeometry: Array<Array<Point>>,
                           feature: VectorTileFeature,
                           geometry: Array<Array<Point>>,
                           zoom: number,
                           transform: Transform,
                           pixelsToTileUnits: number): boolean {
        const translatedPolygon = translate(queryGeometry,
            this.paint.get('histogram-translate'),
            this.paint.get('histogram-translate-anchor'),
            transform.angle, pixelsToTileUnits);
        return multiPolygonIntersectsMultiPolygon(translatedPolygon, geometry);
    }

    hasOffscreenPass() {
        return this.paint.get('histogram-opacity') !== 0 && this.visibility !== 'none';
    }

    resize() {
        tileDrawHelper.destroy(this);
    }
}

export default HistogramStyleLayer;

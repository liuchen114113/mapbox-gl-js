//@flow
/* eslint-disable */
/*
* @Author: hydata
* @Date:   2018-05-30 17:57:25
* @Last Modified by:   hydata
* @Last Modified time: 2018-06-08 18:58:16
*/

import Point from '@hymap/point-geometry';

import StyleLayer from '../style_layer';
import ParticleLineBucket from '../../data/bucket/particleline_bucket';

import EvaluationParameters from '../evaluation_parameters';
import { multiPolygonIntersectsBufferedMultiLine } from '../../util/intersection_tests';
import { getMaximumPaintValue, translateDistance, translate } from '../query_utils';
import properties from './particleline_style_layer_properties';
import { extend } from '../../util/util';
import { Transitionable, Transitioning, Layout, PossiblyEvaluated, DataDrivenProperty } from '../properties';

import type {Bucket,BucketParameters} from '../../data/bucket';
import type {LayoutProps, PaintProps} from './particleline_style_layer_properties';


class LineFloorwidthProperty extends DataDrivenProperty<number> {
    useIntegerZoom: true;

    possiblyEvaluate(value, parameters) {
        parameters = new EvaluationParameters(Math.floor(parameters.zoom), {
            now: parameters.now,
            fadeDuration: parameters.fadeDuration,
            zoomHistory: parameters.zoomHistory,
            transition: parameters.transition
        });
        return super.possiblyEvaluate(value, parameters);
    }

    evaluate(value, globals, feature) {
        globals = extend({}, globals, {zoom: Math.floor(globals.zoom)});
        return super.evaluate(value, globals, feature);
    }
}

const lineFloorwidthProperty = new LineFloorwidthProperty(properties.paint.properties['particleline-width'].specification);
lineFloorwidthProperty.useIntegerZoom = true;

class ParticleLineStyleLayer extends StyleLayer {
    _unevaluatedLayout: Layout<LayoutProps>;
    layout: PossiblyEvaluated<LayoutProps>;

    _transitionablePaint: Transitionable<PaintProps>;
    _transitioningPaint: Transitioning<PaintProps>;
    paint: PossiblyEvaluated<PaintProps>;

    constructor(layer: LayerSpecification) {
        super(layer, properties);
    }

    recalculate(parameters: EvaluationParameters) {
        super.recalculate(parameters);

        (this.paint._values: any)['particleline-floorwidth'] =lineFloorwidthProperty.possiblyEvaluate(this._transitioningPaint._values['particleline-width'].value, parameters);
    }

    createBucket(parameters: BucketParameters<*>) {
         return new ParticleLineBucket(parameters);
    }

    queryRadius(bucket: Bucket): number {
        const lineBucket: ParticleLineBucket = (bucket: any);
         const width = getLineWidth(
            getMaximumPaintValue('particleline-width', this, lineBucket),
            getMaximumPaintValue('particleline-gap-width', this, lineBucket));
        const offset = getMaximumPaintValue('particleline-offset', this, lineBucket);
        return width / 2 + Math.abs(offset) + translateDistance(this.paint.get('particleline-translate'));
    }

    queryIntersectsFeature(queryGeometry: Array<Array<Point>>,
                           feature: VectorTileFeature,
                           geometry: Array<Array<Point>>,
                           zoom: number,
                           bearing: number,
                           pixelsToTileUnits: number): boolean {
        const translatedPolygon = translate(queryGeometry,
            this.paint.get('particleline-translate'),
            this.paint.get('particleline-translate-anchor'),
            bearing, pixelsToTileUnits);
        const halfWidth = pixelsToTileUnits / 2 * getLineWidth(
            this.paint.get('particleline-width').evaluate(feature),
            this.paint.get('particleline-gap-width').evaluate(feature));
        const lineOffset = this.paint.get('particleline-offset').evaluate(feature);
        if (lineOffset) {
            geometry = offsetLine(geometry, lineOffset * pixelsToTileUnits);
        }
        return multiPolygonIntersectsBufferedMultiLine(translatedPolygon, geometry, halfWidth);
    }
    hasOffscreenPass() {
        return this.paint.get("particleline-opacity") !== 0 && this.visibility !== "none";
    }

    resize()
    {
        tileDrawHelper.destory(this);
    }
}
export default ParticleLineStyleLayer;
function getLineWidth(lineWidth, lineGapWidth) {
    if (lineGapWidth > 0) {
        return lineGapWidth + 2 * lineWidth;
    } else {
        return lineWidth;
    }
}

function offsetLine(rings, offset) {
    const newRings = [];
    const zero = new Point(0, 0);
    for (let k = 0; k < rings.length; k++) {
        const ring = rings[k];
        const newRing = [];
        for (let i = 0; i < ring.length; i++) {
            const a = ring[i - 1];
            const b = ring[i];
            const c = ring[i + 1];
            const aToB = i === 0 ? zero : b.sub(a)._unit()._perp();
            const bToC = i === ring.length - 1 ? zero : c.sub(b)._unit()._perp();
            const extrude = aToB._add(bToC)._unit();

            const cosHalfAngle = extrude.x * bToC.x + extrude.y * bToC.y;
            extrude._mult(1 / cosHalfAngle);

            newRing.push(extrude._mult(offset)._add(b));
        }
        newRings.push(newRing);
    }
    return newRings;
}
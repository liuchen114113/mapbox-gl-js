/*
 * @Description:  airline拓展
 * @Author: liuchen@hiynn.com
 * @Date: 2018-06-13 15:02:19
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-07-05 18:33:32
 */
// @flow
import Point from '@hymap/point-geometry';

import StyleLayer from '../style_layer';
import LineBucket from '../../data/bucket/airline_bucket';
import tileDrawHelper from '../../gl/tile_draw_helper';
import {RGBAImage} from '../../util/image';
import {multiPolygonIntersectsBufferedMultiLine} from '../../util/intersection_tests';
import {getMaximumPaintValue, translateDistance, translate} from '../query_utils';
import properties from './airline_style_layer_properties';
import {extend} from '../../util/util';
import EvaluationParameters from '../evaluation_parameters';
// import renderColorRamp from '../../util/color_ramp';
import {Transitionable, Transitioning, Layout, PossiblyEvaluated, DataDrivenProperty} from '../properties';

import type { FeatureState } from '../../style-spec/expression';
import type {Bucket, BucketParameters} from '../../data/bucket';
import type {LayoutProps, PaintProps} from './airline_style_layer_properties';
import type Transform from '../../geo/transform';
import type Texture from '../../render/texture';

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

    evaluate(value, globals, feature, featureState) {
        globals = extend({}, globals, {zoom: Math.floor(globals.zoom)});
        return super.evaluate(value, globals, feature, featureState);
    }
}

const lineFloorwidthProperty = new LineFloorwidthProperty(properties.paint.properties['airline-width'].specification);
lineFloorwidthProperty.useIntegerZoom = true;

class LineStyleLayer extends StyleLayer {
    _unevaluatedLayout: Layout<LayoutProps>;
    layout: PossiblyEvaluated<LayoutProps>;

    gradient: ?RGBAImage;
    gradientTexture: ?Texture;

    _transitionablePaint: Transitionable<PaintProps>;
    _transitioningPaint: Transitioning<PaintProps>;
    paint: PossiblyEvaluated<PaintProps>;

    constructor(layer: LayerSpecification) {
        super(layer, properties);
    }

    // setPaintProperty(name: string, value: mixed, options: { validate: boolean }) {
    //     super.setPaintProperty(name, value, options);
    //     if (name === 'line-gradient') {
    //         this._updateGradient();
    //     }
    // }

    // _updateGradient() {
    //     const expression = this._transitionablePaint._values['line-gradient'].value.expression;
    //     this.gradient = renderColorRamp(expression, 'lineProgress');
    //     this.gradientTexture = null;
    // }

    recalculate(parameters: EvaluationParameters) {
        super.recalculate(parameters);

        (this.paint._values: any)['airline-floorwidth'] =
            lineFloorwidthProperty.possiblyEvaluate(this._transitioningPaint._values['airline-width'].value, parameters);
    }

    createBucket(parameters: BucketParameters<*>) {

        return new LineBucket(parameters);
    }

    queryRadius(bucket: Bucket): number {
        const lineBucket: LineBucket = (bucket: any);
        const width = getLineWidth(
            getMaximumPaintValue('airline-width', this, lineBucket),
            getMaximumPaintValue('airline-gap-width', this, lineBucket));

        const offset = getMaximumPaintValue('airline-offset', this, lineBucket);
        return width / 2 + Math.abs(offset) + translateDistance(this.paint.get('airline-translate'));
    }

    queryIntersectsFeature(queryGeometry: Array<Array<Point>>,
                           feature: VectorTileFeature,
                           featureState: FeatureState,
                           geometry: Array<Array<Point>>,
                           zoom: number,
                           transform: Transform,
                           pixelsToTileUnits: number): boolean {
        const translatedPolygon = translate(queryGeometry,
            this.paint.get('airline-translate'),
            this.paint.get('airline-translate-anchor'),
            transform.angle, pixelsToTileUnits);
        const halfWidth = pixelsToTileUnits / 2 * getLineWidth(
            this.paint.get('airline-width').evaluate(feature, featureState),
            this.paint.get('airline-gap-width').evaluate(feature, featureState));
        const lineOffset = this.paint.get('airline-offset').evaluate(feature, featureState);
        if (lineOffset) {
            geometry = offsetLine(geometry, lineOffset * pixelsToTileUnits);
        }
        return multiPolygonIntersectsBufferedMultiLine(translatedPolygon, geometry, halfWidth);
    }

    hasOffscreenPass() {
        return this.paint.get("airline-opacity") !== 0 && this.visibility !== "none";
    }

    resize() {
        tileDrawHelper.destroy(this);
    }

}

export default LineStyleLayer;

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
